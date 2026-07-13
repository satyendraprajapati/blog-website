import matter from 'gray-matter'

const projectFiles = import.meta.glob('/content/projects/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

const projects = Object.entries(projectFiles).map(([path, raw]) => {
  const { data, content } = matter(raw)
  const slug = path.split('/').pop().replace(/\.md$/, '')

  return {
    slug,
    title: data.title,
    date: data.date,
    tools: data.tools || [],
    result: data.result || '',
    excerpt: data.excerpt || '',
    content,
  }
}).sort((a, b) => new Date(b.date) - new Date(a.date))

export function getAllProjects() {
  return projects
}

export function getProjectBySlug(slug) {
  return projects.find((project) => project.slug === slug) || null
}
