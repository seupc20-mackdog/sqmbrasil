import { NextResponse, type NextRequest } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export const runtime = "nodejs";

type Body = {
  content?: string;
  parent_id?: string | null;
};

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id: postId } = await context.params;

  const supabase = await supabaseServer();

  const { data: auth, error: authErr } = await supabase.auth.getUser();
  if (authErr || !auth.user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  let body: Body = {};
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const content = String(body.content ?? "").trim();
  if (!content) {
    return NextResponse.json({ error: "Comentário vazio" }, { status: 400 });
  }

  const { error: insErr } = await supabase.from("comments").insert({
    post_id: postId,
    author_id: auth.user.id,
    content,
    parent_id: body.parent_id ?? null,
  });

  if (insErr) {
    return NextResponse.json({ error: insErr.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
