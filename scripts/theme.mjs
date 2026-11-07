// Shared look for every SVG card in this profile.
// SVGs in a README are rendered through <img>, so no web fonts: system stacks only.

export const C = {
  bgA: '#0b1322',
  bgB: '#060a12',
  panel: '#0c1424',
  panel2: '#0f1a2e',
  field: '#08101d',
  line: '#1a2740',
  line2: '#26364f',
  text: '#e8eef7',
  sub: '#a3b1c6',
  mute: '#66768d',
  cyan: '#22d3ee',
  cyanLite: '#a5f3fc',
  blue: '#60a5fa',
  red: '#fb7185',
  amber: '#fbbf24',
};

export const SANS = "'Segoe UI', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Inter, Roboto, Arial, sans-serif";
export const MONO = "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace";

// Monospace advance (em). Every mono string gets textLength, so widths are exact on any font.
export const MONO_EM = 0.6;
export const monoW = (s, size) => +(String(s).length * MONO_EM * size).toFixed(1);

export const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const r1 = (n) => Math.round(n * 10) / 10;

/** Monospace text whose rendered width is pinned to n chars * 0.6em. */
export function mono(x, y, s, size, attrs = '') {
  return `<text class="m" x="${r1(x)}" y="${r1(y)}" font-size="${size}" textLength="${monoW(s, size)}" lengthAdjust="spacing" ${attrs}>${esc(s)}</text>`;
}

export function sans(x, y, s, size, attrs = '') {
  return `<text class="s" x="${r1(x)}" y="${r1(y)}" font-size="${size}" ${attrs}>${esc(s)}</text>`;
}

/** Wrap a card body in an <svg> document with shared fonts and a reduced-motion switch. */
export function svgDoc({ w, h, title, desc, style = '', defs = '', body }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="title desc">
<title id="title">${esc(title)}</title>
<desc id="desc">${esc(desc)}</desc>
<style>
.s{font-family:${SANS}}
.m{font-family:${MONO}}
${style}
@media (prefers-reduced-motion: reduce){*{animation:none!important}}
</style>
<defs>${defs}</defs>
${body}
</svg>
`;
}

/** Card background: gradient, faded dot grid, optional glow, border, and an editor-style tab. */
export function frame({ w, h, tab, tabIcon = 'dot', right = '', glow = null }) {
  const defs = `
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.bgA}"/><stop offset="1" stop-color="${C.bgB}"/></linearGradient>
<pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1.1" fill="#1d2b44"/></pattern>
<radialGradient id="dotfade" cx=".85" cy=".1" r="1"><stop offset="0" stop-color="#fff"/><stop offset=".75" stop-color="#fff" stop-opacity="0"/></radialGradient>
<mask id="dotmask"><rect width="${w}" height="${h}" fill="url(#dotfade)"/></mask>
<radialGradient id="glow"><stop offset="0" stop-color="${C.cyan}" stop-opacity=".16"/><stop offset="1" stop-color="${C.cyan}" stop-opacity="0"/></radialGradient>
<clipPath id="card"><rect width="${w}" height="${h}" rx="20"/></clipPath>`;

  let body = `<g clip-path="url(#card)">
<rect width="${w}" height="${h}" fill="url(#bg)"/>
<rect width="${w}" height="${h}" fill="url(#dots)" mask="url(#dotmask)"/>
${glow ? `<circle class="glow" cx="${glow.x}" cy="${glow.y}" r="${glow.r}" fill="url(#glow)"/>` : ''}
</g>
<rect x=".5" y=".5" width="${w - 1}" height="${h - 1}" rx="19.5" fill="none" stroke="${C.line}"/>`;

  if (tab) {
    const tw = 62 - 24 + monoW(tab, 16) + 24;
    body += `
<line x1="1" y1="56" x2="${w - 1}" y2="56" stroke="${C.line}"/>
<path d="M24 57 V28 a12 12 0 0 1 12 -12 H${24 + tw - 12} a12 12 0 0 1 12 12 V57 Z" fill="${C.panel2}" stroke="${C.line}"/>
<rect x="25" y="55" width="${tw - 2}" height="3" fill="${C.panel2}"/>
${tabGlyph(tabIcon, 44, 37)}
${mono(62, 42, tab, 16, `fill="${C.sub}"`)}
${right ? `<text class="m" x="${w - 28}" y="42" font-size="15" fill="${C.mute}" text-anchor="end">${esc(right)}</text>` : ''}`;
  }
  return { defs, body };
}

function tabGlyph(kind, cx, cy) {
  switch (kind) {
    case 'ts':
      return `<rect x="${cx - 9}" y="${cy - 9}" width="18" height="18" rx="4" fill="none" stroke="${C.cyan}" stroke-width="1.6"/><text class="m" x="${cx + 7}" y="${cy + 6}" font-size="8.5" font-weight="700" fill="${C.cyan}" text-anchor="end">TS</text>`;
    case 'rec':
      return `<circle cx="${cx}" cy="${cy}" r="6" fill="${C.red}"/>`;
    case 'md':
      return `<rect x="${cx - 10}" y="${cy - 7}" width="20" height="14" rx="3" fill="none" stroke="${C.cyan}" stroke-width="1.6"/><path d="M${cx - 6} ${cy + 3} v-6 l3 3 l3 -3 v6" fill="none" stroke="${C.cyan}" stroke-width="1.4" stroke-linejoin="round"/>`;
    case 'log':
      return `<path d="M${cx - 8} ${cy - 5} h16 M${cx - 8} ${cy} h11 M${cx - 8} ${cy + 5} h14" stroke="${C.cyan}" stroke-width="1.8" stroke-linecap="round"/>`;
    default:
      return `<circle cx="${cx}" cy="${cy}" r="5" fill="${C.cyan}"/>`;
  }
}

// ---------- SMIL helpers (used where several elements must stay frame-locked) ----------

/**
 * Build an <animate>/<animateTransform>/<animateMotion> attribute set from [time, value] pairs.
 * Times are seconds within one loop of length T. Pairs at the same time make an instant jump.
 */
export function timeline(T, pairs) {
  const pts = [...pairs].sort((a, b) => a[0] - b[0]);
  if (pts[0][0] > 0) pts.unshift([0, pts[0][1]]);
  if (pts[pts.length - 1][0] < T) pts.push([T, pts[pts.length - 1][1]]);
  // Nudge duplicate times apart so every renderer accepts the keyTimes list.
  const eps = 0.004;
  const times = [];
  pts.forEach(([t], i) => {
    let k = t / T;
    if (i > 0 && k <= times[i - 1]) k = times[i - 1] + eps / T;
    times.push(Math.min(k, 1));
  });
  times[times.length - 1] = 1;
  for (let i = times.length - 2; i >= 0; i--) if (times[i] >= times[i + 1]) times[i] = times[i + 1] - eps / T;
  return {
    keyTimes: times.map((k) => +k.toFixed(5)).join(';'),
    values: pts.map((p) => p[1]).join(';'),
  };
}

export function animate(attr, T, pairs, extra = '') {
  const { keyTimes, values } = timeline(T, pairs);
  return `<animate attributeName="${attr}" dur="${T}s" repeatCount="indefinite" calcMode="linear" keyTimes="${keyTimes}" values="${values}" ${extra}/>`;
}

export function translateX(T, pairs) {
  const { keyTimes, values } = timeline(T, pairs.map(([t, x]) => [t, `${r1(x)} 0`]));
  return `<animateTransform attributeName="transform" type="translate" dur="${T}s" repeatCount="indefinite" calcMode="linear" keyTimes="${keyTimes}" values="${values}"/>`;
}

/** Opacity that is on during [a, b) with short fades. */
export function windowOpacity(T, a, b, fade = 0.15, on = 1) {
  const pairs = [];
  if (a <= 0) pairs.push([0, on]);
  else pairs.push([0, 0], [Math.max(0, a - fade), 0], [a, on]);
  if (b >= T) pairs.push([T, on]);
  else pairs.push([b, on], [Math.min(T, b + fade), 0], [T, 0]);
  return animate('opacity', T, pairs);
}
