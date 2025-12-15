import Link from "next/link";

type ProductCardProps = {
  product: {
    slug: string;
    name: string;
    description?: string | null;
    price_cents: number;
    currency?: string | null;
    image_url?: string | null;
  };
};

export function ProductCard({ product }: ProductCardProps) {
  const price = (product.price_cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: product.currency || "BRL",
  });

  return (
    <Link href={`/shop/${product.slug}`} className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10">
      <div className="text-sm text-zinc-400">Produto</div>
      <div className="mt-1 text-lg font-semibold">{product.name}</div>
      <div className="mt-2 text-sm text-zinc-300">
        {product.description || "Ver detalhes do produto."}
      </div>
      <div className="mt-3 text-emerald-300 font-semibold">{price}</div>
    </Link>
  );
}
