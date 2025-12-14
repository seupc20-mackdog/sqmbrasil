import { supabaseServer } from "@/lib/supabase/server";
import { ProductCard } from "@/components/ProductCard";

export default async function ShopPage() {
  const supabase = await supabaseServer();

  const { data: products, error } = await supabase
    .from("products")
    .select("id,slug,title,price_cents,currency,stock,product_images(url,sort_order)")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="p-6 text-zinc-200">
        Erro ao carregar produtos: <span className="text-red-300">{error.message}</span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="text-2xl font-semibold text-white">Loja</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(products ?? []).map((p) => (
          <ProductCard key={p.id} product={p as any} />
        ))}
      </div>
    </div>
  );
}
