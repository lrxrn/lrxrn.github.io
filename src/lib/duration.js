// Inclusive month counts, the way LinkedIn shows them: May 2026 to Nov 2026 is 7 mos.
const parts = v => (typeof v === 'string' ? v.split('-').map(Number) : [v.getFullYear(), v.getMonth() + 1]);

export function months(start, end = new Date()) {
  const [sy, sm] = parts(start), [ey, em] = parts(end);
  return (ey - sy) * 12 + (em - sm) + 1;
}

export function fmt(m) {
  const y = Math.floor(m / 12), r = m % 12;
  return [y && `${y} yr${y > 1 ? 's' : ''}`, r && `${r} mo${r > 1 ? 's' : ''}`].filter(Boolean).join(' ') || '1 mo';
}

// 'YYYY-MM' -> 'May 2026'
export const label = s => new Date(...parts(s).map((n, i) => (i ? n - 1 : n))).toLocaleString('en', { month: 'short', year: 'numeric' });
