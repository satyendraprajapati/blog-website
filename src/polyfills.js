import { Buffer } from 'buffer'

// gray-matter (frontmatter parsing for blog posts) expects Node's Buffer
// global. Must run before anything that imports posts.js (e.g. App.jsx).
globalThis.Buffer = Buffer
