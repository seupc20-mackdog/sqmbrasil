import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const supabase = supabaseServer();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const postId = params.id;

  const { data: existing } = await supabase
    .from("post_likes")
    .select("post_id,user_id")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase.from("post_likes").delete().eq("post_id", postId).eq("user_id", user.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true, liked: false });
  } else {
    const { error } = await supabase.from("post_likes").insert({ post_id: postId, user_id: user.id });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true, liked: true });
  }
}
