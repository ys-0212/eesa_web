// Measures section tops/heights + key typography on the reference and the local clone at each width,
// so layout drift can be fixed numerically. Writes analysis/comparisons/geometry.json
// Usage: node scripts/compare/geometry.mjs [localUrl=http://localhost:3100/] [widths]
import { chromium } from 'playwright';
import fs from 'node:fs';

const LOCAL = process.argv[2] ?? 'http://localhost:3100/';
const widths = (process.argv[3] ?? '1440,1024,768,390').split(',').map(Number);
const HEIGHTS = { 1440: 900, 1024: 768, 768: 1024, 390: 844 };
const NAMES = ['hero', 'cases', 'research', 'articles', 'services', 'testimonials', 'cta', 'footer'];

async function measure(page, isRef) {
  return page.evaluate(({ isRef, NAMES }) => {
    const secs = isRef
      ? [...document.querySelector('.main-wrapper').children].filter((c) => c.getBoundingClientRect().height > 0)
      : [...document.querySelectorAll('main > section, body > footer, footer#footer')];
    const box = (el) => { const r = el.getBoundingClientRect(); return { y: Math.round(r.top + scrollY), h: Math.round(r.height) }; };
    const out = {};
    secs.slice(0, NAMES.length).forEach((s, i) => (out[NAMES[i]] = box(s)));
    const h1 = document.querySelector('h1');
    out.h1 = h1 && { ...box(h1), fs: getComputedStyle(h1).fontSize };
    out.doc = document.documentElement.scrollHeight;
    return out;
  }, { isRef, NAMES });
}

const browser = await chromium.launch();
const result = {};
for (const w of widths) {
  result[w] = {};
  for (const [label, url, isRef] of [['reference', 'https://www.greaterstudio.com/', true], ['local', LOCAL, false]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: HEIGHTS[w] } });
    const page = await ctx.newPage();
    await page.goto(url, { waitUntil: 'load', timeout: 90000 });
    await page.waitForTimeout(3000);
    result[w][label] = await measure(page, isRef);
    await ctx.close();
  }
  const r = result[w].reference;
  const l = result[w].local;
  console.log(`\n== ${w}  doc ref ${r.doc} local ${l.doc} (Δ ${l.doc - r.doc})`);
  for (const n of NAMES) {
    if (!r[n] || !l[n]) continue;
    console.log(`${n.padEnd(13)} y ${String(r[n].y).padStart(5)} → ${String(l[n].y).padStart(5)} (Δ${String(l[n].y - r[n].y).padStart(5)})   h ${String(r[n].h).padStart(5)} → ${String(l[n].h).padStart(5)} (Δ${String(l[n].h - r[n].h).padStart(5)})`);
  }
}
fs.mkdirSync('analysis/comparisons', { recursive: true });
fs.writeFileSync('analysis/comparisons/geometry.json', JSON.stringify(result, null, 2));
await browser.close();
