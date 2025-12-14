import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

const PROTECTED = ["/feed", "/new"];

function supabaseUrl() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  return url;
}

function supabaseAnon() {
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!key) throw new Error("Missing NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  return key;
}

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Sempre marca que o proxy rodou (para você checar no DevTools)
  const response = NextResponse.next();
  response.headers.set("x-sqm-proxy", "1");

  const isProtected = PROTECTED.some((p) => path === p || path.startsWith(p + "/"));
  if (!isProtected) return response;

  const supabase = createServerClient(supabaseUrl(), supabaseAnon(), {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set({ name, value, ...options });
        });
      },
    },
  });

  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", path);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ["/feed/:path*", "/new/:path*"],
};
