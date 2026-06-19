import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/slug'
import { deletePost, logout } from './actions'
import type { Post } from '@/lib/types'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Admin' }

export default async function AdminPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: posts } = await supabase
    .from('posts')
    .select('id, title, slug, content, created_at, updated_at')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <h2 style={{ margin: 0 }}>Dashboard</h2>
        <form action={logout}>
          <button type="submit" className="btn">Sign out</button>
        </form>
      </div>
      <p className="muted">Signed in as {user?.email}</p>

      <p>
        <Link href="/admin/new" className="btn">
          + New post
        </Link>
      </p>

      <hr />

      {!posts || posts.length === 0 ? (
        <p className="muted">No posts yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {(posts as Post[]).map((post) => (
            <li
              key={post.id}
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem 1rem',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                padding: '0.6rem 0',
                borderBottom: '1px solid #ddd',
              }}
            >
              <span>
                <Link href={`/posts/${post.slug}`}>{post.title}</Link>{' '}
                <span className="muted" style={{ fontSize: '0.8rem' }}>
                  {formatDate(post.created_at)}
                </span>
              </span>
              <span className="row" style={{ gap: '0.5rem' }}>
                <Link href={`/admin/edit/${post.id}`} className="btn">
                  Edit
                </Link>
                <form action={deletePost}>
                  <input type="hidden" name="id" value={post.id} />
                  <button type="submit" className="btn btn--danger">
                    Delete
                  </button>
                </form>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
