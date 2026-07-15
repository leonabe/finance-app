import Link from "next/link";
import { getSessionUser } from "@/lib/supabase/server";
import { signOut } from "@/lib/auth/actions";
import { CHAPTERS } from "@/lib/chapters";

export async function AppHeader() {
  const user = await getSessionUser();

  return (
    <header className="border-b border-ink-200 bg-paper">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-baseline gap-3">
            <Link href="/" className="text-lg font-semibold tracking-tight text-ink-900">
              Mastering Financial Calculations
            </Link>
            <span className="hidden text-xs uppercase tracking-widest text-ink-500 sm:inline">
              Digital companion
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            {user ? (
              <>
                <span className="max-w-[12rem] truncate text-ink-600" title={user.email ?? undefined}>
                  {user.email}
                </span>
                <form action={signOut}>
                  <button
                    type="submit"
                    className="rounded border border-ink-300 bg-white px-2.5 py-1 text-ink-800 hover:bg-ink-50"
                  >
                    Sign out
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="rounded border border-ink-300 bg-white px-2.5 py-1 text-ink-800 hover:bg-ink-50"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/signup"
                  className="rounded bg-ink-900 px-2.5 py-1 text-white hover:bg-ink-800"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
        <nav aria-label="Chapters" className="flex flex-wrap gap-1 border-t border-ink-100 pt-2">
          {CHAPTERS.map((ch) => (
            <Link
              key={ch.slug}
              href={`/chapters/${ch.slug}`}
              className="rounded px-2 py-1 text-xs font-medium text-ink-700 hover:bg-ink-100 hover:text-ink-900 sm:text-sm"
            >
              Ch{ch.number}
              <span className="ml-1 hidden text-ink-500 md:inline">· {ch.title}</span>
            </Link>
          ))}
          <span className="mx-1 hidden self-center text-ink-200 sm:inline" aria-hidden>
            |
          </span>
          <Link
            href="/graphs"
            className="rounded px-2 py-1 text-xs font-medium text-ink-500 hover:bg-ink-100 hover:text-ink-800 sm:text-sm"
          >
            Graphs
            <span className="ml-1 hidden text-ink-400 md:inline">· Coming soon</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
