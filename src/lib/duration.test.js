// Run: node src/lib/duration.test.js
import assert from 'node:assert/strict';
import { months, fmt, label } from './duration.js';

const nov26 = new Date(2026, 10, 24);
assert.equal(fmt(months('2026-05', nov26)), '7 mos');
assert.equal(fmt(months('2026-04', '2026-08')), '5 mos');
assert.equal(fmt(months('2024-12', nov26)), '2 yrs');
assert.equal(fmt(months('2024-10', nov26)), '2 yrs 2 mos');
assert.equal(fmt(months('2024-10', '2024-12')), '3 mos');
assert.equal(fmt(1), '1 mo');
assert.equal(label('2026-05'), 'May 2026');
console.log('duration ok');
