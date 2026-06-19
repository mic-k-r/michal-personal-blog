import { createBrowserClient } from '@supabase/ssr'

// Browser-side Supabase client. Use this inside Client Components, e.g. for
// uploading images to Storage from the post editor.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}
