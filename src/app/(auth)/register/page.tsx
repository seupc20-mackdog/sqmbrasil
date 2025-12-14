import { supabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default function RegisterPage({
  searchParams,
}: {
  searchParams?: { error?: string; ok?: string };
}) {
  async function signUp(formData: FormData): Promise<void> {
    "use server";

    const username = String(formData.get("username") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "").trim();

    if (!username || !email || password.length < 6) redirect("/register?error=1");

    const supabase = await supabaseServer();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username }, // fica no metadata do usuário
      },
    });

    if (error) redirect("/register?error=1");

    redirect("/login?registered=1");
  }

  const hasError = searchParams?.error === "1";

  return (
    <main>
      <h1 className="text-xl font-semibold">Criar conta</h1>
      <p className="mt-1 text-sm text-zinc-300">
        Cadastre-se para curtir, comentar e participar da comunidade.
      </p>

      {hasError ? (
        <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
          Não foi possível criar sua conta. Verifique os dados e tente novamente.
        </div>
      ) : null}

      <form action={signUp} className="mt-5 grid gap-3">
        <input
          name="username"
          placeholder="Nome de usuário"
          className="w-full rounded-md border border-white/10 bg-zinc-900 px-3 py-2 outline-none"
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full rounded-md border border-white/10 bg-zinc-900 px-3 py-2 outline-none"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Senha (mín. 6)"
          className="w-full rounded-md border border-white/10 bg-zinc-900 px-3 py-2 outline-none"
          required
          minLength={6}
        />

        <button className="mt-2 rounded-md bg-emerald-500 px-4 py-2 font-medium text-zinc-950 hover:bg-emerald-400">
          Criar conta
        </button>
      </form>

      <p className="mt-4 text-sm text-zinc-300">
        Já tem conta? <a className="text-emerald-300 hover:underline" href="/login">Entrar</a>
      </p>
    </main>
  );
}
