// Refresh commits / share / contributors in src/data/projects.json from the GitHub API.
// Needs `gh` signed in with access to the private repos. Run: npm run stats   (add --write to save)
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

const ME = 'lrxrn';
const file = new URL('../src/data/projects.json', import.meta.url);
const projects = JSON.parse(fs.readFileSync(file, 'utf8'));
const write = process.argv.includes('--write');

for (const p of projects) {
  if (!p.repo) continue;
  try {
    const rows = JSON.parse(execFileSync('gh', ['api', `repos/${p.repo}/contributors?per_page=100`, '--paginate', '--slurp'], { encoding: 'utf8' })).flat();
    const total = rows.reduce((n, r) => n + r.contributions, 0);
    const mine = rows.find(r => r.login === ME)?.contributions ?? 0;
    const next = { commits: mine, share: Math.round((mine / total) * 100), contributors: rows.length >= 20 ? '20+' : String(rows.length) };
    console.log(`${p.name.padEnd(14)} ${p.commits} -> ${next.commits}  (${next.share}%, ${next.contributors} contributors)`);
    if (mine) Object.assign(p, next); // never overwrite with 0 (private repo you can't read, rename)
  } catch (e) {
    console.warn(`${p.name}: skipped (${e.message.split('\n')[0]})`);
  }
}

if (write) {
  fs.writeFileSync(file, '[\n' + projects.map(p => '  ' + JSON.stringify(p)).join(',\n') + '\n]\n');
  console.log('saved');
}
