import { supabaseServer } from "@/lib/supabase/server";

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const supabase = supabaseServer();

  const { data: product, error } = await supabase
    .from("products")
    .select("id,slug,title,description,price_cents,currency,stock")
    .eq("slug", params.slug)
    .maybeSingle();

  if (error || !product) return <div className="text-zinc-300">Produto não encontrado.</div>;

  const price = (product.price_cents / 100).toLocaleString("pt-BR", { style: "currency", currency: product.currency });

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="text-sm text-zinc-400">{product.stock > 0 ? "Em estoque" : "Sem estoque"}</div>
      <h2 className="mt-1 text-2xl font-semibold">{product.title}</h2>
      <div className="mt-3 text-emerald-300">{price}</div>
      {product.description ? <p className="mt-4 text-zinc-300">{product.description}</p> : null}

      <button
        className="mt-6 w-full rounded-md bg-emerald-500 px-4 py-2 font-medium text-zinc-950 hover:bg-emerald-400 disabled:opacity-50"
        disabled={product.stock <= 0}
        onClick={() => {}}
      />
      <AddToCartButton productId={product.id} title={product.title} price_cents={product.price_cents} currency={product.currency} />
    </div>
  );
}

function AddToCartButton(props: { productId: string; title: string; price_cents: number; currency: string }) {
  // client wrapper
  return (
    <form action="/cart" className="mt-6">
      <AddToCartClient {...props} />
    </form>
  );
}

function AddToCartClient(_: any) {
  // placeholder replaced by client component file below
  return null as any;
}
