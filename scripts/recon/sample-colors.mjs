// Samples pixel colours at known coordinates of the 1440 reference screenshots.
import fs from 'node:fs';
import { PNG } from 'pngjs';

const read = (p) => PNG.sync.read(fs.readFileSync(p));
const hex = (img, x, y) => {
  const i = (img.width * y + x) << 2;
  return '#' + [img.data[i], img.data[i + 1], img.data[i + 2]].map((v) => v.toString(16).padStart(2, '0')).join('');
};
const base = 'analysis/screenshots/reference/1440/';
const s0 = read(base + 'scroll-00.png');
const s2 = read(base + 'scroll-02.png');
const s3 = read(base + 'scroll-03.png');
const s4 = read(base + 'scroll-04.png');
const i = 'analysis/screenshots/reference/interactions/';
const cur = read(i + 'desktop-cursor.png');
const menu = read(i + 'menu-open-700ms.png');
const out = {
  pageBg: hex(s0, 50, 500),
  ctaBlue: hex(s0, 1100, 60),
  pillPink: hex(s0, 200, 800),
  collabTagYellow: hex(s0, 225, 360),
  selectionOutline: hex(s0, 413, 340),
  inputBorder: hex(s0, 429, 660),
  submitBlue: hex(s0, 845, 650),
  articleYellow: hex(s2, 160, 260),
  articleTeal: hex(s2, 545, 260),
  articleBlue: hex(s2, 935, 440),
  articlePink: hex(s2, 700, 400),
  articleTagBg: hex(s2, 150, 480),
  subscribeBtn: hex(s2, 1200, 115),
  serviceCard1Top: hex(s3, 150, 430),
  serviceCard2: hex(s3, 545, 440),
  serviceCard3: hex(s3, 935, 860),
  serviceCard4: hex(s3, 1325, 430),
  plusBtn: hex(s3, 445, 845),
  arrowPrev: hex(s4, 1215, 185),
  arrowNext: hex(s4, 1262, 185),
  brandChip: hex(s4, 170, 500),
  cursorOrange: hex(cur, 1130, 630),
  menuRightBg: hex(menu, 1100, 150),
  menuLeftCard: hex(menu, 100, 150),
  menuBackdrop: hex(menu, 950, 5),
  eyebrowBlue: null,
};
fs.writeFileSync('analysis/measurements/colors.json', JSON.stringify(out, null, 2));
console.log(out);
