import type { ReactNode } from "react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-md px-4 py-10">
        <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-300 hover:text-white">
          <span className="h-7 w-7 rounded-xl bg-emerald-500/20 ring-1 ring-emerald-500/30" />
          Voltar para a Home
        </Link>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          {children}
        </div>

        <p className="mt-4 text-center text-xs text-zinc-500">
          Ao criar conta, você concorda com os termos e políticas do projeto (MVP).
        </p>
      </div>
    </div>
  );
}
