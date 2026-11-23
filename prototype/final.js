import { background, drift, decode, beam } from 'asciify-engine/kit';
import projects from './data/projects.json';
import stack from './data/stack.json';
import experience from './data/experience.json';
import education from './data/education.json';

const email = 'me@lrxrn.dev';
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const now = new Date().getFullYear();
const list = projects.filter(p => !p.hidden);
const bird = String.raw`   __
 <(o )___
  ( ._> /
   '---'`;

const pill = c => `<li style="--c:${c.color || '#888'}">${c.name}</li>`;
const feat = p => `<a class="row" href="${p.url || 'https://github.com/lrxrn/' + p.name}"><div><b>${p.name}</b><span>${p.line}</span></div><i class="arrow">→</i></a>`;
const mini = p => `<a class="row" href="${p.url || 'https://github.com/lrxrn/' + p.name}"><b>${p.name}</b><span>${p.line}</span><i>${p.year}</i></a>`;
const job = j => `<div class="row${j.end ? '' : ' cur'}"><div><b>${j.role}</b><span>${j.type}</span></div><i>${j.start} – ${j.end ?? '<em class="badge">Present</em>'}</i></div>`;
const orgs = [...new Set(experience.map(j => j.org))];
const edu = e => `<div class="row${e.active ? ' cur' : ''}"><div><b>${e.degree}${e.active ? ` <em class="badge">Year ${now - e.start + 1}</em>` : ''}</b><span>${e.school}</span></div><i>${e.start} – ${e.end}</i></div>`;

document.getElementById('app').innerHTML = `
<header class="reveal" style="--i:0">
  <h1 tabindex="0" aria-label="Meesum, also known as lrxrn"><span id="nm" aria-hidden="true">lrxrn</span><span class="dot" aria-hidden="true">.</span><span class="caret" aria-hidden="true"></span></h1>
  <p class="bio">Software engineering student who builds tools people actually use.</p>
</header>
<section class="reveal" style="--i:1"><h2>Stack</h2>
  ${stack.map(g => `<div class="stack"><span class="k">${g.name}</span><ul>${g.items.map(pill).join('')}</ul></div>`).join('')}
</section>
<section class="reveal" style="--i:2"><h2>Work</h2>
  ${list.filter(p => p.featured).map(feat).join('')}
  <details class="all"><summary>All ${list.length} projects</summary>${list.filter(p => !p.featured).map(mini).join('')}</details>
</section>
<section class="reveal" style="--i:3"><h2>Experience</h2>
  ${orgs.map(o => `<p class="org">${o}</p>${experience.filter(j => j.org === o).map(job).join('')}`).join('')}
</section>
<section class="reveal" style="--i:4"><h2>Education</h2>${education.map(edu).join('')}</section>
<section class="reveal" style="--i:5"><h2>Contact</h2>
  <p class="lede">Open to stuff. Internships, collabs, good ideas.</p>
  <a class="btn" href="mailto:${email}">${email}</a>
  <p class="elsewhere"><a href="https://github.com/lrxrn">GitHub</a> · <a href="https://linkedin.com/in/meesum-ahmed">LinkedIn</a> · Discord m13kx</p>
</section>
<footer class="reveal" style="--i:6"><pre aria-hidden="true" style="font:11px/1.2 var(--mono)">${bird}</pre><span>© ${now} Meesum</span><button id="theme" aria-label="Toggle theme">◐</button></footer>`;

document.getElementById('theme').onclick = () => {
  const r = document.documentElement;
  const dark = r.dataset.theme ? r.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  r.dataset.theme = dark ? 'light' : 'dark';
};

// name: hover, focus or tap types lrxrn over to Meesum (interruptible: always steps toward the current target)
const h1 = document.querySelector('h1'), nm = document.getElementById('nm');
let cur = 'lrxrn', target = cur, timer = 0;
function step() {
  if (cur === target) { clearInterval(timer); timer = 0; h1.classList.remove('typing'); return; }
  cur = target.startsWith(cur) ? target.slice(0, cur.length + 1) : cur.slice(0, -1);
  nm.textContent = cur;
}
function go(t) {
  target = t;
  if (reduced) { cur = t; nm.textContent = t; return; }
  h1.classList.add('typing');
  timer ||= setInterval(step, 55);
}
h1.onmouseenter = () => go('Meesum'); h1.onmouseleave = () => go('lrxrn');
h1.onfocus = () => go('Meesum'); h1.onblur = () => go('lrxrn');
h1.onclick = () => go(target === 'Meesum' ? 'lrxrn' : 'Meesum'); // touch

// asciify: one drifting ground that keeps clear of the text, headings resolve on scroll, a quiet beam on the email button
let rects = [], dirty = true;
const range = document.createRange();
const read = () => {
  if (!dirty) return rects;
  dirty = false;
  rects = [...document.querySelectorAll('h1,h2,p,.row,.stack,.btn,summary')].map(el => el.getBoundingClientRect());
  return rects;
};
const mark = () => { dirty = true; };
addEventListener('scroll', mark, { passive: true, capture: true });
addEventListener('resize', mark);
document.fonts.addEventListener('loadingdone', mark);
new ResizeObserver(mark).observe(document.body);
document.querySelector('.all').addEventListener('toggle', mark);

try {
  background(document.getElementById('bg'), { preset: drift, clear: read, clearPadding: 6, clearSoftness: 28, ink: '--ascii-ink', opacity: .7 });
  document.querySelectorAll('h2').forEach(h => decode(h, { trigger: 'scroll', settle: 'text' }));
  beam(document.querySelector('.btn'), { palette: 'mono', mode: 'pulse' });
} catch (e) { console.warn('asciify unavailable', e); }

// what I'm up to (same worker as the current site); ?demo shows a sample
const w = document.getElementById('waiu'), [t1, t2] = w.querySelectorAll('b,small');
const verb = { listening: 'Listening to', playing: 'Playing', watching: 'Watching', streaming: 'Streaming', competing: 'Competing in' };
function show(l) {
  const a = l[0];
  if (!a) return w.classList.remove('on');
  const time = d => new Date(d).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  t1.textContent = a.source === 'waiu' ? 'Scheduled' : `${verb[a.type] || ''} ${a.name ?? ''}`.trim();
  t2.textContent = a.source === 'waiu' ? `${time(a.timestart)} – ${time(a.end)}` : [a.details, a.state].filter(Boolean).join(' · ');
  t2.hidden = !t2.textContent; w.classList.add('on');
}
if (location.search.includes('demo')) show([{ type: 'listening', name: 'Apple Music', details: 'Song title', state: 'Artist' }]);
else (function connect() {
  const ws = new WebSocket('wss://waiu.lrxrn.workers.dev/ws');
  ws.onmessage = e => { const m = JSON.parse(e.data); if (m.type === 'update') show(m.data.current ?? []); };
  ws.onclose = () => setTimeout(connect, 3000);
  ws.onerror = () => ws.close();
})();
