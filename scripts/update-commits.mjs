// Refresh commits / share / contributors and top languages in src/data/projects.json from the GitHub API.
// Needs `gh` signed in with access to the private repos. Run: npm run stats   (add --write to save)
// `repo` drives commits and languages; `langRepo` (a repo or a list of repos, bytes are summed) overrides where languages come from.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

const ME = 'lrxrn';
const file = new URL('../src/data/projects.json', import.meta.url);
const projects = JSON.parse(fs.readFileSync(file, 'utf8'));
const write = process.argv.includes('--write');
const gh = (...args) => JSON.parse(execFileSync('gh', ['api', ...args], { encoding: 'utf8' }));

for (const p of projects) {
  if (p.repo) {
    try {
      const rows = JSON.parse(execFileSync('gh', ['api', `repos/${p.repo}/contributors?per_page=100`, '--paginate', '--slurp'], { encoding: 'utf8' })).flat();
      const total = rows.reduce((n, r) => n + r.contributions, 0);
      const mine = rows.find(r => r.login === ME)?.contributions ?? 0;
      // keep a hand-written "20+" when the API's top-100 list is shorter than that
      const contributors = String(p.contributors).endsWith('+') ? p.contributors : rows.length >= 20 ? '20+' : String(rows.length);
      console.log(`${p.name.padEnd(14)} commits ${p.commits} -> ${mine} (${Math.round((mine / total) * 100)}%, ${contributors} contributors)`);
      if (mine) Object.assign(p, { commits: mine, share: Math.round((mine / total) * 100), contributors }); // never overwrite with 0
    } catch (e) {
      console.warn(`${p.name}: commits skipped (${e.message.split('\n')[0]})`);
    }
  }
  const lr = [].concat(p.langRepo || p.repo || []);
  if (lr.length) {
    try {
      const bytes = {};
      for (const r of lr) for (const [k, n] of Object.entries(gh(`repos/${r}/languages`))) bytes[k] = (bytes[k] || 0) + n;
      const sum = Object.values(bytes).reduce((a, b) => a + b, 0);
      const top = Object.entries(bytes).sort((a, b) => b[1] - a[1]).slice(0, 3)
        .map(([name, n]) => ({ name, pct: Math.round((n / sum) * 100) })).filter(l => l.pct >= 1);
      if (top.length) { p.languages = top; console.log(`${p.name.padEnd(14)} ${top.map(l => `${l.name} ${l.pct}%`).join(', ')}`); }
    } catch (e) {
      console.warn(`${p.name}: languages skipped (${e.message.split('\n')[0]})`);
    }
  }
}

if (write) {
  fs.writeFileSync(file, '[\n' + projects.map(p => '  ' + JSON.stringify(p)).join(',\n') + '\n]\n');
  console.log('saved');
}
