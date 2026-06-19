import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { updatePost } from '../../actions'
import PostEditor from '../../new/PostEditor'
import type { Post } from '@/lib/types'

export const metadata = { title: 'Edit post' }

export default async function EditPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string }>
}) {
  const { id } = await params
  const { error } = await searchParams

  const supabase = await createClient()
  const { data } = await supabase
    .from('posts')
    .select('id, title, slug, content, created_at, updated_at')
    .eq('id', id)
    .maybeSingle()

  const post = data as Post | null
  if (!post) notFound()

  // Pre-bind the post id so the editor's form only sends title + content.
  const action = updatePost.bind(null, post.id)

  return (
    <div>
      <p>
        <Link href="/admin">&laquo; Back to dashboard</Link>
      </p>
      <h2>Edit post</h2>
      {error && <p className="error">{error}</p>}
      <PostEditor
        action={action}
        initialTitle={post.title}
        initialContent={post.content}
        submitLabel="Save changes"
      />
    </div>
  )
}
