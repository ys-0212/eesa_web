// Pixel-diffs analysis/screenshots/reference vs analysis/screenshots/local (same widths, same scroll
// step index, plus full-page cropped to the shorter height). Writes analysis/comparisons/<w>/*.png
// and analysis/comparisons/summary.json.
// Usage: node scripts/compare/diff.mjs [widths=1440,1024,768,390]
import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const REF = 'analysis/screenshots/reference';
const LOC = 'analysis/screenshots/local';
const OUT = 'analysis/comparisons';
const widths = (process.argv[2] ?? '1440,1024,768,390').split(',');

const crop = (img, w, h) => {
  if (img.width === w && img.height === h) return img;
  const out = new PNG({ width: w, height: h });
  PNG.bitblt(img, out, 0, 0, w, h, 0, 0);
  return out;
};

const summary = {};
for (const w of widths) {
  const refDir = path.join(REF, w);
  const locDir = path.join(LOC, w);
  if (!fs.existsSync(refDir) || !fs.existsSync(locDir)) continue;
  fs.mkdirSync(path.join(OUT, w), { recursive: true });
  const files = fs.readdirSync(refDir).filter((f) => f.endsWith('.png') && fs.existsSync(path.join(locDir, f)));
  summary[w] = {};
  for (const f of files) {
    const a = PNG.sync.read(fs.readFileSync(path.join(refDir, f)));
    const b = PNG.sync.read(fs.readFileSync(path.join(locDir, f)));
    const width = Math.min(a.width, b.width);
    const height = Math.min(a.height, b.height);
    const ra = crop(a, width, height);
    const rb = crop(b, width, height);
    const diff = new PNG({ width, height });
    const n = pixelmatch(ra.data, rb.data, diff.data, width, height, { threshold: 0.15, includeAA: false, alpha: 0.35 });
    fs.writeFileSync(path.join(OUT, w, f.replace('.png', '-diff.png')), PNG.sync.write(diff));
    summary[w][f] = {
      mismatchPct: +((n / (width * height)) * 100).toFixed(2),
      refSize: [a.width, a.height],
      localSize: [b.width, b.height],
    };
  }
  const vals = Object.entries(summary[w]).filter(([k]) => k !== 'full.png').map(([, v]) => v.mismatchPct);
  summary[w]._meanViewportMismatchPct = vals.length ? +(vals.reduce((s, v) => s + v, 0) / vals.length).toFixed(2) : null;
  console.log(`${w}: mean viewport mismatch ${summary[w]._meanViewportMismatchPct}% | full ${summary[w]['full.png']?.mismatchPct}% (ref ${summary[w]['full.png']?.refSize?.[1]}px vs local ${summary[w]['full.png']?.localSize?.[1]}px)`);
}
fs.writeFileSync(path.join(OUT, 'summary.json'), JSON.stringify(summary, null, 2));
