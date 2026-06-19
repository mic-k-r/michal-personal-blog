import { site } from '@/lib/site'

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <hr />
      <p>
        &copy; {new Date().getFullYear()} {site.author}. Built with Next.js.
      </p>
    </footer>
  )
}
