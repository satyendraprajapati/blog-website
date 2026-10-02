---
title: "Adding TypeScript to Your Vite + React Blog Without a Full Rewrite"
date: "2026-10-02"
tags: ["web-development", "react", "typescript"]
excerpt: "How to introduce TypeScript into an existing JavaScript Vite + React blog one file at a time, instead of converting the whole codebase in one risky pass."
---

A working blog built in plain JavaScript doesn't need a weekend-long conversion to start getting TypeScript's benefits. Vite already treats `.js`/`.jsx` and `.ts`/`.tsx` as equal citizens in the same build, which means you can introduce types one file at a time and keep shipping posts while you do it.

**1. Install the pieces and let JS and TS coexist.** Add TypeScript and the React type definitions as dev dependencies — nothing about your existing `.jsx` files needs to change yet.
```bash
npm install -D typescript @types/react @types/react-dom
```

**2. Add a `tsconfig.json` with `allowJs` turned on.** This is the setting that makes incremental adoption possible — it tells TypeScript to tolerate plain `.js`/`.jsx` files sitting right next to typed ones, instead of demanding the whole project convert at once.
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "jsx": "react-jsx",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowJs": true,
    "strict": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

**3. Convert leaf utility files first, not components.** `src/lib/posts.js` — the module that parses frontmatter — is a better starting point than any component, because it's pure functions with no JSX to fight with. Rename it to `posts.ts` and give the frontmatter shape a real type:
```ts
export interface Post {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
}

export function parseFrontmatter(raw: string): Post {
  const { data } = matter(raw);
  return data as Post;
}
```

**4. Let untouched `.jsx` components import from the new `.ts` files freely.** Vite's build doesn't care that `Blog.jsx` is still plain JavaScript while importing a typed `Post` from `lib/posts.ts` — there's no extra config step here, which is exactly what makes this approach lower-risk than converting everything at once.

**5. Convert one component at a time, starting with the simplest.** `PostCard.jsx` — a small component that just renders a `Post` — is a safer second step than `App.jsx`'s routing logic. Rename the file to `.tsx` and type its props instead of trusting whatever shape happens to get passed in:
```tsx
interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return <h2>{post.title}</h2>;
}
```

**6. Leave `strict` mode on for new files, but don't chase down every old one.** `allowJs` with `strict: true` only type-checks the `.ts`/`.tsx` files you've actually converted — it won't retroactively flag issues in the `.jsx` files you haven't touched yet, so there's no backlog of errors to clear before you can commit.

**7. Wire a type-check into the CI you already have.** If a GitHub Actions workflow already runs on push, add one line so a typo in a converted file fails the build instead of reaching production:
```bash
npx tsc --noEmit
```

None of this requires picking a day to "do the TypeScript migration." Convert `lib/` this week, `PostCard` next week, and leave `Header.jsx` exactly as it is until there's a reason to touch it — the codebase is never in a half-broken state, because it was never fully one thing or the other to begin with.
