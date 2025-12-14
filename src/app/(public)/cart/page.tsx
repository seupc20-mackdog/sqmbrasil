"use client";

import { useEffect, useMemo, useState } from "react";

type CartItem = { productId: string; title: string; price_cents: number; currency: string; qty: number };

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("sqm_cart");
    setItems(raw ? JSON.parse(raw) : []);
  }, []);

  const total = useMemo(() => items.reduce((s, x) => s + x.price_cents * x.qty, 0), [items]);

  function save(next: CartItem[]) {
    setItems(next);
    localStorage.setItem("sqm_cart", JSON.stringify(next));
  }

  async function checkout() {
    setBusy(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ items: items.map(({ productId, qty }) => ({ productId, qty })) }),
      });
      const data = await res.json();
      if (data?.url) window.location.href = data.url;
      else alert(data?.error || "Checkout não configurado.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="grid gap-4">
      <h2 className="text-2xl font-semibold">Carrinho</h2>

      {items.length === 0 ? (
        <div className="text-zinc-300">Seu carrinho está vazio.</div>
      ) : (
        <div className="grid gap-3">
          {items.map((x) => (
            <div key={x.productId} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
              <div>
                <div className="font-medium">{x.title}</div>
                <div className="text-sm text-zinc-300">
                  {(x.price_cents / 100).toLocaleString("pt-BR", { style: "currency", currency: x.currency })} × {x.qty}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  className="rounded-md border border-white/15 px-3 py-2 text-sm hover:bg-white/5"
                  onClick={() => save(items.map((it) => (it.productId === x.productId ? { ...it, qty: Math.max(1, it.qty - 1) } : it)))}
                >
                  -
                </button>
                <button
                  className="rounded-md border border-white/15 px-3 py-2 text-sm hover:bg-white/5"
                  onClick={() => save(items.map((it) => (it.productId === x.productId ? { ...it, qty: it.qty + 1 } : it)))}
                >
                  +
                </button>
                <button
                  className="rounded-md border border-red-500/30 px-3 py-2 text-sm text-red-200 hover:bg-red-500/10"
                  onClick={() => save(items.filter((it) => it.productId !== x.productId))}
                >
                  remover
                </button>
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="text-zinc-300">Total</div>
            <div className="text-emerald-300">
              {(total / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </div>
          </div>

          <button
            disabled={busy}
            onClick={checkout}
            className="rounded-md bg-emerald-500 px-4 py-2 font-medium text-zinc-950 hover:bg-emerald-400 disabled:opacity-50"
          >
            Ir para checkout
          </button>
        </div>
      )}
    </section>
  );
}
