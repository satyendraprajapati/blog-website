---
title: "Adding a Copy-to-Clipboard Button to Code Blocks in Your React Markdown Blog"
date: "2026-08-04"
tags: ["web-development", "react", "beginner"]
excerpt: "A small usability fix for a technical blog: letting readers copy a DAX measure or Excel formula in one click instead of manually selecting text around syntax highlighting."
---

A data-analysis blog lives and dies by whether readers can actually use the formulas and snippets in it. Selecting a multi-line DAX measure by hand — dragging past line numbers, highlight colors, and a scrollbar — is friction that a copy button removes for the price of one small component.

**1. Hook into the same renderer that does syntax highlighting.** If code blocks already render through a custom component in `react-markdown` (commonly via the `code` or `pre` override), that's the place to add the button rather than a separate pass over the DOM after render — it keeps the button tied to the exact code being displayed instead of re-parsing rendered HTML.

```jsx
function CodeBlock({ className, children }) {
  const [copied, setCopied] = useState(false);
  const code = String(children).replace(/\n$/, "");

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs px-2 py-1 rounded bg-gray-700 text-gray-100"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
      <pre className={className}>
        <code>{code}</code>
      </pre>
    </div>
  );
}
```

**2. Strip the trailing newline before copying.** Markdown code fences almost always include a trailing `\n` in the captured content, which pastes as an extra blank line at the end of whatever the reader is pasting into — a one-line `.replace(/\n$/, "")` avoids that small but noticeable annoyance.

**3. Confirm the copy happened, briefly.** Swapping the button label to "Copied!" for a couple of seconds is enough feedback — a toast notification or modal is overkill for an action this small, and would pull attention away from the code itself.

**4. Handle the clipboard permission failing gracefully.** `navigator.clipboard.writeText` requires a secure context (HTTPS, which Vercel gives you by default) and can still reject if the browser blocks clipboard access. Wrap the call in a `try/catch` and fall back to selecting the text so the reader can still copy manually with `Cmd/Ctrl+C`, instead of the button silently doing nothing.

**5. Only show the button on hover, not permanently.** A copy button sitting visible on every code block all the time adds visual noise to posts that already have a lot of code in them. Tying its opacity to a `group-hover` state (as above) keeps the block clean by default and puts the button exactly where the reader's mouse already is when they're about to select code.

**6. Make sure it's reachable without a mouse.** A button that only appears on `:hover` is invisible to keyboard and screen-reader users. Pair the CSS opacity toggle with `focus-within` so the button also appears when the code block (or the button itself) receives keyboard focus, and give the button a proper `aria-label` like "Copy code to clipboard" rather than relying on the visible text alone.

It's a small addition, but on a blog where half the posts exist specifically so someone can paste a formula into Excel or Power BI, it removes the single most common bit of friction between reading a post and actually using it.
