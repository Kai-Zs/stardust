import MarkdownIt from 'markdown-it'
import DOMPurify from 'dompurify'
import hljs from 'highlight.js'
import katex from 'katex'
import 'highlight.js/styles/github.css'
import 'katex/dist/katex.min.css'

let md: MarkdownIt
md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
  highlight(str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code>${hljs.highlight(str, { language: lang }).value}</code></pre>`
      } catch {}
    }
    return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`
  },
})

// 在 markdown-it 渲染前手动处理 LaTeX 公式（$$ 块级和 $ 行内）
const originalRender = md.render.bind(md)
md.render = (src: string, env?: unknown): string => {
  let processed = src
  // 块级公式 $$...$$
  processed = processed.replace(/\$\$([\s\S]*?)\$\$/g, (_: string, formula: string) => {
    try { return katex.renderToString(formula.trim(), { displayMode: true, throwOnError: false }) }
    catch { return `<pre class="katex-error">公式渲染失败: ${formula}</pre>` }
  })
  // 行内公式 $...$
  processed = processed.replace(/\$([^$]+?)\$/g, (_: string, formula: string) => {
    try { return katex.renderToString(formula.trim(), { displayMode: false, throwOnError: false }) }
    catch { return `$${formula}$` }
  })
  return originalRender(processed, env)
}

export function renderMarkdown(content: string): string {
  const raw = md.render(content)
  return DOMPurify.sanitize(raw, {
    ALLOWED_TAGS: ['h1','h2','h3','h4','h5','h6','p','br','a','ul','ol','li','blockquote','pre','code','em','strong','del','ins','table','thead','tbody','tr','th','td','img','span','div','input','label','sup','sub','details','summary','hr','section'],
    ALLOWED_ATTR: ['href','src','alt','title','class','id','target','rel','loading','width','height'],
  })
}

export { md }
