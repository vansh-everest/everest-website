"use client";

import { useActionState } from "react";
import { signInAction, type SignInState } from "@/app/(admin)/admin/actions";
import { button, control } from "./fields";

const initial: SignInState = { error: "" };

export function LoginForm({ configured }: { configured: boolean }) {
  const [state, action, pending] = useActionState(signInAction, initial);

  return (
    <form action={action} className="grid gap-4">
      <label className="grid gap-1.5">
        <span className="text-[13px] font-medium text-navy">User</span>
        <input name="email" required autoComplete="username" className={control} />
      </label>
      <label className="grid gap-1.5">
        <span className="text-[13px] font-medium text-navy">Password</span>
        <input name="password" type="password" required autoComplete="current-password" className={control} />
      </label>
      <button type="submit" disabled={pending || !configured} className={`${button.primary} mt-1 w-full`}>
        {pending ? "Signing in" : "Sign in"}
      </button>
      {state.error ? <p className="text-[13px] text-[#b3261e]">{state.error}</p> : null}
    </form>
  );
}
