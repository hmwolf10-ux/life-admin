/* Pure logic: dates, weekly resets, and service-due status. No DOM, so it runs under node --test. */
const pad = n => String(n).padStart(2, '0');
export const ymd = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const parse = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
export const shift = (s, n) => { const d = parse(s); d.setDate(d.getDate() + n); return ymd(d); };
export const weekStart = s => shift(s, -((parse(s).getDay() + 6) % 7));
export function addMonths(s, n) {
  const d = parse(s), day = d.getDate(); d.setDate(1); d.setMonth(d.getMonth() + n);
  const last = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate(); d.setDate(Math.min(day, last)); return ymd(d);
}
export const daysBetween = (a, b) => Math.round((parse(b) - parse(a)) / 86400000);

/* The newest service entry for an interval, by date then mileage. */
export const lastService = (log, id) => log.filter(e => e.k === id).sort((a, b) => b.d.localeCompare(a.d) || (b.mi || 0) - (a.mi || 0))[0] || null;

/* status: 'none' (never logged), 'over', 'soon', or 'ok'. */
export function dueStatus(iv, last, miles, today) {
  if (!last) return { status: 'none' };
  const dueMi = iv.mi && last.mi != null ? last.mi + iv.mi : null, dueDate = iv.mo ? addMonths(last.d, iv.mo) : null;
  const miLeft = dueMi != null && miles != null ? dueMi - miles : null, dayLeft = dueDate ? daysBetween(today, dueDate) : null;
  const over = (miLeft != null && miLeft < 0) || (dayLeft != null && dayLeft < 0);
  const soon = (miLeft != null && miLeft < 1000) || (dayLeft != null && dayLeft < 30);
  return { status: over ? 'over' : soon ? 'soon' : 'ok', miLeft, dayLeft, dueMi, dueDate };
}
export const pct = (done, total) => total ? Math.round(done / total * 100) : 0;
