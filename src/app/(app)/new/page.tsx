import { createCommunityPost } from "./actions";

export default function NewPostPage() {
  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-white/10 bg-white/5 p-6">
      <h2 className="text-xl font-semibold">Novo post (comunidade)</h2>
      <p className="mt-1 text-sm text-zinc-300">Seu post entra como pendente até aprovação do admin.</p>

      <form action={createCommunityPost} className="mt-5 grid gap-3">
        <input name="title" placeholder="Título" className="w-full rounded-md border border-white/10 bg-zinc-900 px-3 py-2 outline-none" required />
        <textarea name="summary" placeholder="Resumo (opcional)" className="min-h-[110px] w-full rounded-md border border-white/10 bg-zinc-900 px-3 py-2 outline-none" />
        <button className="mt-2 rounded-md bg-emerald-500 px-4 py-2 font-medium text-zinc-950 hover:bg-emerald-400">
          Publicar
        </button>
      </form>
    </div>
  );
}
