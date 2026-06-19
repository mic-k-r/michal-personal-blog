// Rough plain-text excerpt from a Markdown string, for post previews.
export function excerpt(markdown: string, max = 220): string {
  const text = markdown
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '') // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // links -> text
    .replace(/[#>*_`~-]/g, '') // markdown punctuation
    .replace(/\s+/g, ' ')
    .trim()
  if (text.length <= max) return text
  return text.slice(0, max).replace(/\s+\S*$/, '') + '\u2026'
}
