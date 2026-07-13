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
