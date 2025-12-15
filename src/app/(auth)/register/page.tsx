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
      setError(error.message || "Nao foi possivel criar sua conta. Verifique os dados e tente novamente.");
      setLoading(false);
      return;
    }

    if (data.session) {
      router.replace("/feed");
      router.refresh();
      return;
    }

    setMessage("Conta criada! Verifique seu email para confirmar o cadastro.");
    setLoading(false);
  };

  return (
    <main>
      <h1 className="text-xl font-semibold">Criar conta</h1>
      <p className="mt-1 text-sm text-zinc-300">
        Cadastre-se para curtir, comentar e participar da comunidade.
      </p>

      {error ? (
        <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      {message ? (
        <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-200">
          {message}
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="mt-5 grid gap-3">
        <input
          name="username"
          placeholder="Nome de usuario"
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
          placeholder="Senha (min. 6)"
          className="w-full rounded-md border border-white/10 bg-zinc-900 px-3 py-2 outline-none"
          required
          minLength={6}
        />

        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-md bg-emerald-500 px-4 py-2 font-medium text-zinc-950 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Criando..." : "Criar conta"}
        </button>
      </form>

      <p className="mt-4 text-sm text-zinc-300">
        Ja tem conta?{" "}
        <Link className="text-emerald-300 hover:underline" href="/login">
          Entrar
        </Link>
      </p>
    </main>
  );
}
