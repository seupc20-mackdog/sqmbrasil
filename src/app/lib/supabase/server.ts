import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function supabaseServer() {
  const cookieStore = await cookies();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; // fallback p/ seu projeto atual

  if (!url || !key) {
    throw new Error(
      "Supabase env faltando: defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (ou NEXT_PUBLIC_SUPABASE_ANON_KEY)."
    );
  }

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            // Em Server Component pode ser read-only; em Route Handler/Server Action funciona.
            (cookieStore as any).set(name, value, options);
          });
        } catch {
          // OK ignorar quando chamado a partir de Server Component,
          // desde que você use proxy para refresh de sessão depois.
        }
      },
    },
  });
}
