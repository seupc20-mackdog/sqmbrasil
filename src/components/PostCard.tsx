type PostAuthor = {
  username: string | null;
  avatar_url: string | null;
};

type Post = {
  id: string;
  type: "official" | "community";
  title: string;
  summary: string | null;
  created_at: string;
  author?: PostAuthor | null;
};

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(new Date(value));
  } catch {
    return null;
  }
}

export function PostCard({ post }: { post: Post }) {
  const authorName = post.author?.username || "Anonimo";
  const date = formatDate(post.created_at);

  return (
    <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-center justify-between gap-3">
        <span
          className="rounded-md bg-emerald-500/15 px-2 py-1 text-xs font-semibold text-emerald-300"
          aria-label={post.type === "official" ? "Post oficial" : "Post da comunidade"}
        >
          {post.type === "official" ? "Oficial" : "Comunidade"}
        </span>

        {date ? <span className="text-xs text-zinc-400">{date}</span> : null}
      </div>

      <h3 className="mt-3 text-lg font-semibold text-white">{post.title}</h3>
      {post.summary ? <p className="mt-2 text-sm text-zinc-300">{post.summary}</p> : null}

      <div className="mt-4 flex items-center gap-3">
        {post.author?.avatar_url ? (
          <img
            src={post.author.avatar_url}
            alt={authorName}
            className="h-9 w-9 rounded-full border border-white/10 bg-white/5 object-cover"
          />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-semibold uppercase text-zinc-200">
            {authorName.slice(0, 1)}
          </div>
        )}

        <div className="leading-tight">
          <div className="text-sm font-medium text-white">{authorName}</div>
          <div className="text-xs text-zinc-400">Postado no feed</div>
        </div>
      </div>
    </article>
  );
}
