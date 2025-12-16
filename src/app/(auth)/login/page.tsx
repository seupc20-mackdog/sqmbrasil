"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useMemo, useState } from "react";

import { supabaseBrowser } from "@/lib/supabase/client";

function safeNextPath(input: string | null): string {
  if (!input) return "/feed";
  if (!input.startsWith("/")) return "/feed";
  if (input.startsWith("//")) return "/feed";
  if (input.includes("://")) return "/feed";
  return input;
}

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="p-6 text-sm text-white/70">Carregando...</main>}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = useMemo(() => supabaseBrowser(), []);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);

  const registered = searchParams.get("registered") === "1";
  const loggedOut = searchParams.get("loggedOut") === "1";
  const nextPath = safeNextPath(searchParams.get("next"));
  const hasOauthError = searchParams.get("error") === "oauth";

  const startGoogle = async () => {
    setError(null);
    setOauthLoading(true);

    const origin = window.location.origin;
    const redirectTo = `${origin}/auth/callback${nextPath ? `?next=${encodeURIComponent(nextPath)}` : ""}`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });

    if (error) {
      setError(error.message || "Nao foi possivel entrar com o Google. Tente novamente.");
      setOauthLoading(false);
    }
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    if (!email || !password) {
      setError("Preencha email e senha.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("Email ou senha invalidos. Tente novamente.");
      setLoading(false);
      return;
    }

    router.replace(nextPath);
    router.refresh();
  };

  return (
    <main className="space-y-6 text-base text-white sm:space-y-7">
      <header className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-[var(--muted)] ring-1 ring-white/10">
          <span className="h-2 w-2 rounded-full bg-[var(--accent)] shadow-[0_0_10px_rgba(123,244,223,0.8)]" />
          Acesso seguro
        </div>
        <h1 className="text-3xl font-semibold leading-tight text-white">Entrar</h1>
        <p className="text-base text-[var(--muted)]">
          Acesse sua conta para participar da comunidade e comprar na loja.
        </p>
      </header>

      {registered ? (
        <div className="rounded-xl border border-white/10 bg-[var(--card)]/80 px-4 py-3 text-sm text-[var(--muted-strong)] shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
          Conta criada. Agora faca login.
        </div>
      ) : null}

      {loggedOut ? (
        <div className="rounded-xl border border-white/10 bg-[var(--card)]/80 px-4 py-3 text-sm text-[var(--muted-strong)] shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
          Voce saiu da conta.
        </div>
      ) : null}

      {error ? (
        <div className="rounded-xl border border-[#f1719c]/40 bg-[#2a0f1c] px-4 py-3 text-sm text-[#ffb5ca] shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
          {error}
        </div>
      ) : null}

      {hasOauthError ? (
        <div className="rounded-xl border border-[#f1719c]/40 bg-[#2a0f1c] px-4 py-3 text-sm text-[#ffb5ca] shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
          Nao foi possivel entrar com o Google. Tente novamente.
        </div>
      ) : null}

      <div className="grid gap-2">
        <button
          type="button"
          onClick={startGoogle}
          disabled={oauthLoading}
          className="flex items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-3.5 text-sm font-semibold uppercase tracking-wide text-[#04101f] shadow-[0_14px_40px_rgba(123,244,223,0.35)] transition hover:bg-[var(--accent-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050915] disabled:cursor-not-allowed disabled:opacity-70 sm:text-base"
        >
          {oauthLoading ? "Redirecionando..." : "Entrar com Google"}
        </button>
      </div>

      <div className="relative py-2 sm:py-3">
        <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-white/10" />
        <span className="relative mx-auto block w-fit rounded-full bg-[#0c1224] px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted)] ring-1 ring-white/10">
          ou use email
        </span>
      </div>

      <form onSubmit={onSubmit} className="grid gap-3 sm:gap-4">
        <label className="grid gap-1.5 text-sm font-semibold text-white sm:text-base">
          <span>Email</span>
          <input
            name="email"
            type="email"
            placeholder="voce@email.com"
            className="w-full rounded-xl border border-white/10 bg-[#0f162c] px-4 py-3 text-base text-white outline-none placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]"
            required
          />
        </label>

        <label className="grid gap-1.5 text-sm font-semibold text-white sm:text-base">
          <span>Senha</span>
          <input
            name="password"
            type="password"
            placeholder="Sua senha"
            className="w-full rounded-xl border border-white/10 bg-[#0f162c] px-4 py-3 text-base text-white outline-none placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]"
            required
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="mt-1 inline-flex items-center justify-center rounded-xl bg-white/10 px-4 py-3.5 text-sm font-semibold uppercase tracking-wide text-white ring-1 ring-white/15 transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050915] disabled:cursor-not-allowed disabled:opacity-70 sm:text-base"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <div className="flex flex-col gap-2 text-sm text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between sm:text-base">
        <Link className="font-semibold text-[var(--accent)] hover:underline" href="/register">
          Criar conta
        </Link>
        <Link className="font-semibold text-[var(--muted-strong)] hover:underline" href="/">
          Voltar para inicio
        </Link>
      </div>
    </main>
  );
}
