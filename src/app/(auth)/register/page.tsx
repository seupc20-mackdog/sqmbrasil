import { signUp } from "./actions";

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-white/5 p-6">
      <h2 className="text-xl font-semibold">Criar conta</h2>

      <form action={signUp} className="mt-5 grid gap-3">
        <input name="username" placeholder="Nome de usuário" className="w-full rounded-md border border-white/10 bg-zinc-900 px-3 py-2 outline-none" required />
        <input name="email" type="email" placeholder="Email" className="w-full rounded-md border border-white/10 bg-zinc-900 px-3 py-2 outline-none" required />
        <input name="password" type="password" placeholder="Senha" className="w-full rounded-md border border-white/10 bg-zinc-900 px-3 py-2 outline-none" required />

        <button className="mt-2 rounded-md bg-emerald-500 px-4 py-2 font-medium text-zinc-950 hover:bg-emerald-400">
          Criar conta
        </button>
      </form>
    </div>
  );
}
