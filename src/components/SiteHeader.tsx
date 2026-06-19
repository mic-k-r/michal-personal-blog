import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { site } from '@/lib/site'

export default async function SiteHeader() {
  // Only show the Admin link when *you* are signed in. This is cosmetic —
  // the real protection is the middleware + RLS — so a lightweight
  // cookie-based session check (no extra network round-trip) is enough.
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <header className="site-header">
      <div>
        <h1 className="site-title">
          <Link href="/">{site.title}</Link>
        </h1>
        <p className="site-tagline">{site.tagline}</p>
      </div>
      <nav>
        <Link href="/">Home</Link>
        {session && <Link href="/admin">Admin</Link>}
      </nav>
    </header>
  )
}

