// Captures the clone's interaction states + recordings to sit next to the reference ones.
// Writes analysis/screenshots/local/interactions/*.png and analysis/recordings/local-*.webm
// Usage: node scripts/compare/local-interactions.mjs [url=http://localhost:3200/]
import { chromium } from 'playwright';
import fs from 'node:fs';

const url = process.argv[2] ?? 'http://localhost:3200/';
const dir = 'analysis/screenshots/local/interactions';
fs.mkdirSync(dir, { recursive: true });
fs.mkdirSync('analysis/recordings/tmp', { recursive: true });
const browser = await chromium.launch();

async function session(label, viewport, fn) {
  const ctx = await browser.newContext({ viewport, recordVideo: { dir: 'analysis/recordings/tmp', size: viewport } });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForTimeout(2500);
  await fn(page);
  const video = page.video();
  await ctx.close();
  fs.renameSync(await video.path(), `analysis/recordings/local-${label}.webm`);
}
const wheel = async (page, px) => { for (let s = 0; s < px; s += 100) { await page.mouse.wheel(0, 100); await page.waitForTimeout(30); } };

await session('desktop-1440', { width: 1440, height: 900 }, async (page) => {
  await page.mouse.move(1100, 620, { steps: 10 });
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${dir}/desktop-cursor.png` });
  await page.getByRole('link', { name: 'Get in touch' }).first().hover().catch(() => {});
  await page.getByRole('button', { name: 'Get in touch' }).hover();
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${dir}/hover-hero-submit.png` });
  await page.getByRole('button', { name: 'Open menu' }).click();
  for (const t of [100, 300, 700]) { await page.waitForTimeout(t === 100 ? 100 : t - (t === 300 ? 100 : 300)); await page.screenshot({ path: `${dir}/menu-open-${t}ms.png` }); }
  await page.keyboard.press('Escape');
  await page.waitForTimeout(700);
  await wheel(page, 700);
  await page.waitForTimeout(1000);
  await page.locator('#work a').first().hover();
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${dir}/hover-case-card.png` });
  await wheel(page, 2300);
  await page.waitForTimeout(1200);
  await page.locator('#services li a').first().hover();
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${dir}/hover-service-card.png` });
  await wheel(page, 1000);
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${dir}/testimonial-1.png` });
  await page.getByRole('button', { name: 'Next testimonial' }).click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${dir}/testimonial-2.png` });
  await wheel(page, 700);
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${dir}/cta-ring.png` });
  await page.mouse.move(5, 5);
  await page.getByRole('button', { name: 'Toggle dark mode' }).click();
  await wheel(page, 2000);
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${dir}/theme-dark.png` });
  await page.getByRole('button', { name: 'Toggle dark mode' }).click();
});

await session('mobile-390', { width: 390, height: 844 }, async (page) => {
  await page.screenshot({ path: `${dir}/mobile-top.png` });
  await page.getByRole('button', { name: 'Open menu' }).click();
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${dir}/mobile-menu-open.png` });
  await page.getByRole('button', { name: 'Close menu' }).click();
  await page.waitForTimeout(800);
  for (let i = 0; i < 9; i++) { await page.mouse.wheel(0, 844); await page.waitForTimeout(900); }
});

fs.rmSync('analysis/recordings/tmp', { recursive: true, force: true });
await browser.close();
console.log('local interaction captures written');
