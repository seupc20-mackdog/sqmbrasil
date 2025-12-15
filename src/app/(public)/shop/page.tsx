import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";
import { ProductCard } from "@/components/ProductCard";

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
    name: "Spray nasal hipoalergênico",
    description: "Ajuda no conforto respiratório diário (demo).",
    price_cents: 3990,
    image_url: null,
  },
  {
    id: "demo-2",
    slug: "vitamina-d3-k2",
    name: "Vitamina D3 + K2",
    description: "Suporte básico para rotina de suplementação (demo).",
    price_cents: 5890,
    image_url: null,
  },
  {
    id: "demo-3",
    slug: "probiotico-sensivel",
    name: "Probiótico para sensíveis",
    description: "Fórmula pensada para rotinas mais delicadas (demo).",
    price_cents: 7990,
    image_url: null,
  },
];

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const supabase = await supabaseServer();

  const { data, error } = await supabase
    .from("products")
    .select("id,slug,name,description,price_cents,image_url");

  const products: Product[] =
    !error && data && data.length ? (data as Product[]) : DEMO_PRODUCTS;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Loja</h1>
          <p className="mt-1 text-sm text-zinc-300">
            Catálogo MVP (usando Supabase quando houver produtos; senão, demo).
          </p>
          {error ? (
            <p className="mt-2 text-xs text-amber-300">
              Aviso: Supabase retornou erro no catálogo. Exibindo produtos demo.
            </p>
          ) : null}
        </div>

        <Link
          href="/cart"
          className="rounded-md border border-white/15 px-3 py-2 text-sm hover:bg-white/5"
        >
          Ver carrinho
        </Link>
      </div>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </section>
    </main>
  );
}
