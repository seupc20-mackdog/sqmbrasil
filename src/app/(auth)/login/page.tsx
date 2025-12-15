import { supabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

function safeNextPath(input: string | null): string {
  if (!input) return "/feed";
  if (!input.startsWith("/")) return "/feed";
  if (input.startsWith("//")) return "/feed";
  if (input.includes("://")) return "/feed";
  return input;
}

export const dynamic = "force-dynamic";

export default function LoginPage({
  searchParams,
}: {
  searchParams?: { error?: string; registered?: string; next?: string; loggedOut?: string };
}) {
  const nextPath = safeNextPath(searchParams?.next ?? null);
  const hasError = searchParams?.error === "1";
  const registered = searchParams?.registered === "1";
  const loggedOut = searchParams?.loggedOut === "1";

  async function signIn(formData: FormData): Promise<void> {
    "use server";

    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "").trim();
    const next = safeNextPath(String(formData.get("next") || "/feed"));

    if (!email || !password) {
      redirect(`/login?error=1&next=${encodeURIComponent(next)}`);
    }

    const supabase = await supabaseServer();

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      redirect(`/login?error=1&next=${encodeURIComponent(next)}`);
    }

    redirect(next);
  }

  return (
    <main>
      <h1 className="text-xl font-semibold">Entrar</h1>
      <p className="mt-1 text-sm text-zinc-300">Acesse sua conta para curtir, comentar e comprar na loja.</p>

      {registered ? (
        <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-200">
          Conta criada. Agora faca login.
        </div>
      ) : null}

      {loggedOut ? (
        <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-zinc-200">
          Voce saiu da conta.
        </div>
      ) : null}

      {hasError ? (
        <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
          Email ou senha invalidos (ou sua conta ainda nao foi confirmada por email, se a confirmacao estiver ligada).
        </div>
      ) : null}

      <form action={signIn} className="mt-5 grid gap-3">
        <input type="hidden" name="next" value={nextPath} />

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
          placeholder="Senha"
          className="w-full rounded-md border border-white/10 bg-zinc-900 px-3 py-2 outline-none"
          required
        />

        <button className="mt-2 rounded-md bg-emerald-500 px-4 py-2 font-medium text-zinc-950 hover:bg-emerald-400">
          Entrar
        </button>
      </form>

      <p className="mt-4 text-sm text-zinc-300">
        Nao tem conta?{" "}
        <a className="text-emerald-300 hover:underline" href="/register">
          Criar conta
        </a>
      </p>
    </main>
  );
}
