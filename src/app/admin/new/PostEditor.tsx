'use client'

import { useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Markdown from '@/components/Markdown'

type Props = {
  action: (formData: FormData) => void | Promise<void>
  initialTitle?: string
  initialContent?: string
  submitLabel?: string
}

export default function PostEditor({
  action,
  initialTitle = '',
  initialContent = '',
  submitLabel = 'Publish',
}: Props) {
  const [title, setTitle] = useState(initialTitle)
  const [content, setContent] = useState(initialContent)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [preview, setPreview] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Insert text at the current caret position in the textarea.
  function insertAtCursor(text: string) {
    const el = textareaRef.current
    if (!el) {
      setContent((c) => c + text)
      return
    }
    const start = el.selectionStart ?? content.length
    const end = el.selectionEnd ?? content.length
    const next = content.slice(0, start) + text + content.slice(end)
    setContent(next)
    requestAnimationFrame(() => {
      el.focus()
      const pos = start + text.length
      el.setSelectionRange(pos, pos)
    })
  }

  // Upload one or more images to Supabase Storage and drop Markdown
  // image tags into the post at the cursor.
  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    setUploading(true)
    setUploadError(null)
    const supabase = createClient()
    const snippets: string[] = []
    try {
      for (const file of Array.from(files)) {
        const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
        const path = `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 8)}.${ext}`
        const { error } = await supabase.storage
          .from('post-images')
          .upload(path, file, { cacheControl: '3600', upsert: false })
        if (error) throw error
        const { data } = supabase.storage
          .from('post-images')
          .getPublicUrl(path)
        const alt = file.name.replace(/\.[^.]+$/, '')
        snippets.push(`![${alt}](${data.publicUrl})`)
      }
      insertAtCursor('\n\n' + snippets.join('\n\n') + '\n\n')
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <form action={action} className="stack">
      <div className="field">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="field">
        <div
          className="row"
          style={{ justifyContent: 'space-between', marginBottom: '0.3rem' }}
        >
          <label htmlFor="content" style={{ margin: 0 }}>
            Body (Markdown)
          </label>
          <button
            type="button"
            className="btn"
            onClick={() => setPreview((p) => !p)}
          >
            {preview ? 'Edit' : 'Preview'}
          </button>
        </div>

        {preview ? (
          <div
            className="panel"
            style={{ margin: 0, maxWidth: 'none', minHeight: 200 }}
          >
            {content.trim() ? (
              <Markdown>{content}</Markdown>
            ) : (
              <p className="muted">Nothing to preview yet.</p>
            )}
          </div>
        ) : (
          <textarea
            id="content"
            name="content"
            ref={textareaRef}
            rows={18}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your update here. Markdown is supported."
          />
        )}
        {/* Keep the value in the form even while previewing. */}
        {preview && <input type="hidden" name="content" value={content} />}
      </div>

      <div className="field">
        <label htmlFor="photos">Add photos</label>
        <input
          id="photos"
          type="file"
          accept="image/*"
          multiple
          disabled={uploading}
          onChange={(e) => handleFiles(e.target.files)}
        />
        <p className="muted" style={{ fontSize: '0.8rem', marginTop: '0.3rem' }}>
          {uploading
            ? 'Uploading\u2026'
            : 'Photos are uploaded and inserted into the post where your cursor is.'}
        </p>
        {uploadError && <p className="error">{uploadError}</p>}
      </div>

      <div className="row">
        <button type="submit" className="btn" disabled={uploading}>
          {submitLabel}
        </button>
      </div>
    </form>
  )
}
