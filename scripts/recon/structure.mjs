// Section inventory + geometry + computed styles + media inventory of the reference page.
// Usage: node scripts/recon/structure.mjs [width] [height]
// Writes analysis/measurements/structure-<width>.json
import { chromium } from 'playwright';
import fs from 'node:fs';

const TARGET = 'https://www.greaterstudio.com/';
const width = Number(process.argv[2] ?? 1440);
const height = Number(process.argv[3] ?? 900);
fs.mkdirSync('analysis/measurements', { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
const page = await context.newPage();
await page.goto(TARGET, { waitUntil: 'load', timeout: 90000 });
await page.waitForTimeout(3000);
// Drive Lenis with real wheel input so lazy media + scroll-triggered reveals settle before measuring.
const total = await page.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0; y < total + height; y += Math.round(height * 0.6)) {
  await page.mouse.wheel(0, Math.round(height * 0.6));
  await page.waitForTimeout(350);
}
await page.waitForTimeout(1500);
await page.evaluate(() => (window.lenis?.scrollTo ? window.lenis.scrollTo(0, { immediate: true }) : window.scrollTo(0, 0)));
await page.mouse.wheel(0, -100000);
await page.waitForTimeout(2000);

const data = await page.evaluate(() => {
  const sy = () => window.scrollY;
  const box = (el) => { const r = el.getBoundingClientRect(); return { x: Math.round(r.x), y: Math.round(r.y + sy()), w: Math.round(r.width), h: Math.round(r.height) }; };
  const pick = (el, props) => { const cs = getComputedStyle(el); return Object.fromEntries(props.map((p) => [p, cs.getPropertyValue(p)])); };
  const TYPO = ['font-family', 'font-size', 'font-weight', 'line-height', 'letter-spacing', 'text-transform', 'color', 'text-align'];
  const LAYOUT = ['display', 'position', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left', 'margin-top', 'margin-bottom', 'gap', 'grid-template-columns', 'background-color', 'background-image', 'border-radius', 'overflow', 'z-index', 'max-width'];
  const cls = (el) => (el.className?.baseVal ?? el.className ?? '').toString().trim().slice(0, 140);
  const textOf = (el) => (el.innerText ?? '').replace(/\s+/g, ' ').trim();

  const wrapper = document.querySelector('.page-wrapper') ?? document.body;
  const main = wrapper.querySelector('main, .main-wrapper') ?? wrapper;
  const sectionEls = [...main.children].filter((c) => c.getBoundingClientRect().height > 0 || c.tagName === 'SECTION');

  const describeSection = (s) => {
    const headings = [...s.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter((h) => h.getBoundingClientRect().height > 0).slice(0, 25).map((h) => ({
      tag: h.tagName, cls: cls(h), text: textOf(h).slice(0, 160), box: box(h), style: pick(h, TYPO),
    }));
    const paras = [...s.querySelectorAll('p, .text-size-medium, .text-size-regular, .text-size-large')].filter((p) => p.getBoundingClientRect().height > 0).slice(0, 15).map((p) => ({
      cls: cls(p), text: textOf(p).slice(0, 220), box: box(p), style: pick(p, TYPO),
    }));
    const links = [...s.querySelectorAll('a, button')].filter((a) => a.getBoundingClientRect().height > 0).slice(0, 30).map((a) => ({
      tag: a.tagName, cls: cls(a), text: textOf(a).slice(0, 80), href: a.getAttribute('href'), box: box(a),
      style: pick(a, [...TYPO, 'background-color', 'border-radius', 'padding-top', 'padding-left', 'border-top-width', 'border-top-color']),
    }));
    const media = [...s.querySelectorAll('img, video, svg, canvas, spline-viewer, iframe, picture source')].filter((m) => m.tagName === 'SOURCE' || m.getBoundingClientRect().height > 0).slice(0, 60).map((m) => ({
      tag: m.tagName, cls: cls(m), box: m.tagName === 'SOURCE' ? null : box(m),
      src: m.currentSrc || m.getAttribute('src') || m.getAttribute('data-src') || m.getAttribute('url') || m.getAttribute('srcset') || null,
      alt: m.getAttribute('alt'), natural: m.naturalWidth ? [m.naturalWidth, m.naturalHeight] : (m.videoWidth ? [m.videoWidth, m.videoHeight] : null),
      loading: m.getAttribute('loading'), attrs: m.tagName === 'VIDEO' ? { autoplay: m.autoplay, loop: m.loop, muted: m.muted, playsinline: m.playsInline, poster: m.poster, sources: [...m.querySelectorAll('source')].map((x) => x.src) } : undefined,
      style: pick(m, ['object-fit', 'object-position', 'border-radius', 'opacity', 'transform', 'aspect-ratio', 'filter', 'mix-blend-mode']),
      svg: m.tagName === 'svg' ? { viewBox: m.getAttribute('viewBox'), len: m.outerHTML.length } : undefined,
    }));
    const bgEls = [...s.querySelectorAll('*')].filter((e) => { const b = getComputedStyle(e).backgroundImage; return b && b !== 'none' && b.includes('url('); }).slice(0, 15).map((e) => ({ cls: cls(e), bg: getComputedStyle(e).backgroundImage.slice(0, 300), box: box(e) }));
    // Child outline two levels deep for layout understanding.
    const outline = (el, depth) => depth === 0 ? undefined : [...el.children].filter((c) => c.getBoundingClientRect().height > 0).slice(0, 14).map((c) => ({ tag: c.tagName, cls: cls(c), box: box(c), kids: outline(c, depth - 1) }));
    return {
      tag: s.tagName, id: s.id, cls: cls(s), box: box(s), style: pick(s, LAYOUT),
      text: textOf(s).slice(0, 600), headings, paras, links, media, bgEls, outline: outline(s, 4),
    };
  };

  const nav = document.querySelector('nav.navigation-wrapper');
  const navInfo = nav && { ...describeSection(nav), fixed: getComputedStyle(nav).position };
  const footer = document.querySelector('footer') ?? [...document.querySelectorAll('[class*="footer"]')][0];

  return {
    viewport: [innerWidth, innerHeight],
    docHeight: document.documentElement.scrollHeight,
    body: pick(document.body, [...TYPO, 'background-color']),
    rootVars: (() => { const cs = getComputedStyle(document.documentElement); const out = {}; for (const sheet of document.styleSheets) { try { for (const r of sheet.cssRules) { if (r.selectorText === ':root' || r.selectorText?.includes('u-theme-light') ) { for (const p of r.style) if (p.startsWith('--')) out[p] = cs.getPropertyValue(p).trim(); } } } catch {} } return out; })(),
    nav: navInfo,
    footerCls: footer ? cls(footer) : null,
    sections: sectionEls.map(describeSection),
    cursor: (() => { const c = document.querySelector('.fig-cursor'); const b = document.querySelector('.fig-box'); return { cursor: c && { cls: cls(c), html: c.outerHTML.slice(0, 600), style: pick(c, ['position', 'width', 'height', 'pointer-events', 'transform', 'mix-blend-mode', 'z-index']) }, box: b && { html: b.outerHTML.slice(0, 600), style: pick(b, ['position', 'width', 'height', 'transform', 'z-index']) } }; })(),
    scrollThumb: (() => { const t = document.querySelector('.scroll-thumb'); return t && { html: t.outerHTML.slice(0, 300), style: pick(t, ['position', 'right', 'top', 'width', 'height', 'background-color', 'border-radius', 'opacity']) }; })(),
  };
});
fs.writeFileSync(`analysis/measurements/structure-${width}.json`, JSON.stringify(data, null, 2));
console.log(`viewport ${width}x${height} doc ${data.docHeight}`);
for (const s of data.sections) console.log(`- ${s.tag}.${s.cls} y=${s.box.y} h=${s.box.h} :: ${s.text.slice(0, 140)}`);
await browser.close();
