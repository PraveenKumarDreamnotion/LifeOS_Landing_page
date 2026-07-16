# LifeOS - Landing Site

A fast, static marketing site for **LifeOS** (assistant name: *Yogi*) - a privacy-first,
voice-first AI assistant for Windows by **DreamNotion**.

Pure **HTML + CSS + vanilla JavaScript**. No frameworks, no build step, no external
requests (fitting for a privacy-first product). Ready to host on **GitHub Pages**.

---

## 1. Folder structure

```
lifeos_page/
├── index.html          # Landing page (hero, features, how-it-works, download, FAQ…)
├── privacy.html        # Privacy Policy (mirrors the app's real, code-enforced posture)
├── terms.html          # Terms & Conditions (MIT, as-is, third-party services)
├── 404.html            # Self-contained not-found page (inline styles)
├── manifest.json       # PWA manifest (name, icons, theme colour)
├── robots.txt          # Crawler directives + sitemap pointer
├── sitemap.xml         # Sitemap for the 3 indexable pages
├── favicon.ico         # Multi-size favicon (from the app logo)
├── .nojekyll           # Tell GitHub Pages to serve files as-is (skip Jekyll)
├── css/
│   └── styles.css      # Single design-system stylesheet (tokens, light+dark, components)
├── js/
│   ├── config.js       # ⭐ ALL editable links/version/contact live here
│   └── main.js         # Theme toggle, nav, mobile menu, scroll reveals, config injection
├── images/
│   ├── logo.png        # Brand mark (orange ring)
│   ├── og-image.png    # 1200×630 social share image
│   └── screenshots/    # Real product screenshots (email address redacted)
│       ├── launcher.png, chat.png, schedules.png, history.png
│       └── settings-ai.png, settings-email.png, settings-general.png
└── assets/             # (empty) drop extra downloadable assets here if needed
```

---

## 2. Features implemented

- Responsive, mobile/tablet/desktop-optimised layout (fluid, no horizontal scroll).
- **Light + dark theme** with a toggle, `prefers-color-scheme` default, and no-flash
  persistence via `localStorage`.
- Semantic HTML, ARIA labels, keyboard-focus styles, `prefers-reduced-motion` support.
- Scroll-reveal animations as a **progressive enhancement** - content is fully visible
  and crawlable even with JavaScript disabled.
- SEO: per-page `<title>`/description, Open Graph + Twitter cards, canonical URLs,
  JSON-LD `SoftwareApplication`, `robots.txt`, `sitemap.xml`, `manifest.json`, favicon.
- One **configurable download button** wired from a single JS object (see §3).
- Sections: hero, trust strip, what-is-LifeOS, alternating feature showcases, feature-card
  grid, how-it-works steps, screenshot carousel, why-local-first, tech stack, download, FAQ.
- Professional Privacy Policy and Terms pages consistent with the actual product.

> **Accuracy note:** all copy describes only features that ship in **v0.1.0**. It
> deliberately avoids claiming things the app does *not* do (background/wake-word
> listening, monthly reminders by voice, long-term memory, non-OpenAI models,
> code-signing, macOS/Linux/mobile). Keep it that way when editing.

---

## 3. How to update the download link (and other links)

Everything editable lives in **`js/config.js`** - you never touch the HTML.

```js
window.LIFEOS_CONFIG = {
  VERSION: "0.1.0",
  DOWNLOAD_URL: "https://github.com/dreamnotion/lifeos/releases/latest/download/LifeOS-Setup-0.1.0.exe",
  DOWNLOAD_FILENAME: "LifeOS Setup 0.1.0.exe",
  DOWNLOAD_SIZE: "~155 MB",
  GITHUB_URL: "https://github.com/dreamnotion/lifeos",
  RELEASES_URL: "https://github.com/dreamnotion/lifeos/releases",
  CONTACT_EMAIL: "tech@dreamnotion.com",
  ...
};
```

Change `DOWNLOAD_URL`, save, done - every download button updates.

> ⚠️ **The installer is ~162 MB.** GitHub blocks files over 100 MB from a repo, so the
> `.exe` **cannot** live next to these HTML files. Upload it as a **GitHub Release asset**
> and point `DOWNLOAD_URL` at it. The `/releases/latest/download/<file>` form always
> serves the newest release. The URLs shipped in `config.js` are **placeholders** -
> replace `dreamnotion/lifeos` and the contact email with your real values.

---

## 4. How to deploy on GitHub Pages

1. Create a repository (e.g. `lifeos`) and push the **contents of this folder** to it.
2. In **Settings → Pages**, set *Source* = **Deploy from a branch**, branch = `main`,
   folder = `/ (root)`.
3. Your site goes live at `https://<user>.github.io/<repo>/` in ~1 minute.
4. Create a **Release**, attach `LifeOS Setup 0.1.0.exe`, and set `DOWNLOAD_URL` in
   `js/config.js` to that asset's URL.
5. Update the placeholder domain in `sitemap.xml`, `robots.txt`, and the `<link rel="canonical">`
   / `og:url` tags to your real Pages URL.

*(For a custom domain, add a `CNAME` file and configure DNS as GitHub documents.)*

---

## 5. How to replace screenshots

Screenshots are referenced by filename, so just **overwrite the files** in
`images/screenshots/` (keep the same names) - no HTML changes needed:

| File                    | Shown as                                   |
|-------------------------|--------------------------------------------|
| `chat.png`              | Hero window + carousel                      |
| `launcher.png`          | Hero floating widget + voice-launcher row   |
| `schedules.png`         | Reminders feature row + carousel            |
| `history.png`           | How-it-works + carousel                     |
| `settings-ai.png`       | Privacy/AI feature row + carousel           |
| `settings-email.png`    | Email feature row                           |
| `settings-general.png`  | Carousel                                    |

To swap the social image, replace `images/og-image.png` (keep it 1200×630).

> **Privacy reminder:** the real screenshots had a personal email address redacted to
> `you@example.com`. If you re-capture, use clean demo data and no real personal info.

---

## 6. Manual testing checklist

- [ ] Every nav link scrolls to the right section; mobile hamburger opens/closes.
- [ ] Theme toggle switches light ⇄ dark and persists across reloads.
- [ ] With system dark mode, first load respects it (no flash of the wrong theme).
- [ ] Hero + all sections are visible with **JavaScript disabled**.
- [ ] Download buttons point at `DOWNLOAD_URL`; GitHub/Releases/Contact links resolve.
- [ ] Version, filename, size, platform, and year render (not raw placeholders).
- [ ] FAQ items expand/collapse.
- [ ] No horizontal scrollbar at 320 / 375 / 768 / 1024 / 1440 px widths.
- [ ] `privacy.html`, `terms.html`, `404.html` render and link back home.
- [ ] Social preview looks right (paste the URL into a link-preview debugger).
- [ ] Lighthouse pass for Performance / Accessibility / SEO.

---

## 7. Suggestions for future improvements

- Add a real GitHub repo, then swap the placeholder URLs in `config.js`.
- Publish SHA-256 checksums next to the download and link them (matches the app's honesty).
- Add a short muted auto-playing demo clip (voice launcher in action) above the fold.
- Once the app is code-signed, remove the SmartScreen note in the download section/FAQ.
- Add `hreflang` / translations if you target non-English audiences (app is English-only today).
- Consider a lightweight, privacy-respecting, cookieless view counter - or keep zero analytics
  to match the product ethos.
- Add a changelog page that reads from GitHub Releases.

---

© DreamNotion · LifeOS is MIT licensed. This site makes no external network requests.
