import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";

import { AuthButtons } from "@/components/AuthButtons";

type CssVarStyle = CSSProperties & Record<`--${string}`, string>;

const tokens: CssVarStyle = {
  "--bg-left": "linear-gradient(140deg, #050915 0%, #0d1529 45%, #0f1f37 100%)",
  "--accent": "#7BF4DF",
  "--accent-strong": "#45E0C1",
  "--card": "#0c1224",
  "--muted": "#9fb3d4",
  "--muted-strong": "#dfe7f5",
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#02060f] text-white" style={tokens}>
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        <div className="relative flex flex-col gap-8 px-6 pb-12 pt-10 sm:px-10 lg:px-14 lg:pb-16 lg:pt-12">
          <div className="absolute inset-0 bg-[var(--bg-left)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(123,244,223,0.18),transparent_40%),radial-gradient(circle_at_85%_60%,rgba(69,224,193,0.18),transparent_38%)]" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#050915]/60 to-transparent" />

          <header className="relative flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-lg font-semibold uppercase tracking-tight text-[var(--accent)] ring-1 ring-white/10">
                SQM
              </div>
              <div className="leading-tight">
                <p className="text-sm font-semibold text-white/90">SQM Brasil</p>
                <p className="text-xs text-[var(--muted)]">Comunidade e Loja para SQM</p>
              </div>
            </Link>
            <div className="hidden text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--accent)] sm:block">
              AUTH_LAYOUT_V2
            </div>
          </header>

          <div className="relative mt-4 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[13px] font-semibold text-[var(--muted-strong)] shadow-[0_10px_40px_rgba(2,6,15,0.4)]">
              <span className="h-2 w-2 rounded-full bg-[var(--accent)] shadow-[0_0_14px_rgba(123,244,223,0.9)]" />
              Acesso seguro e rápido
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">
                Comunidade e Loja para pessoas com Sensibilidade Química Múltipla (SQM).
              </h1>
              <p className="text-base text-[var(--muted)] sm:text-lg">
                Participe das conversas, acompanhe novidades sobre bem-estar e encontre produtos selecionados para o dia a dia com SQM.
              </p>
            </div>

            <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 text-[var(--muted-strong)] shadow-[0_16px_40px_rgba(2,6,15,0.35)] sm:grid-cols-2 sm:gap-4">
              <Benefit title="Comunidade" description="Publique, comente e curta conteúdos." />
              <Benefit title="Loja" description="Produtos selecionados e checkout simples." />
              <Benefit title="Conta segura" description="Autenticação e sessão protegida." />
              <Benefit title="Multi-dispositivo" description="Experiência otimizada para desktop e mobile." />
            </div>

            <p className="text-xs text-[var(--muted)]">
              Conteúdo informativo; não substitui orientação profissional.
            </p>
          </div>
        </div>

        <div className="flex min-h-screen flex-col items-center justify-center bg-[#050915] px-4 pb-12 pt-10 sm:px-6 lg:px-12 lg:pb-16">
          <div className="w-full max-w-[420px] rounded-2xl border border-white/8 bg-[var(--card)]/80 p-6 shadow-[0_18px_45px_rgba(0,0,0,0.45)] backdrop-blur">
            <div className="mb-4 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
              <span className="rounded-full bg-white/5 px-3 py-1 font-semibold text-[var(--muted-strong)]">SQM Brasil</span>
              <span className="rounded-full bg-white/5 px-3 py-1 font-semibold text-[var(--accent)]">Acesso seguro</span>
            </div>
            <div className="mb-5 block lg:hidden">
              <AuthButtons layout="stacked" />
            </div>
            <div className="hidden lg:mb-6 lg:flex lg:justify-end">
              <AuthButtons />
            </div>
            {children}
          </div>

          <p className="mt-6 text-center text-xs text-[var(--muted)]">
            Precisa de ajuda? <Link href="/shop" className="text-[var(--accent)] underline-offset-4 hover:underline">Explore a loja</Link> ou{" "}
            <Link href="/feed" className="text-[var(--accent)] underline-offset-4 hover:underline">veja a comunidade</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}

function Benefit({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-white/5 px-3.5 py-3 ring-1 ring-white/5">
      <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[var(--accent)] shadow-[0_0_12px_rgba(123,244,223,0.9)]" />
      <div className="space-y-1">
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="text-sm text-[var(--muted)]">{description}</p>
      </div>
    </div>
  );
}
