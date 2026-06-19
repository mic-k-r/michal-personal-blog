import Link from 'next/link'

export default function NotFound() {
  return (
    <div>
      <h2>Page not found</h2>
      <p>That page doesn&apos;t exist (or the post was removed).</p>
      <p>
        <Link href="/">&laquo; Back home</Link>
      </p>
    </div>
  )
}
