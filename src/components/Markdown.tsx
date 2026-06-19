import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

// Renders post bodies written in Markdown. GitHub-flavored markdown adds
// tables, strikethrough, task lists, and auto-links.
export default function Markdown({ children }: { children: string }) {
  return (
    <div className="markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Open external links in a new tab.
          a: ({ href, children, ...props }) => {
            const external = href?.startsWith('http')
            return (
              <a
                href={href}
                {...props}
                {...(external
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
              >
                {children}
              </a>
            )
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}
