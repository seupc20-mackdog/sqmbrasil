"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type AuthButtonsProps = {
  layout?: "inline" | "stacked";
};

export function AuthButtons({ layout = "inline" }: AuthButtonsProps) {
  const pathname = usePathname();
  const isLogin = pathname?.includes("/login");
  const isRegister = pathname?.includes("/register");

  const wrapperClass =
    layout === "stacked" ? "grid grid-cols-1 gap-2" : "flex items-center gap-3";
  const sizeClass = layout === "stacked" ? "w-full text-center" : "";

  return (
    <div className={wrapperClass}>
      <Link
        href="/register"
        className={`rounded-[12px] border border-[var(--field-border)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--nav-bg)] transition hover:bg-[var(--field-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cta-teal)] ${sizeClass} ${
          isRegister ? "shadow-[0_8px_18px_rgba(244,245,247,0.45)]" : ""
        }`}
      >
        CADASTRE-SE
      </Link>

      <Link
        href="/login"
        className={`rounded-[12px] border border-[var(--brand-pink)] bg-[var(--brand-pink)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--brand-pink-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cta-teal)] ${sizeClass} ${
          isLogin ? "shadow-[0_18px_30px_rgba(245,19,90,0.28)]" : ""
        }`}
      >
        ENTRAR
      </Link>
    </div>
  );
}
