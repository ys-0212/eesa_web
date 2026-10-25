// Shared screenshot routine used for both the reference site and the local clone, so the
// two sets are captured identically and can be pixel-diffed.
// Usage: node scripts/shared/capture.mjs <url> <outDir> [widths=1440,1024,768,390]
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

export const VIEWPORTS = { 1440: 900, 1024: 768, 768: 1024, 390: 844 };
const HIDE_CSS = `.cky-consent-container,.cky-overlay,.cky-modal,.cky-btn-revisit-wrapper,.grecaptcha-badge{display:none!important}`;

export async function capture(url, outDir, widths = Object.keys(VIEWPORTS).map(Number)) {
  const browser = await chromium.launch();
  const report = {};
  for (const width of widths) {
    const height = VIEWPORTS[width];
    const dir = path.join(outDir, String(width));
    fs.mkdirSync(dir, { recursive: true });
    const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1, reducedMotion: 'no-preference' });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    await page.goto(url, { waitUntil: 'load', timeout: 90000 });
    await page.addStyleTag({ content: HIDE_CSS });
    await page.mouse.move(width - 5, 5);
    await page.waitForTimeout(4500); // let the load-in animation finish
    await page.screenshot({ path: path.join(dir, 'scroll-00.png') });

    // Step through the page one viewport at a time with real wheel input (drives Lenis/ScrollTrigger).
    const shots = [{ i: 0, y: 0 }];
    let i = 1;
    for (;;) {
      const before = await page.evaluate(() => window.scrollY);
      // Smooth-scroll libraries clamp per-event deltas, so feed small wheel ticks until one viewport is covered.
      let sent = 0;
      while (sent < height) {
        const d = Math.min(100, height - sent);
        await page.mouse.wheel(0, d);
        sent += d;
        await page.waitForTimeout(40);
      }
      await page.waitForTimeout(1400);
      const y = await page.evaluate(() => window.scrollY);
      if (y <= before + 2) break;
      await page.screenshot({ path: path.join(dir, `scroll-${String(i).padStart(2, '0')}.png`) });
      shots.push({ i, y: Math.round(y) });
      i += 1;
      if (i > 40) break;
    }
    // Back to top, then full-page capture with every reveal already triggered.
    await page.mouse.wheel(0, -1e6);
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(dir, 'full.png'), fullPage: true });
    report[width] = { height, shots, docHeight: await page.evaluate(() => document.documentElement.scrollHeight), errors };
    await context.close();
    console.log(`${width}: ${shots.length} scroll shots, doc ${report[width].docHeight}px, ${errors.length} page errors`);
  }
  fs.writeFileSync(path.join(outDir, 'capture.json'), JSON.stringify(report, null, 2));
  await browser.close();
  return report;
}

if (process.argv[1] && import.meta.url.endsWith(path.basename(process.argv[1]))) {
  const [url, outDir, widths] = process.argv.slice(2);
  await capture(url, outDir, widths ? widths.split(',').map(Number) : undefined);
}
