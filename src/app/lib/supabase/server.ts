import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export async function supabaseServer() {
  // Next 16: cookies() é async
  const cookieStore = await cookies();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anon) {
    throw new Error(
      "Supabase não configurado: defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY no .env.local / Vercel"
    );
  }

  return createServerClient(url, anon, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },

      // Em Server Components, cookies são read-only; em alguns contextos isso pode falhar.
      // Não deixe quebrar o build/runtime.
      set(name: string, value: string, options: CookieOptions) {
        try {
          (cookieStore as any).set?.({ name, value, ...options });
        } catch {}
      },

      remove(name: string, options: CookieOptions) {
        try {
          (cookieStore as any).set?.({ name, value: "", ...options, maxAge: 0 });
        } catch {}
      },
    },
  });
}
