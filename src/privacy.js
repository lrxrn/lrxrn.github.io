import '@fontsource-variable/lexend';
import './styles/global.css';
import './stores/theme.js'; // sets data-theme, same as the main page

const css = `
.doc { max-width: 640px; margin: 0 auto; padding: 72px 24px 96px; display: block; }
.doc::before { display: none; }
.doc h1 { font-size: clamp(36px, 8vw, 52px); letter-spacing: -.03em; line-height: 1.1; font-weight: 600; margin: 24px 0 8px; }
.doc h2 { font-size: 20px; letter-spacing: -.01em; font-weight: 600; color: var(--violet); margin: 40px 0 8px; }
.doc p, .doc li { color: var(--fg); max-width: 62ch; }
.doc p + p, .doc ul { margin-top: 12px; }
.doc ul { padding-left: 20px; display: grid; gap: 8px; }
.doc .muted { color: var(--muted); font: 13px var(--mono); }
@media (max-width: 640px) { .doc { padding: 48px 20px 72px; } }
`;
document.head.append(Object.assign(document.createElement('style'), { textContent: css }));

// the address is only assembled here so it is not sitting in the page source
const mail = document.getElementById('mail');
mail.href = 'mailto:' + ['me', 'lrxrn.dev'].join('@');
