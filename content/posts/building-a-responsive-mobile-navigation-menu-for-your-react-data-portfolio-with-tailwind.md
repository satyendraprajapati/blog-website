---
title: "Building a Responsive Mobile Navigation Menu for Your React Data Portfolio with Tailwind"
date: "2026-10-01"
tags: ["web-development", "react", "tailwind"]
excerpt: "A header nav built for desktop width quietly breaks on a phone — here's how to add a hamburger menu that collapses it into a usable mobile drawer with just React state and Tailwind classes."
---

If you built your `Header.jsx` with a row of links — Home, Blog, Portfolio, About, Contact — spaced out with `flex` and `gap-6`, it looks fine on a laptop and overflows or wraps awkwardly the moment the viewport narrows to a phone. Tailwind's responsive prefixes make it straightforward to swap that row for a hamburger-triggered drawer below a breakpoint, without a navigation library.

**1. Hide the desktop row below your breakpoint, and show a button instead.** Tailwind's `md:flex` / `hidden` pairing does the swap with no JavaScript involved yet:
```jsx
<nav className="hidden md:flex gap-6">
  <Link to="/">Home</Link>
  <Link to="/blog">Blog</Link>
  <Link to="/portfolio">Portfolio</Link>
  <Link to="/about">About</Link>
  <Link to="/contact">Contact</Link>
</nav>
<button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
  {open ? <XIcon /> : <MenuIcon />}
</button>
```

**2. Track open/closed state with one `useState`.** The menu itself is just the same list of links, conditionally rendered based on that state:
```jsx
const [open, setOpen] = useState(false);

{open && (
  <div className="md:hidden flex flex-col gap-4 p-4 bg-white dark:bg-gray-900">
    <Link to="/" onClick={() => setOpen(false)}>Home</Link>
    <Link to="/blog" onClick={() => setOpen(false)}>Blog</Link>
    <Link to="/portfolio" onClick={() => setOpen(false)}>Portfolio</Link>
    <Link to="/about" onClick={() => setOpen(false)}>About</Link>
    <Link to="/contact" onClick={() => setOpen(false)}>Contact</Link>
  </div>
)}
```
Closing the menu on each link's own click, not just on an outside click, is the detail that's easy to skip and immediately noticeable when it's missing — without it, a visitor taps "Blog," the page navigates, and the drawer is still sitting open over the new page.

**3. Close it on route change too.** A visitor can also leave the menu open by tapping the browser's back button rather than a link, so it's worth also resetting `open` to `false` in a `useEffect` keyed on `location.pathname` from React Router's `useLocation`, rather than relying on the per-link `onClick` alone.

**4. Keep your theme toggle and any other header controls inside the same conditional.** If your header also has a dark/light toggle or a search icon, decide per-control whether it belongs in the always-visible top bar (so it's reachable without opening the menu) or inside the drawer with the links — cramming every control into the collapsed top bar defeats the point of collapsing it.

**5. Test at an actual narrow width, not just by shrinking a desktop browser window.** Browser dev tools' device toolbar (or just dragging the window down to ~375px) catches things a quick resize doesn't — like a logo that's still sized for desktop and pushes the hamburger button off-screen, or tap targets under 44px that are technically clickable but miserable on a real touchscreen.

None of this requires a gesture library, a headless-UI component, or a CSS framework beyond what you already have — a boolean, a couple of Tailwind breakpoint prefixes, and remembering to close the drawer on navigation cover the whole feature.
