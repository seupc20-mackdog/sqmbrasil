import { supabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export default function NewPostPage({
  searchParams,
}: {
  searchParams?: { error?: string };
}) {
  async function createCommunityPost(formData: FormData): Promise<void> {
    "use server";

    const title = String(formData.get("title") || "").trim();
    const summary = String(formData.get("summary") || "").trim();

    if (!title) {
      redirect("/new?error=1");
    }

    const supabase = await supabaseServer();

    const { data: auth, error: authErr } = await supabase.auth.getUser();
    if (authErr || !auth.user) {
      redirect("/login?next=/new");
    }

    const { error } = await supabase.from("posts").insert({
      type: "community",
      title,
      summary: summary || null,
      author_id: auth.user.id,
      is_approved: false,
    });

    if (error) {
      redirect("/new?error=1");
    }

    // atualiza a lista (se você mostra aprovados/pending em algum lugar)
    revalidatePath("/feed");
    redirect("/feed?created=1");
  }

  const hasError = searchParams?.error === "1";

  return (
    <main className="mx-auto max-w-xl p-6">
      <h1 className="text-2xl font-semibold text-white">Novo post</h1>
      <p className="mt-1 text-sm text-zinc-300">
        Seu post entra como pendente até aprovação do admin.
      </p>

      {hasError ? (
        <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
          Não foi possível publicar agora. Tente novamente.
        </div>
      ) : null}

      <form action={createCommunityPost} className="mt-5 grid gap-3">
        <input
          name="title"
          placeholder="Título"
          className="w-full rounded-md border border-white/10 bg-zinc-900 px-3 py-2 text-white outline-none"
          required
        />
        <textarea
          name="summary"
          placeholder="Resumo (opcional)"
          className="min-h-[110px] w-full rounded-md border border-white/10 bg-zinc-900 px-3 py-2 text-white outline-none"
        />

        <button
          type="submit"
          className="mt-2 rounded-md bg-emerald-500 px-4 py-2 font-medium text-zinc-950 hover:bg-emerald-400"
        >
          Publicar
        </button>
      </form>
    </main>
  );
}
