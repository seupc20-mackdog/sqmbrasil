import type { ReactNode } from "react";
import Link from "next/link";

import { LogoutButton } from "@/components/LogoutButton";
import { supabaseServer } from "@/lib/supabase/server";

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-emerald-500/20 ring-1 ring-emerald-500/30" />
            <div className="leading-tight">
              <div className="text-sm font-semibold">SQM Brasil</div>
              <div className="text-xs text-zinc-400">Comunidade + Loja</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-4 text-sm text-zinc-300 md:flex">
            <Link className="hover:text-white" href="/feed">Comunidade</Link>
            <Link className="hover:text-white" href="/shop">Loja</Link>
            <Link className="hover:text-white" href="/cart">Carrinho</Link>
          </nav>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Link
                  href="/feed"
                  className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
                >
                  Ir para o app
                </Link>

                <LogoutButton className="rounded-md border border-white/10 px-3 py-2 text-sm text-zinc-200 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-70" />
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-md border border-white/10 px-3 py-2 text-sm text-zinc-200 hover:bg-white/10"
                >
                  Entrar
                </Link>
                <Link
                  href="/register"
                  className="rounded-md bg-emerald-500 px-3 py-2 text-sm font-medium text-zinc-950 hover:bg-emerald-400"
                >
                  Criar conta
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {children}

      <footer className="mt-14 border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-zinc-400">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>© {new Date().getFullYear()} SQM Brasil</div>
            <div className="flex gap-4">
              <a className="hover:text-white" href="/shop">Loja</a>
              <a className="hover:text-white" href="/feed">Comunidade</a>
              <a className="hover:text-white" href="/register">Criar conta</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
