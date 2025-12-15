import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";

import { AuthButtons } from "@/components/AuthButtons";

const authTokens: CSSProperties = {
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
      <div className="flex min-h-screen flex-col md:flex-row md:bg-[var(--nav-bg)] md:text-white">
        <header className="flex items-center justify-between px-5 py-4 md:hidden">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[18px] bg-[var(--soft-teal-bg)] text-sm font-semibold uppercase tracking-tight text-[var(--check-teal)] ring-1 ring-[var(--cta-teal)]">
              SQM
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-[var(--nav-bg)]">SQM Sportsbook</p>
              <p className="text-xs text-[#5a647a]">Auth Sportsbook v1.0</p>
            </div>
          </Link>

          <Link
            href="/"
            aria-label="Fechar"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--field-border)] text-[var(--nav-bg)] shadow-sm transition hover:bg-[var(--field-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cta-teal)]"
          >
            &#10005;
          </Link>
        </header>

        <div className="hidden w-[45%] flex-col justify-between px-12 py-12 md:flex">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-[var(--soft-teal-bg)] text-sm font-semibold uppercase tracking-tight text-[var(--check-teal)] ring-1 ring-[var(--cta-teal)]">
                SQM
              </div>
              <div>
                <div className="text-lg font-semibold">SQM Sportsbook</div>
                <div className="text-sm text-[#a3b6d6]">Acesso seguro e rapido</div>
              </div>
            </Link>

            <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/90">
              Auth v1.0
            </div>
          </div>

          <div className="mt-16 space-y-6 text-white">
            <p className="text-3xl font-semibold leading-tight">
              Acompanhe apostas e ofertas com seguranca e clareza.
            </p>
            <ul className="space-y-4 text-sm text-[#d8e3f5]">
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[var(--check-teal)]" />
                Login rapido com Google ou email para voltar aos seus tickets.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[var(--check-teal)]" />
                Protecao com tokens verificados e ambiente monitorado 24/7.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[var(--check-teal)]" />
                Experiencia otimizada para escritorio e mobile, pronta para apostar.
              </li>
            </ul>
          </div>

          <p className="mt-10 text-xs text-[#a3b6d6]">
            Dica: mantenha seus acessos seguros e atualizados para nao perder os limites do dia.
          </p>
        </div>

        <div className="flex-1 bg-white md:min-h-screen md:bg-transparent md:pb-12">
          <div className="mx-auto flex w-full max-w-[540px] flex-col px-5 pb-8 pt-3 md:ms-auto md:me-12 md:pt-12">
            <div className="hidden justify-end md:flex">
              <AuthButtons />
            </div>

            <div className="mt-4 rounded-none border-none bg-white px-0 py-0 shadow-none md:mt-5 md:rounded-[18px] md:border md:border-[var(--field-border)] md:px-8 md:py-8 md:shadow-[0_18px_50px_rgba(10,19,36,0.22)]">
              <div className="mb-4 md:hidden">
                <AuthButtons layout="stacked" />
              </div>
              {children}
            </div>

            <p className="mt-6 text-center text-xs text-[#5f6677] md:text-start">
              Ao continuar, voce concorda com as praticas de seguranca do ambiente Sportsbook.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
