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

// 用占位符保护行内公式，块级公式在 markdown-it 之后处理
const originalRender = md.render.bind(md)
md.render = (src: string, env?: unknown): string => {
  const inlinePlaceholders: string[] = []
  let processed = src
  // 先移除块级公式，用空行占位，稍后处理
  const blockFormulas: string[] = []
  processed = processed.replace(/\$\$([\s\S]*?)\$\$/g, (_: string, formula: string) => {
    blockFormulas.push(formula.trim())
    return `\n\n%%MATH_BLOCK_${blockFormulas.length - 1}%%\n\n`
  })
  // 行内公式用占位符保护，避免 markdown-it 处理 _ * 等
  processed = processed.replace(/\$([^$\n]+?)\$/g, (_: string, formula: string) => {
    try {
      const html = katex.renderToString(formula.trim(), { displayMode: false, throwOnError: false })
      const idx = inlinePlaceholders.length
      inlinePlaceholders.push(html)
      return `%%MATH_INLINE_${idx}%%`
    } catch { return `$${formula}$` }
  })
  let result = originalRender(processed, env)
  // 还原行内公式占位符
  inlinePlaceholders.forEach((html, idx) => {
    result = result.replace(`%%MATH_INLINE_${idx}%%`, html)
  })
  // 块级公式在 markdown-it 之后渲染，确保不被包裹在 <p> 中
  blockFormulas.forEach((formula, idx) => {
    try {
      const html = katex.renderToString(formula, { displayMode: true, throwOnError: false })
      result = result.replace(`<p>%%MATH_BLOCK_${idx}%%</p>`, html)
      result = result.replace(`%%MATH_BLOCK_${idx}%%`, html)
    } catch {
      result = result.replace(`%%MATH_BLOCK_${idx}%%`, `<pre class="katex-error">公式渲染失败: ${formula}</pre>`)
    }
  })
  return result
}

export function renderMarkdown(content: string): string {
  const raw = md.render(content)
  return DOMPurify.sanitize(raw, {
    ALLOWED_TAGS: ['h1','h2','h3','h4','h5','h6','p','br','a','ul','ol','li','blockquote','pre','code','em','strong','del','ins','table','thead','tbody','tr','th','td','img','span','div','button','input','label','sup','sub','details','summary','hr','section'],
    ALLOWED_ATTR: ['href','src','alt','title','class','id','target','rel','loading','width','height','onclick','style'],
  })
}

export { md }
