/* Life Admin: daily routines, product stock, car upkeep, and paperwork how-tos. */
import { $, $$, esc, ICON, uid, createStore, applyTheme, act, onInput, onChange, setNavItems, setNav, setBar, view, openSheet, closeSheet, toast, confirmSheet, startRouter, go, settingsHtml, bindSettings, registerSW } from './ui.js';
import { DEFAULT_ROUTINES, DEFAULT_STOCK, DEFAULT_INTERVALS, VEHICLE_FIELDS } from './defaults.js';
import { GUIDES } from './guides.js';
import { ymd, weekStart, lastService, dueStatus, pct } from './engine.js';

const store = createStore('adm.');
applyTheme(store);
const WHEEL = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2.5"/><path d="M12 3v6.5M12 14.5V21M4.2 16.5l5.6-3.2M14.2 10.7l5.6-3.2"/></svg>';
setNavItems([['today', 'Today', ICON.check], ['stock', 'Stock', ICON.list], ['car', 'Car', WHEEL], ['guides', 'Guides', ICON.book], ['settings', 'Settings', ICON.gear]]);

let routines = store.get('routines', DEFAULT_ROUTINES);
let checks = store.get('checks', {});
let stock = store.get('stock', DEFAULT_STOCK);
let car = store.get('car', { info: {}, miles: null, milesOn: null });
let service = store.get('service', []);
let intervals = store.get('intervals', DEFAULT_INTERVALS);
const today = () => ymd(new Date());
const chev = '<svg class="chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>';
const put = (k, v) => store.set(k, v);
const SECT = [['am', 'Morning', 'day'], ['pm', 'Evening', 'day'], ['weekly', 'Weekly', 'week']];
const slot = kind => kind === 'week' ? 'w' + weekStart(today()) : 'd' + today();
const isDone = (kind, id) => !!(checks[slot(kind)] || {})[id];

/* ---------- Today ---------- */
function viewToday() {
  setBar({ title: 'Today', doc: 'Today · Life Admin' }); setNav('today');
  const all = SECT.flatMap(([k, , kind]) => routines[k].map(r => ({ r, kind }))), done = all.filter(x => isDone(x.kind, x.r.id)).length;
  const low = stock.filter(s => s.status !== 'ok'), due = intervals.filter(iv => ['over', 'soon'].includes(dueStatus(iv, lastService(service, iv.id), car.miles, today()).status));
  const d = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
  view(`<div class="card"><div class="row between"><div><div class="title">${done} of ${all.length}</div><div class="small muted">${esc(d)}</div></div><span class="pill ${done === all.length && all.length ? 'green' : ''}">${pct(done, all.length)}%</span></div><div class="progress ${done === all.length && all.length ? 'ok' : ''}" style="margin-top:12px"><i style="width:${pct(done, all.length)}%"></i></div></div>
    ${low.length ? `<a class="card alert" href="#/stock"><b>${low.length} to restock</b><span class="small muted">${esc(low.slice(0, 3).map(s => s.name).join(', '))}${low.length > 3 ? '…' : ''}</span>${chev}</a>` : ''}
    ${due.length ? `<a class="card alert" href="#/car"><b>${due.length} car item${due.length > 1 ? 's' : ''} due</b><span class="small muted">${esc(due.slice(0, 3).map(s => s.name).join(', '))}</span>${chev}</a>` : ''}
    ${SECT.map(([k, label, kind]) => `<div class="sec row between" style="margin-right:0"><span>${label}${kind === 'week' ? ' · resets Monday' : ''}</span><button class="btn link sm" data-a="edit-routine" data-k="${k}">Edit</button></div><div class="card flush">${routines[k].length ? routines[k].map(r => `<label class="check"><input type="checkbox" data-c="tick" data-k="${kind}" data-id="${r.id}" ${isDone(kind, r.id) ? 'checked' : ''}><span class="${isDone(kind, r.id) ? 'done' : ''}">${esc(r.t)}</span></label>`).join('') : '<div class="empty" style="padding:16px">Nothing here yet.</div>'}</div>`).join('')}`);
}
onChange('tick', el => {
  const s = slot(el.dataset.k); checks[s] = checks[s] || {}; if (el.checked) checks[s][el.dataset.id] = 1; else delete checks[s][el.dataset.id];
  Object.keys(checks).sort().slice(0, -60).forEach(k => delete checks[k]); put('checks', checks); viewToday();
});
act('edit-routine', el => {
  const k = el.dataset.k, label = SECT.find(s => s[0] === k)[1];
  openSheet(`<div class="row between"><h2>${label} routine</h2><button class="icon-btn" data-a="close-sheet" aria-label="Close">${ICON.x}</button></div><div id="rlist">${rlist(k)}</div>
    <div class="row" style="margin-top:12px"><input id="rnew" type="text" maxlength="40" placeholder="Add a step" aria-label="New step"><button class="btn primary" data-a="radd" data-k="${k}">Add</button></div>`);
});
const rlist = k => routines[k].map((r, i) => `<div class="row" style="min-height:48px;border-bottom:1px solid var(--line)"><span class="grow">${esc(r.t)}</span><button class="icon-btn" data-a="rmv" data-k="${k}" data-i="${i}" data-d="-1" ${i === 0 ? 'disabled' : ''} aria-label="Move up">${ICON.up}</button><button class="icon-btn" data-a="rmv" data-k="${k}" data-i="${i}" data-d="1" ${i === routines[k].length - 1 ? 'disabled' : ''} aria-label="Move down">${ICON.down}</button><button class="icon-btn" data-a="rdel" data-k="${k}" data-i="${i}" aria-label="Remove ${esc(r.t)}">${ICON.trash}</button></div>`).join('') || '<p class="muted small">No steps yet.</p>';
const rsave = k => { put('routines', routines); $('#rlist').innerHTML = rlist(k); viewToday(); };
act('radd', el => { const v = $('#rnew').value.trim(); if (!v) return; routines[el.dataset.k].push({ id: uid(), t: v }); $('#rnew').value = ''; rsave(el.dataset.k); });
act('rdel', el => { routines[el.dataset.k].splice(+el.dataset.i, 1); rsave(el.dataset.k); });
act('rmv', el => { const a = routines[el.dataset.k], i = +el.dataset.i, j = i + +el.dataset.d; if (j < 0 || j >= a.length) return; [a[i], a[j]] = [a[j], a[i]]; rsave(el.dataset.k); });

/* ---------- Stock ---------- */
const ST = { ok: ['Have it', 'green'], low: ['Running low', ''], out: ['Out', 'gray'] };
const NEXT = { ok: 'low', low: 'out', out: 'ok' };
function viewStock() {
  setBar({ title: 'Stock', doc: 'Stock · Life Admin' }); setNav('stock');
  const order = { out: 0, low: 1, ok: 2 }, list = [...stock].sort((a, b) => order[a.status] - order[b.status] || a.name.localeCompare(b.name)), need = list.filter(s => s.status !== 'ok').length;
  view(`<div class="row between" style="margin:0 4px 8px"><span class="small muted">${need ? need + ' to restock. Tap a status to change it.' : 'Everything is stocked. Tap a status to change it.'}</span><button class="btn sm" data-a="add-stock">${ICON.plus} Add</button></div>
    <div class="card flush">${list.map(s => `<div class="srow"><div class="grow"><b>${esc(s.name)}</b>${s.note ? `<div class="small muted">${esc(s.note)}</div>` : ''}</div>${s.status !== 'ok' ? `<a class="btn sm" href="${esc(s.url || 'https://www.google.com/search?tbm=shop&q=' + encodeURIComponent(s.name))}" target="_blank" rel="noopener">Reorder</a>` : ''}<button class="pill ${ST[s.status][1]} pbtn" data-a="cycle" data-id="${s.id}">${ST[s.status][0]}</button><button class="icon-btn" data-a="edit-stock" data-id="${s.id}" aria-label="Edit ${esc(s.name)}">${ICON.edit}</button></div>`).join('') || '<div class="empty"><b>No products yet</b>Add what you keep in stock.</div>'}</div>`);
}
act('cycle', el => { const s = stock.find(x => x.id === el.dataset.id); s.status = NEXT[s.status]; put('stock', stock); viewStock(); });
function stockForm(s) {
  openSheet(`<h2>${s ? 'Edit product' : 'Add a product'}</h2><label class="f" for="sn">Name</label><input id="sn" type="text" maxlength="40" value="${esc(s ? s.name : '')}" autocomplete="off"><label class="f" for="sno">Note (size, brand)</label><input id="sno" type="text" maxlength="60" value="${esc(s ? s.note || '' : '')}" autocomplete="off"><label class="f" for="su">Reorder link (optional)</label><input id="su" type="url" placeholder="https://" value="${esc(s ? s.url || '' : '')}">
    <div class="row" style="margin-top:16px">${s ? `<button class="btn danger" data-a="del-stock" data-id="${s.id}">Delete</button>` : ''}<button class="btn block" data-a="close-sheet">Cancel</button><button class="btn primary block" data-a="save-stock" data-id="${s ? s.id : ''}">Save</button></div>`);
}
act('add-stock', () => stockForm(null));
act('edit-stock', el => stockForm(stock.find(x => x.id === el.dataset.id)));
act('save-stock', el => {
  const name = $('#sn').value.trim(); if (!name) return toast('Give it a name');
  const url = $('#su').value.trim(), d = { name, note: $('#sno').value.trim(), url: /^https?:\/\//i.test(url) ? url : '' };
  if (el.dataset.id) Object.assign(stock.find(x => x.id === el.dataset.id), d); else stock.push({ id: uid(), status: 'ok', ...d });
  put('stock', stock); closeSheet(); viewStock();
});
act('del-stock', el => { const id = el.dataset.id; closeSheet(); const old = stock; stock = stock.filter(x => x.id !== id); put('stock', stock); viewStock(); toast('Product deleted', () => { stock = old; put('stock', stock); viewStock(); }); });

/* ---------- Car ---------- */
const DUE = { none: ['Not logged', 'gray'], ok: ['OK', 'green'], soon: ['Due soon', ''], over: ['Overdue', 'warn'] };
const fmtMi = n => n == null ? '' : Number(n).toLocaleString();
const fmtDate = s => new Date(s + 'T12:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
function viewCar() {
  setBar({ title: 'Car', doc: 'Car · Life Admin' }); setNav('car');
  const t = today(), info = car.info || {};
  const rows = intervals.map(iv => { const last = lastService(service, iv.id), d = dueStatus(iv, last, car.miles, t), [label, cls] = DUE[d.status];
    const when = last ? `Last ${fmtDate(last.d)}${last.mi != null ? ' at ' + fmtMi(last.mi) + ' mi' : ''}` : 'Never logged';
    const next = d.status === 'none' ? '' : [d.dueMi != null ? 'due ' + fmtMi(d.dueMi) + ' mi' : '', d.dueDate ? 'by ' + fmtDate(d.dueDate) : ''].filter(Boolean).join(' or ');
    return `<div class="srow"><div class="grow"><b>${esc(iv.name)}</b><div class="small muted">${when}${next ? ' · ' + next : ''}</div></div><span class="pill ${cls}">${label}</span></div>`; }).join('');
  const hist = [...service].sort((a, b) => b.d.localeCompare(a.d)).slice(0, 25).map(e => `<div class="srow"><div class="grow"><b>${esc(e.name)}</b><div class="small muted">${fmtDate(e.d)}${e.mi != null ? ' · ' + fmtMi(e.mi) + ' mi' : ''}${e.cost ? ' · $' + e.cost : ''}${e.note ? ' · ' + esc(e.note) : ''}</div></div><button class="icon-btn" data-a="del-service" data-id="${e.id}" aria-label="Delete entry">${ICON.trash}</button></div>`).join('');
  view(`<div class="card"><div class="row between"><div><div class="small muted">${esc(info.name || 'Your vehicle')}</div><div class="title">${car.miles != null ? fmtMi(car.miles) + ' mi' : 'Odometer not set'}</div>${car.milesOn ? `<div class="tiny muted">As of ${fmtDate(car.milesOn)}</div>` : ''}</div><button class="btn sm" data-a="odo">Update</button></div>
      <div class="row" style="margin-top:14px"><button class="btn primary block" data-a="log-service">${ICON.plus} Log service</button></div></div>
    <div class="sec">Maintenance</div><div class="card flush">${rows}</div>
    <div class="sec row between" style="margin-right:0"><span>Service history</span></div>${hist ? `<div class="card flush">${hist}</div>` : '<div class="card"><p class="small muted">No service logged yet. Logging one sets its next due date.</p></div>'}
    <div class="sec row between" style="margin-right:0"><span>Vehicle details</span><button class="btn link sm" data-a="edit-car">Edit</button></div>
    <div class="card">${VEHICLE_FIELDS.filter(([k]) => info[k]).map(([k, l]) => `<div class="kv"><span>${l}</span><span>${esc(info[k])}</span></div>`).join('') || '<p class="small muted">Keep your plate, VIN, policy and loan numbers handy. They stay on this device only.</p>'}</div>`);
}
act('odo', () => openSheet(`<h2>Odometer</h2><label class="f" for="mi">Miles right now</label><input id="mi" type="number" inputmode="numeric" min="0" value="${car.miles ?? ''}"><div class="row" style="margin-top:16px"><button class="btn block" data-a="close-sheet">Cancel</button><button class="btn primary block" data-a="save-odo">Save</button></div>`));
act('save-odo', () => { const v = parseInt($('#mi').value, 10); if (isNaN(v) || v < 0) return toast('Enter the odometer reading'); car.miles = v; car.milesOn = today(); put('car', car); closeSheet(); viewCar(); });
act('log-service', () => {
  openSheet(`<h2>Log service</h2><label class="f" for="sk">What was done</label><select id="sk">${intervals.map(iv => `<option value="${iv.id}">${esc(iv.name)}</option>`).join('')}<option value="">Something else</option></select>
    <div id="sother" hidden><label class="f" for="sname">Describe it</label><input id="sname" type="text" maxlength="50"></div>
    <div class="row" style="gap:10px"><div class="grow"><label class="f" for="sd">Date</label><input id="sd" type="date" value="${today()}"></div><div class="grow"><label class="f" for="smi">Miles</label><input id="smi" type="number" inputmode="numeric" value="${car.miles ?? ''}"></div></div>
    <div class="row" style="gap:10px"><div class="grow"><label class="f" for="sc">Cost ($)</label><input id="sc" type="number" inputmode="decimal" min="0"></div><div class="grow"><label class="f" for="snt">Note</label><input id="snt" type="text" maxlength="60"></div></div>
    <div class="row" style="margin-top:16px"><button class="btn block" data-a="close-sheet">Cancel</button><button class="btn primary block" data-a="save-service">Save</button></div>`);
  $('#sk').addEventListener('change', e => { $('#sother').hidden = !!e.target.value; });
});
act('save-service', () => {
  const k = $('#sk').value, iv = intervals.find(x => x.id === k), name = iv ? iv.name : $('#sname').value.trim(), d = $('#sd').value;
  if (!name || !d) return toast('Add what was done and the date');
  const mi = $('#smi').value === '' ? null : parseInt($('#smi').value, 10), cost = $('#sc').value.trim();
  service.push({ id: uid(), k: k || 'other', name, d, mi, cost, note: $('#snt').value.trim() });
  if (mi != null && (car.miles == null || mi > car.miles)) { car.miles = mi; car.milesOn = d; put('car', car); }
  put('service', service); closeSheet(); viewCar(); toast('Service logged');
});
act('del-service', el => { const old = service; service = service.filter(e => e.id !== el.dataset.id); put('service', service); viewCar(); toast('Entry deleted', () => { service = old; put('service', service); viewCar(); }); });
act('edit-car', () => openSheet(`<h2>Vehicle details</h2><p class="small muted" style="margin:4px 0">Saved on this device only.</p>${VEHICLE_FIELDS.map(([k, l, ph]) => `<label class="f" for="cv-${k}">${l}</label><input id="cv-${k}" type="text" maxlength="80" placeholder="${esc(ph)}" value="${esc((car.info || {})[k] || '')}" autocomplete="off">`).join('')}<div class="row" style="margin-top:16px"><button class="btn block" data-a="close-sheet">Cancel</button><button class="btn primary block" data-a="save-car">Save</button></div>`));
act('save-car', () => { car.info = {}; VEHICLE_FIELDS.forEach(([k]) => { const v = $('#cv-' + k).value.trim(); if (v) car.info[k] = v; }); put('car', car); closeSheet(); viewCar(); });

/* ---------- Guides ---------- */
function viewGuides() {
  setBar({ title: 'Guides', doc: 'Guides · Life Admin' }); setNav('guides');
  view(`<div class="card flush">${GUIDES.map(g => `<a class="list-row" href="#/guide/${g.id}"><span class="nm">${esc(g.title)}<span class="sub">${esc(g.blurb)}</span></span>${chev}</a>`).join('')}</div>`);
}
function viewGuide(id) {
  const g = GUIDES.find(x => x.id === id); if (!g) return go('#/guides');
  setNav(null); setBar({ title: g.title, back: '#/guides', doc: g.title + ' · Life Admin' });
  view(`<article class="card doc">${g.html.replace(/<table>([\s\S]*?)<\/table>/g, '<div class="tw"><table>$1</table></div>')}</article>`);
}

/* ---------- Settings ---------- */
function viewSettings() {
  setBar({ title: 'Settings', doc: 'Settings · Life Admin' }); setNav('settings');
  view(`${settingsHtml(store)}<div class="sec">Car</div><div class="card"><div class="row between"><span>Service intervals</span><button class="btn sm" data-a="edit-iv">Edit</button></div><p class="small muted" style="margin-top:8px">The defaults are typical. Match them to your owner's manual.</p></div>
    <div class="sec">About</div><div class="card"><p class="small muted">Routines, stock, vehicle details, and service history stay on this device. General guidance only, not legal, tax, or medical advice.</p></div>`);
}
act('edit-iv', () => openSheet(`<h2>Service intervals</h2><p class="small muted" style="margin:4px 0 8px">Miles and months between services. Use 0 to ignore one.</p>${intervals.map((iv, i) => `<div class="kv" style="align-items:center;gap:8px"><span style="flex:1;color:var(--fg)">${esc(iv.name)}</span><input type="number" inputmode="numeric" min="0" style="width:90px" value="${iv.mi}" data-i="iv" data-n="${i}" data-f="mi" aria-label="${esc(iv.name)} miles"><input type="number" inputmode="numeric" min="0" style="width:70px" value="${iv.mo}" data-i="iv" data-n="${i}" data-f="mo" aria-label="${esc(iv.name)} months"></div>`).join('')}<div class="row tiny muted" style="justify-content:flex-end;gap:40px;margin:4px 6px"><span>miles</span><span>months</span></div><button class="btn primary block" style="margin-top:12px" data-a="close-sheet">Done</button>`));
onInput('iv', el => { const v = Math.max(0, parseInt(el.value, 10) || 0); intervals[+el.dataset.n][el.dataset.f] = v; put('intervals', intervals); });
bindSettings({ store, app: 'life-admin', rerender: full => { if (full) { routines = store.get('routines', DEFAULT_ROUTINES); checks = store.get('checks', {}); stock = store.get('stock', DEFAULT_STOCK); car = store.get('car', { info: {}, miles: null, milesOn: null }); service = store.get('service', []); intervals = store.get('intervals', DEFAULT_INTERVALS); } viewSettings(); } });

startRouter({ today: viewToday, stock: viewStock, car: viewCar, guides: viewGuides, guide: viewGuide, settings: viewSettings }, 'today');
registerSW();
