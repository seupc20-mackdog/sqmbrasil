import type { ReactNode, CSSProperties } from "react";
import Link from "next/link";

import { AuthButtons } from "@/components/AuthButtons";

type CssVarStyle = CSSProperties & Record<`--${string}`, string>;

const authTokens: CssVarStyle = {
  "--nav-bg": "#0A1324",
  "--brand-pink": "#F5135A",
  "--brand-pink-hover": "#D80F4F",
  "--cta-teal": "#98D2D4",
  "--cta-teal-hover": "#86C7C9",
  "--field-bg": "#F4F5F7",
  "--field-border": "#CACFD3",
  "--link-blue": "#5F95C5",
  "--soft-teal-bg": "#DFF2F5",
  "--check-teal": "#168D90",
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-[#0A1324]" style={authTokens}>
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[1.05fr_1fr] lg:bg-[var(--nav-bg)] lg:text-white">
        <header className="flex items-center justify-between px-4 py-4 sm:px-6 lg:hidden">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[18px] bg-[var(--soft-teal-bg)] text-sm font-semibold uppercase tracking-tight text-[var(--check-teal)] ring-1 ring-[var(--cta-teal)]">
              SQM
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-[var(--nav-bg)]">SQM Brasil - Comunidade e Loja</p>
              <p className="text-xs text-[#5a647a]">Entre para participar da comunidade e acessar a loja.</p>
            </div>
          </Link>

          <Link
            href="/"
            aria-label="Voltar para a pagina inicial"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--field-border)] text-[var(--nav-bg)] shadow-sm transition hover:bg-[var(--field-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cta-teal)]"
          >
            &#10005;
          </Link>
        </header>

        <div className="relative hidden h-full flex-col justify-between overflow-hidden px-10 py-12 lg:flex">
          <div className="absolute inset-0 -z-10 rounded-[28px] bg-[radial-gradient(circle_at_18%_20%,rgba(152,210,212,0.26),transparent_45%),radial-gradient(circle_at_82%_65%,rgba(245,19,90,0.22),transparent_42%)]" />
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-[var(--soft-teal-bg)] text-sm font-semibold uppercase tracking-tight text-[var(--check-teal)] ring-1 ring-[var(--cta-teal)]">
                SQM
              </div>
              <div>
                <div className="text-lg font-semibold">SQM Brasil - Comunidade e Loja</div>
                <div className="text-sm text-[#d8e3f5]">Entre para participar da comunidade e acessar a loja.</div>
              </div>
            </Link>

            <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/90">
              Acesso seguro e rapido
            </div>
          </div>

          <div className="mt-12 space-y-8 text-white">
            <p className="text-3xl font-semibold leading-tight">
              Acesse publicacoes, comente, curta e salve conteudos da comunidade. Finalize compras na loja com facilidade e acompanhe seus pedidos.
            </p>
            <ul className="space-y-4 text-sm text-[#d8e3f5]">
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[var(--check-teal)]" />
                Login com Google ou email para entrar na sua conta.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[var(--check-teal)]" />
                Sessao protegida com autenticacao e cookies seguros.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[var(--check-teal)]" />
                Experiencia otimizada para desktop e mobile.
              </li>
            </ul>
          </div>

          <p className="mt-10 text-xs text-[#a3b6d6]">
            Conteudo informativo; nao substitui orientacao profissional.
          </p>
        </div>

        <div className="flex min-h-full flex-col bg-white px-4 pb-10 pt-2 sm:px-6 lg:ms-auto lg:me-10 lg:min-h-screen lg:justify-center lg:rounded-tl-[28px] lg:rounded-bl-[28px] lg:px-10 lg:pb-14 lg:pt-8">
          <div className="mb-5 hidden justify-end lg:flex">
            <AuthButtons />
          </div>

          <div className="mx-auto w-full max-w-[420px] rounded-2xl border border-[var(--field-border)] bg-white p-6 shadow-[0_16px_46px_rgba(10,19,36,0.14)] lg:shadow-[0_24px_60px_rgba(10,19,36,0.2)]">
            <div className="mb-5 lg:hidden">
              <AuthButtons layout="stacked" />
            </div>
            {children}
          </div>

          <p className="mt-6 text-center text-xs text-[#5f6677] lg:text-start">
            Conteudo informativo; nao substitui orientacao profissional.
          </p>
        </div>
      </div>
    </div>
  );
}
