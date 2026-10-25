// Stack / structure reconnaissance of the reference landing page.
// Writes analysis/measurements/stack.json
import { chromium } from 'playwright';
import fs from 'node:fs';

const TARGET = 'https://www.greaterstudio.com/';
fs.mkdirSync('analysis/measurements', { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
const requests = [];
page.on('response', async (r) => {
  const req = r.request();
  requests.push({ url: r.url(), status: r.status(), type: req.resourceType(), ct: r.headers()['content-type'] ?? '' });
});
await page.goto(TARGET, { waitUntil: 'load', timeout: 90000 });
await page.waitForTimeout(5000);

const info = await page.evaluate(() => {
  const html = document.documentElement;
  const attrs = (el) => Object.fromEntries([...el.attributes].map((a) => [a.name, a.value.slice(0, 200)]));
  const g = window;
  const globals = [
    'gsap', 'ScrollTrigger', 'Lenis', 'lenis', 'Webflow', '__NEXT_DATA__', 'next', '__nuxt', '__NUXT__',
    'Framer', '__framer_importFromPackage', 'jQuery', '$', 'Swiper', 'barba', 'Splitting', 'SplitType',
    'SplitText', 'LocomotiveScroll', 'THREE', 'anime', 'Motion', 'Alpine', 'Vue', 'React', 'Stimulus',
    'partytown', 'Shopify', 'Squarespace', 'Wix', 'Sanity', 'Hls', 'Vimeo', 'YT',
  ].filter((k) => { try { return g[k] !== undefined; } catch { return false; } });
  const gsapInfo = (() => {
    try {
      if (!g.gsap) return null;
      const st = g.ScrollTrigger;
      return {
        version: g.gsap.version,
        plugins: Object.keys(g.gsap.core?.globals?.() ?? {}),
        scrollTriggers: st ? st.getAll().map((t) => ({
          trigger: t.trigger ? (t.trigger.className?.toString().slice(0, 80) || t.trigger.tagName) : null,
          start: t.start, end: t.end, pin: !!t.pin, scrub: t.vars?.scrub ?? null,
          startVar: String(t.vars?.start ?? ''), endVar: String(t.vars?.end ?? ''),
        })) : null,
      };
    } catch (e) { return { error: String(e) }; }
  })();
  return {
    title: document.title,
    htmlAttrs: attrs(html),
    bodyAttrs: attrs(document.body),
    metas: [...document.querySelectorAll('meta')].map(attrs),
    links: [...document.querySelectorAll('link')].map(attrs),
    scripts: [...document.querySelectorAll('script')].map((s) => ({ src: s.src, type: s.type, id: s.id, len: s.textContent.length, head: s.src ? '' : s.textContent.slice(0, 120) })),
    styles: [...document.querySelectorAll('style')].map((s) => ({ len: s.textContent.length, head: s.textContent.slice(0, 160) })),
    globals,
    gsapInfo,
    fonts: [...document.fonts].map((f) => ({ family: f.family, weight: f.weight, style: f.style, status: f.status })),
    docHeight: document.documentElement.scrollHeight,
    bodyClasses: document.body.className,
    topLevel: [...document.body.children].map((c) => ({ tag: c.tagName, id: c.id, cls: c.className?.toString().slice(0, 120), h: Math.round(c.getBoundingClientRect().height) })),
  };
});
info.requests = requests;
fs.writeFileSync('analysis/measurements/stack.json', JSON.stringify(info, null, 2));
console.log(JSON.stringify({
  title: info.title, htmlAttrs: info.htmlAttrs, globals: info.globals, gsap: info.gsapInfo && { v: info.gsapInfo.version, n: info.gsapInfo.scrollTriggers?.length },
  docHeight: info.docHeight, scripts: info.scripts.filter((s) => s.src).map((s) => s.src),
  css: info.links.filter((l) => l.rel === 'stylesheet').map((l) => l.href),
  fonts: [...new Set(info.fonts.map((f) => `${f.family} ${f.weight} ${f.style} ${f.status}`))],
  topLevel: info.topLevel,
  generator: info.metas.filter((m) => m.name === 'generator'),
  reqHosts: [...new Set(requests.map((r) => new URL(r.url).host))],
}, null, 1));
await browser.close();

