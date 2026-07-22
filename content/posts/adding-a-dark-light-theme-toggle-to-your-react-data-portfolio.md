---
title: "Adding a Dark/Light Theme Toggle to Your React Data Portfolio"
date: "2026-07-22"
tags: ["web-development", "react", "tailwind"]
excerpt: "How to build a theme toggle that respects the visitor's system preference, persists their choice, and avoids the flash-of-wrong-theme problem on a React and Tailwind site."
---

A theme toggle looks like a small feature, but the naive version — a `useState` flag that flips a class — gets the details wrong in ways visitors actually notice: it defaults to light mode even for someone whose system is set to dark, it forgets their choice on the next visit, and it flashes the wrong theme for a moment before your JavaScript runs. Here's a version that avoids all three.

**1. Let Tailwind's `dark:` variant do the styling work.** Set `darkMode: "class"` in `tailwind.config.js` instead of the default `media` strategy. That switches dark mode from "always follows the OS setting" to "on whenever a `dark` class is present on `<html>`" — which is what makes a manual toggle possible in the first place.
```js
// tailwind.config.js
export default {
  darkMode: "class",
  // ...
}
```
From there, any element can carry both a light and dark style: `className="bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100"`.

**2. Default to the visitor's system preference, not a hardcoded theme.** On first load, with nothing saved yet, check `window.matchMedia("(prefers-color-scheme: dark)")` rather than always starting in light mode — someone who has their OS set to dark shouldn't have to manually flip your site's toggle just to match.

**3. Persist the choice once they do toggle it.** Store the resolved theme in `localStorage` so a returning visitor sees the theme they picked last time, not whatever the system default happens to be:
```jsx
function getInitialTheme() {
  const stored = localStorage.getItem("theme");
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}
```

**4. Apply the class before React finishes mounting, not after.** If the `dark` class only gets added inside a `useEffect`, the page renders in light mode first and flips a frame later — a visible flash on every page load. Add a small inline script in `index.html`, before your app's script tag, that reads `localStorage` and sets the class immediately:
```html
<script>
  const stored = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (stored === "dark" || (!stored && prefersDark)) {
    document.documentElement.classList.add("dark");
  }
</script>
```
Your React `ThemeToggle` component then just needs to stay in sync with whatever this script already set, instead of being the only source of truth.

**5. Keep the toggle logic in one small component.** A `ThemeToggle` component that reads the current class off `document.documentElement`, flips it on click, and writes the new value to `localStorage` is all you need — there's no reason to reach for React Context here unless several unrelated components genuinely need to react to theme changes independently.
```jsx
function ThemeToggle() {
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  function toggle() {
    const next = !isDark;
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
    setIsDark(next);
  }

  return (
    <button onClick={toggle} aria-label="Toggle dark mode">
      {isDark ? "🌙" : "☀️"}
    </button>
  );
}
```

**6. Double-check contrast in both modes, not just dark mode's existence.** It's easy to add `dark:bg-gray-900` everywhere and call it done, but body text at `text-gray-500` that was readable on white can disappear against a dark background. Spend a few minutes clicking through every page in both themes rather than assuming Tailwind's default gray scale works evenly in both directions.

The result is a toggle that feels like it was always part of the site rather than bolted on — it respects what the visitor already told their OS, remembers their override, and never shows the wrong theme even for a moment.
