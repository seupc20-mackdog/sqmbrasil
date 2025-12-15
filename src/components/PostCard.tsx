import Link from "next/link";

type Product = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price_cents: number;
  image_url: string | null;
};

function formatBRL(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

const FALLBACK_IMG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="900" height="700">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#0b0b0b"/>
        <stop offset="1" stop-color="#111827"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <rect x="40" y="40" width="820" height="620" rx="28" ry="28" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)"/>
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#a1a1aa" font-family="Arial" font-size="28">
      SQM Brasil — Produto
    </text>
  </svg>
`);

export function ProductCard({ product }: { product: Product }) {
  const price = formatBRL(product.price_cents);

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10"
    >
      <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-black/30">
        <img
          src={product.image_url || FALLBACK_IMG}
          alt={product.name}
          className="h-full w-full object-cover transition group-hover:scale-[1.02]"
          loading="lazy"
        />
      </div>

      <div className="mt-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-semibold leading-snug text-white">
            {product.name}
          </h3>

          <div className="shrink-0 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-sm font-semibold text-white">
            {price}
          </div>
        </div>

        <p className="mt-2 line-clamp-2 text-sm text-zinc-300">
          {product.description || "Ver detalhes do produto."}
        </p>

        <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-emerald-300">
          Ver produto <span className="transition group-hover:translate-x-0.5">→</span>
        </div>
      </div>
    </Link>
  );
}
