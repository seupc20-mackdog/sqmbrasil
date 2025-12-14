import Link from "next/link";

const fakePosts = [
  { id: "p1", title: "Guia rápido: como reduzir reações em casa", summary: "Checklist prático de rotina, ambiente e higiene para diminuir gatilhos." },
  { id: "p2", title: "Relato: minha jornada com SQM", summary: "O que mudou quando ajustei alimentação, produtos e ventilação do quarto." },
  { id: "p3", title: "Produtos: como ler rótulos sem cair em pegadinhas", summary: "Fragrâncias, conservantes e termos que podem esconder irritantes." },
];

const fakeProducts = [
  { slug: "sabao-neutro", name: "Sabão neutro (sem perfume)", price: 29.9, note: "Uso geral: roupas e limpeza leve." },
  { slug: "suplemento-magnesio", name: "Magnésio (suporte)", price: 59.9, note: "Rotina diária (consultar profissional)." },
  { slug: "mascara-carvao", name: "Máscara com filtro", price: 39.9, note: "Ambientes com cheiro / poeira." },
];

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      {/* Hero */}
      <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-8 md:p-12">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Comunidade e loja focadas em SQM — com experiência simples e moderna.
          </h1>
          <p className="mt-3 text-zinc-300">
            Perfis, publicações, curtidas e comentários. E uma loja com catálogo bonito, produto bem explicado e checkout.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/register"
              className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-emerald-400"
            >
              Criar conta
            </Link>
            <Link
              href="/shop"
              className="rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-100 hover:bg-white/10"
            >
              Ver loja
            </Link>
            <Link
              href="/feed"
              className="rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-100 hover:bg-white/10"
            >
              Ver comunidade
            </Link>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm font-semibold">Publicações</div>
              <div className="mt-1 text-sm text-zinc-300">Feed com curtir e comentar</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm font-semibold">Perfis</div>
              <div className="mt-1 text-sm text-zinc-300">Cadastro + perfil do usuário</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm font-semibold">Loja</div>
              <div className="mt-1 text-sm text-zinc-300">Catálogo + produto + carrinho</div>
            </div>
          </div>
        </div>
      </section>

      {/* Últimas publicações (fictícias) */}
      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Últimas publicações</h2>
          <Link className="text-sm text-emerald-300 hover:underline" href="/feed">
            Abrir feed
          </Link>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {fakePosts.map((p) => (
            <div key={p.id} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-base font-semibold">{p.title}</div>
              <div className="mt-2 text-sm text-zinc-300">{p.summary}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Destaques da loja (fictícios) */}
      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Destaques da loja</h2>
          <Link className="text-sm text-emerald-300 hover:underline" href="/shop">
            Abrir catálogo
          </Link>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {fakeProducts.map((p) => (
            <Link
              key={p.slug}
              href={`/shop/${p.slug}`}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10"
            >
              <div className="text-base font-semibold">{p.name}</div>
              <div className="mt-2 text-sm text-zinc-300">{p.note}</div>
              <div className="mt-4 text-sm font-semibold">R$ {p.price.toFixed(2)}</div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
