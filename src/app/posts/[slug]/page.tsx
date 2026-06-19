import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/slug'
import Markdown from '@/components/Markdown'
import type { Post } from '@/lib/types'

export const dynamic = 'force-dynamic'

async function getPost(slug: string): Promise<Post | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('posts')
    .select('id, title, slug, content, created_at, updated_at')
    .eq('slug', slug)
    .maybeSingle()
  return (data as Post) ?? null
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  return { title: post?.title ?? 'Post not found' }
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  return (
    <article>
      <h1 style={{ marginBottom: '0.2rem' }}>{post.title}</h1>
      <p className="muted" style={{ marginTop: 0 }}>
        {formatDate(post.created_at)}
      </p>
      <hr />
      <Markdown>{post.content}</Markdown>
      <hr />
      <p>
        <Link href="/">&laquo; Back to all posts</Link>
      </p>
    </article>
  )
}
