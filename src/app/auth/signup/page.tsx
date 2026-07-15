import Link from "next/link";
import { AuthForm } from "@/components/auth/AuthForm";
import { signUpWithPassword } from "@/lib/auth/actions";

export const metadata = {
  title: "Sign up · Financial Calculations",
};

export default function SignupPage() {
  return (
    <div className="auth-card">
      <h1 className="text-xl font-semibold text-ink-900">Create account</h1>
      <p className="mt-1 mb-4 text-sm text-ink-600">
        Register with email and password.{" "}
        <Link href="/auth/login" className="underline">
          Already have an account?
        </Link>
      </p>
      <AuthForm action={signUpWithPassword} submitLabel="Sign up" />
    </div>
  );
}
