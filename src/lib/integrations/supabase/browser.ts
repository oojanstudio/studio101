import { createBrowserClient } from '@supabase/ssr';
import { env } from '$env/dynamic/public';

let browserClient: ReturnType<typeof createBrowserClient> | undefined;

export function getBrowserSupabase() {
  const url = env.PUBLIC_SUPABASE_URL;
  const anonKey = env.PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error('Missing PUBLIC_SUPABASE_URL or PUBLIC_SUPABASE_ANON_KEY in environment.');
  }

  if (!browserClient) {
    browserClient = createBrowserClient(url, anonKey);
  }

  return browserClient;
}