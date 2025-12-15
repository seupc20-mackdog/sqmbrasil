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
    <main className="space-y-6 text-[var(--nav-bg)]">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--brand-pink)]">Cadastro</p>
        <h1 className="text-3xl font-semibold leading-tight">Criar conta</h1>
        <p className="text-sm text-[#5a647a]">
          Cadastre-se para salvar preferencias e acompanhar o seu historico de apostas.
        </p>
      </header>

      {error ? (
        <div className="rounded-[12px] border border-[var(--brand-pink)]/40 bg-[#fff2f6] px-4 py-3 text-sm text-[#7a0d32] shadow-sm">
          {error}
        </div>
      ) : null}

      {message ? (
        <div className="rounded-[12px] border border-[var(--check-teal)]/40 bg-[var(--soft-teal-bg)] px-4 py-3 text-sm text-[var(--nav-bg)] shadow-sm">
          {message}
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="grid gap-3">
        <label className="grid gap-1.5 text-sm font-semibold text-[var(--nav-bg)]">
          <span>Nome de usuario</span>
          <input
            name="username"
            placeholder="nickname"
            className="w-full rounded-[10px] border border-[var(--field-border)] bg-[var(--field-bg)] px-4 py-3 text-[var(--nav-bg)] outline-none placeholder:text-[#7b8496] focus:border-[var(--cta-teal)] focus:bg-white focus:ring-2 focus:ring-[var(--cta-teal)]"
            required
          />
        </label>

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
            placeholder="Minimo 6 caracteres"
            className="w-full rounded-[10px] border border-[var(--field-border)] bg-[var(--field-bg)] px-4 py-3 text-[var(--nav-bg)] outline-none placeholder:text-[#7b8496] focus:border-[var(--cta-teal)] focus:bg-white focus:ring-2 focus:ring-[var(--cta-teal)]"
            required
            minLength={6}
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 inline-flex items-center justify-center rounded-[12px] bg-[var(--brand-pink)] px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-md transition hover:bg-[var(--brand-pink-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cta-teal)] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Criando..." : "Criar conta"}
        </button>
      </form>

      <p className="text-sm">
        Ja tem conta?{" "}
        <Link className="font-semibold text-[var(--link-blue)] hover:underline" href="/login">
          Entrar
        </Link>
      </p>
    </main>
  );
}
