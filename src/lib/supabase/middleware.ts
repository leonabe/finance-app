import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

function isUsableSupabaseEnv(url: string, key: string): boolean {
  if (!url || !key) return false;
  if (url.includes("your-project") || key === "your-anon-key") return false;
  try {
    const u = new URL(url);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

/**
 * Refresh Supabase session cookies when configured.
 * Always returns a valid NextResponse so pages keep routing.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key || !isUsableSupabaseEnv(url, key)) {
    return supabaseResponse;
  }

  try {
    const supabase = createServerClient(url, key, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    });

    // Touch the session so expired tokens are refreshed.
    await supabase.auth.getUser();
  } catch {
    // Misconfigured project / network: never block the request.
    return NextResponse.next({ request });
  }

  return supabaseResponse;
}
