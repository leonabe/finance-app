import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser Supabase client. Requires NEXT_PUBLIC_SUPABASE_URL and
 * NEXT_PUBLIC_SUPABASE_ANON_KEY. Returns null when env is not configured
 * so UI can degrade gracefully in local/demo environments.
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return null;
  }

  // Reject placeholder example values so createBrowserClient never throws on boot.
  if (url.includes("your-project") || key === "your-anon-key") {
    return null;
  }

  try {
    return createBrowserClient(url, key);
  } catch {
    return null;
  }
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
