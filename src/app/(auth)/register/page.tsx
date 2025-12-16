"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";

import { supabaseBrowser } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = useMemo(() => supabaseBrowser(), []);

  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);

  const startGoogle = async () => {
    setError(null);
    setMessage(null);
    setOauthLoading(true);

    const origin = window.location.origin;
    const redirectTo = `${origin}/auth/callback`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });

    if (error) {
      setError(error.message || "Não foi possível entrar com o Google. Tente novamente.");
      setOauthLoading(false);
    }
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const username = String(formData.get("username") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    if (!username || !email || password.length < 6) {
      setError("Preencha os campos e use senha com pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } },
    });

    if (error) {
      setError(error.message || "Não foi possível criar sua conta. Verifique os dados e tente novamente.");
      setLoading(false);
      return;
    }

    if (data.session) {
      router.replace("/feed");
      router.refresh();
      return;
    }

    setMessage("Conta criada! Verifique seu email para confirmar o cadastro e depois faça login.");
    setLoading(false);
  };

  return (
    <main className="space-y-6 text-base text-white sm:space-y-7">
      <header className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-[var(--muted)] ring-1 ring-white/10">
          <span className="h-2 w-2 rounded-full bg-[var(--accent)] shadow-[0_0_10px_rgba(123,244,223,0.8)]" />
          Cadastro seguro
        </div>
        <h1 className="text-3xl font-semibold leading-tight text-white">Criar conta</h1>
        <p className="text-base text-[var(--muted)]">
          Crie sua conta para acessar conteúdos e produtos especializados para quem tem SQM.
        </p>
      </header>

      {error ? (
        <div className="rounded-xl border border-[#f1719c]/40 bg-[#2a0f1c] px-4 py-3 text-sm text-[#ffb5ca] shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
          {error}
        </div>
      ) : null}

      {message ? (
        <div className="rounded-xl border border-white/10 bg-[var(--card)]/80 px-4 py-3 text-sm text-[var(--muted-strong)] shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
          {message}
        </div>
      ) : null}

      <div className="grid gap-2">
        <button
          type="button"
          onClick={startGoogle}
          disabled={oauthLoading}
          className="flex items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-3.5 text-sm font-semibold uppercase tracking-wide text-[#04101f] shadow-[0_14px_40px_rgba(123,244,223,0.35)] transition hover:bg-[var(--accent-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050915] disabled:cursor-not-allowed disabled:opacity-70 sm:text-base"
        >
          {oauthLoading ? "Redirecionando..." : "Criar conta com Google"}
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
          <span>Nome</span>
          <input
            name="username"
            placeholder="Seu nome"
            className="w-full rounded-xl border border-white/10 bg-[#0f162c] px-4 py-3 text-base text-white outline-none placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]"
            required
          />
        </label>

        <label className="grid gap-1.5 text-sm font-semibold text-white sm:text-base">
          <span>Email</span>
          <input
            name="email"
            type="email"
            placeholder="Seu email"
            className="w-full rounded-xl border border-white/10 bg-[#0f162c] px-4 py-3 text-base text-white outline-none placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]"
            required
          />
        </label>

        <label className="grid gap-1.5 text-sm font-semibold text-white sm:text-base">
          <span>Senha</span>
          <input
            name="password"
            type="password"
            placeholder="Sua senha (mínimo 6 caracteres)"
            className="w-full rounded-xl border border-white/10 bg-[#0f162c] px-4 py-3 text-base text-white outline-none placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]"
            required
            minLength={6}
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="mt-1 inline-flex items-center justify-center rounded-xl bg-[var(--accent)] px-4 py-3.5 text-sm font-semibold uppercase tracking-wide text-[#04101f] shadow-[0_14px_40px_rgba(123,244,223,0.35)] transition hover:bg-[var(--accent-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050915] disabled:cursor-not-allowed disabled:opacity-70 sm:text-base"
        >
          {loading ? "Criando..." : "Criar conta"}
        </button>
      </form>

      <p className="text-sm text-[var(--muted)] sm:text-base">
        Já tenho conta.{" "}
        <Link className="font-semibold text-[var(--accent)] hover:underline" href="/login">
          Fazer login
        </Link>
      </p>
    </main>
  );
}
