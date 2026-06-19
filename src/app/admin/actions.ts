'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { slugify } from '@/lib/slug'

async function requireUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')
  return supabase
}

// Build a unique slug from the title.
async function uniqueSlug(
  supabase: Awaited<ReturnType<typeof createClient>>,
  title: string,
  ignoreId?: string,
): Promise<string> {
  const base = slugify(title) || 'post'
  let slug = base
  for (let i = 0; i < 50; i++) {
    const query = supabase.from('posts').select('id').eq('slug', slug)
    const { data } = await query.maybeSingle()
    if (!data || (ignoreId && data.id === ignoreId)) return slug
    slug = `${base}-${i + 2}`
  }
  return `${base}-${Date.now().toString(36)}`
}

export async function createPost(formData: FormData) {
  const supabase = await requireUser()
  const title = String(formData.get('title') ?? '').trim()
  const content = String(formData.get('content') ?? '')

  if (!title) redirect('/admin/new?error=Title%20is%20required')

  const slug = await uniqueSlug(supabase, title)
  const { error } = await supabase.from('posts').insert({ title, slug, content })
  if (error) redirect('/admin/new?error=' + encodeURIComponent(error.message))

  revalidatePath('/')
  revalidatePath('/admin')
  redirect(`/posts/${slug}`)
}

export async function updatePost(id: string, formData: FormData) {
  const supabase = await requireUser()
  const title = String(formData.get('title') ?? '').trim()
  const content = String(formData.get('content') ?? '')

  if (!title) redirect(`/admin/edit/${id}?error=Title%20is%20required`)

  const slug = await uniqueSlug(supabase, title, id)
  const { error } = await supabase
    .from('posts')
    .update({ title, slug, content, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error)
    redirect(`/admin/edit/${id}?error=` + encodeURIComponent(error.message))

  revalidatePath('/')
  revalidatePath('/admin')
  redirect(`/posts/${slug}`)
}

export async function deletePost(formData: FormData) {
  const supabase = await requireUser()
  const id = String(formData.get('id') ?? '')
  await supabase.from('posts').delete().eq('id', id)
  revalidatePath('/')
  revalidatePath('/admin')
  redirect('/admin')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/admin/login')
}
