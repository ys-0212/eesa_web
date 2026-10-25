// Connects to the CDP browser launched for REA and (re)navigates its page target.
// Usage: node scripts/recon/cdp-nav.mjs [url] [width] [height]
import { chromium } from 'playwright';

const url = process.argv[2] ?? 'https://www.greaterstudio.com/';
const width = Number(process.argv[3] ?? 1440);
const height = Number(process.argv[4] ?? 900);

const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
const context = browser.contexts()[0];
let page = context.pages().find((p) => p.url() === '' || p.url().includes('greaterstudio')) ?? context.pages()[0];
if (!page) page = await context.newPage();
await page.setViewportSize({ width, height });
const res = await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 }).catch((e) => ({ error: String(e) }));
console.log(JSON.stringify({ status: res?.status?.() ?? res, url: page.url(), title: await page.title() }));
// Leave the page open for REA; only drop the Playwright connection.
await browser.close().catch(() => {});
