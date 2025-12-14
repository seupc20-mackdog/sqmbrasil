import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export async function supabaseServer() {
  const cookieStore = await cookies();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anon) {
    throw new Error(
      "Supabase não configurado: defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY em .env.local"
    );
  }

  return createServerClient(url, anon, {
    cookies: {
      get(name: string) {
        try {
          // Caminho padrão
          const v = (cookieStore as any).get?.(name)?.value;
          if (typeof v === "string") return v;

          // Fallback (se não existir .get)
          const all = (cookieStore as any).getAll?.() ?? [];
          const found = all.find((c: any) => c?.name === name);
          return found?.value;
        } catch {
          return undefined;
        }
      },

      set(name: string, value: string, options: CookieOptions) {
        try {
          (cookieStore as any).set?.({ name, value, ...options });
        } catch {
          // Em alguns contextos, cookies podem ser read-only — não derruba o app.
        }
      },

      remove(name: string, options: CookieOptions) {
        try {
          (cookieStore as any).set?.({ name, value: "", ...options, maxAge: 0 });
        } catch {}
      },
    },
  });
}
