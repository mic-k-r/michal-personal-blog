import Link from 'next/link'
import { createPost } from '../actions'
import PostEditor from './PostEditor'

export const metadata = { title: 'New post' }

export default async function NewPostPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <div>
      <p>
        <Link href="/admin">&laquo; Back to dashboard</Link>
      </p>
      <h2>New post</h2>
      {error && <p className="error">{error}</p>}
      <PostEditor action={createPost} submitLabel="Publish" />
    </div>
  )
}
