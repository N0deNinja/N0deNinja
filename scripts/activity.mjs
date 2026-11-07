// Renders the contribution card from real GitHub data.
// Run: node scripts/activity.mjs <out.svg>
// Uses the GraphQL API when GITHUB_TOKEN is set (GitHub Actions), otherwise the public calendar page.
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { C, monoW, esc, mono, sans, svgDoc, frame } from './theme.mjs';

const USER = process.env.GH_USER || 'N0deNinja';
const OUT = resolve(process.argv[2] || 'dist/activity.svg');

const LEVEL = { NONE: 0, FIRST_QUARTILE: 1, SECOND_QUARTILE: 2, THIRD_QUARTILE: 3, FOURTH_QUARTILE: 4 };

async function fromGraphQL(token) {
  const query = `query($login:String!){user(login:$login){contributionsCollection{contributionCalendar{
    totalContributions weeks{contributionDays{date contributionCount contributionLevel}}}}}}`;
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { Authorization: `bearer ${token}`, 'Content-Type': 'application/json', 'User-Agent': 'profile-activity-card' },
    body: JSON.stringify({ query, variables: { login: USER } }),
  });
  const json = await res.json();
  if (!res.ok || json.errors) throw new Error(`GraphQL: ${res.status} ${JSON.stringify(json.errors || json)}`);
  const cal = json.data.user.contributionsCollection.contributionCalendar;
  return cal.weeks.flatMap((w) => w.contributionDays).map((d) => ({
    date: d.date, count: d.contributionCount, level: LEVEL[d.contributionLevel] ?? 0,
  }));
}

async function fromPublicPage() {
  const res = await fetch(`https://github.com/users/${USER}/contributions`, { headers: { 'User-Agent': 'profile-activity-card' } });
  if (!res.ok) throw new Error(`contributions page: ${res.status}`);
  const html = await res.text();
  const counts = new Map();
  for (const m of html.matchAll(/<tool-tip[^>]*for="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g)) {
    const n = m[2].match(/^(\d[\d,]*)\s+contribution/);
    counts.set(m[1], n ? Number(n[1].replace(/,/g, '')) : 0);
  }
  const days = [];
  for (const m of html.matchAll(/<td[^>]*data-date="([\d-]+)"[^>]*>/g)) {
    const tag = m[0];
    const id = tag.match(/id="([^"]+)"/)?.[1];
    const level = Number(tag.match(/data-level="(\d)"/)?.[1] ?? 0);
    days.push({ date: m[1], level, count: counts.get(id) ?? (level ? 1 : 0) });
  }
  if (!days.length) throw new Error('no days parsed from the contributions page');
  return days.sort((a, b) => a.date.localeCompare(b.date));
}

const days = process.env.GITHUB_TOKEN ? await fromGraphQL(process.env.GITHUB_TOKEN) : await fromPublicPage();

// ---------- stats ----------
const total = days.reduce((s, d) => s + d.count, 0);
const active = days.filter((d) => d.count > 0).length;
let longest = 0, run = 0;
for (const d of days) { run = d.count > 0 ? run + 1 : 0; longest = Math.max(longest, run); }
const best = days.reduce((b, d) => (d.count > b.count ? d : b), days[0]);
const fmtDate = (iso) => new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' });
const nf = (n) => n.toLocaleString('en-US');

// ---------- layout ----------
const W = 1200, cell = 16, step = 20, gx = 92, gy = 196;
const first = new Date(`${days[0].date}T00:00:00Z`);
const firstDow = first.getUTCDay(); // Sunday = 0, same as GitHub
const weeks = Math.ceil((days.length + firstDow) / 7);
const H = gy + 7 * step + 64;
const shades = ['#152117', '#25401c', '#3f6b1f', '#6ea22c', '#b5e04a'];

let cells = '', months = '';
let lastMonth = -1;
days.forEach((d, i) => {
  const idx = i + firstDow, col = Math.floor(idx / 7), row = idx % 7;
  const x = gx + col * step, y = gy + row * step;
  const delay = (col * 0.018 + row * 0.04).toFixed(3);
  const isLast = i === days.length - 1;
  cells += `<rect class="c" style="animation-delay:${delay}s" x="${x}" y="${y}" width="${cell}" height="${cell}" rx="3.5" fill="${shades[d.level]}"><title>${esc(`${d.count} on ${d.date}`)}</title></rect>`;
  if (isLast) cells += `<rect class="today" x="${x - 3}" y="${y - 3}" width="${cell + 6}" height="${cell + 6}" rx="5.5" fill="none" stroke="${C.accent}" stroke-width="1.6"/>`;
  const m = new Date(`${d.date}T00:00:00Z`).getUTCMonth();
  if (row === 0 && m !== lastMonth) {
    if (col < weeks - 2) months += `<text class="m" x="${x}" y="${gy - 12}" font-size="13" fill="${C.mute}">${new Date(`${d.date}T00:00:00Z`).toLocaleDateString('en-GB', { month: 'short', timeZone: 'UTC' })}</text>`;
    lastMonth = m;
  }
});
const dayLabels = [[1, 'Mon'], [3, 'Wed'], [5, 'Fri']]
  .map(([r, s]) => `<text class="m" x="48" y="${gy + r * step + 13}" font-size="13" fill="${C.mute}">${s}</text>`).join('');

const stats = [
  [nf(total), 'contributions'],
  [nf(active), 'active days'],
  [`${longest} days`, 'longest streak'],
  [nf(best.count), `best day · ${fmtDate(best.date)}`],
];
const colW = 1104 / stats.length;
const statSvg = stats.map(([v, l], i) => {
  const x = 48 + i * colW;
  return `${i ? `<line x1="${x - 24}" y1="84" x2="${x - 24}" y2="140" stroke="${C.line}"/>` : ''}
${sans(x, 120, v, 36, `fill="${C.text}" font-weight="700"`)}
${mono(x, 144, l, 14, `fill="${C.mute}"`)}`;
}).join('');

const legendX = W - 48 - (5 * 20 + 90);
const legend = `${mono(legendX - 4, H - 26, 'less', 13, `fill="${C.mute}" text-anchor="end"`)}` +
  shades.map((s, i) => `<rect x="${legendX + 6 + i * 20}" y="${H - 38}" width="${cell}" height="${cell}" rx="3.5" fill="${s}"/>`).join('') +
  `${mono(legendX + 6 + 5 * 20 + 4, H - 26, 'more', 13, `fill="${C.mute}"`)}`;

const updated = new Date().toISOString().slice(0, 10);
const scanW = 120;
const css = `
.c{opacity:0;animation:pop .5s ease-out both}
@keyframes pop{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
.today{animation:pulse 2.4s ease-in-out infinite}
@keyframes pulse{0%,100%{opacity:.25}50%{opacity:1}}
.scan{animation:scan 9s ease-in-out 2s infinite both}
@keyframes scan{0%{transform:translateX(0);opacity:0}8%{opacity:1}55%{opacity:1}65%,100%{transform:translateX(${weeks * step + scanW}px);opacity:0}}`;

const f = frame({ w: W, h: H, tab: 'activity.log', tabIcon: 'log', right: `// last 12 months · updated ${updated}` });
const body = `${f.body}
${statSvg}
${months}
${dayLabels}
${cells}
<g clip-path="url(#grid)"><rect class="scan" x="${gx - scanW}" y="${gy - 4}" width="${scanW}" height="${7 * step + 4}" fill="url(#scan)"/></g>
${mono(48, H - 26, `github.com/${USER}`, 13, `fill="${C.mute}"`)}
${legend}`;

const svg = svgDoc({
  w: W, h: H,
  title: `GitHub activity for ${USER}`,
  desc: `${nf(total)} contributions and ${active} active days in the last 12 months. Longest streak ${longest} days.`,
  style: css,
  defs: `${f.defs}
<clipPath id="grid"><rect x="${gx - 4}" y="${gy - 4}" width="${weeks * step + 4}" height="${7 * step + 4}"/></clipPath>
<linearGradient id="scan" x1="0" x2="1"><stop offset="0" stop-color="${C.accent}" stop-opacity="0"/><stop offset=".85" stop-color="${C.accent}" stop-opacity=".16"/><stop offset="1" stop-color="${C.accent}" stop-opacity="0"/></linearGradient>`,
  body,
});

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, svg);
console.log(`${OUT}: ${nf(total)} contributions, ${active} active days, longest streak ${longest}, ${weeks} weeks`);
