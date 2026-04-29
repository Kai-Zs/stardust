import MarkdownIt from 'markdown-it'
import DOMPurify from 'dompurify'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import python from 'highlight.js/lib/languages/python'
import css from 'highlight.js/lib/languages/css'
import xml from 'highlight.js/lib/languages/xml'
import json from 'highlight.js/lib/languages/json'
import bash from 'highlight.js/lib/languages/bash'
import sql from 'highlight.js/lib/languages/sql'
import java from 'highlight.js/lib/languages/java'
import go from 'highlight.js/lib/languages/go'
import rust from 'highlight.js/lib/languages/rust'
import cpp from 'highlight.js/lib/languages/cpp'
import csharp from 'highlight.js/lib/languages/csharp'
import php from 'highlight.js/lib/languages/php'
import ruby from 'highlight.js/lib/languages/ruby'
import swift from 'highlight.js/lib/languages/swift'
import kotlin from 'highlight.js/lib/languages/kotlin'
import yaml from 'highlight.js/lib/languages/yaml'
import markdown from 'highlight.js/lib/languages/markdown'
import dockerfile from 'highlight.js/lib/languages/dockerfile'
import diff from 'highlight.js/lib/languages/diff'

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('python', python)
hljs.registerLanguage('css', css)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('json', json)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('sql', sql)
hljs.registerLanguage('java', java)
hljs.registerLanguage('go', go)
hljs.registerLanguage('rust', rust)
hljs.registerLanguage('cpp', cpp)
hljs.registerLanguage('csharp', csharp)
hljs.registerLanguage('php', php)
hljs.registerLanguage('ruby', ruby)
hljs.registerLanguage('swift', swift)
hljs.registerLanguage('kotlin', kotlin)
hljs.registerLanguage('yaml', yaml)
hljs.registerLanguage('markdown', markdown)
hljs.registerLanguage('dockerfile', dockerfile)
hljs.registerLanguage('diff', diff)
import katex from 'katex'
import 'highlight.js/styles/github.css'
import 'katex/dist/katex.min.css'

const md: MarkdownIt = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
  highlight(str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        const highlighted = hljs.highlight(str, { language: lang }).value
        return `<div class="code-block"><button class="copy-btn" data-copyable>复制</button><pre class="hljs"><code>${highlighted}</code></pre></div>`
      } catch {}
    }
    return `<div class="code-block"><button class="copy-btn" data-copyable>复制</button><pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre></div>`
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
    } catch {
      return `$${formula}$`
    }
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
      result = result.replace(
        `%%MATH_BLOCK_${idx}%%`,
        `<pre class="katex-error">公式渲染失败: ${formula}</pre>`,
      )
    }
  })
  return result
}

export function renderMarkdown(content: string): string {
  const raw = md.render(content)
  return DOMPurify.sanitize(raw, {
    ALLOWED_TAGS: [
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'p',
      'br',
      'a',
      'ul',
      'ol',
      'li',
      'blockquote',
      'pre',
      'code',
      'em',
      'strong',
      'del',
      'ins',
      'table',
      'thead',
      'tbody',
      'tr',
      'th',
      'td',
      'img',
      'span',
      'div',
      'button',
      'input',
      'label',
      'sup',
      'sub',
      'details',
      'summary',
      'hr',
      'section',
    ],
    ALLOWED_ATTR: [
      'href',
      'src',
      'alt',
      'title',
      'class',
      'id',
      'target',
      'rel',
      'loading',
      'width',
      'height',
      'data-copyable',
      'style',
    ],
  })
}

export function setupCopyDelegate(container: HTMLElement): void {
  container.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-copyable]')
    if (!btn) return
    const code = btn.parentElement?.querySelector('code')
    if (!code) return
    navigator.clipboard.writeText(code.textContent ?? '').then(() => {
      btn.textContent = '已复制'
      setTimeout(() => {
        btn.textContent = '复制'
      }, 1500)
    })
  })
}
