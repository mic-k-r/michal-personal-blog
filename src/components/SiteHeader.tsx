import Link from 'next/link'
import { site } from '@/lib/site'

export default function SiteHeader() {
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
        <Link href="/admin">Admin</Link>
      </nav>
    </header>
  )
}
