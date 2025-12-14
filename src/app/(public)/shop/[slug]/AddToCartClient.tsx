"use client";

export default function AddToCartClient(props: {
  productId: string;
  title: string;
  price_cents: number;
  currency: string;
}) {
  function add() {
    const key = "sqm_cart";
    const raw = localStorage.getItem(key);
    const cart = raw ? (JSON.parse(raw) as any[]) : [];

    const i = cart.findIndex((x) => x.productId === props.productId);
    if (i >= 0) cart[i].qty += 1;
    else cart.push({ productId: props.productId, title: props.title, price_cents: props.price_cents, currency: props.currency, qty: 1 });

    localStorage.setItem(key, JSON.stringify(cart));
    window.location.href = "/cart";
  }

  return (
    <button
      type="button"
      onClick={add}
      className="w-full rounded-md bg-emerald-500 px-4 py-2 font-medium text-zinc-950 hover:bg-emerald-400"
    >
      Adicionar ao carrinho
    </button>
  );
}
