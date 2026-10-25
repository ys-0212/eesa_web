// Condenses analysis/measurements/structure-<w>.json into a readable token summary
// (analysis/measurements/tokens-summary.json) used to write SPEC.md.
import fs from 'node:fs';

const summary = {};
for (const w of [1440, 1024, 768, 390]) {
  const d = JSON.parse(fs.readFileSync(`analysis/measurements/structure-${w}.json`, 'utf8'));
  const t = (s) => s && `${s['font-family'].split(',')[0]} ${s['font-size']}/${s['line-height']} w${s['font-weight']} ls${s['letter-spacing']} ${s['text-transform']} ${s.color}`;
  summary[w] = {
    doc: d.docHeight,
    body: t(d.body) + ' bg ' + d.body['background-color'],
    nav: d.nav && { box: d.nav.box, links: d.nav.links.map((l) => `${l.text}|${l.box.x},${l.box.y} ${l.box.w}x${l.box.h}|${t(l.style)}|bg ${l.style['background-color']} pad ${l.style['padding-top']} ${l.style['padding-left']} r${l.style['border-radius']}`) },
    sections: d.sections.map((s) => ({
      cls: s.cls, box: s.box, pad: `${s.style['padding-top']} ${s.style['padding-right']} ${s.style['padding-bottom']} ${s.style['padding-left']}`, bg: s.style['background-color'],
      headings: s.headings.map((h) => `${h.tag} "${h.text.slice(0, 40)}" ${h.box.x},${h.box.y} ${h.box.w}x${h.box.h} :: ${t(h.style)}`),
      paras: s.paras.slice(0, 6).map((p) => `"${p.text.slice(0, 40)}" ${p.box.x},${p.box.y} ${p.box.w}x${p.box.h} :: ${t(p.style)}`),
      links: s.links.slice(0, 12).map((l) => `${l.tag} "${l.text.slice(0, 30)}" ${l.box.x},${l.box.y} ${l.box.w}x${l.box.h} :: ${t(l.style)} bg ${l.style['background-color']} r${l.style['border-radius']}`),
      media: s.media.filter((m) => m.tag !== 'svg' || (m.box && m.box.w > 40)).slice(0, 14).map((m) => `${m.tag}.${m.cls.slice(0, 40)} ${m.box ? `${m.box.x},${m.box.y} ${m.box.w}x${m.box.h}` : ''} fit ${m.style['object-fit']} r${m.style['border-radius']} ${m.natural ?? ''} ${m.attrs ? JSON.stringify(m.attrs).slice(0, 120) : ''} ${(m.src ?? '').slice(-60)}`),
    })),
  };
}
const d1440 = JSON.parse(fs.readFileSync('analysis/measurements/structure-1440.json', 'utf8'));
summary.rootVars = d1440.rootVars;
summary.cursor = d1440.cursor;
summary.scrollThumb = d1440.scrollThumb;
fs.writeFileSync('analysis/measurements/tokens-summary.json', JSON.stringify(summary, null, 1));
console.log(JSON.stringify(summary[1440], null, 1).slice(0, 26000));
