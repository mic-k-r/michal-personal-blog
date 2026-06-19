import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/slug'
import { excerpt } from '@/lib/excerpt'
import type { Post } from '@/lib/types'

// Always fetch fresh so new posts show up immediately.
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: posts, error } = await supabase
    .from('posts')
    .select('id, title, slug, content, created_at, updated_at')
    .order('created_at', { ascending: false })

  if (error) {
    return <p className="error">Could not load posts: {error.message}</p>
  }

  if (!posts || posts.length === 0) {
    return (
      <p className="muted">
        No posts yet. Sign in to the <Link href="/admin">admin area</Link> to
        write the first one.
      </p>
    )
  }

  return (
    <div className="stack">
      {(posts as Post[]).map((post) => (
        <article key={post.id}>
          <h2 style={{ marginBottom: '0.2rem' }}>
            <Link href={`/posts/${post.slug}`}>{post.title}</Link>
          </h2>
          <p className="muted" style={{ margin: '0 0 0.5rem' }}>
            {formatDate(post.created_at)}
          </p>
          <p style={{ margin: 0 }}>{excerpt(post.content)}</p>
          <p style={{ margin: '0.5rem 0 0' }}>
            <Link href={`/posts/${post.slug}`}>Read more &raquo;</Link>
          </p>
          <hr />
        </article>
      ))}
    </div>
  )
}
