// Records load/scroll/hover/cursor/menu behaviour of the reference at desktop + mobile and
// dumps animation configuration (ScrollTrigger, Lenis, CSS transitions, media queries).
// Writes analysis/recordings/*.webm, analysis/screenshots/reference/interactions/*.png,
// analysis/measurements/animations.json
import { chromium } from 'playwright';
import fs from 'node:fs';

const TARGET = 'https://www.greaterstudio.com/';
const HIDE_CSS = `.cky-consent-container,.cky-overlay,.cky-modal,.cky-btn-revisit-wrapper,.grecaptcha-badge{display:none!important}`;
fs.mkdirSync('analysis/recordings', { recursive: true });
fs.mkdirSync('analysis/screenshots/reference/interactions', { recursive: true });
const shot = (page, name) => page.screenshot({ path: `analysis/screenshots/reference/interactions/${name}.png` });
const out = {};

const browser = await chromium.launch();

async function session(label, viewport, fn) {
  const context = await browser.newContext({ viewport, recordVideo: { dir: 'analysis/recordings/tmp', size: viewport } });
  const page = await context.newPage();
  await page.goto(TARGET, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.addStyleTag({ content: HIDE_CSS }).catch(() => {});
  await fn(page);
  const video = page.video();
  await context.close();
  if (video) fs.renameSync(await video.path(), `analysis/recordings/${label}.webm`);
}

async function wheelBy(page, px) {
  for (let s = 0; s < Math.abs(px); s += 100) { await page.mouse.wheel(0, Math.sign(px) * 100); await page.waitForTimeout(30); }
}

// ---------- Desktop ----------
await session('desktop-1440', { width: 1440, height: 900 }, async (page) => {
  // Page-load sequence: sample hero state every 150ms.
  const loadFrames = [];
  for (let t = 0; t <= 3000; t += 150) {
    loadFrames.push(await page.evaluate((t) => {
      const q = (s) => document.querySelector(s);
      const st = (el) => el && { o: getComputedStyle(el).opacity, tf: getComputedStyle(el).transform, vis: getComputedStyle(el).visibility };
      const h1 = q('.hero h1, h1');
      const firstChar = h1?.querySelector('.char, .word, .line, span');
      return { t, h1: st(h1), firstSplit: st(firstChar), splitCls: firstChar?.className ?? null, nav: st(q('nav.navigation-wrapper')) };
    }, t));
    await page.waitForTimeout(150);
  }
  out.loadFrames = loadFrames;
  await page.waitForTimeout(1500);

  out.config = await page.evaluate(() => {
    const cls = (el) => (el?.className?.baseVal ?? el?.className ?? '').toString().slice(0, 100);
    const st = window.ScrollTrigger;
    const triggers = st ? st.getAll().map((t) => ({
      trigger: cls(t.trigger) || t.trigger?.tagName, pin: t.pin ? cls(t.pin) : null,
      start: Math.round(t.start), end: Math.round(t.end), scrub: t.vars?.scrub ?? null, toggleActions: t.vars?.toggleActions ?? null,
      startVar: typeof t.vars?.start === 'function' ? 'fn' : String(t.vars?.start ?? ''), endVar: typeof t.vars?.end === 'function' ? 'fn' : String(t.vars?.end ?? ''),
      anim: t.animation ? { duration: t.animation.duration(), targets: (t.animation.targets?.() ?? []).slice(0, 3).map(cls), vars: Object.fromEntries(Object.entries(t.animation.vars ?? {}).filter(([, v]) => typeof v !== 'object' && typeof v !== 'function').slice(0, 14)) } : null,
    })) : [];
    // Media-query breakpoints from same-origin/CORS-readable stylesheets.
    const mqs = new Set();
    const transitions = [];
    for (const sheet of document.styleSheets) {
      let rules; try { rules = sheet.cssRules; } catch { continue; }
      for (const r of rules) {
        if (r.media) mqs.add(r.media.mediaText);
        if (r.style?.transition && transitions.length < 80) transitions.push({ sel: r.selectorText?.slice(0, 120), transition: r.style.transition });
      }
    }
    const keyEls = {};
    for (const sel of ['nav.navigation-wrapper', '.hero h1', '.hero p', '.u-section h2', '.button, .w-button, a[class*="button"]', '.fig-cursor', '.scroll-thumb', '.footer']) {
      const el = document.querySelector(sel);
      if (el) { const cs = getComputedStyle(el); keyEls[sel] = { cls: cls(el), transition: cs.transition, willChange: cs.willChange, transform: cs.transform }; }
    }
    return {
      gsapVersion: window.gsap?.version, triggerCount: triggers.length, triggers,
      lenis: (() => { const l = Object.values(window).find((v) => v && v.constructor && v.constructor.name === 'Lenis') ?? window.lenis; return l ? { options: Object.fromEntries(Object.entries(l.options ?? {}).filter(([, v]) => typeof v !== 'object' && typeof v !== 'function')) } : null; })(),
      mediaQueries: [...mqs], transitions, keyEls,
      splitTypeChars: document.querySelectorAll('.char').length, splitTypeWords: document.querySelectorAll('.word').length, splitTypeLines: document.querySelectorAll('.line').length,
    };
  });

  await shot(page, 'desktop-top');
  // Cursor follower: move the mouse and sample the follower element.
  const cursorSamples = [];
  for (const [x, y] of [[300, 300], [700, 450], [1100, 600]]) {
    await page.mouse.move(x, y, { steps: 8 });
    for (const dt of [0, 80, 400]) {
      await page.waitForTimeout(dt);
      cursorSamples.push({ mouse: [x, y], dt, ...(await page.evaluate(() => {
        const c = document.querySelector('.fig-cursor'); const b = document.querySelector('.fig-box');
        const r = (e) => e && (({ x, y, width, height }) => ({ x: Math.round(x), y: Math.round(y), w: Math.round(width), h: Math.round(height) }))(e.getBoundingClientRect());
        return { cursor: r(c), cursorOpacity: c && getComputedStyle(c).opacity, box: r(b), boxText: b?.innerText?.slice(0, 60) };
      })) });
    }
  }
  out.cursorSamples = cursorSamples;
  await shot(page, 'desktop-cursor');

  // Hover states: nav links, CTA, case-study cards, article cards, service cards, footer links.
  const hoverTargets = {
    'nav-link': 'nav.navigation-wrapper a:not([class*="button"])',
    'nav-cta': 'nav.navigation-wrapper a[class*="button"], nav.navigation-wrapper .button',
    'hero-submit': '.hero input[type="submit"], .hero button, .hero .button',
  };
  out.hover = {};
  for (const [name, sel] of Object.entries(hoverTargets)) {
    const el = page.locator(sel).first();
    if (!(await el.count())) continue;
    const before = await el.evaluate((e) => { const c = getComputedStyle(e); return { color: c.color, bg: c.backgroundColor, tf: c.transform, td: c.textDecorationLine, op: c.opacity }; });
    await el.hover({ force: true }).catch(() => {});
    await page.waitForTimeout(500);
    const after = await el.evaluate((e) => { const c = getComputedStyle(e); return { color: c.color, bg: c.backgroundColor, tf: c.transform, td: c.textDecorationLine, op: c.opacity }; });
    out.hover[name] = { before, after };
    await shot(page, `hover-${name}`);
  }

  // Scroll through: nav state + case-study card hover + articles/services hover.
  out.navOnScroll = [];
  for (const y of [0, 400, 1200, 2400, 4000]) {
    await page.mouse.wheel(0, -1e6); await page.waitForTimeout(400);
    await wheelBy(page, y); await page.waitForTimeout(1200);
    out.navOnScroll.push({ y, ...(await page.evaluate(() => {
      const n = document.querySelector('nav.navigation-wrapper'); const c = getComputedStyle(n);
      const inner = [...n.querySelectorAll('*')].filter((e) => getComputedStyle(e).backgroundColor !== 'rgba(0, 0, 0, 0)').slice(0, 6).map((e) => ({ cls: (e.className?.baseVal ?? e.className).toString().slice(0, 80), bg: getComputedStyle(e).backgroundColor }));
      return { scrollY: Math.round(scrollY), pos: c.position, tf: c.transform, bg: c.backgroundColor, h: n.getBoundingClientRect().height, top: n.getBoundingClientRect().top, inner };
    })) });
  }
  await page.mouse.wheel(0, -1e6); await page.waitForTimeout(600);
  await wheelBy(page, 700); await page.waitForTimeout(1200);
  const card = page.locator('.u-section a').first();
  if (await card.count()) { await card.hover({ force: true }).catch(() => {}); await page.waitForTimeout(700); await shot(page, 'hover-case-card'); }
  await wheelBy(page, 1500); await page.waitForTimeout(1200);
  const article = page.locator('.u-section a[href*="research"], .u-section a[href*="blog"]').first();
  if (await article.count()) { await article.hover({ force: true }).catch(() => {}); await page.waitForTimeout(700); await shot(page, 'hover-article-card'); }
  await wheelBy(page, 900); await page.waitForTimeout(1500);
  await shot(page, 'services-before-hover');
  const plus = page.locator('.u-section [class*="service"] [class*="button"], .u-section [class*="service"] [class*="plus"], .u-section [class*="service"] [class*="icon"]').first();
  if (await plus.count()) { await plus.hover({ force: true }).catch(() => {}); await page.waitForTimeout(800); await shot(page, 'hover-service-card'); }
  out.servicesInfo = await page.evaluate(() => {
    const s = [...document.querySelectorAll('section')].find((x) => /OUR SERVICES/i.test(x.innerText));
    if (!s) return null;
    const cls = (el) => (el?.className?.baseVal ?? el?.className ?? '').toString().slice(0, 100);
    const swiper = s.querySelector('.swiper');
    return { swiper: swiper ? { cls: cls(swiper), params: swiper.swiper ? Object.fromEntries(Object.entries(swiper.swiper.params).filter(([, v]) => ['number', 'string', 'boolean'].includes(typeof v))) : null } : null,
      cards: [...s.querySelectorAll('[class*="card"]')].slice(0, 8).map((c) => ({ cls: cls(c), w: Math.round(c.getBoundingClientRect().width), h: Math.round(c.getBoundingClientRect().height), text: c.innerText.replace(/\s+/g, ' ').slice(0, 200) })) };
  });
  // Testimonials slider: click next.
  await wheelBy(page, 1000); await page.waitForTimeout(1200);
  out.testimonialSwiper = await page.evaluate(() => {
    const sw = [...document.querySelectorAll('.swiper')].map((s) => s.swiper && { cls: (s.className ?? '').toString().slice(0, 100), slides: s.swiper.slides.length, params: Object.fromEntries(Object.entries(s.swiper.params).filter(([, v]) => ['number', 'string', 'boolean'].includes(typeof v))) });
    return sw.filter(Boolean);
  });
  const next = page.locator('[class*="next"]').filter({ visible: true }).first();
  if (await next.count()) { await shot(page, 'testimonial-1'); await next.click({ force: true }).catch(() => {}); await page.waitForTimeout(1200); await shot(page, 'testimonial-2'); }
  // CTA rotating cylinder: sample transform over time.
  await wheelBy(page, 700); await page.waitForTimeout(1000);
  out.ctaCylinder = await page.evaluate(async () => {
    const s = [...document.querySelectorAll('section')].find((x) => /Rise above/i.test(x.innerText));
    if (!s) return null;
    const canv = s.querySelector('canvas'); const imgs = [...s.querySelectorAll('img')].length;
    const samples = [];
    const cls = (el) => (el?.className?.baseVal ?? el?.className ?? '').toString().slice(0, 100);
    const rot = [...s.querySelectorAll('*')].filter((e) => getComputedStyle(e).transform !== 'none').slice(0, 6);
    for (let i = 0; i < 4; i++) { samples.push(rot.map((e) => ({ cls: cls(e), tf: getComputedStyle(e).transform.slice(0, 120) }))); await new Promise((r) => setTimeout(r, 500)); }
    return { canvas: canv ? { w: canv.width, h: canv.height, cls: cls(canv) } : null, imgs, samples };
  });
  await shot(page, 'cta-cylinder');
  await wheelBy(page, 2000); await page.waitForTimeout(1500);
  await shot(page, 'footer');

  // Menu (hamburger) open.
  await page.mouse.wheel(0, -1e6); await page.waitForTimeout(800);
  const burger = page.locator('nav.navigation-wrapper [class*="menu"], nav.navigation-wrapper [class*="burger"], nav.navigation-wrapper [class*="hamburger"]').filter({ visible: true }).last();
  out.menu = { burgerFound: await burger.count() };
  if (await burger.count()) {
    out.menu.burgerCls = await burger.evaluate((e) => (e.className ?? '').toString());
    await burger.click({ force: true }).catch((e) => (out.menu.clickError = String(e)));
    for (const t of [100, 300, 700]) { await page.waitForTimeout(t === 100 ? 100 : t - 100); await shot(page, `menu-open-${t}ms`); }
    out.menu.open = await page.evaluate(() => {
      const cls = (el) => (el?.className?.baseVal ?? el?.className ?? '').toString().slice(0, 100);
      const panels = [...document.querySelectorAll('[class*="menu"], [class*="nav-panel"], [class*="dropdown"]')].filter((e) => { const r = e.getBoundingClientRect(); return r.width > 200 && r.height > 200 && getComputedStyle(e).visibility !== 'hidden' && getComputedStyle(e).opacity !== '0'; });
      return panels.slice(0, 4).map((p) => ({ cls: cls(p), box: (({ x, y, width, height }) => ({ x, y, width, height }))(p.getBoundingClientRect()), bg: getComputedStyle(p).backgroundColor, text: p.innerText.replace(/\s+/g, ' ').slice(0, 500), links: [...p.querySelectorAll('a')].map((a) => a.innerText.trim()).filter(Boolean).slice(0, 30) }));
    });
    await page.keyboard.press('Escape'); await page.waitForTimeout(600);
  }
  // Theme toggle.
  const toggle = page.locator('nav.navigation-wrapper [class*="theme"], nav.navigation-wrapper [class*="toggle"], nav.navigation-wrapper [class*="dark"]').filter({ visible: true }).first();
  if (await toggle.count()) {
    await page.mouse.move(5, 5);
    await toggle.click({ force: true }).catch(() => {});
    await page.waitForTimeout(1200);
    await shot(page, 'theme-dark');
    out.darkTheme = await page.evaluate(() => ({ htmlCls: document.documentElement.className.slice(0, 200), bodyBg: getComputedStyle(document.body).backgroundColor, color: getComputedStyle(document.body).color, h1: getComputedStyle(document.querySelector('h1')).color }));
    await toggle.click({ force: true }).catch(() => {});
  }
});

// ---------- Mobile ----------
await session('mobile-390', { width: 390, height: 844 }, async (page) => {
  await page.waitForTimeout(3500);
  await shot(page, 'mobile-top');
  const burger = page.locator('nav.navigation-wrapper [class*="menu"], nav.navigation-wrapper [class*="burger"], nav.navigation-wrapper [class*="hamburger"]').filter({ visible: true }).last();
  if (await burger.count()) {
    await burger.click({ force: true }).catch(() => {});
    await page.waitForTimeout(900);
    await shot(page, 'mobile-menu-open');
    out.mobileMenu = await page.evaluate(() => [...document.querySelectorAll('a')].filter((a) => { const r = a.getBoundingClientRect(); return r.height > 0 && r.top >= 0 && r.top < innerHeight && getComputedStyle(a).visibility !== 'hidden'; }).map((a) => a.innerText.trim()).filter(Boolean).slice(0, 40));
    await page.keyboard.press('Escape');
    await burger.click({ force: true }).catch(() => {});
    await page.waitForTimeout(800);
  }
  for (let i = 0; i < 9; i++) { await page.mouse.wheel(0, 844); await page.waitForTimeout(900); }
  await page.mouse.wheel(0, -1e6); await page.waitForTimeout(800);
});

fs.rmSync('analysis/recordings/tmp', { recursive: true, force: true });
fs.writeFileSync('analysis/measurements/animations.json', JSON.stringify(out, null, 2));
console.log(JSON.stringify({ gsap: out.config?.gsapVersion, triggers: out.config?.triggerCount, lenis: out.config?.lenis, mq: out.config?.mediaQueries, split: [out.config?.splitTypeChars, out.config?.splitTypeWords, out.config?.splitTypeLines], menu: out.menu, mobileMenu: out.mobileMenu, hover: out.hover, dark: out.darkTheme, swipers: out.testimonialSwiper, services: out.servicesInfo?.swiper, cyl: out.ctaCylinder && { canvas: out.ctaCylinder.canvas, imgs: out.ctaCylinder.imgs } }, null, 1));
await browser.close();
