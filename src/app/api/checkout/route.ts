import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseServer } from "@/lib/supabase/server";

type Body = { items: { productId: string; qty: number }[] };

export async function POST(req: Request) {
  const supabase = supabaseServer();

  // opcional: exigir login para checkout
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) return NextResponse.json({ error: "Faça login para finalizar." }, { status: 401 });

  const body = (await req.json().catch(() => null)) as Body | null;
  if (!body?.items?.length) return NextResponse.json({ error: "Carrinho vazio." }, { status: 400 });

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) return NextResponse.json({ error: "Configure STRIPE_SECRET_KEY (ou substitua por Mercado Pago)." }, { status: 501 });

  const stripe = new Stripe(stripeKey, { apiVersion: "2024-06-20" });

  // Busca produtos no Supabase (preço do servidor = fonte de verdade)
  const productIds = body.items.map((x) => x.productId);
  const { data: products, error } = await supabase
    .from("products")
    .select("id,title,price_cents,currency,stock,active")
    .in("id", productIds);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  const map = new Map(products?.map((p) => [p.id, p]));
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  let total = 0;

  for (const it of body.items) {
    const p = map.get(it.productId);
    if (!p || !p.active) return NextResponse.json({ error: "Produto inválido." }, { status: 400 });
    if (it.qty <= 0) return NextResponse.json({ error: "Quantidade inválida." }, { status: 400 });
    if (p.stock < it.qty) return NextResponse.json({ error: `Sem estoque: ${p.title}` }, { status: 400 });

    total += p.price_cents * it.qty;

    lineItems.push({
      quantity: it.qty,
      price_data: {
        currency: p.currency.toLowerCase(),
        unit_amount: p.price_cents,
        product_data: { name: p.title },
      },
    });
  }

  // Cria order pending no banco
  const { data: order, error: orderErr } = await supabase
    .from("orders")
    .insert({ user_id: user.id, total_cents: total, currency: "BRL", payment_provider: "stripe" })
    .select("id")
    .maybeSingle();

  if (orderErr || !order) return NextResponse.json({ error: orderErr?.message || "Erro ao criar pedido." }, { status: 400 });

  // Salva itens do pedido
  const itemsRows = body.items.map((it) => {
    const p = map.get(it.productId)!;
    return { order_id: order.id, product_id: p.id, qty: it.qty, unit_price_cents: p.price_cents };
  });

  const { error: itemErr } = await supabase.from("order_items").insert(itemsRows);
  if (itemErr) return NextResponse.json({ error: itemErr.message }, { status: 400 });

  const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    success_url: `${site}/shop?success=1`,
    cancel_url: `${site}/cart?canceled=1`,
    metadata: { order_id: order.id, user_id: user.id },
  });

  // Guarda referência externa
  await supabase.from("orders").update({ provider_ref: session.id }).eq("id", order.id);

  return NextResponse.json({ url: session.url });
}
