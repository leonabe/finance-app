import Link from "next/link";
import { AuthForm } from "@/components/auth/AuthForm";
import { signInWithPassword } from "@/lib/auth/actions";

export const metadata = {
  title: "Sign in · Financial Calculations",
};

export default function LoginPage() {
  return (
    <div className="auth-card">
      <h1 className="text-xl font-semibold text-ink-900">Sign in</h1>
      <p className="mt-1 mb-4 text-sm text-ink-600">
        Email and password via Supabase Auth.{" "}
        <Link href="/auth/signup" className="underline">
          Create an account
        </Link>
      </p>
      <AuthForm action={signInWithPassword} submitLabel="Sign in" />
    </div>
  );
}
