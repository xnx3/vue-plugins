import type MarkdownIt from 'markdown-it'

let markdownRenderer: MarkdownIt | null = null

export const useMarkdown = () => {
  const initializeMarkdown = async () => {
    if (markdownRenderer || !import.meta.client) return
    
    // Dynamic imports for client-side only
    const [{ default: MarkdownIt }, { default: hljs }] = await Promise.all([
      import('markdown-it'),
      import('highlight.js')
    ])
    
    // Import GitHub theme for highlight.js
    await import('highlight.js/styles/github.css')
    
    markdownRenderer = new MarkdownIt({
      html: true,
      breaks: true,
      typographer: true,
      highlight: function (str: string, lang: string) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return '<pre class="hljs"><code>' +
                   hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
                   '</code></pre>'
          } catch {
            // Fallback to escaped HTML if highlighting fails
          }
        }

        return '<pre class="hljs"><code>' + markdownRenderer!.utils.escapeHtml(str) + '</code></pre>'
      }
    })
  }

  const renderMarkdown = async (source: string) => {
    if (!import.meta.client) {
      // Server-side: return raw markdown, will be processed on client
      return source
    }
    
    await initializeMarkdown()
    if (!markdownRenderer) return source
    return markdownRenderer.render(source)
  }

  return {
    renderMarkdown
  }
}
