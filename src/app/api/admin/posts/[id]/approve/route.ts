import { NextResponse, type NextRequest } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const supabase = await supabaseServer();

    // precisa estar logado
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    // checa admin no profile
    const { data: profile, error: pErr } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", auth.user.id)
      .maybeSingle();

    if (pErr) {
      return NextResponse.json({ error: pErr.message }, { status: 400 });
    }
    if (!profile?.is_admin) {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
    }

    // aprova post
    const { error } = await supabase
      .from("posts")
      .update({ is_approved: true })
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Erro inesperado" },
      { status: 500 }
    );
  }
}
