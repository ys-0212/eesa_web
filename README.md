# Greater Studio landing page — recreation

A Next.js (App Router) + TypeScript + Tailwind CSS v4 recreation of the layout, typography scale, spacing, responsive behaviour
and motion of the landing page at https://www.greaterstudio.com/ — landing page only.

All copy, people, metrics and imagery in this repo are **original placeholders** (the reference's photography, client logos,
portraits, mascot and licensed fonts are not redistributed). Swap in your own through `src/content.ts` and `public/media/`.

## Run it

Requires Node 20+ (tested on Node 24.14 / npm 11.12).

```bash
cd greaterstudio
npm install        # app dependencies only; Playwright is reused from the parent folder (see below)
npm run dev        # http://localhost:3100
npm run build      # production build
npm start          # http://localhost:3100 (production)
```

Quality checks:

```bash
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
npm run test:e2e   # Playwright: builds, serves on :3200, runs tests/landing.spec.ts
```

### Playwright reuse

`@playwright/test` is declared as an **optional peer dependency pinned to 1.64.1** and is resolved from the parent project's
`D:\EESA_WEB\node_modules`, using the Chromium already in the shared Playwright browser cache — nothing is re-downloaded.
If you move this folder out of `D:\EESA_WEB`, install it locally:

```bash
npm i -D @playwright/test@1.64.1   # browsers are already cached if the version matches
```

## Replace content and media

Everything editable lives in **`src/content.ts`**, grouped by section:

| Export | Section |
|---|---|
| `site` | page title/description, brand name, optional `logo` (set `{ src, alt, width, height }` to use an image logo instead of the script wordmark) |
| `nav`, `menu` | top navigation, CTA, full-screen menu links |
| `hero` | headline (`headingBefore` + highlighted word + `headingAfter`), lead, badges, collaborator tag, email form labels |
| `caseStudies` | the two featured cards (status pill, client, title, stat, image) and the four count-up stats |
| `research`, `articles` | research intro, newsletter labels, article cards |
| `services` | 13 service cards (title, link, image) |
| `testimonials` | quotes, names, roles, company chip, stat, portrait |
| `contactCta` | huge heading, subheading, CTA, the 8 ring panels |
| `footer` | newsletter, badges, link columns, location labels, mascot |

Media lives in **`public/media/`** and is referenced by path from `content.ts`. To replace an image, drop a file (SVG, PNG, JPG,
WebP or AVIF) into `public/media/…` and update its `src` (and `width`/`height`) in `content.ts`. Keep the aspect ratio of the slot:

| Slot | Aspect / size | Folder |
|---|---|---|
| Case-study image | ≈ 4:3 or taller (cover-cropped; square on tablet/mobile) | `cases/` |
| Article artwork | 3:2 | `articles/` |
| Service card | 368:505 (≈ 3:4) | `services/` |
| Testimonial portrait | 1:1 (rendered grayscale) | `people/` |
| Ring panel | 600:460 | `ring/` |
| Badge / icon / avatar | square | `badges/`, `icons/`, `avatars/` |
| Hero pin, mascot | 172×232, 105×143 | `hero/`, root |

`next/image` optimises raster formats automatically; SVGs are served as-is. To regenerate the placeholder artwork run
`node scripts/media/generate.mjs` (overwrites only the generated files).

Fonts are set in `app/layout.tsx` (`next/font/google`): Instrument Serif (display), Figtree (body), Space Mono (mono), Yellowtail
(wordmark). Replace them there — the CSS variables `--font-display/body/code/wordmark` feed the Tailwind theme in `app/globals.css`,
where the colour tokens (light + dark) also live.

## Project layout

```
app/                    layout (fonts, theme bootstrap, skip link), page, globals.css (tokens, fluid rem, type utilities)
components/sections/    Nav, MenuOverlay, Hero, CaseStudies, ResearchIntro, Articles, Services, Testimonials, ContactCta, Footer
components/ui/          Button, EmailForm, ThemeToggle, CustomCursor, ScrollThumb, Ring, Parallax, Wordmark, icons
lib/animations/         GSAP setup, MotionProvider (Lenis + reveals + count-ups), reveal.ts, countup.ts
src/content.ts          all editable content
public/media/           all images
tests/                  Playwright end-to-end tests
scripts/recon/          reference reconnaissance (stack, structure, interactions, tokens, colours)
scripts/shared/         screenshot capture used for both sites
scripts/compare/        pixel diff, geometry comparison, overflow probe, local interaction captures
analysis/               SPEC.md, COMPARISON.md, measurements, screenshots, diffs, recordings, REA evidence
```

## Behaviour notes

- Fluid type: `html { font-size: calc(13px + .2083vw) }` (≥480px) / `calc(13px + .578vw)` (<480px), gutters 10vw ≥1280px else 5vw.
- Motion: Lenis smooth scroll, GSAP ScrollTrigger + SplitText line reveals, count-ups, case-image parallax, CSS-3D ring,
  collaborator cursor loop, custom "YOU" cursor (fine pointers only), scroll thumb.
- Accessibility: skip link, landmarks, labelled forms with live status, keyboard-operable menu with focus trap/Escape/focus return,
  `aria-pressed` theme toggle, carousel semantics, visible `:focus-visible` rings, and `prefers-reduced-motion` disables smooth
  scrolling, reveals, parallax, the ring spin, cursor effects and count-ups.
- The email forms validate locally and have no backend — connect `EmailForm`'s submit handler to your provider.

See `analysis/SPEC.md` for the measured spec and `analysis/COMPARISON.md` for the reference-vs-clone results and known gaps.
