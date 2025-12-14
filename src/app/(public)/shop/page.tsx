import { supabaseServer } from "@/lib/supabase/server";
import { ProductCard } from "@/components/ProductCard";

export default async function ShopPage() {
  const supabase = supabaseServer();

  const { data: products, error } = await supabase
  .from("products")
  .select("slug,title,price_cents,currency,stock,product_images(url,sort_order)")
  .order("created_at", { ascending: false });


  if (error) return <div className="text-red-300">Erro: {error.message}</div>;

  return (
    <section className="grid gap-4">
      <h2 className="text-2xl font-semibold">Loja</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {products?.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </section>
  );
}
