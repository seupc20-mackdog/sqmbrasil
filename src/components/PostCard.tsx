"use client";

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
  const [comment, setComment] = useState("");

  async function toggleLike() {
    setBusy(true);
    try {
      await fetch(`/api/posts/${post.id}/like`, { method: "POST" });
    } finally {
      setBusy(false);
    }
  }

  async function addComment() {
    const content = comment.trim();
    if (!content) return;

    setBusy(true);
    try {
      await fetch(`/api/posts/${post.id}/comment`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ content }),
      });

      setComment("");
    } finally {
      setBusy(false);
    }
  }

  const authorName =
    post.author?.username || (post.type === "official" ? "Equipe SQMcarla" : "Usuário");

  return (
    <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          {/* Autor + data */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 overflow-hidden rounded-full border border-white/10 bg-white/5">
              {post.author?.avatar_url ? (
                <img
                  src={post.author.avatar_url}
                  alt={authorName}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : null}
            </div>

            <div className="min-w-0">
              <div className="truncate text-sm font-medium text-white">{authorName}</div>
              <div className="text-xs text-zinc-400">
                {new Date(post.created_at).toLocaleString("pt-BR")}
              </div>
            </div>
          </div>

          {/* Conteúdo */}
          <h3 className="mt-3 text-lg font-semibold">{post.title}</h3>
          {post.summary ? <p className="mt-2 text-sm text-zinc-300">{post.summary}</p> : null}
        </div>

        <button
          disabled={busy}
          onClick={toggleLike}
          className="shrink-0 rounded-md border border-white/15 px-3 py-2 text-sm hover:bg-white/5 disabled:opacity-50"
        >
          Curtir
        </button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          addComment();
        }}
        className="mt-4 flex gap-2"
      >
        <input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          name="content"
          placeholder="Comentar..."
          className="flex-1 rounded-md border border-white/10 bg-zinc-900 px-3 py-2 text-sm outline-none"
        />
        <button
          type="submit"
          disabled={busy}
          className="rounded-md bg-emerald-500 px-3 py-2 text-sm font-medium text-zinc-950 hover:bg-emerald-400 disabled:opacity-50"
        >
          Enviar
        </button>
      </form>
    </article>
  );
}
