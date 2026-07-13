import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from './site-config.js'

const postsDir = path.resolve('content/posts')
const outputPath = path.resolve('public/rss.xml')

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

const postFiles = fs.readdirSync(postsDir).filter((file) => file.endsWith('.md'))

const posts = postFiles
  .map((file) => {
    const raw = fs.readFileSync(path.join(postsDir, file), 'utf-8')
    const { data } = matter(raw)
    return {
      slug: file.replace(/\.md$/, ''),
      title: data.title,
      date: data.date,
      excerpt: data.excerpt || '',
    }
  })
  .sort((a, b) => new Date(b.date) - new Date(a.date))

const items = posts
  .map(
    (post) => `  <item>
    <title>${escapeXml(post.title)}</title>
    <link>${SITE_URL}/blog/${post.slug}</link>
    <guid>${SITE_URL}/blog/${post.slug}</guid>
    <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    <description>${escapeXml(post.excerpt)}</description>
  </item>`
  )
  .join('\n')

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>${escapeXml(SITE_NAME)}</title>
  <link>${SITE_URL}</link>
  <description>${escapeXml(SITE_DESCRIPTION)}</description>
${items}
</channel>
</rss>
`

fs.writeFileSync(outputPath, rss)
console.log(`Wrote ${postFiles.length} post(s) to public/rss.xml`)
