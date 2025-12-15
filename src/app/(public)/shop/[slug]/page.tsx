import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";

type Product = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price_cents: number;
  image_url: string | null;
};

const DEMO_PRODUCTS: Product[] = [
  {
    id: "demo-1",
    slug: "spray-nasal-hipoalergenico",
    name: "Spray nasal hipoalergenico",
    description: "Ajuda no conforto respiratorio diario (demo).",
    price_cents: 3990,
    image_url: null,
  },
  {
    id: "demo-2",
    slug: "vitamina-d3-k2",
    name: "Vitamina D3 + K2",
    description: "Suporte basico para rotina de suplementacao (demo).",
    price_cents: 5890,
    image_url: null,
  },
  {
    id: "demo-3",
    slug: "probiotico-sensivel",
    name: "Probiotico para sensiveis",
    description: "Formula pensada para rotinas mais delicadas (demo).",
    price_cents: 7990,
    image_url: null,
  },
];

function formatBRL(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const supabase = await supabaseServer();

  let product: Product | null = null;
  let loadError: string | null = null;

  try {
    const { data, error } = await supabase
      .from("products")
      .select("id,slug,name,description,price_cents,image_url")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      loadError = error.message;
    } else if (data) {
      product = data as Product;
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    loadError = message.includes('relationship between "products" and "product_images"')
      ? "Relacionamento product_images indisponivel; usando produto demo."
      : message;
  }

  if (!product) {
    product = DEMO_PRODUCTS.find((p) => p.slug === slug) ?? null;
  }

  if (!product) return notFound();

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <Link href="/shop" className="text-sm text-zinc-300 hover:text-zinc-100">
        ← Voltar para a loja
      </Link>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-black/30">
            <img
              src={
                product.image_url ||
                "data:image/svg+xml;utf8," +
                  encodeURIComponent(
                    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
                      <rect width="100%" height="100%" fill="#0b0b0b"/>
                      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#777" font-family="Arial" font-size="28">
                        Sem imagem
                      </text>
                    </svg>`
                  )
              }
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          {loadError ? (
            <p className="mb-3 text-xs text-amber-300">
              Aviso: {loadError} Exibindo produto demo (se existir).
            </p>
          ) : null}

          <h1 className="text-2xl font-semibold">{product.name}</h1>
          <p className="mt-2 text-sm text-zinc-300">{product.description || "Sem descricao por enquanto."}</p>

          <div className="mt-6 flex items-center justify-between gap-4">
            <div className="text-xl font-semibold">{formatBRL(product.price_cents)}</div>

            <Link
              href="/cart"
              className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-emerald-400"
            >
              Ir ao carrinho
            </Link>
          </div>

          <p className="mt-3 text-xs text-zinc-400">
            (Proximo passo: botao "Adicionar ao carrinho" + checkout real.)
          </p>
        </div>
      </div>
    </main>
  );
}
