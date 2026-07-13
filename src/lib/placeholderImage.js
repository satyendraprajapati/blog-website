// Free placeholder images (picsum.photos) keyed by a stable seed so the same
// post always gets the same image. Swap these for real photos later by
// setting an `image` field in a post's frontmatter and using that instead.
export function getPlaceholderImage(seed, width = 800, height = 400) {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${width}/${height}`
}
