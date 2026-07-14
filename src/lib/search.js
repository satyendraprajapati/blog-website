import { getAllPosts } from './posts'

export function searchPosts(query) {
  const q = query.trim().toLowerCase()
  if (!q) return []

  return getAllPosts()
    .map((post) => {
      const title = post.title.toLowerCase()
      const excerpt = post.excerpt.toLowerCase()
      const tags = post.tags.join(' ').toLowerCase()
      const content = post.content.toLowerCase()

      let score = 0
      if (title.includes(q)) score += 3
      if (tags.includes(q)) score += 2
      if (excerpt.includes(q)) score += 1
      if (content.includes(q)) score += 0.5

      return { post, score }
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ post }) => post)
}
