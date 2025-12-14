import { supabaseServer } from "@/lib/supabase/server";
import { PostCard } from "@/components/PostCard";

type Author = { username: string | null; avatar_url: string | null };

type RawPost = {
  id: string;
  type: "official" | "community";
  title: string;
  summary: string | null;
  created_at: string;
  // pode vir como objeto OU array dependendo do relacionamento no Supabase
  author?: Author | Author[] | null;
};

export default async function FeedPage() {
  const supabase = await supabaseServer();

  const { data, error } = await supabase
    .from("posts")
    .select("id,type,title,summary,created_at,author:profiles(username,avatar_url)")
    .eq("is_approved", true)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return (
      <main className="mx-auto max-w-3xl p-6 text-zinc-200">
        <h1 className="text-xl font-semibold text-white">Feed</h1>
        <p className="mt-3 text-red-300">Erro ao carregar posts: {error.message}</p>
      </main>
    );
  }

  const posts = ((data ?? []) as RawPost[]).map((p) => {
    const normalizedAuthor: Author | null = Array.isArray(p.author)
      ? p.author[0] ?? null
      : p.author ?? null;

    return {
      id: p.id,
      type: p.type,
      title: p.title,
      summary: p.summary,
      created_at: p.created_at,
      author: normalizedAuthor,
    };
  });

  return (
    <main className="mx-auto max-w-3xl p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">Feed</h1>
      </div>

      <div className="mt-6 space-y-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </main>
  );
}
