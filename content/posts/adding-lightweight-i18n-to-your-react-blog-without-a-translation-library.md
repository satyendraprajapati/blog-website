---
title: "Adding Lightweight i18n to Your React Blog Without a Translation Library"
date: "2026-10-11"
tags: ["react", "i18n", "web-development"]
excerpt: "A plain-object translation setup for a small React data portfolio, for when a full i18next install is more machinery than a handful of UI strings need."
---

A full internationalization library like `react-i18next` is the right call for a large app with hundreds of translated strings, pluralization rules, and locale-aware number formatting. For a personal blog where the only thing that needs translating is the UI chrome — nav labels, buttons, a footer line — it's a lot of setup for not much payoff. A plain JavaScript object and a tiny hook cover the same ground.

**1. Keep each language as a flat object of key-value pairs.** No nesting, no build step — just files you can read and edit directly.
```js
// src/locales/en.js
export default {
  nav_home: "Home",
  nav_blog: "Blog",
  nav_about: "About",
  reading_time: "{min} min read",
};
```
```js
// src/locales/es.js
export default {
  nav_home: "Inicio",
  nav_blog: "Blog",
  nav_about: "Acerca de",
  reading_time: "{min} min de lectura",
};
```

**2. Store the active language in context, with `localStorage` as the memory between visits.** This is the same pattern your theme toggle probably already uses, so there's no new mental model to learn.
```jsx
const LocaleContext = createContext();

export function LocaleProvider({ children }) {
  const [locale, setLocale] = useState(
    () => localStorage.getItem("locale") || "en"
  );

  useEffect(() => {
    localStorage.setItem("locale", locale);
  }, [locale]);

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}
```

**3. Write a `t()` helper that looks up a key and does simple substitution.** This is the one piece of "translation logic" the whole setup needs — no ICU message syntax, just a `{placeholder}` replace.
```jsx
const dictionaries = { en: enDict, es: esDict };

export function useTranslation() {
  const { locale } = useContext(LocaleContext);
  const dict = dictionaries[locale] || dictionaries.en;

  const t = (key, vars = {}) => {
    let str = dict[key] || key;
    for (const [k, v] of Object.entries(vars)) {
      str = str.replace(`{${k}}`, v);
    }
    return str;
  };

  return { t, locale };
}
```
Usage in a component is then just `t("reading_time", { min: 4 })`.

**4. Lazy-load locale files you're not using yet.** With only two or three languages this barely matters, but if you add more, dynamic imports keep the extra dictionaries out of the main bundle until someone actually switches to them.
```js
const dictionaries = {
  en: enDict,
  es: () => import("./locales/es.js"),
};
```

**5. Know where this approach stops scaling.** It's fine for static UI strings, but it does nothing for your actual blog post content — each Markdown post is still written in one language, and translating post bodies means maintaining parallel `.md` files per language, which is a content problem a translation library can't solve for you either. It also skips things a full i18n stack handles automatically: pluralization rules, locale-aware date and number formatting, and right-to-left layout. If any of those become real requirements, that's the point to graduate to `react-i18next` or `FormatJS` rather than growing this pattern into one by hand.

For a handful of nav labels and buttons on a personal site, though, this gets you a working language switcher in under fifty lines, with nothing to configure and nothing new to debug when it breaks.
