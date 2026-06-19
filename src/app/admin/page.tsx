import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/slug'
import { logout } from './actions'
import DeletePostButton from './DeletePostButton'
import type { Post } from '@/lib/types'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Admin' }

export default async function AdminPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Only load the post list when actually signed in.
  let posts: Post[] | null = null
  if (user) {
    const { data } = await supabase
      .from('posts')
      .select('id, title, slug, content, created_at, updated_at')
      .order('created_at', { ascending: false })
    posts = data as Post[] | null
  }

  return (
    <div>
      <div className="stack" style={{ marginBottom: '2rem' }}>
        <p className="muted" style={{ margin: 0 }}>
          {user ? `Signed in as ${user.email}` : 'Not signed in'}
        </p>
        {user ? (
          <form action={logout}>
            <button type="submit" className="btn">
              Log out
            </button>
          </form>
        ) : (
          <Link href="/admin/login" className="btn">
            Log in
          </Link>
        )}
      </div>

      {user && (
        <>
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
              {posts.map((post) => (
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
                    <DeletePostButton postId={post.id} postTitle={post.title} />
                  </span>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  )
}
