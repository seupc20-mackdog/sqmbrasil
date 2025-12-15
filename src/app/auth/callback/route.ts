import { NextResponse } from "next/server";

import { supabaseServer } from "@/lib/supabase/server";

function safeNextPath(input: string | null): string {
  if (!input) return "/feed";
  if (!input.startsWith("/")) return "/feed";
  if (input.startsWith("//")) return "/feed";
  if (input.includes("://")) return "/feed";
  return input;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const nextParam = url.searchParams.get("next");
  const nextPath = safeNextPath(nextParam);

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=oauth", url.origin));
  }

  const supabase = await supabaseServer();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(new URL("/login?error=oauth", url.origin));
  }

  return NextResponse.redirect(new URL(nextPath, url.origin));
}
