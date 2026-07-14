import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { SITE_URL, SITE_NAME } from './site-config.js'

const distDir = path.resolve('dist')
const templatePath = path.join(distDir, 'index.html')
const template = fs.readFileSync(templatePath, 'utf-8')

const SLUG_PATTERN = /^[a-z0-9-]+$/i

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function replaceOnce(html, regex, replacement, label) {
  if (!regex.test(html)) {
    throw new Error(
      `prerender.js: could not find ${label} in dist/index.html template — its markup may have changed`
    )
  }
  return html.replace(regex, replacement)
}

function renderShell({ routePath, title, description, ogType = 'website', image, imageAlt, jsonLd }) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME
  const canonical = `${SITE_URL}${routePath}`
  const safeTitle = escapeHtml(fullTitle)
  const safeDescription = escapeHtml(description || '')

  let html = template

  html = replaceOnce(html, /<title>[^<]*<\/title>/, `<title>${safeTitle}</title>`, '<title>')
  html = replaceOnce(
    html,
    /(<meta\s+name="description"[^>]*content=")[^"]*(")/,
    `$1${safeDescription}$2`,
    'meta description'
  )
  html = replaceOnce(
    html,
    /(<meta\s+property="og:type"[^>]*content=")[^"]*(")/,
    `$1${ogType}$2`,
    'og:type'
  )
  html = replaceOnce(
    html,
    /(<meta\s+property="og:title"[^>]*content=")[^"]*(")/,
    `$1${safeTitle}$2`,
    'og:title'
  )
  html = replaceOnce(
    html,
    /(<meta\s+property="og:description"[^>]*content=")[^"]*(")/,
    `$1${safeDescription}$2`,
    'og:description'
  )

  const extraTags = [
    `<link rel="canonical" href="${canonical}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:site_name" content="${escapeHtml(SITE_NAME)}" />`,
  ]

  if (image) {
    extraTags.push(
      `<meta property="og:image" content="${image}" />`,
      `<meta property="og:image:width" content="1200" />`,
      `<meta property="og:image:height" content="630" />`,
      `<meta property="og:image:alt" content="${escapeHtml(imageAlt || fullTitle)}" />`,
      `<meta name="twitter:card" content="summary_large_image" />`
    )
  }

  if (jsonLd) {
    const json = JSON.stringify(jsonLd).replace(/</g, '\\u003c')
    extraTags.push(`<script type="application/ld+json">${json}</script>`)
  }

  html = replaceOnce(html, /<\/head>/, `${extraTags.join('\n    ')}\n  </head>`, '</head>')

  return html
}

function writeRoute(routePath, html) {
  const outDir = path.join(distDir, routePath.replace(/^\//, ''))
  fs.mkdirSync(outDir, { recursive: true })
  fs.writeFileSync(path.join(outDir, 'index.html'), html)
}

function ogImageFor(slug) {
  return `https://picsum.photos/seed/${encodeURIComponent(slug)}/1200/630`
}

function assertValidSlug(slug, kind) {
  if (!SLUG_PATTERN.test(slug)) {
    throw new Error(`prerender.js: ${kind} slug "${slug}" contains unexpected characters, refusing to write`)
  }
}

// --- Blog posts ---
const postsDir = path.resolve('content/posts')
const postFiles = fs.readdirSync(postsDir).filter((file) => file.endsWith('.md'))

for (const file of postFiles) {
  const raw = fs.readFileSync(path.join(postsDir, file), 'utf-8')
  const { data } = matter(raw)
  const slug = file.replace(/\.md$/, '')
  assertValidSlug(slug, 'post')

  const routePath = `/blog/${slug}`
  const image = ogImageFor(slug)
  const excerpt = data.excerpt || ''

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: data.title,
    description: excerpt,
    image,
    datePublished: data.date,
    author: { '@type': 'Person', name: 'Satyendra Prajapati' },
    mainEntityOfPage: `${SITE_URL}${routePath}`,
  }

  const html = renderShell({
    routePath,
    title: data.title,
    description: excerpt,
    ogType: 'article',
    image,
    imageAlt: data.title,
    jsonLd,
  })

  writeRoute(routePath, html)
}

// --- Portfolio projects ---
const projectsDir = path.resolve('content/projects')
const projectFiles = fs.readdirSync(projectsDir).filter((file) => file.endsWith('.md'))

for (const file of projectFiles) {
  const raw = fs.readFileSync(path.join(projectsDir, file), 'utf-8')
  const { data } = matter(raw)
  const slug = file.replace(/\.md$/, '')
  assertValidSlug(slug, 'project')

  const routePath = `/portfolio/${slug}`
  const image = ogImageFor(slug)

  const html = renderShell({
    routePath,
    title: data.title,
    description: data.excerpt || '',
    ogType: 'article',
    image,
    imageAlt: data.title,
  })

  writeRoute(routePath, html)
}

// --- Static routes ---
const staticRoutes = [
  {
    routePath: '/blog',
    title: 'Blog',
    description: 'All posts on data analysis, dashboards, and the tools behind them.',
  },
  {
    routePath: '/services',
    title: 'Services',
    description:
      'Power BI dashboards, Excel automation, website development, and PowerPoint design services.',
  },
  {
    routePath: '/portfolio',
    title: 'Portfolio',
    description: 'Case studies from Power BI, Excel automation, and web development projects.',
  },
  {
    routePath: '/about',
    title: 'About',
    description:
      'Satyendra Prajapati is a data analyst with 16 years of experience in data analysis, business automation, and web development.',
    image: `${SITE_URL}/images/satyendra-prajapati.jpeg`,
    imageAlt: 'Satyendra Prajapati',
  },
  {
    routePath: '/contact',
    title: 'Contact',
    description: 'Get in touch to discuss a Power BI, Excel automation, website, or presentation project.',
  },
]

for (const route of staticRoutes) {
  writeRoute(route.routePath, renderShell(route))
}

console.log(
  `prerender.js: wrote ${postFiles.length} post shell(s), ${projectFiles.length} project shell(s), and ${staticRoutes.length} static route shell(s).`
)
