import matter from 'gray-matter'

const WORDS_PER_MINUTE = 200

const postFiles = import.meta.glob('/content/posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

function getReadingTime(content) {
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE))
}

const posts = Object.entries(postFiles).map(([path, raw]) => {
  const { data, content } = matter(raw)
  const slug = path.split('/').pop().replace(/\.md$/, '')

  return {
    slug,
    title: data.title,
    date: data.date,
    tags: data.tags || [],
    excerpt: data.excerpt || '',
    content,
    readingTime: getReadingTime(content),
  }
}).sort((a, b) => new Date(b.date) - new Date(a.date))

export function getAllPosts() {
  return posts
}

export function getPostBySlug(slug) {
  return posts.find((post) => post.slug === slug) || null
}

export function getRelatedPosts(slug, limit = 3) {
  const current = getPostBySlug(slug)
  if (!current) return []

  const others = posts.filter((post) => post.slug !== slug)

  const scored = others
    .map((post) => ({
      post,
      score: post.tags.filter((tag) => current.tags.includes(tag)).length,
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ post }) => post)

  const related = scored.slice(0, limit)

  if (related.length < limit) {
    const usedSlugs = new Set(related.map((post) => post.slug))
    const backfill = others.filter((post) => !usedSlugs.has(post.slug))
    related.push(...backfill.slice(0, limit - related.length))
  }

  return related
}
