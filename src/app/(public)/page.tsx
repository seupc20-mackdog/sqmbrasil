import Link from "next/link";

export default function PublicHomePage() {
  return (
    <section className="grid gap-8">
      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-8">
        <h1 className="text-3xl font-semibold tracking-tight">
          SQM Brasil — Comunidade e Loja
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-zinc-300">
          Um espaço para pessoas com Sensibilidade Química Múltipla (SQM) encontrarem
          informação, apoio e produtos selecionados para rotinas mais sensíveis.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/shop"
            className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-emerald-400"
          >
            Ver produtos
          </Link>
          <Link
            href="/feed"
            className="rounded-md border border-white/15 px-4 py-2 text-sm hover:bg-white/5"
          >
            Acessar comunidade
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="font-semibold">Conteúdo confiável</h3>
          <p className="mt-2 text-sm text-zinc-300">
            Publicações oficiais e tópicos da comunidade, com moderação.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="font-semibold">Loja com foco em sensíveis</h3>
          <p className="mt-2 text-sm text-zinc-300">
            Catálogo organizado e fácil de comprar (MVP comercial).
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="font-semibold">Perfil e interação</h3>
          <p className="mt-2 text-sm text-zinc-300">
            Cadastro, perfil, curtidas e comentários em posts/tópicos.
          </p>
        </div>
      </div>
    </section>
  );
}
