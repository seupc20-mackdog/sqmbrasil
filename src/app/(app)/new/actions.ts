"use server";

import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";

export async function createCommunityPost(formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  const summary = String(formData.get("summary") || "").trim();

  if (!title) return { ok: false, message: "Título obrigatório." };

  const supabase = await supabaseServer();

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) return { ok: false, message: "Não autenticado." };

  // O índice único no banco garante 1 post/dia; aqui a gente só dá mensagem amigável.
  const { error } = await supabase.from("posts").insert({
    type: "community",
    author_id: user.id,
    title,
    summary: summary || null,
    is_approved: false,
    published: true,
  });

  if (error) {
    if (String(error.message).toLowerCase().includes("posts_one_community_per_day")) {
      return { ok: false, message: "Você já postou hoje. Tente novamente amanhã." };
    }
    return { ok: false, message: error.message };
  }

  redirect("/feed");
}
