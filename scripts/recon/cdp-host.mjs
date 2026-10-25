// Long-lived host: launches the existing Playwright Chromium with a loopback CDP port so
// REA (list_browser_targets / inspect_web_page / analyze_web_bundle) can attach to it.
// Usage: node scripts/recon/cdp-host.mjs [url] [width] [height]
import { chromium } from 'playwright';

const url = process.argv[2] ?? 'https://www.greaterstudio.com/';
const width = Number(process.argv[3] ?? 1440);
const height = Number(process.argv[4] ?? 900);

const browser = await chromium.launch({
  headless: true,
  args: ['--remote-debugging-port=9333', '--remote-debugging-address=127.0.0.1'],
});
const context = await browser.newContext({ viewport: { width, height } });
const page = await context.newPage();
page.on('console', (m) => console.log(`[console.${m.type()}] ${m.text()}`));
const res = await page.goto(url, { waitUntil: 'load', timeout: 90000 });
await page.waitForTimeout(4000);
console.log(`READY status=${res?.status()} url=${page.url()} title=${await page.title()}`);

process.on('SIGINT', async () => { await browser.close(); process.exit(0); });
setInterval(() => {}, 1 << 30);
