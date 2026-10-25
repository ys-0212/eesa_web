# Greater Studio landing page — recreation spec

Reference: https://www.greaterstudio.com/ (captured 2026-10-24, Chromium 156 via the existing Playwright 1.64.1 install).
Scope: the landing page only.

Evidence lives next to this file:

| Path | What |
|---|---|
| `rea/inspect_web_page.json` | REA passive CDP inspection (DOM, a11y, scripts, frames, workers) |
| `measurements/stack.json` | script/style/font inventory, globals, network hosts |
| `measurements/structure-{1440,1024,768,390}.json` | per-section geometry, computed typography/layout, media inventory |
| `measurements/tokens-summary.json`, `responsive-digest.txt` | condensed tokens per width |
| `measurements/animations.json` | ScrollTrigger dump (77 triggers), load-sequence samples, cursor samples, nav-on-scroll states, hover deltas, menu, theme |
| `measurements/colors.json` | pixel-sampled palette |
| `measurements/assets-reference.json` | every reference image/font URL (documentation only, nothing downloaded) |
| `screenshots/reference/<w>/scroll-NN.png`, `full.png` | viewport shots per scroll step + full page, all four widths |
| `screenshots/reference/interactions/*.png` | hover, cursor, menu (desktop + mobile), dark theme, testimonial, ring, footer |
| `recordings/desktop-1440.webm`, `recordings/mobile-390.webm` | load, cursor, hover, scroll, menu and theme recordings |

## 1. Stack identified

| Concern | Reference | Evidence |
|---|---|---|
| Platform | **Webflow** (`data-wf-site`, `data-wf-page`, `w-mod-js`, `cdn.prod.website-files.com`) | `stack.json` htmlAttrs |
| CSS | Webflow-generated + "Lumos" utility framework (`u-section`, `u-theme-light`, `padding-global`, theme-toggle/collector scripts) | stylesheet + script list |
| Animation | **GSAP 3.12.2** + **ScrollTrigger** (several duplicate GSAP copies 3.12.2/3.12.5/3.12.7 loaded), **CustomEase** | `window.gsap.version`, 77 live triggers |
| Text splitting | **SplitType 0.3.4** (154 `.line` elements) | globals + DOM |
| Smooth scroll | **Lenis 0.2.28** (studio-freight bundle) | script list, wheel deltas clamped to ~100px |
| Sliders | **Swiper 10/11** (`.swiper.is-team`, `slidesPerView 3`, `spaceBetween 24`, speed 300) | animations.json |
| 3D | **Three.js r128** ring canvas (`.ring3d-canvas`, 8 image panels); Spline viewer script loaded | DOM + script list |
| Misc | Finsweet Attributes (modal, a11y), Flowbase count-up, lazysizes, Partytown sandbox, Intellimize, CookieYes, reCAPTCHA/Turnstile, jQuery 3.5/3.6 | script list |
| Fonts | Adobe Typekit `articulat-cf` (200–900 + italics), self-hosted `Perfectlynineties`, `Spacemono`, `Peridot PE Variable`, `Greater Marker` | `document.fonts` |
| Anti-automation | devtools-detection console probes; Turnstile fails headless (error 600010). Observation stayed passive; nothing was bypassed. | host log |

REA `analyze_web_bundle` analysed the 23 same-origin inline scripts (no vendor fingerprints, routes or endpoints — all real
libraries come from third-party CDNs outside the origin filter). The stack above is therefore confirmed by Playwright DOM/global inspection.

## 2. Design tokens (measured)

### Colour (`colors.json`, computed styles)

| Token | Value | Use |
|---|---|---|
| `--bg` | `#f5f2f1` | page background (light) |
| `--ink` | `#06110e` | text, dark theme background |
| `--accent` | `#2b40eb` | primary buttons, eyebrow accent text |
| `--accent-ink` | `#1f2da4` | ghost-button hover text |
| `--accent-soft` | `#9ab3eb` | subscribe button, slider "next", service plus buttons |
| `--muted` | `#eeeae7` | theme-toggle square |
| `--panel` | `#e2dfdc` | menu panel, article tag chip, menu backdrop |
| `--disabled` | `#a0a29f` | disabled slider arrow |
| `--pink` | `#f3b0e3` | case-study status pills, article artwork |
| `--chartreuse` | `#cbc308` | collaborator cursor tag, article artwork |
| `--teal` | `#0e4943` | article artwork |
| `--signal` | `#ff4b19` | "YOU" cursor |
| `--violet` | `#5046e4` | client logo chip |
| dark theme | bg `#06110e`, text `#f5f2f1` | `html.u-theme-dark` |

### Fluid root size
Everything is rem-based on a fluid root: **`html{font-size: calc(13px + .2083vw)}`** for ≥480px (16px @1440, 15.13 @1024, 14.60 @768) and
**`calc(13px + .578vw)`** below 480px (15.26 @390). Gutters (`padding-global`): **10vw ≥1280px, 5vw below**.

### Typography

| Role | Ref font | Size/leading (≥480) | <480 | Notes |
|---|---|---|---|---|
| H1 hero | Perfectlynineties 400 | 5.25rem / 1 | 3.5rem | centered, max ≈ 47rem |
| Display H2 | Perfectlynineties 400 | 4.25rem / 1 | 3rem | left, width ≈ 44rem |
| CTA huge | Perfectlynineties 400 | 9rem / .9 | 4.5rem | centered |
| Lead paragraph | articulat-cf 400 | 1.5rem / 1.5 | 1.25rem | |
| Case title / stat | articulat-cf 700 | 2rem / 1 | 1.5rem | on image |
| Stat number | articulat-cf 400 | 3.5rem / 1.16 | 1.875rem | |
| Stat label | articulat-cf 400 | 1.25rem / 1.5 | 1.25rem | |
| Card title (articles, services) | articulat-cf 700 | 1.75rem / 1.25 | 1.75rem | |
| CTA subtitle | articulat-cf 700 | 3rem / 1 | 2rem | |
| Quote | articulat-cf 400 | 1.5rem / 1.5 | 1.25rem | |
| Eyebrow / meta | Spacemono 400 | .75rem / 1.64, ls .04em, uppercase | same | |
| Buttons / nav | Spacemono 400 | 1rem / 1, uppercase | same | height 2.5rem, pad-x 1.5rem, radius .25rem |
| Footer links | Spacemono 400 | 1rem / 1.5, uppercase | same | chevron suffix |

Font substitutions (licensed faces are not redistributed): Perfectlynineties → **Instrument Serif** (OFL),
articulat-cf → **Figtree** (OFL), Spacemono → **Space Mono** (OFL, same family), script wordmark → **Yellowtail** (OFL).
All served through `next/font/google` (self-hosted at build time).

## 3. Section inventory (1440 × 900, doc height 6238px)

| # | Section | y / h @1440 | Layout @1440 | 1024 | 768 | 390 |
|---|---|---|---|---|---|---|
| 0 | **Nav** (fixed, h 144) | 0 | logo 149×48 @ (10vw, 50); right: 3 ghost links, CONTACT (primary), theme toggle 40², menu 40² | same, scaled | logo + toggle + menu only | logo + CONTACT + menu |
| 1 | **Hero** | 144 / 601 | centred H1 (2 lines) with Figma-style selection box on "partner", collaborator cursor tag, pulsing location pin; lead para; 4 partner badges row (mono 12px + 24px icon); email field 400w + button | same | badges wrap 2×2 | badges stack 1 col, form stacks full width |
| 2 | **Case studies + stats** | 745 / 867 | 2 cards 568×454 gap 16, r 8, image cover + bottom gradient; pill tag top-left (inset 48); logo, title bottom-left (w 304), stat bottom-right; below: 2×2 stats with 1px rules (number left, label at +292) | 453×362 | cards stack 1:1 square | square 351 |
| 3 | **Research intro** | 1611 / 348 | eyebrow, display H2 (w 709), lead; newsletter (eyebrow accent + input + SUBSCRIBE) at right | same | stacked | stacked |
| 4 | **Articles** | 1959 / 752 | 3 cols 373 gap 16; 3:2 artwork; tag chip + date; title; optional excerpt; 24px avatar + author; centred VIEW MORE + | 2 cols | 2 cols | 1 col, button full width |
| 5 | **Services** | 2711 / 986 | eyebrow, display H2, lead; horizontal draggable track, cards 368×505 (3 per container width, gap 24, bleeds right); title + plus button 40² | 291×400 | 214×294 | 317×435 (≈1.1 per view) |
| 6 | **Testimonials** | 3697 / 579 | eyebrow + counter `[ 1 / N ]`, prev/next 40² at right; 310² grayscale portrait with client chip; quote; name/role mono; stat at right | 247² | stacked | stacked |
| 7 | **Contact CTA** | 4276 / 1035 | huge 2-line serif heading; rotating 3D ring of 8 panels (1312×656 canvas) overlapping the 2nd line; bold subtitle; CONTACT US | scaled | scaled | ring 390×300 |
| 8 | **Footer** | 5311 / 926 | newsletter + 2 badges left; 5 link columns (3 top, 2 bottom) at x 677/889/1100; "♡ NEW YORK" / "WORLDWIDE ⊕"; full-bleed script wordmark (h 302) with mascot peeking | same | stacked | stacked, badges + mascot at end |
| – | **Menu overlay** | | right panel (#e2dfdc) logo + close, search, large mono links, 2 small links; left rounded light card with sitemap; desktop only left card | | | right panel full screen |
| – | **Custom cursor** | | "YOU" arrow + orange label follows pointer (fine pointers only) | | | none |
| – | **Scroll thumb** | | custom 128px thumb at right edge, fades in while scrolling (opacity .35s) | | | none |

## 4. Asset inventory and substitution plan

The reference uses 58 DOM images (no `<video>` elements) — full list with URLs in `measurements/assets-reference.json`.
Ownership/licence for re-distribution could not be verified (client photography, client logos, staff/customer portraits,
third-party partner marks, a proprietary 3D mascot, Adobe/commercial fonts), so **no original media is copied**. Every slot is filled
with an original SVG created for this project, sized to the reference aspect ratio, and referenced from `src/content.ts`:

| Slot (count) | Reference | Replacement in `public/media/` |
|---|---|---|
| Logo wordmark | custom script SVG | text wordmark in Yellowtail (swap for `logo.svg` via content) |
| Hero location pin (1) | 3D pigeon pin PNG | `hero/pin.svg` (original) |
| Partner badge icons (4) | Webflow/Dribbble/AirOps/Claude marks | `icons/badge-{1..4}.svg` generic glyphs |
| Case study images (2) + client logos (2) | client photography | `cases/case-{1,2}.svg` abstract art; logos as text |
| Article artwork (3) + avatars (2) | thumbnails, headshots | `articles/article-{1..3}.svg`, `avatars/avatar-{1,2}.svg` |
| Service cards (13) | rendered illustrations | `services/service-{01..13}.svg` gradient art |
| Testimonial portraits + client chips | real people photos/logos | `people/person-{1..5}.svg` monogram portraits; chip = text |
| Ring panels (8) | project imagery | `ring/panel-{1..8}.svg` |
| Footer badges (2) | partner badges | `badges/badge-{1,2}.svg` generic shields |
| Mascot (footer) | 3D pigeon "Frankie" | `mascot.svg` original character |
| Cursor | SVG | inline component |

Copy: the reference wording is replaced with original placeholder copy of comparable length/line-breaks (fictional clients, names and
metrics, clearly marked placeholders in `src/content.ts`), while generic UI labels (nav items, buttons, footer headings) are kept.

## 5. Animation catalogue

| # | Interaction | Reference implementation | Clone |
|---|---|---|---|
| A1 | Text reveal | SplitType lines in overflow-hidden wrappers; `gsap.from(lines,{y:'100%',duration:.6,ease:'power2.out',stagger:.1})`, ScrollTrigger `start:'top 95%'`, once (77 instances: eyebrows, headings, paragraphs) | `lib/animations/reveal.ts` — GSAP + SplitText (lines, mask) with identical params |
| A2 | Smooth scroll | Lenis 0.2.28 defaults | `lenis` npm, synced to `gsap.ticker` + ScrollTrigger |
| A3 | Nav scrolled state | `.inner-links.is-scrolled` gets `rgba(245,242,241,.9)` pill background once scrolled | class toggle at `scrollY > 10` |
| A4 | Collaborator cursor | `.fig-cursor` (GREATER tag + avatars) tweened between points near the hero heading; selection box on "partner" | GSAP timeline loop |
| A5 | "YOU" cursor | custom cursor SVG following the pointer | rAF follower, `pointer:fine` only |
| A6 | Location pin pulse | `.frankie_pulse_image` pulse ring | CSS keyframes |
| A7 | Count-up stats | Flowbase count-up when in view | GSAP tween on in-view |
| A8 | Services drag | Swiper slide (speed 300, gap 24) | native overflow-x + scroll-snap + pointer drag |
| A9 | Testimonials | Swiper with prev/next, counter `[ i / N ]`, disabled prev at start (#a0a29f) | React state, fade/slide 300ms, buttons disabled at ends |
| A10 | Ring | Three.js r128 cylinder of 8 textured panels, continuous Y rotation | CSS 3D (`preserve-3d`) ring, rAF rotation + scroll velocity boost |
| A11 | Menu | panel slides in from right, left card from left, backdrop | CSS transforms .5s, focus trap, Esc to close, body scroll lock |
| A12 | Theme toggle | Lumos theme-toggle swaps `u-theme-light/dark` | `data-theme` on `<html>`, persisted in localStorage, no-flash inline script |
| A13 | Hover | `.gr-button` transition .2s; ghost links → `#1f2da4`; primary opacity .9; testimonial arrows bg/colour .25s; footer chevrons | Tailwind transitions with the same timings |
| A14 | Scroll thumb | custom thumb, `transition: opacity .35s` | fixed element, translateY from progress |
| A15 | Lazy media | lazysizes | `loading="lazy"` / `decoding="async"` |
| — | Reduced motion | `(prefers-reduced-motion: reduce)` query present | disables Lenis, reveals, ring spin, cursor loops, count-up (final values shown) |

## 6. Implementation plan

1. Next.js 16 App Router + TypeScript + Tailwind v4 (`@theme` tokens above), `next/font/google` for the four OFL faces.
2. `src/content.ts` — all text/links/alt/media per section; `public/media/**` — generated original SVGs (`scripts/media/generate.mjs`).
3. `components/sections/*` — Nav, Hero, CaseStudies, ResearchIntro, Articles, Services, Testimonials, ContactCta, Footer, MenuOverlay.
4. `components/ui/*` — Button, Eyebrow, EmailForm, Chevron icons, CustomCursor, ScrollThumb, ThemeToggle, Reveal wrapper.
5. `lib/animations/*` — Lenis provider, reveal (SplitText), count-up, ring, collaborator cursor.
6. A11y: semantic landmarks, skip link, labelled forms, `aria-expanded` menu + focus trap, `:focus-visible` rings, reduced motion.
7. Verify: `scripts/shared/capture.mjs` on both sites → `scripts/compare/diff.mjs` (pixelmatch) at 1440/1024/768/390, Playwright tests for
   interactions/console errors/overflow, then lint, `tsc`, `next build`.
