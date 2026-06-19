// Turn a post title into a URL-friendly slug.
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '') // strip accents
    .replace(/[^a-z0-9\s-]/g, '') // drop non-alphanumerics
    .replace(/\s+/g, '-') // spaces -> dashes
    .replace(/-+/g, '-') // collapse dashes
    .replace(/^-|-$/g, '') // trim leading/trailing dashes
}

// Friendly date like "June 11, 2026".
export function formatDate(value: string | Date): string {
  const date = typeof value === 'string' ? new Date(value) : value
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
