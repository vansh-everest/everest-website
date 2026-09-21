"use client";

import { useActionState } from "react";
import { signInAction, type SignInState } from "@/app/(admin)/admin/actions";

const initial: SignInState = { error: "" };

export function LoginForm({ configured }: { configured: boolean }) {
  const [state, action, pending] = useActionState(signInAction, initial);

  const field =
    "mt-1.5 block h-11 w-full rounded-lg border border-line bg-white px-3 text-sm text-navy outline-none focus:border-brand";

  return (
    <form action={action} className="grid gap-4">
      <label className="block text-[13px] font-semibold text-navy">
        User
        <input name="email" required autoComplete="username" className={field} />
      </label>
      <label className="block text-[13px] font-semibold text-navy">
        Password
        <input name="password" type="password" required autoComplete="current-password" className={field} />
      </label>
      <button
        type="submit"
        disabled={pending || !configured}
        className="h-11 rounded-lg bg-navy text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-60"
      >
        {pending ? "Signing in" : "Sign in"}
      </button>
      {state.error ? <p className="text-sm text-[#b3261e]">{state.error}</p> : null}
    </form>
  );
}
