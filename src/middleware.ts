import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const PROTECTED_PREFIXES = ["/feed", "/new", "/profile", "/admin"];

function isValidHttpUrl(value?: string | null) {
  if (!value) return false;
  return /^https?:\/\//i.test(value);
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtected = PROTECTED_PREFIXES.some((p) => path.startsWith(p));

  // Se não for rota protegida, não precisa tocar em Supabase
  if (!isProtected) {
    return NextResponse.next();
  }

  // Variáveis de ambiente (não derruba o app se estiver faltando)
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!isValidHttpUrl(url) || !anon) {
    // Se env não estiver pronta, deixa passar (evita crash local)
    return NextResponse.next();
  }

  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(url!, anon!, {
    cookies: {
      get(name) {
        return request.cookies.get(name)?.value;
      },
      set(name, value, options) {
        response.cookies.set({ name, value, ...options });
      },
      remove(name, options) {
        response.cookies.set({ name, value: "", ...options, maxAge: 0 });
      },
    },
  });

  const { data, error } = await supabase.auth.getUser();

  // Se não autenticado (ou erro), redireciona para login
  if (error || !data?.user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", path);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ["/feed/:path*", "/new/:path*", "/profile/:path*", "/admin/:path*"],
};
