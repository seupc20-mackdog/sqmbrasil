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
    <Suspense fallback={<main className="p-6 text-sm text-zinc-300">Carregando...</main>}>
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

  const registered = searchParams.get("registered") === "1";
  const loggedOut = searchParams.get("loggedOut") === "1";
  const nextPath = safeNextPath(searchParams.get("next"));

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

      {error ? (
        <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="mt-5 grid gap-3">
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

        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-md bg-emerald-500 px-4 py-2 font-medium text-zinc-950 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <p className="mt-4 text-sm text-zinc-300">
        Nao tem conta?{" "}
        <Link className="text-emerald-300 hover:underline" href="/register">
          Criar conta
        </Link>
      </p>
    </main>
  );
}
