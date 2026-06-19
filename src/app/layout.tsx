import type { Metadata } from 'next'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import { site } from '@/lib/site'
import './globals.scss'

export const metadata: Metadata = {
  title: site.title,
  description: site.tagline,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="layout">
          <main className="panel">
            <SiteHeader />
            {children}
          </main>
          <SiteFooter />
        </div>
      </body>
    </html>
  )
}
