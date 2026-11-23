import '@fontsource-variable/lexend';
import './styles/global.css';
import './stores/theme.js'; // sets data-theme, same as the main page
import { kit } from './lib/asciify.js';

const css = `
.lost { min-height: 100svh; display: grid; place-items: end center; padding: 24px 24px 72px; background: var(--bg); }
.copy { text-align: center; display: grid; justify-items: center; gap: 16px; }
.copy h1 { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); } /* the big 404 is drawn by the field */
.copy p { font-size: 17px; color: var(--muted); }
.btn { display: inline-flex; align-items: center; min-height: 48px; padding: 0 24px; border-radius: 999px; background: var(--violet); color: var(--on-violet); font-weight: 600; font-size: 15px; text-decoration: none; transition: transform 120ms var(--ease-out); }
.btn:hover { color: var(--on-violet); } .btn:active { transform: scale(.97); }
@media (prefers-reduced-motion: reduce) { .btn { transform: none !important; } }
`;
document.head.append(Object.assign(document.createElement('style'), { textContent: css }));

const home = document.getElementById('home');
kit().then(({ fieldBackground }) => {
  const lost = fieldBackground(document.getElementById('art'), { preset: 'notFound', ink: '--violet', label: '404' });
  // the numerals scatter, then re-form, before the page goes home
  home.addEventListener('click', async e => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    e.preventDefault();
    await lost.scatter(home);
    location.href = home.href;
  });
}).catch(() => {});
