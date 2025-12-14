import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

type SeedUser = {
  email: string;
  password: string;
  username: string;
  bio: string;
  avatar_url: string;
  is_admin?: boolean;
};

type SeedProduct = {
  slug: string;
  title: string;
  description: string;
  price_cents: number;
  stock: number;
  image: string;
};

type SeedPost = {
  type: "official" | "community";
  title: string;
  slug?: string; // para official
  summary: string;
  content: string;
  author_email?: string; // para community
  is_approved?: boolean;
  published?: boolean;
};

function mustEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Faltou env: ${name}`);
  return v;
}

const SUPABASE_URL = mustEnv("NEXT_PUBLIC_SUPABASE_URL");
const SERVICE_ROLE = mustEnv("SUPABASE_SERVICE_ROLE_KEY");

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const SEED_PASSWORD = "Sqm@123456!";

const users: SeedUser[] = [
  {
    email: "admin@sqmcarla.com",
    password: SEED_PASSWORD,
    username: "Admin Carla",
    bio: "Admin da comunidade. Moderação e curadoria de conteúdo.",
    avatar_url: "https://i.pravatar.cc/150?img=32",
    is_admin: true,
  },
  {
    email: "ana@sqmcarla.com",
    password: SEED_PASSWORD,
    username: "Ana",
    bio: "Aprendendo a lidar com produtos neutros e rotina mais segura.",
    avatar_url: "https://i.pravatar.cc/150?img=47",
  },
  {
    email: "bruno@sqmcarla.com",
    password: SEED_PASSWORD,
    username: "Bruno",
    bio: "Testando ajustes em casa e trocando experiências com a comunidade.",
    avatar_url: "https://i.pravatar.cc/150?img=12",
  },
  {
    email: "carla@sqmcarla.com",
    password: SEED_PASSWORD,
    username: "Carla",
    bio: "Foco em organização, checklists e produtos de baixo odor.",
    avatar_url: "https://i.pravatar.cc/150?img=5",
  },
];

const products: SeedProduct[] = [
  {
    slug: "seed-sabonete-neutro",
    title: "Sabonete Neutro (sem fragrância)",
    description: "Opção neutra para rotina diária. Exemplo fictício para o catálogo.",
    price_cents: 1990,
    stock: 22,
    image: "https://picsum.photos/seed/sabonete/900/700",
  },
  {
    slug: "seed-detergente-sem-perfume",
    title: "Detergente Sem Perfume",
    description: "Para limpeza com menor carga de odor. Exemplo fictício.",
    price_cents: 2590,
    stock: 18,
    image: "https://picsum.photos/seed/detergente/900/700",
  },
  {
    slug: "seed-shampoo-neutro",
    title: "Shampoo Neutro",
    description: "Sem fragrância adicionada. Exemplo fictício para teste.",
    price_cents: 3490,
    stock: 10,
    image: "https://picsum.photos/seed/shampoo/900/700",
  },
  {
    slug: "seed-hidratante-sem-odor",
    title: "Hidratante Sem Odor",
    description: "Produto de demonstração para UX da loja.",
    price_cents: 4990,
    stock: 15,
    image: "https://picsum.photos/seed/hidratante/900/700",
  },
  {
    slug: "seed-luva-nitrilica",
    title: "Luvas Nitrílicas",
    description: "Item de apoio (fictício).",
    price_cents: 2890,
    stock: 40,
    image: "https://picsum.photos/seed/luvas/900/700",
  },
  {
    slug: "seed-mascara-pff2",
    title: "Máscara PFF2",
    description: "Uso demonstrativo para a loja.",
    price_cents: 1590,
    stock: 55,
    image: "https://picsum.photos/seed/mascara/900/700",
  },
  {
    slug: "seed-protetor-colchao",
    title: "Protetor de Colchão (hipoalergênico)",
    description: "Exemplo fictício.",
    price_cents: 8990,
    stock: 9,
    image: "https://picsum.photos/seed/colchao/900/700",
  },
  {
    slug: "seed-organizador-rotina",
    title: "Organizador de Rotina (checklist)",
    description: "Produto digital fictício para testar layout e checkout.",
    price_cents: 1290,
    stock: 999,
    image: "https://picsum.photos/seed/checklist/900/700",
  },
];

const posts: SeedPost[] = [
  {
    type: "official",
    title: "seed: Guia rápido de rotina com menor exposição",
    slug: "seed-guia-rotina-menor-exposicao",
    summary: "Checklist prático (fictício) para testar feed oficial.",
    content:
      "Conteúdo fictício para o site rodar com dados. Aqui entraria um guia detalhado com seções e links.",
    published: true,
  },
  {
    type: "official",
    title: "seed: Como organizar a casa por zonas",
    slug: "seed-organizacao-por-zonas",
    summary: "Organização por ambientes (exemplo).",
    content:
      "Conteúdo fictício. Estruture: Zona segura, zona transição, zona externa, com regras de entrada/limpeza.",
    published: true,
  },
  {
    type: "community",
    title: "seed: Troquei o detergente e senti diferença",
    summary: "Relato curto para testar posts aprovados.",
    content: "Relato fictício: reduzi fragrâncias e a rotina ficou mais previsível.",
    author_email: "ana@sqmcarla.com",
    is_approved: true,
  },
  {
    type: "community",
    title: "seed: Dicas para compras sem gatilhos",
    summary: "Sugestões rápidas para compras.",
    content: "Relato fictício: vou em horários vazios e priorizo itens sem perfume.",
    author_email: "bruno@sqmcarla.com",
    is_approved: true,
  },
];

async function cleanupSeedData() {
  // Produtos seed-*
  const { data: prodIds } = await supabase
    .from("products")
    .select("id")
    .like("slug", "seed-%");

  if (prodIds?.length) {
    await supabase.from("products").delete().in("id", prodIds.map((x) => x.id));
  }

  // Posts seed:* e slugs seed-*
  const { data: off } = await supabase.from("posts").select("id").like("slug", "seed-%");
  if (off?.length) await supabase.from("posts").delete().in("id", off.map((x) => x.id));

  const { data: comm } = await supabase.from("posts").select("id").ilike("title", "seed:%");
  if (comm?.length) await supabase.from("posts").delete().in("id", comm.map((x) => x.id));
}

async function ensureUsers() {
  const created: Record<string, string> = {};

  for (const u of users) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: u.email,
      password: u.password,
      email_confirm: true,
      user_metadata: { username: u.username },
    });

    if (error) {
      // Se já existir, você pode apagar pelo painel Auth > Users e rodar o seed novamente.
      throw new Error(`Falha ao criar user ${u.email}: ${error.message}`);
    }

    const id = data.user.id;
    created[u.email] = id;

    const { error: upErr } = await supabase
      .from("profiles")
      .update({
        bio: u.bio,
        avatar_url: u.avatar_url,
        is_admin: !!u.is_admin,
      })
      .eq("id", id);

    if (upErr) throw new Error(`Falha update profile ${u.email}: ${upErr.message}`);
  }

  return created;
}

async function seedProducts() {
  const { error } = await supabase.from("products").insert(
    products.map((p) => ({
      slug: p.slug,
      title: p.title,
      description: p.description,
      price_cents: p.price_cents,
      currency: "BRL",
      stock: p.stock,
      active: true,
    }))
  );
  if (error) throw new Error(`Falha insert products: ${error.message}`);

  const { data: inserted, error: selErr } = await supabase
    .from("products")
    .select("id,slug")
    .like("slug", "seed-%");

  if (selErr) throw new Error(`Falha select products: ${selErr.message}`);

  const slugToId = new Map(inserted?.map((x) => [x.slug, x.id]));

  const imagesRows = products.map((p, idx) => ({
    product_id: slugToId.get(p.slug),
    url: p.image,
    sort_order: idx,
  })).filter((x) => !!x.product_id);

  const { error: imgErr } = await supabase.from("product_images").insert(imagesRows);
  if (imgErr) throw new Error(`Falha insert product_images: ${imgErr.message}`);
}

async function seedPosts(userIdsByEmail: Record<string, string>) {
  const rows = posts.map((p) => ({
    type: p.type,
    title: p.title,
    slug: p.slug ?? null,
    summary: p.summary,
    content: p.content,
    author_id: p.type === "community" ? userIdsByEmail[p.author_email!] : null,
    is_approved: p.type === "community" ? !!p.is_approved : true,
    published: p.type === "official" ? (p.published ?? true) : true,
  }));

  const { data: inserted, error } = await supabase
    .from("posts")
    .insert(rows)
    .select("id,type,title,author_id");

  if (error) throw new Error(`Falha insert posts: ${error.message}`);

  return inserted ?? [];
}

async function seedCommentsAndLikes(insertedPosts: any[], userIdsByEmail: Record<string, string>) {
  const ana = userIdsByEmail["ana@sqmcarla.com"];
  const bruno = userIdsByEmail["bruno@sqmcarla.com"];
  const carla = userIdsByEmail["carla@sqmcarla.com"];

  const firstCommunity = insertedPosts.find((p) => p.type === "community");
  if (!firstCommunity) return;

  // Comentário raiz
  const { data: c1, error: c1err } = await supabase
    .from("comments")
    .insert({
      post_id: firstCommunity.id,
      author_id: bruno,
      content: "Comentário fictício: isso me ajudou também. Obrigado por compartilhar.",
    })
    .select("id")
    .maybeSingle();

  if (c1err) throw new Error(`Falha comment: ${c1err.message}`);

  // Reply
  if (c1?.id) {
    const { error: c2err } = await supabase.from("comments").insert({
      post_id: firstCommunity.id,
      author_id: ana,
      parent_id: c1.id,
      content: "Reply fictício: boa! vou testar essa abordagem durante a semana.",
    });
    if (c2err) throw new Error(`Falha reply: ${c2err.message}`);
  }

  // Likes em posts
  const likeRows = insertedPosts.slice(0, 3).flatMap((p) => [
    { post_id: p.id, user_id: ana },
    { post_id: p.id, user_id: bruno },
    { post_id: p.id, user_id: carla },
  ]);

  const { error: lerr } = await supabase.from("post_likes").insert(likeRows);
  if (lerr) throw new Error(`Falha post_likes: ${lerr.message}`);
}

async function main() {
  console.log("== Seed: cleanup");
  await cleanupSeedData();

  console.log("== Seed: create users + profiles");
  const userIdsByEmail = await ensureUsers();

  console.log("== Seed: products + images");
  await seedProducts();

  console.log("== Seed: posts");
  const insertedPosts = await seedPosts(userIdsByEmail);

  console.log("== Seed: comments + likes");
  await seedCommentsAndLikes(insertedPosts, userIdsByEmail);

  console.log("\nSeed concluído.");
  console.log("Login admin:", "admin@sqmcarla.com", SEED_PASSWORD);
  console.log("Login user:", "ana@sqmcarla.com", SEED_PASSWORD);
}

main().catch((e) => {
  console.error("Seed falhou:", e);
  process.exit(1);
});
