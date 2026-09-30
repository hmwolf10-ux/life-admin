import test from 'node:test';
import assert from 'node:assert/strict';
import { weekStart, addMonths, daysBetween, lastService, dueStatus, shift, pct } from '../src/engine.js';

test('weekStart is the Monday of that week', () => {
  assert.equal(weekStart('2026-09-30'), '2026-09-28'); assert.equal(weekStart('2026-09-28'), '2026-09-28'); assert.equal(weekStart('2026-10-04'), '2026-09-28');
});
test('addMonths clamps to month end', () => {
  assert.equal(addMonths('2026-01-31', 1), '2026-02-28'); assert.equal(addMonths('2026-09-15', 6), '2027-03-15'); assert.equal(addMonths('2026-11-30', 3), '2027-02-28');
});
test('daysBetween and shift', () => { assert.equal(daysBetween('2026-09-01', '2026-10-01'), 30); assert.equal(shift('2026-03-01', -1), '2026-02-28'); });
test('lastService picks the newest entry for the interval', () => {
  const log = [{ k: 'oil', d: '2026-01-01', mi: 100 }, { k: 'oil', d: '2026-06-01', mi: 5000 }, { k: 'rotate', d: '2026-07-01', mi: 6000 }];
  assert.equal(lastService(log, 'oil').mi, 5000); assert.equal(lastService(log, 'cabin'), null);
});
const oil = { mi: 7500, mo: 6 };
test('no history means none', () => assert.equal(dueStatus(oil, null, 9000, '2026-09-30').status, 'none'));
test('ok when far from both limits', () => assert.equal(dueStatus(oil, { d: '2026-09-01', mi: 10000 }, 11000, '2026-09-30').status, 'ok'));
test('soon when under 1000 miles or 30 days left', () => {
  assert.equal(dueStatus(oil, { d: '2026-09-01', mi: 10000 }, 16800, '2026-09-30').status, 'soon');
  assert.equal(dueStatus(oil, { d: '2026-04-15', mi: 10000 }, 10100, '2026-09-30').status, 'soon');
});
test('over when either limit is passed', () => {
  assert.equal(dueStatus(oil, { d: '2026-09-01', mi: 10000 }, 17600, '2026-09-30').status, 'over');
  assert.equal(dueStatus(oil, { d: '2026-01-01', mi: 10000 }, 10100, '2026-09-30').status, 'over');
});
test('date-only and mileage-only intervals', () => {
  assert.equal(dueStatus({ mi: 0, mo: 12 }, { d: '2025-09-01' }, null, '2026-09-30').status, 'over');
  assert.equal(dueStatus({ mi: 5000, mo: 0 }, { d: '2026-01-01', mi: 1000 }, 2000, '2026-09-30').status, 'ok');
});
test('pct', () => { assert.equal(pct(1, 3), 33); assert.equal(pct(0, 0), 0); });
