import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "SQM Carla",
  description: "Comunidade + Loja para pessoas com SQM",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-zinc-950 text-zinc-50">
        <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/70 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="font-semibold tracking-tight">
              SQM<span className="text-emerald-400">carla</span>
            </Link>

            <nav className="flex items-center gap-4 text-sm text-zinc-300">
              <Link className="hover:text-white" href="/shop">Loja</Link>
              <Link className="hover:text-white" href="/feed">Comunidade</Link>
              <Link className="hover:text-white" href="/cart">Carrinho</Link>
              <Link className="rounded-md bg-emerald-500 px-3 py-1.5 font-medium text-zinc-950 hover:bg-emerald-400" href="/login">
                Entrar
              </Link>
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>

        <footer className="border-t border-white/10 py-8 text-center text-xs text-zinc-400">
          SQM Carla — conteúdo informativo; não substitui orientação profissional.
        </footer>
      </body>
    </html>
  );
}
