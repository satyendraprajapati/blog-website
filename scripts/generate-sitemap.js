import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { SITE_URL } from './site-config.js'

const postsDir = path.resolve('content/posts')
const outputPath = path.resolve('public/sitemap.xml')

const postFiles = fs.readdirSync(postsDir).filter((file) => file.endsWith('.md'))

const posts = postFiles.map((file) => {
  const raw = fs.readFileSync(path.join(postsDir, file), 'utf-8')
  const { data } = matter(raw)
  return {
    slug: file.replace(/\.md$/, ''),
    date: data.date,
  }
})

const staticRoutes = [
  { path: '/', priority: '1.0' },
  { path: '/blog', priority: '0.8' },
  { path: '/about', priority: '0.5' },
  { path: '/contact', priority: '0.5' },
]

const urls = [
  ...staticRoutes.map(
    ({ path: routePath, priority }) => `  <url>
    <loc>${SITE_URL}${routePath}</loc>
    <priority>${priority}</priority>
  </url>`
  ),
  ...posts.map(
    ({ slug, date }) => `  <url>
    <loc>${SITE_URL}/blog/${slug}</loc>
    <lastmod>${date}</lastmod>
    <priority>0.7</priority>
  </url>`
  ),
].join('\n')

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`

fs.writeFileSync(outputPath, sitemap)
console.log(`Wrote ${postFiles.length} post(s) + ${staticRoutes.length} static route(s) to public/sitemap.xml`)
