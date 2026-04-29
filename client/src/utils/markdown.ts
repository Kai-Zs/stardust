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
        const highlighted = hljs.highlight(str, { language: lang }).value
        return `<div class="code-block"><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.querySelector('code').textContent).then(()=>{this.textContent='已复制';setTimeout(()=>{this.textContent='复制'},1500)})">复制</button><pre class="hljs"><code>${highlighted}</code></pre></div>`
      } catch {}
    }
    return `<div class="code-block"><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.querySelector('code').textContent).then(()=>{this.textContent='已复制';setTimeout(()=>{this.textContent='复制'},1500)})">复制</button><pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre></div>`
  },
})

// 用占位符保护公式，避免 markdown-it 处理公式中的 _ * 等字符
const originalRender = md.render.bind(md)
md.render = (src: string, env?: unknown): string => {
  const placeholders: string[] = []
  let processed = src
  // 块级公式 $$...$$
  processed = processed.replace(/\$\$([\s\S]*?)\$\$/g, (_: string, formula: string) => {
    try {
      const html = katex.renderToString(formula.trim(), { displayMode: true, throwOnError: false })
      const idx = placeholders.length
      placeholders.push(html)
      return `%%MATH_BLOCK_${idx}%%`
    } catch { return `<pre class="katex-error">公式渲染失败: ${formula}</pre>` }
  })
  // 行内公式 $...$
  processed = processed.replace(/\$([^$]+?)\$/g, (_: string, formula: string) => {
    try {
      const html = katex.renderToString(formula.trim(), { displayMode: false, throwOnError: false })
      const idx = placeholders.length
      placeholders.push(html)
      return `%%MATH_INLINE_${idx}%%`
    } catch { return `$${formula}$` }
  })
  let result = originalRender(processed, env)
  // 还原公式占位符
  placeholders.forEach((html, idx) => {
    result = result.replace(`%%MATH_BLOCK_${idx}%%`, html)
    result = result.replace(`%%MATH_INLINE_${idx}%%`, html)
  })
  return result
}

export function renderMarkdown(content: string): string {
  const raw = md.render(content)
  return DOMPurify.sanitize(raw, {
    ALLOWED_TAGS: ['h1','h2','h3','h4','h5','h6','p','br','a','ul','ol','li','blockquote','pre','code','em','strong','del','ins','table','thead','tbody','tr','th','td','img','span','div','button','input','label','sup','sub','details','summary','hr','section'],
    ALLOWED_ATTR: ['href','src','alt','title','class','id','target','rel','loading','width','height','onclick'],
  })
}

export { md }
