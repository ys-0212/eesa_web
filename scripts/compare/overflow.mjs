// Lists elements whose right edge extends past the viewport (horizontal overflow debugging).
// Usage: node scripts/compare/overflow.mjs [url=http://localhost:3200/] [width=390]
import { chromium } from 'playwright';

const url = process.argv[2] ?? 'http://localhost:3200/';
const width = Number(process.argv[3] ?? 390);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width, height: 844 } });
await page.goto(url, { waitUntil: 'load' });
await page.waitForTimeout(2000);
const res = await page.evaluate(() => {
  const vw = window.innerWidth;
  const offenders = [];
  for (const el of document.querySelectorAll('body *')) {
    const r = el.getBoundingClientRect();
    if (r.right > vw + 1 && r.width > 0) {
      // Skip descendants of elements that clip their own overflow (scrollers, overflow hidden/clip).
      let p = el.parentElement;
      let clipped = false;
      while (p && p !== document.body) {
        const cs = getComputedStyle(p);
        if (cs.overflowX !== 'visible' || cs.position === 'fixed') { clipped = true; break; }
        p = p.parentElement;
      }
      if (!clipped) offenders.push({ tag: el.tagName, cls: (el.className?.baseVal ?? el.className).toString().slice(0, 120), right: Math.round(r.right), pos: getComputedStyle(el).position });
    }
  }
  return { scrollWidth: document.documentElement.scrollWidth, vw, offenders: offenders.slice(0, 20) };
});
console.log(JSON.stringify(res, null, 1));
await browser.close();
