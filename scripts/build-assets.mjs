// Generates the static, animated SVG cards in /assets.
// Run: node scripts/build-assets.mjs
import { mkdirSync, writeFileSync } from 'node:fs';
import {
  C, monoW, esc, r1, mono, sans, svgDoc, frame,
  animate, translateX, windowOpacity,
} from './theme.mjs';

const OUT = new URL('../assets/', import.meta.url);
mkdirSync(OUT, { recursive: true });
const save = (name, svg) => {
  writeFileSync(new URL(name, OUT), svg);
  console.log(`assets/${name}  ${(svg.length / 1024).toFixed(1)} KB`);
};
const pct = (t, P) => `${+((t / P) * 100).toFixed(3)}%`;

// ============================================================================
// HERO
// ============================================================================
function hero() {
  const W = 1200, H = 420;
  const f = frame({ w: W, h: H, glow: { x: 950, y: 210, r: 360 } });

  // ---- typed command line ----
  const phrases = [
    'shipping React Native apps to iOS & Android',
    'TypeScript from the UI down to the API',
    'debugging across app and backend boundaries',
    'replaying game inputs per physics step',
    'building tools with AI coding agents',
  ];
  const bar = { x: 64, y: 270, w: 580, h: 50 };
  const FS = 18, x0 = 108, base = bar.y + 31;
  const SEG = 5.2, P = SEG * phrases.length;
  let css = '';
  let typed = '';
  phrases.forEach((p, i) => {
    const n = p.length, L = monoW(p, FS);
    const t0 = i * SEG, tType = t0 + n * 0.045, tHold = t0 + SEG - 1.0, tErase = tHold + 0.45;
    css += `
@keyframes c${i}{0%,${pct(t0, P)}{transform:translateX(0);animation-timing-function:steps(${n},end)}${pct(tType, P)},${pct(tHold, P)}{transform:translateX(${L}px);animation-timing-function:steps(${n},end)}${pct(tErase, P)},100%{transform:translateX(0)}}
@keyframes g${i}{0%{opacity:${i === 0 ? 1 : 0}}${i === 0 ? '' : `${pct(t0, P)}{opacity:1}`}${pct(t0 + SEG, P)},100%{opacity:0}}
.g${i}{opacity:${i === 0 ? 1 : 0};animation:g${i} ${P}s steps(1,end) infinite}
.c${i}{transform:translateX(${i === 0 ? L : 0}px);animation:c${i} ${P}s linear infinite}`;
    typed += `
<g class="g${i}">
  ${mono(x0, base, p, FS, `fill="${C.text}"`)}
  <g class="c${i}">
    <rect x="${x0 - 1}" y="${bar.y + 5}" width="${L + 24}" height="${bar.h - 10}" fill="${C.field}"/>
    <rect class="blink" x="${x0 + 1}" y="${bar.y + 14}" width="10" height="22" rx="1.5" fill="${C.cyan}"/>
  </g>
</g>`;
  });

  // ---- chips ----
  const chips = ['React Native', 'TypeScript', 'Expo', 'React', 'Node.js'];
  let cx = 64, chipSvg = '';
  for (const c of chips) {
    const w = monoW(c, 16) + 28;
    chipSvg += `<rect x="${cx}" y="344" width="${w}" height="36" rx="18" fill="${C.cyan}" fill-opacity=".06" stroke="${C.cyan}" stroke-opacity=".38"/>
${mono(cx + 14, 367, c, 16, `fill="${C.cyanLite}"`)}`;
    cx += w + 10;
  }

  // ---- architecture diagram (right) ----
  const bx = 776, bw = 364;
  const rows = [52, 142, 232, 322], bh = 50;
  const clientW = (bw - 24) / 3;
  const clients = ['iOS', 'Android', 'Web'].map((name, i) => ({ name, x: bx + i * (clientW + 12), cx: bx + i * (clientW + 12) + clientW / 2 }));
  const layers = [
    { label: 'client' },
    { label: 'app', text: 'React Native · Expo · TypeScript' },
    { label: 'api', text: 'Node.js services · REST APIs' },
    { label: 'data', text: 'SQL · MongoDB · Prisma' },
  ];
  const DOWN = bx + bw / 2 - 10, UP = bx + bw / 2 + 10;

  let diag = '';
  layers.forEach((l, i) => {
    diag += `<text class="m" x="${bx - 18}" y="${rows[i] + 31}" font-size="14" fill="${C.mute}" text-anchor="end">${l.label}</text>`;
  });
  // connectors
  for (const c of clients) diag += `<line x1="${c.cx}" y1="${rows[0] + bh}" x2="${c.cx}" y2="${rows[1]}" class="wire"/>`;
  for (const k of [1, 2]) {
    diag += `<line x1="${DOWN}" y1="${rows[k] + bh}" x2="${DOWN}" y2="${rows[k + 1]}" class="wire"/>`;
    diag += `<line x1="${UP}" y1="${rows[k] + bh}" x2="${UP}" y2="${rows[k + 1]}" class="wire"/>`;
  }
  // boxes + flash overlays
  const box = (x, y, w, cls) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${bh}" rx="10" fill="${C.panel}" stroke="${C.line2}"/>
<rect class="${cls}" x="${x}" y="${y}" width="${w}" height="${bh}" rx="10" fill="${C.cyan}" fill-opacity=".07" stroke="${C.cyan}" stroke-opacity=".9"/>`;
  clients.forEach((c, i) => {
    diag += box(c.x, rows[0], clientW, `fl cl${i}`);
    const icon = c.name === 'Web'
      ? `<rect x="${c.cx - 32}" y="${rows[0] + 17}" width="18" height="13" rx="2" fill="none" stroke="${C.sub}" stroke-width="1.6"/><path d="M${c.cx - 27} ${rows[0] + 34} h8" stroke="${C.sub}" stroke-width="1.6" stroke-linecap="round"/>`
      : `<rect x="${c.cx - (c.name === 'iOS' ? 22 : 38)}" y="${rows[0] + 15}" width="12" height="20" rx="3" fill="none" stroke="${C.sub}" stroke-width="1.6"/>`;
    const tx = c.name === 'iOS' ? c.cx - 4 : c.name === 'Android' ? c.cx - 20 : c.cx - 8;
    diag += icon + sans(tx, rows[0] + 31, c.name, 17, `fill="${C.text}" font-weight="600"`);
  });
  layers.slice(1).forEach((l, i) => {
    diag += box(bx, rows[i + 1], bw, `fl r${i + 1}`);
    diag += sans(bx + bw / 2, rows[i + 1] + 31, l.text, 17, `fill="${C.text}" font-weight="600" text-anchor="middle"`);
  });

  // packets. Shared rows run on a 2 s cycle; each client fires every 6 s, offset by 2 s.
  const RP = 2, CP = 6;
  const hop = (name, P, t0, t1, yFrom, yTo) => `
@keyframes ${name}{0%,${pct(t0, P)}{transform:translateY(${yFrom}px);opacity:0;animation-timing-function:ease-in-out}${pct(t0 + 0.03, P)}{opacity:1}${pct(t1 - 0.03, P)}{opacity:1}${pct(t1, P)},100%{transform:translateY(${yTo}px);opacity:0}}`;
  const flash = (name, P, times) => {
    const ks = times.map((t) => `${pct(Math.max(0, t - 0.02), P)}{opacity:0}${pct(t, P)}{opacity:1}${pct(Math.min(P, t + 0.45), P)}{opacity:0}`).join('');
    return `@keyframes ${name}{0%{opacity:0}${ks}100%{opacity:0}}`;
  };
  const PH = 14;
  const gapY = (k) => [rows[k] + bh, rows[k + 1] - PH];
  css += hop('h1', CP, 0, 0.3, ...gapY(0));
  css += hop('h2', RP, 0.35, 0.65, ...gapY(1));
  css += hop('h3', RP, 0.7, 1.0, ...gapY(2));
  css += hop('h4', RP, 1.15, 1.45, gapY(2)[1], gapY(2)[0]);
  css += hop('h5', RP, 1.5, 1.8, gapY(1)[1], gapY(1)[0]);
  css += hop('h6', CP, 1.85, 2.15, gapY(0)[1], gapY(0)[0]);
  css += flash('fr1', RP, [0.3, 1.8]) + flash('fr2', RP, [0.65, 1.45]) + flash('fr3', RP, [1.0]) + flash('fcl', CP, [2.15]);
  css += `
.wire{stroke:${C.line2};stroke-width:2;stroke-dasharray:3 5}
.fl{opacity:0}
.r1{animation:fr1 ${RP}s linear infinite}.r2{animation:fr2 ${RP}s linear infinite}.r3{animation:fr3 ${RP}s linear infinite}
.cl0,.cl1,.cl2{animation:fcl ${CP}s linear infinite both}.cl1{animation-delay:2s}.cl2{animation-delay:4s}
.pk{opacity:0}
.q1{animation:h1 ${CP}s linear infinite both}.q6{animation:h6 ${CP}s linear infinite both}
.q2{animation:h2 ${RP}s linear infinite both}.q3{animation:h3 ${RP}s linear infinite both}.q4{animation:h4 ${RP}s linear infinite both}.q5{animation:h5 ${RP}s linear infinite both}
.d1{animation-delay:2s}.d2{animation-delay:4s}
.blink{animation:blink 1.05s steps(1,end) infinite}
@keyframes blink{0%{opacity:1}50%{opacity:0}}
.glow{animation:breathe 7s ease-in-out infinite}
@keyframes breathe{0%,100%{opacity:.75}50%{opacity:1}}`;
  const pkt = (x, cls, color) => `<rect class="pk ${cls}" x="${x - 3}" y="0" width="6" height="${PH}" rx="3" fill="${color}"/>`;
  clients.forEach((c, i) => {
    diag += pkt(c.cx, `q1${i ? ` d${i}` : ''}`, C.cyan);
    diag += pkt(c.cx, `q6${i ? ` d${i}` : ''}`, C.blue);
  });
  diag += pkt(DOWN, 'q2', C.cyan) + pkt(DOWN, 'q3', C.cyan) + pkt(UP, 'q4', C.blue) + pkt(UP, 'q5', C.blue);

  const pin = `<path d="M70 236 c-6 0 -10 4.4 -10 9.6 c0 7 10 16.4 10 16.4 s10 -9.4 10 -16.4 c0 -5.2 -4 -9.6 -10 -9.6z" transform="translate(0 -13)" fill="none" stroke="${C.mute}" stroke-width="1.8"/><circle cx="70" cy="232.5" r="3" fill="${C.mute}"/>`;

  const body = `${f.body}
<rect x="64" y="72" width="3" height="20" fill="${C.cyan}"/>
<text class="m" x="80" y="88" font-size="16" fill="${C.cyan}" letter-spacing="3.2">SENIOR FULL-STACK DEVELOPER</text>
<text class="s" x="60" y="166" font-size="74" font-weight="700" fill="url(#name)" letter-spacing="-1">George Dvořák</text>
${sans(64, 207, 'Cross-platform mobile, web & backend engineering', 24, `fill="${C.sub}"`)}
${pin}
${sans(88, 251, 'Prague, Czech Republic', 19, `fill="${C.mute}"`)}
<rect x="${bar.x}" y="${bar.y}" width="${bar.w}" height="${bar.h}" rx="12" fill="${C.field}" stroke="${C.line2}"/>
${mono(84, base, '$', FS, `fill="${C.cyan}"`)}
<g clip-path="url(#typeclip)">${typed}
</g>
${chipSvg}
${diag}`;

  const defs = `${f.defs}
<linearGradient id="name" x1="0" x2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#c7f4fd"/></linearGradient>
<clipPath id="typeclip"><rect x="${x0 - 2}" y="${bar.y + 2}" width="${bar.x + bar.w - x0 - 4}" height="${bar.h - 4}"/></clipPath>`;

  return svgDoc({
    w: W, h: H,
    title: 'George Dvořák — Senior Full-Stack Developer',
    desc: 'Cross-platform mobile, web and backend engineering. React Native, TypeScript, Expo, React and Node.js. Prague, Czech Republic.',
    style: css, defs, body,
  });
}

// ============================================================================
// STACK
// ============================================================================
function stack() {
  const W = 1200;
  const core = [
    { name: 'TypeScript', cap: 'primary language', icon: 'ts' },
    { name: 'React Native', cap: 'iOS + Android apps', icon: 'rn' },
    { name: 'Expo', cap: 'SDK · Router · media', icon: 'expo' },
    { name: 'React', cap: 'component systems', icon: 'react' },
    { name: 'Node.js', cap: 'services · REST APIs', icon: 'node' },
  ];
  const groups = [
    { label: 'MOBILE', items: ['Expo Router', 'Reanimated', 'Skia', 'react-native-svg', 'Expo Image', 'Expo Video', 'Hermes', 'iOS', 'Android'] },
    { label: 'WEB', items: ['Next.js', 'JavaScript', 'HTML / CSS', 'Zustand', 'React Context', 'SWR'] },
    { label: 'BACKEND & DATA', items: ['Fastify', 'REST APIs', 'SQL', 'MongoDB', 'Prisma', 'Drizzle ORM', 'SQLite'] },
    { label: 'TOOLING', items: ['Git', 'GitHub', 'Linux', 'Docker', 'Cypress'] },
    { label: 'PERSONAL PROJECTS', note: 'explored outside work', dashed: true, items: ['C#', 'CounterStrikeSharp', 'Electron', 'Discord.js', 'Playwright', 'Unreal Engine', 'Blender'] },
  ];

  const tileW = (1104 - 4 * 16) / 5, tileH = 150, tileY = 118;
  let tiles = '', clips = '', css = '';
  core.forEach((t, i) => {
    const x = 48 + i * (tileW + 16);
    clips += `<clipPath id="tile${i}"><rect x="${x}" y="${tileY}" width="${tileW}" height="${tileH}" rx="14"/></clipPath>`;
    tiles += `<rect x="${x}" y="${tileY}" width="${tileW}" height="${tileH}" rx="14" fill="${C.panel}" stroke="${C.line2}"/>
<g clip-path="url(#tile${i})"><rect class="sheen sh${i}" x="${x - 160}" y="${tileY - 20}" width="120" height="${tileH + 40}" fill="url(#sheen)" transform="skewX(-18)"/></g>
<rect x="${x + 22}" y="${tileY + 22}" width="48" height="48" rx="11" fill="${C.cyan}" fill-opacity=".07" stroke="${C.cyan}" stroke-opacity=".28"/>
${icon(t.icon, x + 46, tileY + 46)}
${sans(x + 22, tileY + 104, t.name, 23, `fill="${C.text}" font-weight="650"`)}
${mono(x + 22, tileY + 131, t.cap, 14, `fill="${C.mute}"`)}`;
    css += `.sh${i}{animation-delay:${(i * 0.18).toFixed(2)}s}`;
  });
  css += `
.sheen{animation:sheen 9s ease-in-out infinite both}
@keyframes sheen{0%{transform:skewX(-18deg) translateX(0)}22%,100%{transform:skewX(-18deg) translateX(${tileW + 260}px)}}`;

  // chip rows
  const left = 48, chipX = 300, chipMax = 1152, fs = 16, ch = 34, gap = 10, lineH = 46;
  let y = 322, rowsSvg = '';
  groups.forEach((g, gi) => {
    if (g.dashed) {
      y += 10;
      rowsSvg += `<line x1="${left}" y1="${y - 22}" x2="${W - 48}" y2="${y - 22}" stroke="${C.line}" stroke-dasharray="2 6"/>`;
      y += 8;
    }
    rowsSvg += `<text class="m" x="${left}" y="${y + 22}" font-size="14" fill="${g.dashed ? C.sub : C.mute}" letter-spacing="2.4">${esc(g.label)}</text>`;
    if (g.note) rowsSvg += `<text class="m" x="${left}" y="${y + 44}" font-size="13" fill="${C.mute}">// ${esc(g.note)}</text>`;
    let x = chipX, lines = 1;
    for (const item of g.items) {
      const w = monoW(item, fs) + 28;
      if (x + w > chipMax) { x = chipX; y += lineH; lines++; }
      rowsSvg += `<rect x="${x}" y="${y}" width="${w}" height="${ch}" rx="8" fill="${g.dashed ? 'none' : C.panel}" stroke="${g.dashed ? C.mute : C.line2}"${g.dashed ? ' stroke-dasharray="4 4"' : ''}/>
${mono(x + 14, y + 22.5, item, fs, `fill="${g.dashed ? C.sub : '#c9d4e3'}"`)}`;
      x += w + gap;
    }
    y += lineH + (gi < groups.length - 1 ? 6 : 0);
  });
  const H = y + 34;
  const f = frame({ w: W, h: H, tab: 'stack.ts', tabIcon: 'ts', right: '// specialization first, then everything else' });

  const body = `${f.body}
<rect x="48" y="86" width="3" height="18" fill="${C.cyan}"/>
<text class="m" x="62" y="101" font-size="15" fill="${C.cyan}" letter-spacing="3">SPECIALIZATION</text>
${tiles}
<rect x="48" y="${tileY + tileH + 24}" width="3" height="18" fill="${C.mute}"/>
<text class="m" x="62" y="${tileY + tileH + 39}" font-size="15" fill="${C.sub}" letter-spacing="3">ALSO IN THE TOOLBOX</text>
${rowsSvg}`;
  return svgDoc({
    w: W, h: H,
    title: 'Technology stack',
    desc: 'Specialization: TypeScript, React Native, Expo, React, Node.js. Also: mobile, web, backend and tooling libraries, plus technologies explored in personal projects.',
    style: css,
    defs: `${f.defs}${clips}<linearGradient id="sheen" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#bff6ff" stop-opacity=".07"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>`,
    body,
  });
}

function icon(kind, cx, cy) {
  const s = `fill="none" stroke="${C.cyan}" stroke-width="1.8" stroke-linejoin="round"`;
  const atom = (rx, ry, x = cx, y = cy) =>
    [0, 60, 120].map((a) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" transform="rotate(${a} ${x} ${y})" ${s}/>`).join('') +
    `<circle cx="${x}" cy="${y}" r="${rx / 6}" fill="${C.cyan}"/>`;
  switch (kind) {
    case 'ts':
      return `<rect x="${cx - 14}" y="${cy - 14}" width="28" height="28" rx="5" ${s}/><text class="m" x="${cx + 11}" y="${cy + 10}" font-size="13" font-weight="700" fill="${C.cyan}" text-anchor="end">TS</text>`;
    case 'rn':
      return `<rect x="${cx - 11}" y="${cy - 17}" width="22" height="34" rx="5" ${s}/><path d="M${cx - 3} ${cy + 12.5} h6" stroke="${C.cyan}" stroke-width="1.8" stroke-linecap="round"/>${atom(7.5, 2.9, cx, cy - 2)}`;
    case 'expo':
      return `<path d="M${cx} ${cy - 14} L${cx + 15} ${cy - 6} L${cx} ${cy + 2} L${cx - 15} ${cy - 6} Z" ${s}/><path d="M${cx - 15} ${cy} L${cx} ${cy + 8} L${cx + 15} ${cy}" ${s}/><path d="M${cx - 15} ${cy + 6} L${cx} ${cy + 14} L${cx + 15} ${cy + 6}" ${s}/>`;
    case 'react':
      return atom(16, 6.2);
    case 'node':
      return `<path d="M${cx} ${cy - 16} L${cx + 14} ${cy - 8} V${cy + 8} L${cx} ${cy + 16} L${cx - 14} ${cy + 8} V${cy - 8} Z" ${s}/><text class="m" x="${cx}" y="${cy + 5}" font-size="12" font-weight="700" fill="${C.cyan}" text-anchor="middle">js</text>`;
    default:
      return '';
  }
}

// ============================================================================
// AI WORKFLOW
// ============================================================================
function workflow() {
  const W = 1200, H = 316;
  const steps = [
    ['Specify', 'write the spec'],
    ['Understand', 'map the system'],
    ['Decompose', 'plan the pieces'],
    ['Delegate', 'agents implement'],
    ['Review', 'debug and test'],
    ['Integrate', 'validate & merge'],
  ];
  const nw = 160, nh = 78, ny = 104;
  const gap = (1104 - steps.length * nw) / (steps.length - 1);
  const nx = (i) => 48 + i * (nw + gap);
  const P = 10;
  // highlight schedule: [node, start, end]
  const sched = [[0, 0, 1.1], [1, 1.1, 2.2], [2, 2.2, 3.3], [3, 3.3, 4.4], [4, 4.4, 5.5], [3, 6.3, 7.2], [4, 7.2, 8.1], [5, 8.1, 9.4]];
  let css = '', nodes = '';
  steps.forEach(([title, cap], i) => {
    const x = nx(i);
    nodes += `<rect x="${x}" y="${ny}" width="${nw}" height="${nh}" rx="12" fill="${C.panel}" stroke="${C.line2}"/>
<rect class="hl n${i}" x="${x}" y="${ny}" width="${nw}" height="${nh}" rx="12" fill="${C.cyan}" fill-opacity=".08" stroke="${C.cyan}"/>
${mono(x + 16, ny + 24, String(i + 1).padStart(2, '0'), 13, `fill="${C.cyan}"`)}
${sans(x + 16, ny + 49, title, 19, `fill="${C.text}" font-weight="650"`)}
${mono(x + 16, ny + 68, cap, 13, `fill="${C.mute}"`)}`;
    if (i < steps.length - 1) {
      const ax = x + nw + 6, bx2 = nx(i + 1) - 8;
      nodes += `<path d="M${r1(ax)} ${ny + nh / 2} H${r1(bx2)}" stroke="${C.line2}" stroke-width="2"/><path d="M${r1(bx2 - 6)} ${ny + nh / 2 - 5} L${r1(bx2)} ${ny + nh / 2} L${r1(bx2 - 6)} ${ny + nh / 2 + 5}" fill="none" stroke="${C.line2}" stroke-width="2"/>`;
    }
    const ks = sched.filter((s) => s[0] === i)
      .map(([, a, b]) => `${pct(a, P)}{opacity:0}${pct(a + 0.15, P)}{opacity:1}${pct(b - 0.1, P)}{opacity:1}${pct(b + 0.05, P)}{opacity:0}`).join('');
    css += `@keyframes n${i}{0%{opacity:0}${ks}100%{opacity:0}}.n${i}{animation:n${i} ${P}s linear infinite}`;
  });
  // iterate loop from node 5 back to node 4
  const c4 = nx(3) + nw / 2, c5 = nx(4) + nw / 2, yb = ny + nh;
  const loopD = `M${r1(c5)} ${yb + 6} C${r1(c5)} ${yb + 62} ${r1(c4)} ${yb + 62} ${r1(c4)} ${yb + 10}`;
  nodes += `<path d="${loopD}" fill="none" stroke="${C.line2}" stroke-width="2" stroke-dasharray="4 6"/>
<path d="M${r1(c4 - 6)} ${yb + 17} L${r1(c4)} ${yb + 9} L${r1(c4 + 6)} ${yb + 17}" fill="none" stroke="${C.line2}" stroke-width="2"/>
<path class="loop" d="${loopD}" fill="none" stroke="${C.cyan}" stroke-width="2.4" stroke-dasharray="6 8"/>
<text class="m" x="${r1((c4 + c5) / 2)}" y="${yb + 72}" font-size="14" fill="${C.sub}" text-anchor="middle">iterate</text>`;
  css += `
.hl{opacity:0}
.loop{opacity:0;animation:loop ${P}s linear infinite,flow 1s linear infinite}
@keyframes loop{0%,${pct(5.4, P)}{opacity:0}${pct(5.6, P)},${pct(6.3, P)}{opacity:1}${pct(6.5, P)},100%{opacity:0}}
@keyframes flow{to{stroke-dashoffset:-14}}`;

  const f = frame({ w: W, h: H, tab: 'agents.md', tabIcon: 'md', right: '// AI as a multiplier, not a substitute' });
  const body = `${f.body}
${nodes}
${mono(48, H - 30, '// agents write code fast. I own the spec, the architecture, and whether it works.', 15, `fill="${C.mute}"`)}`;
  return svgDoc({
    w: W, h: H,
    title: 'How I work with AI coding agents',
    desc: 'Specify, map the system, decompose, delegate to agents, review and debug in a loop, then validate and integrate.',
    style: css, defs: f.defs, body,
  });
}

// ============================================================================
// RETAKE — the mechanism, animated
// ============================================================================
function retake() {
  const W = 1200, H = 528, T = 18;
  const G = 330, R = 9, Y = G - R; // ground, skater radius, skater center on ground

  // Skate line, side view. Sampled into a polyline so path fractions are exact.
  const segs = [
    ['L', [70, Y], [250, Y]],
    ['Q', [250, Y], [282, 238], [318, G - 38 - R]],            // ollie onto ledge
    ['L', [318, G - 38 - R], [436, G - 38 - R]],               // grind ledge
    ['Q', [436, G - 38 - R], [462, 266], [492, Y]],            // drop
    ['L', [492, Y], [530, Y]],
    ['L', [530, Y], [582, G - 30 - R]],                        // up the kicker
    ['Q', [582, G - 30 - R], [668, 104], [760, Y]],            // gap
    ['L', [760, Y], [808, Y]],
    ['Q', [808, Y], [832, 240], [856, G - 50 - R]],            // ollie onto rail
    ['L', [856, G - 50 - R], [996, G - 50 - R]],               // grind rail
    ['Q', [996, G - 50 - R], [1020, 254], [1046, Y]],          // drop
    ['L', [1046, Y], [1124, Y]],
  ];
  const pts = [];
  for (const [k, a, b, c] of segs) {
    const n = k === 'L' ? Math.max(2, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 6)) : 40;
    for (let i = pts.length ? 1 : 0; i <= n; i++) {
      const t = i / n;
      if (k === 'L') pts.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
      else {
        const u = 1 - t;
        pts.push([u * u * a[0] + 2 * u * t * b[0] + t * t * c[0], u * u * a[1] + 2 * u * t * b[1] + t * t * c[1]]);
      }
    }
  }
  const cum = [0];
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const total = cum[cum.length - 1];
  const fracAtX = (x, onRail = false) => {
    // first sample at/after x (on the rail segment when asked)
    for (let i = 0; i < pts.length; i++) if (pts[i][0] >= x && (!onRail || Math.abs(pts[i][1] - (G - 50 - R)) < 0.5)) return cum[i] / total;
    return 1;
  };
  const pointAt = (f) => {
    const d = f * total;
    let i = cum.findIndex((c) => c >= d);
    if (i <= 0) return pts[0];
    const t = (d - cum[i - 1]) / (cum[i] - cum[i - 1]);
    return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * t, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * t];
  };
  const sub = (fa, fb) => {
    const out = [pointAt(fa)];
    for (let i = 0; i < pts.length; i++) {
      const f = cum[i] / total;
      if (f > fa && f < fb) out.push(pts[i]);
    }
    out.push(pointAt(fb));
    return 'M' + out.map((p) => `${r1(p[0])} ${r1(p[1])}`).join(' L');
  };
  const fullD = sub(0, 1);
  const fb = +fracAtX(928, true).toFixed(4); // bail: middle of the rail
  const fr = +fracAtX(784).toFixed(4);       // picked moment: just after the gap
  const [bxp, byp] = pointAt(fb);
  const [rxp, ryp] = pointAt(fr);

  // ---- timing (seconds) ----
  const tBail = 5.0, tA = tBail * (fr / fb);
  const tOpen = 6.0, tScrubA = 6.5, tScrubB = 8.0, tPress = 8.5;
  const tCatchA = 8.8, tCatchB = 10.6, tGo = 12.4, tEnd = 15.0;
  const tWholeA = 15.3, tWholeB = 17.1, tFade = 17.4;

  // ---- trails ----
  const trail = (d, color, width, drawPairs, extra = '', opPairs = null) => `
<path d="${d}" pathLength="1" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="1 1" stroke-dashoffset="1" ${extra}>
${animate('stroke-dashoffset', T, drawPairs)}
${opPairs ? animate('opacity', T, opPairs) : ''}
</path>`;
  const fadeAll = [[0, 1], [tFade, 1], [T - 0.05, 0], [T, 0]];
  let trails = '';
  // full-line glow for "play whole line"
  trails += `<path d="${fullD}" fill="none" stroke="${C.cyan}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" opacity="0" stroke-opacity=".22">${animate('opacity', T, [[0, 0], [tEnd, 0], [tEnd + 0.4, 1], [tFade, 1], [T - 0.05, 0]])}</path>`;
  // recorded, kept part [0, fr]
  trails += trail(sub(0, fr), C.text, 3, [[0, 1], [tA, 0], [T - 0.05, 0], [T, 1]], 'stroke-opacity=".5"', fadeAll);
  // recorded, later discarded part [fr, fb]
  trails += trail(sub(fr, fb), C.text, 3, [[0, 1], [tA, 1], [tBail, 0], [T, 0]], 'stroke-opacity=".5"',
    [[0, 1], [tPress, 1], [tPress + 1.0, 0], [T - 0.05, 0], [T, 1]]);
  trails += `<path d="${sub(fr, fb)}" fill="none" stroke="${C.red}" stroke-width="3" stroke-dasharray="5 7" stroke-linecap="round" opacity="0">${animate('opacity', T, [[0, 0], [tPress, 0], [tPress + 0.1, 1], [tPress + 1.0, 0]])}</path>`;
  // catch-up replays the kept part in cyan
  trails += trail(sub(0, fr), C.cyan, 3.4, [[0, 1], [tCatchA, 1], [tCatchB, 0], [T - 0.05, 0], [T, 1]], '', fadeAll);
  // the new attempt
  trails += trail(sub(fr, 1), C.cyan, 3.4, [[0, 1], [tGo, 1], [tEnd, 0], [T - 0.05, 0], [T, 1]], '', fadeAll);

  // ---- skater ----
  const keyPts = [[0, 0], [tBail, fb], [tCatchA - 0.01, fb], [tCatchA, 0], [tCatchB, fr], [tGo, fr], [tEnd, 1], [T, 1]];
  const mk = (pairs) => {
    const kt = [], kp = [];
    pairs.forEach(([t, p], i) => {
      let k = t / T;
      if (i && k <= kt[i - 1]) k = kt[i - 1] + 0.0004;
      kt.push(+k.toFixed(5)); kp.push(+p.toFixed(4));
    });
    kt[kt.length - 1] = 1;
    return `keyTimes="${kt.join(';')}" keyPoints="${kp.join(';')}"`;
  };
  const skater = `
<g opacity="0">
  ${animate('opacity', T, [[0, 1], [tBail, 1], [tBail + 0.01, 0], [tCatchA - 0.01, 0], [tCatchA, 1], [tEnd + 0.3, 1], [tEnd + 0.5, 0], [T, 0]])}
  <circle r="16" fill="${C.cyan}" opacity=".0">${animate('opacity', T, [[0, 0], [tCatchA, 0], [tCatchA + 0.1, 0.25], [tEnd, 0.25], [tEnd + 0.3, 0]])}</circle>
  <circle r="${R}" fill="${C.text}" stroke="${C.bgB}" stroke-width="2">${animate('fill', T, [[0, C.text], [tCatchA - 0.01, C.text], [tCatchA, C.cyan], [T - 0.01, C.cyan], [T, C.text]])}</circle>
  <animateMotion dur="${T}s" repeatCount="indefinite" calcMode="linear" path="${fullD}" ${mk(keyPts)}/>
</g>`;
  const ghost = `
<g opacity="0">
  ${animate('opacity', T, [[0, 0], [tOpen, 0], [tOpen + 0.2, 0.85], [tCatchB, 0.85], [tCatchB + 0.2, 0]])}
  <circle r="${R}" fill="none" stroke="${C.text}" stroke-width="2" stroke-dasharray="3 3"/>
  <animateMotion dur="${T}s" repeatCount="indefinite" calcMode="linear" path="${fullD}" ${mk([[0, fb], [tScrubA, fb], [tScrubB, fr], [T, fr]])}/>
</g>`;
  const runner = `
<g opacity="0">
  ${animate('opacity', T, [[0, 0], [tWholeA - 0.05, 0], [tWholeA, 1], [tWholeB, 1], [tWholeB + 0.2, 0]])}
  <circle r="15" fill="${C.cyan}" opacity=".25"/>
  <circle r="${R}" fill="${C.cyan}" stroke="${C.bgB}" stroke-width="2"/>
  <animateMotion dur="${T}s" repeatCount="indefinite" calcMode="linear" path="${fullD}" ${mk([[0, 0], [tWholeA, 0], [tWholeB, 1], [T, 1]])}/>
</g>`;
  const bail = `
<g opacity="0" transform="translate(${r1(bxp)} ${r1(byp)})">
  ${animate('opacity', T, [[0, 0], [tBail, 0], [tBail + 0.05, 1], [tPress, 1], [tPress + 0.4, 0]])}
  <path d="M-8 -8 L8 8 M8 -8 L-8 8" stroke="${C.red}" stroke-width="3" stroke-linecap="round"/>
  <text class="m" x="0" y="-18" font-size="14" fill="${C.red}" text-anchor="middle">bail</text>
</g>`;
  const countdown = ['3', '2', '1'].map((n, i) => {
    const a = tCatchB + i * 0.6, b = a + 0.6;
    return `<text class="s" x="${r1(rxp)}" y="${r1(ryp - 44)}" font-size="56" font-weight="700" fill="${C.amber}" text-anchor="middle" opacity="0">${n}${windowOpacity(T, a, b, 0.08)}</text>`;
  }).join('');
  const pickMark = `<g opacity="0">${animate('opacity', T, [[0, 0], [tScrubB, 0], [tScrubB + 0.2, 1], [tGo, 1], [tGo + 0.3, 0]])}
<line x1="${r1(rxp)}" y1="${r1(ryp + 14)}" x2="${r1(rxp)}" y2="${G}" stroke="${C.cyan}" stroke-dasharray="2 4"/></g>`;

  // ---- scene props ----
  const ledge = `<rect x="300" y="${G - 38}" width="150" height="38" rx="3" fill="${C.panel2}" stroke="${C.line2}"/>`;
  const kicker = `<path d="M530 ${G} L582 ${G - 30} L582 ${G} Z" fill="${C.panel2}" stroke="${C.line2}"/>`;
  const rail = `<path d="M846 ${G - 50} H1004" stroke="${C.sub}" stroke-width="4" stroke-linecap="round"/><path d="M870 ${G - 50} V${G} M980 ${G - 50} V${G}" stroke="${C.line2}" stroke-width="3"/>`;
  const ground = `<path d="M56 ${G} H596 M744 ${G} H1144" stroke="${C.line2}" stroke-width="2"/><path d="M600 ${G} H740" stroke="${C.line2}" stroke-width="2" stroke-dasharray="2 8"/>`;
  const flag = `<g><path d="M1122 ${G} V${G - 54}" stroke="${C.sub}" stroke-width="2"/><path d="M1122 ${G - 54} L1146 ${G - 46} L1122 ${G - 38} Z" fill="${C.line2}">${animate('fill', T, [[0, C.line2], [tEnd - 0.01, C.line2], [tEnd, C.cyan], [tFade, C.cyan], [T, C.line2]])}</path></g>`;
  const labels = [[375, 'ledge'], [670, 'gap'], [925, 'rail'], [86, 'start']]
    .map(([x, s]) => `<text class="m" x="${x}" y="${G + 24}" font-size="13" fill="${C.mute}" text-anchor="middle">${s}</text>`).join('');

  // ---- captions + status ----
  const caps = [
    [0, tBail, 'Skate the line. Every input is recorded.'],
    [tBail, tPress, 'Bail. Open the timeline and pick a moment.'],
    [tPress, tCatchB, 'Your inputs replay up to that moment at 4×.'],
    [tCatchB, tGo, '3, 2, 1, and the controls are yours again.'],
    [tGo, tEnd, 'Land it. The new attempt replaces the rest.'],
    [tEnd, T, 'Play every best attempt back as one run.'],
  ];
  const captions = caps.map(([a, b, s], i) =>
    `<g opacity="${i === 0 ? 1 : 0}">${windowOpacity(T, a, b, 0.2)}
${mono(48, 102, String(i + 1).padStart(2, '0'), 15, `fill="${C.cyan}"`)}
${sans(84, 103, s, 22, `fill="${C.text}" font-weight="600"`)}</g>`).join('');

  const states = [
    [0, tBail, '● REC', C.red],
    [tBail, tOpen, 'BAIL', C.red],
    [tOpen, tPress, 'F11 · TIMELINE', C.cyan],
    [tPress, tCatchB, 'CATCH-UP 4×', C.cyan],
    [tCatchB, tCatchB + 0.6, '3', C.amber],
    [tCatchB + 0.6, tCatchB + 1.2, '2', C.amber],
    [tCatchB + 1.2, tGo, '1', C.amber],
    [tGo, tEnd, '● REC', C.red],
    [tEnd, T, '▶ WHOLE LINE', C.cyan],
  ];
  const pillW = 210, pillX = W - 28 - pillW;
  const status = `<rect x="${pillX}" y="15" width="${pillW}" height="30" rx="15" fill="${C.field}" stroke="${C.line2}"/>` +
    states.map(([a, b, s, col], i) =>
      `<text class="m" x="${pillX + pillW / 2}" y="35.5" font-size="15" font-weight="700" letter-spacing="1.5" fill="${col}" text-anchor="middle" opacity="${i === 0 ? 1 : 0}">${esc(s)}${windowOpacity(T, a, b, 0.01)}</text>`).join('');

  // ---- timeline panel ----
  const px = 48, py = 366, pw = W - 96, ph = 136;
  const tx = 72, tw = W - 144, ty = py + 52;
  const X = (f) => tx + f * tw;
  const btn = (x, label, flashAt) => {
    const w = monoW(label, 14) + 30;
    return {
      w,
      svg: `<rect x="${x}" y="${py + 82}" width="${w}" height="32" rx="8" fill="${C.panel}" stroke="${C.line2}"/>
<rect x="${x}" y="${py + 82}" width="${w}" height="32" rx="8" fill="${C.cyan}" fill-opacity=".18" stroke="${C.cyan}" opacity="0">${flashAt ? animate('opacity', T, [[0, 0], [flashAt - 0.3, 0], [flashAt - 0.2, 1], [flashAt + 0.5, 1], [flashAt + 0.9, 0]]) : ''}</rect>
${mono(x + 15, py + 103, label, 14, `fill="${C.text}"`)}`,
    };
  };
  let bxCursor = tx, buttons = '';
  for (const [label, at] of [['Replay from here', tPress], ['Play whole line', tEnd], ['Carry on', 0]]) {
    const b = btn(bxCursor, label, at);
    buttons += b.svg; bxCursor += b.w + 10;
  }
  const settings = 'catch-up 4×   slow-mo 0.25×';
  buttons += `<text class="m" x="${tx + tw}" y="${py + 103}" font-size="14" fill="${C.mute}" text-anchor="end">${esc(settings)}</text>`;

  const panel = `
<rect x="${px}" y="${py}" width="${pw}" height="${ph}" rx="14" fill="${C.field}" stroke="${C.line2}"/>
<rect x="${px}" y="${py}" width="${pw}" height="${ph}" rx="14" fill="none" stroke="${C.cyan}" opacity="0">${animate('opacity', T, [[0, 0], [tOpen - 0.1, 0], [tOpen + 0.15, 0.9], [tPress + 0.4, 0.9], [tPress + 0.8, 0]])}</rect>
<rect x="${tx}" y="${py + 16}" width="38" height="22" rx="5" fill="none" stroke="${C.line2}"/>
${mono(tx + 7, py + 32, 'F11', 13, `fill="${C.sub}"`)}
${mono(tx + 50, py + 32, 'timeline', 14, `fill="${C.sub}"`)}
<text class="m" x="${tx + tw}" y="${py + 32}" font-size="13" fill="${C.mute}" text-anchor="end">offline only</text>
<rect x="${tx}" y="${ty - 3}" width="${tw}" height="6" rx="3" fill="${C.line}"/>
<rect x="${tx}" y="${ty - 3}" width="0" height="6" rx="3" fill="${C.text}" fill-opacity=".45">${animate('width', T, [[0, 0], [tBail, fb * tw], [tPress, fb * tw], [tPress + 0.01, fr * tw], [T - 0.05, fr * tw], [T, 0]])}</rect>
<rect x="${r1(X(fr))}" y="${ty - 3}" width="${r1((fb - fr) * tw)}" height="6" fill="${C.red}" opacity="0">${animate('opacity', T, [[0, 0], [tPress, 0], [tPress + 0.05, 1], [tPress + 0.9, 0]])}</rect>
<rect x="${tx}" y="${ty - 3}" width="0" height="6" rx="3" fill="${C.cyan}">${animate('width', T, [[0, 0], [tCatchA, 0], [tCatchB, fr * tw], [tFade, fr * tw], [T - 0.05, 0]])}</rect>
<rect x="${r1(X(fr))}" y="${ty - 3}" width="0" height="6" fill="${C.cyan}">${animate('width', T, [[0, 0], [tGo, 0], [tEnd, (1 - fr) * tw], [tFade, (1 - fr) * tw], [T - 0.05, 0]])}</rect>
<g>
  ${translateX(T, [[0, X(0)], [tBail, X(fb)], [tScrubA, X(fb)], [tScrubB, X(fr)], [tGo, X(fr)], [tEnd, X(1)], [tWholeA - 0.01, X(1)], [tWholeA, X(0)], [tWholeB, X(1)], [T - 0.02, X(1)], [T, X(0)]])}
  <path d="M0 ${ty - 14} V${ty + 14}" stroke="${C.cyan}" stroke-width="2"/>
  <circle cx="0" cy="${ty}" r="7" fill="${C.cyan}" stroke="${C.field}" stroke-width="3"/>
</g>
${buttons}`;

  const f = frame({ w: W, h: H, tab: 'retake · how it works', tabIcon: 'rec' });
  const body = `${f.body}
${status}
${captions}
${ground}${ledge}${kicker}${rail}${flag}${labels}
${trails}
${pickMark}
${bail}
${ghost}
${skater}
${runner}
${countdown}
${panel}`;
  return svgDoc({
    w: W, h: H,
    title: 'ReTake: how it works',
    desc: 'Animated diagram: a skate line is recorded, the skater bails, a moment is picked on the timeline, inputs replay to that moment at 4x, a 3-2-1 countdown hands control back, and the best attempts play back as one run.',
    style: '', defs: f.defs, body,
  });
}

// ============================================================================
// CAREER TIMELINE
// ============================================================================
function career() {
  const W = 1200, H = 244;
  const start = 2021, years = 6;                 // Jan 2021 -> Jan 2027
  const x = (y, m) => r1(48 + (((y - start) * 12 + (m - 1)) / (years * 12)) * 1104);
  const barY = 126, barH = 12;
  // [company, role, from [y, m], to [y, m] (exclusive), color, opacity]
  const segs = [
    ['Onlio', 'React · QA', [2021, 5], [2022, 1], C.cyan, 0.35],
    ['Fortuna', 'MarTech', [2022, 6], [2023, 2], C.sub, 0.3],
    ['Partners Banka', 'Mobile · React Native', [2023, 2], [2025, 1], C.cyan, 0.55],
    ['Piletilevi PLG', 'React Native', [2025, 1], [2026, 6], C.cyan, 0.78],
    [null, 'Senior Full-Stack', [2026, 6], [2027, 1], C.cyan, 1],
  ];
  // The current role runs up to the build date.
  const today = new Date();
  const nx = x(today.getUTCFullYear(), today.getUTCMonth() + 1 + today.getUTCDate() / 31);
  let css = '', body = '';
  segs.forEach(([company, role, a, b, color, op], i) => {
    const last = i === segs.length - 1;
    const x0 = x(...a), x1 = last ? nx : x(...b);
    const d = (0.25 + i * 0.22).toFixed(2);
    body += `<rect class="seg" style="animation-delay:${d}s" x="${x0}" y="${barY}" width="${r1(x1 - x0 - (last ? 0 : 3))}" height="${barH}" rx="6" fill="${last ? 'url(#now)' : color}" fill-opacity="${last ? 1 : op}"/>`;
    body += `<g class="lab" style="animation-delay:${d}s">`;
    if (company) body += sans(x0, barY - 16, company, 18, `fill="${C.text}" font-weight="650"`);
    body += last
      ? `<text class="m" x="${r1(x1 + 6)}" y="${barY + 38}" font-size="14" fill="${C.cyanLite}" text-anchor="end">${esc(role)}</text>`
      : mono(x0, barY + 38, role, 14, `fill="${C.mute}"`);
    body += `</g>`;
  });
  // year axis
  const axisY = 196;
  body += `<line x1="48" y1="${axisY}" x2="${W - 48}" y2="${axisY}" stroke="${C.line}"/>`;
  for (let k = 0; k <= years; k++) {
    const xx = x(start + k, 1);
    const anchor = k === 0 ? 'start' : k === years ? 'end' : 'middle';
    body += `<line x1="${xx}" y1="${axisY - 4}" x2="${xx}" y2="${axisY + 4}" stroke="${C.line2}"/>
<text class="m" x="${xx}" y="${axisY + 26}" font-size="13" fill="${C.mute}" text-anchor="${anchor}">${start + k}</text>`;
  }
  // "now" marker at the build date
  body += `<circle class="pulse" cx="${nx}" cy="${barY + barH / 2}" r="11" fill="none" stroke="${C.cyan}" stroke-width="2"/>
<circle cx="${nx}" cy="${barY + barH / 2}" r="5" fill="#ffffff"/>`;
  css += `
.seg{transform-box:fill-box;transform-origin:left center;animation:grow .7s cubic-bezier(.2,.7,.2,1) both}
@keyframes grow{from{transform:scaleX(0)}to{transform:scaleX(1)}}
.lab{animation:fade .6s ease-out both}
@keyframes fade{from{opacity:0}to{opacity:1}}
.pulse{transform-box:fill-box;transform-origin:center;animation:pulse 2.2s ease-out 1.6s infinite both}
@keyframes pulse{0%{transform:scale(.5);opacity:1}100%{transform:scale(1.6);opacity:0}}`;

  const f = frame({ w: W, h: H, tab: 'career.log', tabIcon: 'log', right: '// since 2021' });
  return svgDoc({
    w: W, h: H,
    title: 'Career timeline',
    desc: 'Onlio, React and QA, 2021. Fortuna Entertainment Group, marketing technology, 2022 to 2023. Partners Banka, mobile with React Native, 2023 to 2025. Piletilevi PLG, React Native developer 2025 to 2026, then Senior Full-Stack Developer from June 2026.',
    style: css,
    defs: `${f.defs}<linearGradient id="now" x1="0" x2="1"><stop offset="0" stop-color="${C.cyan}"/><stop offset="1" stop-color="#7df0ff"/></linearGradient>`,
    body: `${f.body}\n${body}`,
  });
}

// ============================================================================
// LINK BUTTONS
// ============================================================================
function button(label, glyph) {
  const fs = 15, tw = monoW(label, fs) + label.length * 1.2;
  const w = Math.round(18 + 20 + 12 + tw + 20), h = 44;
  const g = glyph === 'globe'
    ? `<circle cx="28" cy="22" r="9" fill="none" stroke="${C.cyan}" stroke-width="1.7"/><ellipse cx="28" cy="22" rx="4" ry="9" fill="none" stroke="${C.cyan}" stroke-width="1.5"/><path d="M19 22 H37" stroke="${C.cyan}" stroke-width="1.5"/>`
    : `<rect x="19" y="13" width="18" height="18" rx="4" fill="${C.cyan}"/><text class="s" x="28" y="27.2" font-size="12.5" font-weight="800" fill="${C.bgB}" text-anchor="middle">in</text>`;
  return svgDoc({
    w, h, title: label, desc: label,
    body: `<rect x=".5" y=".5" width="${w - 1}" height="${h - 1}" rx="11" fill="${C.bgA}" stroke="${C.line2}"/>
${g}
<text class="m" x="48" y="27" font-size="${fs}" font-weight="700" fill="${C.text}" letter-spacing="1.2" textLength="${r1(tw)}" lengthAdjust="spacing">${esc(label)}</text>`,
  });
}

save('hero.svg', hero());
save('stack.svg', stack());
save('workflow.svg', workflow());
save('retake.svg', retake());
save('career.svg', career());
save('link-portfolio.svg', button('DVORAKSTUDIO.DEV', 'globe'));
save('link-linkedin.svg', button('LINKEDIN', 'in'));
