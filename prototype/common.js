// Shared content + render for the prototypes. Each variant only supplies CSS.
const P = (name, line, year, featured) => ({ name, line, year, featured });
const projects = [
  P('ta-card', 'Concept for the APU Technical Assistant ID card', 2026, 1),
  P('scanbridge', 'Phone-to-desktop scanner relay on Cloudflare', 2026, 1),
  P('timetable', 'Class timetable app', 2026, 1),
  P('enroll', 'PowerShell tooling', 2026), P('scheduleDB', 'Schedule data', 2026), P('Arux', 'JavaScript project', 2026),
  P('dotfiles', 'My setup', 2026), P('aether-linux', 'Linux TUI for the VOICSKY PULSE 96 keyboard', 2026),
  P('TA-Roster', 'TA duty roster parser', 2026), P('tasw-api', 'TA API', 2026),
  P('holhuashi', 'Anonymous message board for Maldivians', 2026), P('APSearch-API', 'Search API', 2026),
  P('coral-pos', 'Point of sale', 2026), P('ta-tools-api', 'API for TA tools', 2026), P('hr-portal', 'HR portal', 2026),
  P('Trace', 'Spending tracker and bill splitter', 2026), P('tools', 'Small web tools', 2026), P('QC-Toolbox', 'QC helpers', 2026),
  P('auth', 'Auth service', 2026), P('lrxrn.github.io', 'This site', 2026), P('Spy', 'Svelte app', 2026),
  P('TA-Creds', 'TA credentials app', 2026), P('waiu', 'Live status worker', 2026), P('ta-tools', 'Tools for Technical Assistants', 2026),
  P('apu_smartpark', 'Flutter parking app', 2026), P('TA-Graveyard', 'Retired TA projects', 2026), P('dep-trkr', 'Tracker', 2026),
  P('hr-portal-legacy', 'Earlier HR portal', 2026), P('APUSchedule', 'Schedule tool', 2026), P('FDD', 'Assignment site', 2026),
  P('np', 'Now playing player', 2026), P('pos', 'Retail point of sale', 2025), P('link-redirector-main', 'NFC link redirector', 2025),
  P('OODJ', 'Java coursework', 2025), P('Nowify', 'Spotify now playing', 2025), P('SWScripts', 'PowerShell scripts', 2025),
  P('Minot', 'CSS experiment', 2025), P('mapcolata', 'Map project', 2025), P('pfiswe', 'JavaScript project', 2025),
  P('apu-schedule', 'Schedule tool', 2025), P('rounding-analysis', 'Python analysis', 2025),
  P('auto-attendix', 'Attendance automation', 2025), P('IOOP', 'C# coursework', 2025), P('mini-project', 'PowerShell mini project', 2025),
];
const stack = {
  Languages: ['TypeScript', 'JavaScript', 'Python', 'Java', 'C#', 'C++', 'Go', 'Dart', 'PowerShell', 'Bash', 'HTML', 'CSS'],
  'Tech': ['Svelte', 'Next.js', 'Vue', 'Node.js', 'Tailwind', 'Flutter', 'FastAPI', 'Cloudflare Workers', 'Supabase', 'MySQL', 'Git'],
};
const email = 'mikkoahmd@gmail.com';
const featured = projects.filter(p => p.featured), rest = projects.filter(p => !p.featured);
const row = p => `<a class="row" href="https://github.com/lrxrn/${p.name}"><div><b>${p.name}</b><span>${p.line}</span></div><i class="arrow">→</i></a>`;
const small = p => `<a class="row" href="https://github.com/lrxrn/${p.name}"><b>${p.name}</b><span>${p.line}</span><i>${p.year}</i></a>`;

document.getElementById('app').innerHTML = `
<header class="reveal" style="--i:0">
  <h1>Meesum</h1>
  <p class="bio">Software engineering student building small, useful tools.</p>
</header>
<section class="reveal" style="--i:1" id="stack">
  <p class="label">Stack</p>
  ${Object.entries(stack).map(([k, v]) => `<div class="stack"><span class="k">${k}</span><ul>${v.map(t => `<li>${t}</li>`).join('')}</ul></div>`).join('')}
</section>
<section class="reveal" style="--i:2" id="work">
  <p class="label">Work</p>
  ${featured.map(row).join('')}
  <details class="all"><summary>All ${projects.length} projects</summary>${rest.map(small).join('')}</details>
</section>
<section class="reveal" style="--i:3" id="contact">
  <p class="label">Contact</p>
  <p class="lede">Open to internships and interesting projects.</p>
  <a class="btn" href="mailto:${email}">${email}</a>
  <p class="elsewhere"><a href="https://github.com/lrxrn">GitHub</a> · <a href="https://linkedin.com/in/meesum-ahmed">LinkedIn</a> · Discord m13kx</p>
</section>
<footer class="reveal" style="--i:4"><span>© 2026 Meesum</span><button id="t" aria-label="Toggle theme">◐</button></footer>`;

document.getElementById('t').onclick = () => {
  const r = document.documentElement;
  const dark = r.dataset.theme ? r.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  r.dataset.theme = dark ? 'light' : 'dark';
};
