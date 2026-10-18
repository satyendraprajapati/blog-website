---
title: "Respecting prefers-reduced-motion in Your React Blog's Chart Animations and Page Transitions"
date: "2026-10-18"
tags: ["web-development", "accessibility", "react"]
excerpt: "A data blog full of animated charts and page transitions can trigger real discomfort for visitors with vestibular disorders -- prefers-reduced-motion lets you keep the polish for everyone else."
---

A data analysis blog tends to accumulate motion: D3 or Recharts charts that animate in, a View Transitions API page swap, a reveal-on-scroll effect for a case study. Each one is a nice touch in isolation, but for visitors with vestibular disorders or motion sensitivity, large or fast-moving animations can cause real discomfort — nausea, dizziness, headaches. `prefers-reduced-motion` is a media feature the OS exposes based on the visitor's own accessibility settings, and it lets you turn that motion off for exactly the people who've asked their system to reduce it.

**1. Start with the CSS media query — it's free.** Any animation or transition defined in CSS can be scoped out with a single rule, which covers hover effects, CSS keyframe animations, and transitions without touching a single component.
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
}
```
Setting durations to near-zero rather than `none` keeps `transitionend` and `animationend` event listeners firing — code relying on those events won't silently break just because motion was reduced.

**2. Read the same preference in JavaScript for chart libraries that animate via JS.** D3, Chart.js, and Recharts all animate through JavaScript, not CSS, so they need the same check made available to component code.
```jsx
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const listener = (e) => setReduced(e.matches);
    query.addEventListener('change', listener);
    return () => query.removeEventListener('change', listener);
  }, []);

  return reduced;
}
```
The `change` listener matters here, not just the initial read — a visitor can toggle the OS setting while your tab is still open, and the hook should reflect that without a reload.

**3. Pass it into chart config instead of removing the chart's own animation prop everywhere.** Most charting libraries expose an `isAnimationActive` or `animationDuration` prop; feed the hook's result straight into it.
```jsx
const reduced = usePrefersReducedMotion();

<LineChart data={data}>
  <Line dataKey="value" isAnimationActive={!reduced} />
</LineChart>
```
This keeps the setting centralized in one hook rather than scattered as ad-hoc `if` checks through every chart component on the blog.

**4. Gate the View Transitions API the same way.** A full-page morph transition between blog posts is one of the more intense motion effects a site can have, so it deserves an explicit check rather than relying on the browser's default behavior.
```jsx
function navigateWithTransition(to, navigate) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!document.startViewTransition || reduced) {
    navigate(to);
    return;
  }
  document.startViewTransition(() => navigate(to));
}
```

**5. Don't remove motion entirely — reduce it.** The media feature is named "reduce," not "none," on purpose. A brief, small fade or a shorter duration is usually a better outcome than a jarring instant cut, especially for something like a tooltip appearing. Swapping a 600ms bar-chart grow animation for a 150ms fade keeps the interface feeling responsive without the sustained motion that's actually the problem.

**6. Test it without changing your OS settings.** Chrome and Firefox DevTools both let you emulate `prefers-reduced-motion` directly from the Rendering tab, which is faster than digging through macOS or Windows accessibility settings every time you want to check a component.

A blog built around charts will always lean on motion to show data appearing or updating — this isn't about giving that up, it's about making sure the one setting a visitor has already told their operating system they want is the one your site actually listens to.
