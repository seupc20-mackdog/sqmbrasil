import Link from "next/link";

export function ProductCard(props: {
  product: { slug: string; title: string; price_cents: number; currency: string; stock: number };
}) {
  const p = props.product;
  const price = (p.price_cents / 100).toLocaleString("pt-BR", { style: "currency", currency: p.currency });

  return (
    <Link href={`/shop/${p.slug}`} className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10">
      <div className="text-sm text-zinc-400">{p.stock > 0 ? "Em estoque" : "Sem estoque"}</div>
      <div className="mt-1 text-lg font-semibold">{p.title}</div>
      <div className="mt-2 text-emerald-300">{price}</div>
    </Link>
  );
}
