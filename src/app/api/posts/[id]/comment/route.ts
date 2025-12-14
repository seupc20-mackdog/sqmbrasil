import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const supabase = supabaseServer();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { content, parent_id } = await req.json().catch(() => ({ content: "", parent_id: null }));
  const c = String(content || "").trim();
  if (!c) return NextResponse.json({ error: "empty" }, { status: 400 });

  const { error } = await supabase.from("comments").insert({
    post_id: params.id,
    author_id: user.id,
    parent_id: parent_id || null,
    content: c,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
