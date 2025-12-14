import { useState } from "react";

type PostCardProps = {
  post: {
    id: string;
    type: "official" | "community";
    title: string;
    summary: string | null;
    created_at: string;
    author?: { username: string | null; avatar_url: string | null } | null;
  };
};

export function PostCard({ post }: PostCardProps) {
  const [busy, setBusy] = useState(false);
  const [comment, setComment] = useState(""); // Estado para o comentário

  async function toggleLike() {
    setBusy(true);
    try {
      await fetch(`/api/posts/${post.id}/like`, { method: "POST" });
    } finally {
      setBusy(false);
    }
  }

  async function addComment(formData: FormData) {
    const content = comment.trim(); // Usando o estado do comentário
    if (!content) return;

    setBusy(true);
    try {
      await fetch(`/api/posts/${post.id}/comment`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ content }),
      });
      setComment(""); // Limpa o comentário após enviar
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-xs text-zinc-400">{new Date(post.created_at).toLocaleString("pt-BR")}</div>
          <h3 className="mt-1 text-lg font-semibold">{post.title}</h3>
          {post.summary ? <p className="mt-2 text-sm text-zinc-300">{post.summary}</p> : null}
        </div>

        <button
          disabled={busy}
          onClick={toggleLike}
          className="rounded-md border border-white/15 px-3 py-2 text-sm hover:bg-white/5 disabled:opacity-50"
        >
          Curtir
        </button>
      </div>

      <form action={addComment} className="mt-4 flex gap-2">
        <input
          value={comment} // Vincula o valor do input ao estado
          onChange={(e) => setComment(e.target.value)} // Atualiza o estado com a digitação
          name="content"
          placeholder="Comentar..."
          className="flex-1 rounded-md border border-white/10 bg-zinc-900 px-3 py-2 text-sm outline-none"
        />
        <button disabled={busy} className="rounded-md bg-emerald-500 px-3 py-2 text-sm font-medium text-zinc-950 hover:bg-emerald-400 disabled:opacity-50">
          Enviar
        </button>
      </form>
    </article>
  );
}
