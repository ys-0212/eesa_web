// Generates the original placeholder artwork in public/media/. Every file is an original SVG
// made for this project and sized to the aspect ratio of the slot it fills on the reference page.
// Re-run with: node scripts/media/generate.mjs   (overwrites only the files listed below)
import fs from 'node:fs';
import path from 'node:path';

const OUT = 'public/media';
const C = {
  bg: '#f5f2f1', ink: '#06110e', accent: '#2b40eb', soft: '#9ab3eb', pink: '#f3b0e3', lime: '#cbc308',
  teal: '#0e4943', signal: '#ff4b19', violet: '#5046e4', panel: '#e2dfdc', olive: '#6b6a1c', rust: '#c2401b',
};
const write = (rel, svg) => {
  const file = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, svg.trim() + '\n');
};
const svg = (w, h, body, defs = '') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"><defs>${defs}</defs>${body}</svg>`;
const MONO = `font-family="'Space Mono','Courier New',monospace"`;
const SANS = `font-family="Figtree,Arial,Helvetica,sans-serif"`;
// Small deterministic PRNG so the artwork is stable between runs.
let seed = 7;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

// ---------- Hero ----------
write('hero/pin.svg', svg(172, 232, `
  <ellipse cx="86" cy="212" rx="58" ry="16" fill="${C.lime}"/>
  <ellipse cx="86" cy="212" rx="34" ry="9" fill="${C.ink}" opacity=".25"/>
  <path d="M86 8c-42 0-74 31-74 72 0 52 74 124 74 124s74-72 74-124C160 39 128 8 86 8z" fill="${C.soft}" stroke="${C.ink}" stroke-width="6"/>
  <circle cx="86" cy="80" r="40" fill="${C.bg}" stroke="${C.ink}" stroke-width="6"/>
  <circle cx="74" cy="76" r="7" fill="${C.ink}"/><circle cx="100" cy="76" r="7" fill="${C.ink}"/>
  <path d="M74 96q12 10 24 0" fill="none" stroke="${C.ink}" stroke-width="6" stroke-linecap="round"/>`));

const badgeGlyphs = [
  `<path d="M6 8l3 8 3-6 3 6 3-8" fill="none" stroke="#fff" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/>`,
  `<circle cx="12" cy="12" r="6.5" fill="none" stroke="#fff" stroke-width="2"/><path d="M6 10q6 3 12-1M9 6q4 6 3 12" fill="none" stroke="#fff" stroke-width="1.6"/>`,
  `<text x="12" y="16" text-anchor="middle" ${MONO} font-size="10" font-weight="700" fill="#fff">a.</text>`,
  `<g stroke="#fff" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14M7 7l10 10M17 7L7 17"/></g>`,
];
const badgeFills = [C.accent, C.ink, C.teal, C.signal];
badgeGlyphs.forEach((g, i) => write(`icons/badge-${i + 1}.svg`, svg(24, 24, `<rect width="24" height="24" rx="5" fill="${badgeFills[i]}"/>${g}`)));

// ---------- Case studies ----------
write('cases/case-1.svg', svg(1440, 1080, `
  <rect width="1440" height="1080" fill="#16302f"/>
  ${Array.from({ length: 4 }, (_, r) => Array.from({ length: 5 }, (_, c) => `<rect x="${40 + c * 284}" y="${40 + r * 258}" width="250" height="226" rx="10" fill="${['#1f4b49', '#24423f', '#2d5a52', '#1a3a3a'][(r + c) % 4]}" stroke="#e9dcc0" stroke-width="10"/>`).join('')).join('')}
  <path d="M-40 760C240 520 420 980 700 700s420-420 820-200" fill="none" stroke="${C.signal}" stroke-width="46" stroke-linecap="round" opacity=".9"/>
  <path d="M120 260c180-120 360 40 520-60s300-160 520 0" fill="none" stroke="${C.pink}" stroke-width="10" stroke-linecap="round"/>
  <circle cx="1120" cy="830" r="120" fill="#e9dcc0" opacity=".85"/>
  <circle cx="1120" cy="830" r="64" fill="#16302f"/>
  <rect width="1440" height="1080" fill="url(#g)" opacity=".18"/>`,
  `<linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient>`));

write('cases/case-2.svg', svg(1440, 1513, `
  <rect width="1440" height="1513" fill="${C.olive}"/>
  ${Array.from({ length: 14 }, (_, i) => `<path d="M0 ${i * 120 + 40}C360 ${i * 120 - 40} 1080 ${i * 120 + 140} 1440 ${i * 120 + 40}" fill="none" stroke="#8f8d2a" stroke-width="38" opacity=".55"/>`).join('')}
  <g transform="rotate(-24 760 760)">
    <rect x="430" y="210" width="640" height="1240" rx="96" fill="#1b1d1f"/>
    <rect x="456" y="236" width="588" height="1188" rx="76" fill="#eceeea"/>
    <rect x="650" y="262" width="200" height="46" rx="23" fill="#1b1d1f"/>
    <rect x="510" y="360" width="160" height="34" rx="8" fill="${C.ink}"/>
    <rect x="510" y="440" width="470" height="44" rx="6" fill="${C.ink}" opacity=".82"/>
    <rect x="510" y="500" width="360" height="44" rx="6" fill="${C.ink}" opacity=".82"/>
    <rect x="510" y="600" width="480" height="300" rx="14" fill="${C.teal}"/>
    <circle cx="750" cy="750" r="90" fill="${C.violet}"/>
    ${Array.from({ length: 6 }, (_, i) => `<rect x="510" y="${950 + i * 52}" width="${300 + ((i * 97) % 170)}" height="18" rx="9" fill="#9a9c98"/>`).join('')}
  </g>
  <rect width="1440" height="1513" fill="#000" opacity=".08"/>`));

// ---------- Articles ----------
const cursor = (x, y, fill, s = 1) => `<path transform="translate(${x} ${y}) scale(${s})" d="M0 0l110 38-46 18-22 52z" fill="${fill}"/>`;
write('articles/article-1.svg', svg(1800, 1200, `
  <rect width="1800" height="1200" fill="${C.lime}"/>
  ${cursor(250, 330, C.ink, 2.2)}
  <rect x="460" y="540" width="1500" height="460" rx="56" fill="${C.ink}"/>
  <text x="560" y="730" ${MONO} font-size="132" font-weight="700" fill="#fff">AI-ready content</text>
  <text x="560" y="900" ${MONO} font-size="132" font-weight="700" fill="#fff">checklist</text>`));
write('articles/article-2.svg', svg(1800, 1200, `
  <rect width="1800" height="1200" fill="${C.teal}"/>
  ${cursor(250, 330, C.pink, 2.2)}
  <rect x="460" y="540" width="1500" height="460" rx="56" fill="${C.pink}"/>
  <text x="560" y="730" ${MONO} font-size="132" font-weight="700" fill="${C.ink}">Ask before you</text>
  <text x="560" y="900" ${MONO} font-size="132" font-weight="700" fill="${C.ink}">sign a partner</text>`));
write('articles/article-3.svg', svg(1800, 1200, `
  <rect width="1800" height="1200" fill="${C.accent}"/>
  <path d="M-80 1060C400 760 1200 760 1880 1100" fill="none" stroke="${C.bg}" stroke-width="40"/>
  <path d="M-80 820C500 1120 1100 1160 1500 1240" fill="none" stroke="${C.bg}" stroke-width="40"/>
  <ellipse cx="1480" cy="1000" rx="270" ry="160" fill="${C.ink}" opacity=".45"/>
  <circle cx="1560" cy="140" r="250" fill="${C.pink}" stroke="${C.ink}" stroke-width="14"/>
  <path d="M1330 120q230 80 460-40M1440-80q60 220 260 420M1380 300q140-160 360-80" fill="none" stroke="${C.ink}" stroke-width="12"/>
  <text x="900" y="640" text-anchor="middle" ${SANS} font-size="170" font-style="italic" font-weight="800" fill="#fff">Shortlist ✕ Studio</text>`));
const avatar = (bg, fg, initials) => svg(900, 900, `<rect width="900" height="900" fill="${bg}"/><circle cx="450" cy="360" r="170" fill="${fg}"/><path d="M130 900c40-220 180-320 320-320s280 100 320 320z" fill="${fg}"/><text x="450" y="420" text-anchor="middle" ${SANS} font-size="150" font-weight="700" fill="${bg}">${initials}</text>`);
write('avatars/avatar-1.svg', avatar('#c9c5c2', '#5d5a58', 'RE'));
write('avatars/avatar-2.svg', avatar('#bdb8b4', '#3f3d3b', 'JO'));

// ---------- Services (13 cards, 636×848) ----------
const servicePalettes = [
  ['#98b0e7', '#1b1d1c'], ['#2a3de1', '#121a4a'], ['#0d4a42', '#0d1c18'], ['#c7bf08', '#3c3a06'], ['#f3b0e3', '#3a2236'],
  ['#ff4b19', '#2a0e05'], ['#5046e4', '#140f3d'], ['#0e4943', '#06110e'], ['#e2dfdc', '#2d2b29'], ['#2b40eb', '#06110e'],
  ['#cbc308', '#0e4943'], ['#9ab3eb', '#2b40eb'], ['#06110e', '#2b40eb'],
];
servicePalettes.forEach(([top, bottom], i) => {
  seed = 101 + i * 13;
  const shapes = [
    `<rect x="120" y="220" width="400" height="400" rx="60" fill="${C.rust}"/><path d="M200 300h70a120 120 0 0 1 0 240h-70zM330 300a120 120 0 0 1 0 240z" fill="${C.ink}"/>`,
    Array.from({ length: 6 }, (_, k) => { const a = (k / 6) * Math.PI * 2; return `<circle cx="${318 + Math.cos(a) * 140}" cy="${380 + Math.sin(a) * 140}" r="70" fill="${k < 3 ? '#c9c9d4' : 'none'}" stroke="#e8e8f0" stroke-width="6" stroke-dasharray="${k < 3 ? '0' : '18 14'}"/>`; }).join(''),
    `<rect x="80" y="120" width="520" height="380" fill="#f1efe9"/><rect x="250" y="400" width="300" height="80" fill="${C.lime}"/><rect x="150" y="560" width="340" height="80" fill="${C.rust}"/>${cursor(220, 360, '#e3a10b', .8)}`,
    Array.from({ length: 5 }, (_, k) => `<rect x="120" y="${130 + k * 120}" width="400" height="96" rx="22" fill="#fbfaf8" opacity="${1 - k * .12}"/><rect x="150" y="${160 + k * 120}" width="${120 + k * 40}" height="20" rx="10" fill="${C.ink}" opacity=".7"/>`).join(''),
  ][i % 4];
  write(`services/service-${String(i + 1).padStart(2, '0')}.svg`, svg(636, 848, `
    <rect width="636" height="848" fill="url(#s)"/>
    ${shapes}
    ${Array.from({ length: 3 }, () => `<circle cx="${Math.round(rnd() * 636)}" cy="${Math.round(rnd() * 500)}" r="${Math.round(8 + rnd() * 18)}" fill="#fff" opacity=".18"/>`).join('')}
    <rect y="560" width="636" height="288" fill="url(#f)"/>`,
    `<linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/></linearGradient>
     <linearGradient id="f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></linearGradient>`));
});

// ---------- Testimonial portraits (monogram, grayscale) ----------
['AL', 'MK', 'SR', 'DV', 'NB'].forEach((ini, i) => {
  const g = [130, 150, 115, 160, 140][i];
  write(`people/person-${i + 1}.svg`, svg(1440, 1440, `
    <rect width="1440" height="1440" fill="rgb(${g},${g},${g})"/>
    <circle cx="720" cy="560" r="250" fill="rgb(${g - 60},${g - 60},${g - 60})"/>
    <path d="M200 1440c60-380 280-560 520-560s460 180 520 560z" fill="rgb(${g - 80},${g - 80},${g - 80})"/>
    <text x="720" y="640" text-anchor="middle" ${SANS} font-size="220" font-weight="700" fill="rgb(${g + 40},${g + 40},${g + 40})">${ini}</text>`));
});

// ---------- Ring panels ----------
const ringArt = [
  [C.lime, `<path d="M80 340q60-200 160-120t140-120" fill="none" stroke="${C.ink}" stroke-width="10"/><text x="70" y="140" ${SANS} font-size="64" font-style="italic" font-weight="700" fill="${C.ink}">Fieldnotes</text>`],
  ['#b7c43a', `<rect x="170" y="40" width="300" height="420" rx="48" fill="#2b2f45"/><rect x="190" y="60" width="260" height="380" rx="36" fill="#d6e4e4"/><rect x="230" y="200" width="110" height="110" rx="24" fill="${C.teal}"/><circle cx="330" cy="200" r="22" fill="#e5392b"/>`],
  ['#c9b49a', `<rect x="160" y="80" width="200" height="300" fill="#f3ece4"/><rect x="250" y="80" width="110" height="160" fill="${C.ink}" opacity=".85"/>`],
  [C.pink, `<circle cx="300" cy="230" r="150" fill="${C.ink}"/><circle cx="300" cy="230" r="70" fill="${C.pink}"/>`],
  [C.accent, `<path d="M40 380L300 60l260 320z" fill="${C.soft}"/><circle cx="300" cy="300" r="60" fill="${C.bg}"/>`],
  [C.teal, `${Array.from({ length: 5 }, (_, k) => `<rect x="${60 + k * 100}" y="${120 + (k % 2) * 60}" width="70" height="220" rx="35" fill="${C.lime}" opacity="${.5 + k * .1}"/>`).join('')}`],
  ['#e9e4dc', `<rect x="80" y="140" width="440" height="240" rx="18" fill="#8a8d93"/><rect x="100" y="160" width="400" height="200" rx="8" fill="#1f2328"/><path d="M60 400h480" stroke="#6b6e72" stroke-width="20"/>`],
  [C.signal, `<circle cx="180" cy="230" r="90" fill="${C.bg}"/><circle cx="420" cy="230" r="90" fill="${C.ink}"/><path d="M180 230h240" stroke="${C.bg}" stroke-width="16"/>`],
];
ringArt.forEach(([bg, body], i) => write(`ring/panel-${i + 1}.svg`, svg(600, 460, `<rect width="600" height="460" fill="${bg}"/>${body}`)));

// ---------- Footer badges ----------
const shield = (top, label1, label2) => svg(453, 453, `
  <path d="M66 40h321v260l-160 120L66 300z" fill="#fff" stroke="${C.ink}" stroke-width="10" stroke-linejoin="round"/>
  <rect x="40" y="160" width="373" height="80" fill="${top}"/>
  <text x="226" y="214" text-anchor="middle" ${SANS} font-size="44" font-weight="800" fill="#fff">${label1}</text>
  <text x="226" y="300" text-anchor="middle" ${MONO} font-size="34" font-weight="700" fill="${C.ink}">${label2}</text>
  <circle cx="226" cy="100" r="26" fill="none" stroke="${top}" stroke-width="10"/>`);
write('badges/badge-1.svg', shield(C.accent, 'Certified', 'PARTNER'));
write('badges/badge-2.svg', shield(C.ink, 'Select', 'STUDIO'));

// ---------- Mascot (original character "Pip": a chartreuse blob with a pencil) ----------
write('mascot.svg', svg(105, 143, `
  <ellipse cx="52" cy="138" rx="34" ry="5" fill="${C.ink}" opacity=".18"/>
  <path d="M38 118l-6 18M66 118l6 18" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/>
  <path d="M52 14c28 0 46 24 46 56s-18 52-46 52S6 102 6 70 24 14 52 14z" fill="${C.lime}" stroke="${C.ink}" stroke-width="5"/>
  <circle cx="38" cy="58" r="11" fill="#fff" stroke="${C.ink}" stroke-width="4"/><circle cx="66" cy="58" r="11" fill="#fff" stroke="${C.ink}" stroke-width="4"/>
  <circle cx="41" cy="55" r="5" fill="${C.ink}"/><circle cx="69" cy="55" r="5" fill="${C.ink}"/>
  <path d="M42 84q10 8 20 0" fill="none" stroke="${C.ink}" stroke-width="4" stroke-linecap="round"/>
  <path d="M84 30l16-24 4 3-14 26z" fill="${C.signal}" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"/>`));

console.log('media written to', OUT);
