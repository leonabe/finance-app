import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Server-side Supabase client for App Router. Reads/writes the session
 * via cookies. Returns null when env vars are missing.
 */
export async function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return null;
  }
  if (url.includes("your-project") || key === "your-anon-key") {
    return null;
  }

  const cookieStore = await cookies();

  try {
    return createServerClient(url, key, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Called from a Server Component where cookies are read-only;
            // middleware will refresh the session instead.
          }
        },
      },
    });
  } catch {
    return null;
  }
}

export async function getSessionUser() {
  try {
    const supabase = await createClient();
    if (!supabase) return null;

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) return null;
    return user;
  } catch {
    // Missing/invalid Supabase config or network must not 500 the shell.
    return null;
  }
}
