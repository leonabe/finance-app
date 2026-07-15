"use client";

import { useActionState } from "react";
import type { AuthResult } from "@/lib/auth/actions";

type AuthFormProps = {
  action: (prev: AuthResult | null, formData: FormData) => Promise<AuthResult>;
  submitLabel: string;
};

const initial: AuthResult | null = null;

export function AuthForm({ action, submitLabel }: AuthFormProps) {
  const [state, formAction, pending] = useActionState(action, initial);

  return (
    <form action={formAction} className="space-y-3">
      <label className="field">
        <span>Email</span>
        <input
          type="email"
          name="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
        />
      </label>
      <label className="field">
        <span>Password</span>
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          required
          minLength={6}
        />
      </label>
      {state && !state.ok && state.error && (
        <p className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900" role="alert">
          {state.error}
        </p>
      )}
      <button type="submit" className="btn-primary w-full" disabled={pending}>
        {pending ? "Working…" : submitLabel}
      </button>
    </form>
  );
}
