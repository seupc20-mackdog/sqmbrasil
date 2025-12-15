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
    <Suspense fallback={<main className="p-6 text-sm text-[#5a647a]">Carregando...</main>}>
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
      setError(error.message || "Nao foi possivel iniciar o login com Google.");
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
      setError(error.message || "Email ou senha invalidos (ou conta nao confirmada).");
      setLoading(false);
      return;
    }

    router.replace(nextPath);
    router.refresh();
  };

  return (
    <main className="space-y-6 text-[var(--nav-bg)]">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--brand-pink)]">Acesso seguro</p>
        <h1 className="text-3xl font-semibold leading-tight">Entrar</h1>
        <p className="text-sm text-[#5a647a]">
          Acesse sua conta para acompanhar apostas, limites e ofertas exclusivas.
        </p>
      </header>

      {registered ? (
        <div className="rounded-[12px] border border-[var(--check-teal)]/40 bg-[var(--soft-teal-bg)] px-4 py-3 text-sm text-[var(--nav-bg)] shadow-sm">
          Conta criada. Agora faca login.
        </div>
      ) : null}

      {loggedOut ? (
        <div className="rounded-[12px] border border-[var(--field-border)] bg-[var(--field-bg)] px-4 py-3 text-sm text-[var(--nav-bg)] shadow-sm">
          Voce saiu da conta.
        </div>
      ) : null}

      {error ? (
        <div className="rounded-[12px] border border-[var(--brand-pink)]/40 bg-[#fff2f6] px-4 py-3 text-sm text-[#7a0d32] shadow-sm">
          {error}
        </div>
      ) : null}

      {hasOauthError ? (
        <div className="rounded-[12px] border border-[var(--brand-pink)]/40 bg-[#fff2f6] px-4 py-3 text-sm text-[#7a0d32] shadow-sm">
          Falha no login social. Tente novamente.
        </div>
      ) : null}

      <div className="grid gap-2">
        <button
          type="button"
          onClick={startGoogle}
          disabled={oauthLoading}
          className="flex items-center justify-center gap-2 rounded-[12px] border border-[var(--field-border)] bg-white px-4 py-3 text-sm font-semibold text-[var(--nav-bg)] shadow-sm transition hover:bg-[var(--field-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cta-teal)] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {oauthLoading ? "Redirecionando..." : "Entrar com Google"}
        </button>
      </div>

      <div className="relative py-2">
        <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[var(--field-border)]" />
        <span className="relative mx-auto block w-fit bg-white px-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#7c879f]">
          ou use email
        </span>
      </div>

      <form onSubmit={onSubmit} className="grid gap-3">
        <label className="grid gap-1.5 text-sm font-semibold text-[var(--nav-bg)]">
          <span>Email</span>
          <input
            name="email"
            type="email"
            placeholder="seuemail@email.com"
            className="w-full rounded-[10px] border border-[var(--field-border)] bg-[var(--field-bg)] px-4 py-3 text-[var(--nav-bg)] outline-none placeholder:text-[#7b8496] focus:border-[var(--cta-teal)] focus:bg-white focus:ring-2 focus:ring-[var(--cta-teal)]"
            required
          />
        </label>

        <label className="grid gap-1.5 text-sm font-semibold text-[var(--nav-bg)]">
          <span>Senha</span>
          <input
            name="password"
            type="password"
            placeholder="Digite sua senha"
            className="w-full rounded-[10px] border border-[var(--field-border)] bg-[var(--field-bg)] px-4 py-3 text-[var(--nav-bg)] outline-none placeholder:text-[#7b8496] focus:border-[var(--cta-teal)] focus:bg-white focus:ring-2 focus:ring-[var(--cta-teal)]"
            required
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 inline-flex items-center justify-center rounded-[12px] bg-[var(--cta-teal)] px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-md transition hover:bg-[var(--cta-teal-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cta-teal)] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Entrando..." : "Entrar agora"}
        </button>
      </form>

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <Link className="font-semibold text-[var(--link-blue)] hover:underline" href="/register">
          Cadastre-se
        </Link>
        <Link className="font-semibold text-[var(--link-blue)] hover:underline" href="/forgot-password">
          Esqueci minha senha
        </Link>
      </div>
    </main>
  );
}
