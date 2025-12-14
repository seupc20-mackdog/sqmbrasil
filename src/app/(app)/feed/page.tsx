import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";
import { PostCard } from "@/components/PostCard";

export default async function FeedPage() {
  const supabase = supabaseServer();

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  const { data: posts, error } = await supabase
  .from("posts")
  .select("id,type,title,summary,created_at,author:profiles(username,avatar_url)")
  .order("created_at", { ascending: false })
  .limit(50);


  if (error) {
    return <div className="text-red-300">Erro ao carregar feed: {error.message}</div>;
  }

  return (
    <section className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold">Comunidade</h2>
        <div className="flex gap-2">
          <Link href="/new" className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-emerald-400">
            Postar
          </Link>
          <Link href="/profile" className="rounded-md border border-white/15 px-4 py-2 text-sm hover:bg-white/5">
            Meu perfil
          </Link>
        </div>
      </div>

      <div className="text-sm text-zinc-300">
        Logado como: <span className="text-white">{user?.email}</span>
      </div>

      <div className="grid gap-3">
        {posts?.map((p) => (
          <PostCard
          key={p.id}
          post={{
          id: p.id,
          type: p.type,
          title: p.title,
          summary: p.summary,
          created_at: p.created_at,
          author: p.author ?? null,
        }}
        />
        ))}
      </div>
    </section>
  );
}
