---
title: "Adding a Skip-to-Content Link and Visible Focus Styles to Your React Blog for Keyboard Users"
date: "2026-09-22"
tags: ["web-development", "accessibility", "react"]
excerpt: "A reader navigating with a keyboard or screen reader has to tab through your entire header before reaching a post's content -- a skip link and visible focus outlines fix that in a few lines of CSS and JSX."
---

Click around your own blog with a mouse and it feels complete. Unplug the mouse and tab through it instead, and two gaps usually show up immediately: there's no way to jump past the header straight to the content, and it's often unclear which element is even focused as you move through the page. Both are quick to fix and matter to more readers than you'd expect — not just screen reader users, but anyone navigating by keyboard, including people using switch devices or who simply find tabbing faster than reaching for a trackpad.

**1. Add a skip link as the very first focusable element in the page, before the header.** It's a normal anchor link pointing at your main content's ID, hidden off-screen until it receives keyboard focus.
```jsx
function SkipToContent() {
  return (
    <a href="#main-content" className="skip-link">
      Skip to content
    </a>
  );
}
```
```css
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #1d4ed8;
  color: white;
  padding: 8px 16px;
  z-index: 100;
  transition: top 0.15s ease;
}

.skip-link:focus {
  top: 0;
}
```
Render it as the first child of your root layout, right before `<Header />`. Someone tabbing through with a mouse never sees it; someone tabbing through with a keyboard sees it as the very first stop and can jump straight past your nav links.

**2. Give `<main>` a matching `id` and make it focusable.** The skip link's `href="#main-content"` only works if there's an element with that exact ID for the browser to jump to.
```jsx
<main id="main-content" tabIndex={-1}>
  <Outlet />
</main>
```
`tabIndex={-1}` lets the element receive focus programmatically (from the skip link) without adding it to the normal tab order for everyone else.

**3. Never remove the default focus outline without replacing it.** A lot of CSS resets or Tailwind base styles quietly ship `outline: none` on `:focus` to make buttons and links "look cleaner," which also makes it impossible to tell what's focused. If your blog does this anywhere, replace it with a visible style rather than deleting it outright.
```css
a:focus-visible,
button:focus-visible {
  outline: 2px solid #1d4ed8;
  outline-offset: 2px;
}
```
Using `:focus-visible` instead of `:focus` means the outline shows up for keyboard navigation but stays out of the way of a mouse click, which is usually the actual complaint behind "the default outline looks bad."

**4. Check your dark mode variant too.** A 2px blue outline that reads clearly on a white background can disappear against a dark navbar. Define the focus color as a CSS variable alongside your other theme tokens so it flips with the rest of the page instead of getting forgotten in one mode.

**5. Test it the way a keyboard user actually would — Tab from the very top of the page, not by clicking into the middle of it first.** Load the homepage, click the address bar to reset focus, then press Tab repeatedly. The skip link should appear first, Enter should jump you to `<main>`, and every interactive element after that — nav links, the theme toggle, post cards, footer links — should get a visible outline as you move through it.

None of this changes how the site looks for a mouse user. It's a small, mostly invisible layer that decides whether a keyboard or screen reader visitor can actually get through your blog, instead of getting stuck re-tabbing through the same header on every single page.
