/* ============================================================
   main.js · 体验页编排：语言 / 进场 / 舞台 HUD / 车型匹配 / 接机旅程 / 调度 / 地球
   ============================================================ */
import { initStage } from './stage.js';
import { initDispatch } from './dispatch.js';

const $ = (s, r = document) => r.querySelector(s);
const html = document.documentElement;
const isCN = () => html.lang === 'cn';
const tx = (en, cn) => `<span class="lang-en">${en}</span><span class="lang-cn">${cn}</span>`;
const clamp = (v, a, b) => Math.min(Math.max(v, a), b);

/* —— 语言（与主站共用 lyct-lang）—— */
$('#lang-btn').addEventListener('click', () => {
  html.lang = isCN() ? 'en' : 'cn';
  try { localStorage.setItem('lyct-lang', html.lang); } catch (e) {}
});

/* —— 进场动画 —— */
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
document.querySelectorAll('.rv').forEach(el => io.observe(el));

/* —— 3D 舞台 —— */
let stage = null;
try {
  stage = initStage({ canvas: $('#car-canvas'), hotspotLayer: $('#hotspots'), stageEl: $('#stage') });
} catch (e) {
  console.warn('WebGL unavailable', e);
  $('#car-canvas').style.background = 'url(/images/hero.jpg) center/cover';
}
requestAnimationFrame(() => setTimeout(() => $('#loader').classList.add('done'), 350));

const PAINTS = [
  { c: '#0e0f12', m: 0.55, en: 'Obsidian', cn: '曜石黑' },
  { c: '#b8955f', m: 0.8, en: 'Champagne', cn: '香槟金' },
  { c: '#e6e2da', m: 0.25, en: 'Pearl', cn: '珍珠白' },
  { c: '#14264b', m: 0.65, en: 'Sapphire', cn: '午夜蓝' },
  { c: '#4d0d1a', m: 0.6, en: 'Bordeaux', cn: '勃艮第红' },
];
const AMBIENT = [{ c: '#ffb36b', en: 'Amber', cn: '琥珀' }, { c: '#62d8ff', en: 'Ice', cn: '冰蓝' }, { c: '#b48cff', en: 'Violet', cn: '紫罗兰' }];

const paintRow = $('#paint-row');
PAINTS.forEach((p, i) => {
  const b = document.createElement('button');
  b.className = 'swatch' + (i === 1 ? ' on' : ''); b.type = 'button';
  b.style.background = `radial-gradient(circle at 35% 30%, #ffffff55, ${p.c} 45%, ${p.c})`;
  b.title = p.en; b.setAttribute('aria-label', p.en);
  b.addEventListener('click', () => {
    paintRow.querySelectorAll('.swatch').forEach(x => x.classList.remove('on')); b.classList.add('on');
    stage && stage.setPaint(p.c, p.m);
    $('#paint-name').innerHTML = tx(p.en, p.cn);
  });
  paintRow.appendChild(b);
});
$('#paint-name').innerHTML = tx(PAINTS[1].en, PAINTS[1].cn);

const ambRow = $('#ambient-row');
AMBIENT.forEach((a, i) => {
  const b = document.createElement('button');
  b.className = 'swatch' + (i === 0 ? ' on' : ''); b.type = 'button';
  b.style.background = a.c; b.style.boxShadow = `0 0 14px ${a.c}`;
  b.setAttribute('aria-label', a.en);
  b.addEventListener('click', () => { ambRow.querySelectorAll('.swatch').forEach(x => x.classList.remove('on')); b.classList.add('on'); stage && stage.setAmbient(a.c); });
  ambRow.appendChild(b);
});

const dayBtn = $('#day-btn'), nightBtn = $('#night-btn');
let nightPinned = null;
dayBtn.addEventListener('click', () => { nightPinned = nightPinned === false ? null : false; stage && stage.setNight(nightPinned); });
nightBtn.addEventListener('click', () => { nightPinned = nightPinned === true ? null : true; stage && stage.setNight(nightPinned); });

const dots = [...document.querySelectorAll('#chap-dots span')];
(function hudLoop() {
  requestAnimationFrame(hudLoop);
  if (!stage) return;
  const p = stage.progress, n = stage.night;
  dots.forEach((d, i) => d.classList.toggle('on', Math.round(p) === i));
  dayBtn.classList.toggle('on', n < 0.5); nightBtn.classList.toggle('on', n >= 0.5);
  ambRow.style.display = n > 0.3 ? '' : 'none';
  $('#scroll-cue').style.opacity = p < 0.15 ? 1 : 0;
  // 移动端：车型匹配章节时收起 HUD，避免压住面板
  $('#hud').style.opacity = (innerWidth < 900 && p > 2.6) ? 0 : 1;
  $('#hud').style.pointerEvents = (innerWidth < 900 && p > 2.6) ? 'none' : '';
})();

/* —— 车型匹配 —— */
const TYPES = {
  sedan: { seats: 4, bags: 3, en: 'Executive sedan', cn: '行政轿车', model: 'S-Class · E-Class', cols: 2 },
  mpv: { seats: 6, bags: 6, en: 'Business MPV', cn: '高端商务车', model: 'V-Class · ZEEKR 009 · GL8', cols: 3 },
  coach: { seats: 19, bags: 14, en: 'Executive coach', cn: '商务中巴', model: 'Toyota Coaster', cols: 5 },
};
const SCEN = [
  { en: 'Solo trip', cn: '单人商务', p: 1, b: 1 },
  { en: 'Family', cn: '家庭出游', p: 4, b: 4 },
  { en: 'Exec team', cn: '高管团队', p: 6, b: 6 },
  { en: 'Delegation', cn: '代表团', p: 18, b: 12 },
  { en: 'Conference', cn: '大型会议', p: 46, b: 30 },
];
const pax = $('#pax'), bag = $('#bag');
const fit = (p, b) => (p <= 4 && b <= 3) ? 'sedan' : (p <= 6 && b <= 6) ? 'mpv' : 'coach';
function plan(p, b) {
  const list = [];
  while (p > 19 || b > 14) { list.push({ t: 'coach', p: Math.min(p, 19) }); p -= 19; b -= 14; }
  if (p > 0) list.push({ t: fit(Math.max(p, 1), Math.max(b, 0)), p });
  return list;
}
function renderMatch() {
  const p = +pax.value, b = +bag.value;
  pax.style.setProperty('--p', ((p - 1) / 59 * 100) + '%');
  bag.style.setProperty('--p', (b / 40 * 100) + '%');
  $('#pax-v').textContent = p; $('#bag-v').textContent = b;
  const list = plan(p, b);
  const counts = {}; list.forEach(u => counts[u.t] = (counts[u.t] || 0) + 1);
  $('#rec-name').innerHTML = Object.entries(counts).map(([t, n]) => `${n} × ${tx(TYPES[t].en, TYPES[t].cn)}`).join(' + ');
  $('#units').innerHTML = list.map(u => {
    const T = TYPES[u.t];
    const seats = Array.from({ length: T.seats }, (_, i) => `<i class="seat${i < u.p ? ' f' : ''}"></i>`).join('');
    return `<div class="unit"><div class="unit-t">${T.model}</div><div class="seats" style="grid-template-columns:repeat(${T.cols},9px)">${seats}</div></div>`;
  }).join('');
  const cap = list.reduce((s, u) => s + TYPES[u.t].seats, 0), bcap = list.reduce((s, u) => s + TYPES[u.t].bags, 0);
  const sp = Math.round(p / cap * 100), bp = Math.round(clamp(b / bcap, 0, 1) * 100);
  $('#seat-bar').style.width = sp + '%'; $('#seat-pct').textContent = sp + '%';
  $('#bag-bar').style.width = bp + '%'; $('#bag-pct').textContent = bp + '%';
  const main = list.some(u => u.t === 'coach') ? 'coach' : list.some(u => u.t === 'mpv') ? 'mpv' : 'sedan';
  stage && stage.setVehicle(main);
  document.querySelectorAll('#scenarios .chip').forEach((c, i) => c.classList.toggle('on', SCEN[i].p === p && SCEN[i].b === b));
}
SCEN.forEach(s => {
  const c = document.createElement('button');
  c.className = 'chip'; c.type = 'button'; c.innerHTML = tx(s.en, s.cn);
  c.addEventListener('click', () => { pax.value = s.p; bag.value = s.b; renderMatch(); });
  $('#scenarios').appendChild(c);
});
pax.addEventListener('input', renderMatch);
bag.addEventListener('input', renderMatch);
renderMatch();

/* —— 接机旅程：滚动驱动 SVG —— */
(function journey() {
  const sec = $('#journey');
  const steps = [...document.querySelectorAll('#j-steps .j-step')];
  const rMain = $('#r-main-on'), rDepot = $('#r-depot-on'), rPlane = $('#r-plane');
  const plane = $('#plane'), car = $('#jcar'), sign = $('#sign'), glow = $('#dest-glow');
  const Lm = rMain.getTotalLength(), Ld = rDepot.getTotalLength(), Lp = rPlane.getTotalLength();
  [[rMain, Lm], [rDepot, Ld]].forEach(([el, L]) => { el.style.strokeDasharray = L; el.style.strokeDashoffset = L; });
  const seg = (p, a, b) => clamp((p - a) / (b - a), 0, 1);
  const ez = (t) => t * t * (3 - 2 * t);
  const at = (path, L, t) => {
    const a = path.getPointAtLength(L * t), b = path.getPointAtLength(Math.min(L, L * t + 1));
    return { x: a.x, y: a.y, r: Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI };
  };
  const fmt = (m) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(Math.floor(m % 60)).padStart(2, '0')}`;
  const TOASTS = [
    ['MU588 · on time, landing 14:05', 'MU588 · 航班准点，预计 14:05 落地'],
    ['Chauffeur Li arrived at T2 · 13:35', '司机李师傅已抵达 T2 · 13:35'],
    ['Guest met at Arrivals Gate B', '已在 B 出口接到宾客'],
    ['Route shared with your assistant', '行程已实时共享给您的助理'],
    ['Arrived 2 min early ✓', '提前 2 分钟抵达 ✓'],
  ];
  // 竖屏完整显示地图，避免 slice 裁掉机场与目的地
  const svg = $('.j-map svg');
  const fitMap = () => svg.setAttribute('preserveAspectRatio', innerWidth < 900 ? 'xMidYMid meet' : 'xMidYMid slice');
  fitMap(); addEventListener('resize', fitMap);
  let lastStep = -1;
  function update() {
    const r = sec.getBoundingClientRect();
    const p = clamp(-r.top / (sec.offsetHeight - innerHeight), 0, 1);
    // 1 飞机进近 0–.22
    const fp = ez(seg(p, 0, 0.22));
    const pl = at(rPlane, Lp, fp);
    plane.setAttribute('transform', `translate(${pl.x} ${pl.y}) rotate(${pl.r + 90}) scale(${1.4 - fp * 0.5})`);
    plane.style.opacity = p > 0.42 ? 0 : 1;
    // 2 司机前往机场 .12–.38
    const dp = ez(seg(p, 0.12, 0.38));
    rDepot.style.strokeDashoffset = Ld * (1 - dp);
    // 3 举牌 .38–.52
    const sp = seg(p, 0.38, 0.46);
    sign.setAttribute('opacity', p < 0.56 ? sp : 1 - seg(p, 0.56, 0.6));
    // 4 在途 .52–.9
    const mp = ez(seg(p, 0.52, 0.9));
    rMain.style.strokeDashoffset = Lm * (1 - mp);
    const c = p < 0.52 ? at(rDepot, Ld, dp) : at(rMain, Lm, mp);
    car.setAttribute('transform', `translate(${c.x} ${c.y}) rotate(${c.r})`);
    // 5 抵达
    glow.setAttribute('opacity', 0.4 + seg(p, 0.88, 0.95) * 0.6);

    const step = p < 0.12 ? 0 : p < 0.38 ? 1 : p < 0.52 ? 2 : p < 0.9 ? 3 : 4;
    steps.forEach((s, i) => { s.classList.toggle('on', i === step); s.classList.toggle('done', i < step); });
    // 时间线：13:20 → 15:03
    const minutes = 13 * 60 + 20 + p * 103;
    $('#j-time').textContent = fmt(minutes);
    if (step !== lastStep) {
      lastStep = step;
      $('#j-toast').innerHTML = tx(...TOASTS[step]);
      $('#j-label').innerHTML = step < 2 ? tx('Landing in', '距落地') : step < 4 ? tx('ETA to The Bund', '预计到达外滩') : tx('Arrived', '已抵达');
    }
    const eta = step < 2 ? Math.max(0, Math.round(14 * 60 + 5 - minutes)) : step < 4 ? Math.max(1, Math.round(15 * 60 + 1 - minutes)) : 0;
    $('#j-eta').textContent = step === 4 ? '✓' : eta + ' min';
  }
  addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
  addEventListener('resize', update);
  update();
})();

/* —— LyctAI 调度 —— */
const sim = initDispatch({
  canvas: $('#d-canvas'), logEl: $('#d-log'),
  kpi: { active: $('#k-active'), fleet: $('#k-fleet'), eta: $('#k-eta'), done: $('#k-done') },
  onClockTick: (t) => { $('#d-clock').textContent = t; },
});
let rush = false;
$('#rush-btn').addEventListener('click', (e) => { rush = !rush; e.currentTarget.classList.toggle('on', rush); sim.setRush(rush); });
$('#delay-btn').addEventListener('click', () => sim.flightDelay());

/* —— 覆盖地球（接近视口时再加载）—— */
const cityCard = $('#city-card');
function showCity(c) {
  cityCard.innerHTML = `<h4>${tx(c.en, c.cn)}</h4><dl>
    <div><dt>${tx('Airports', '机场')}</dt><dd>${tx(c.air.join(' · '), c.airCn.join(' · '))}</dd></div>
    <div><dt>${tx('Rail &amp; cross-border', '高铁 / 跨境')}</dt><dd>${tx(c.rail.join(' · '), c.railCn.join(' · '))}</dd></div></dl>`;
  document.querySelectorAll('#city-list .chip').forEach(b => b.classList.toggle('on', b.dataset.id === c.id));
}
const gio = new IntersectionObserver(async ([e]) => {
  if (!e.isIntersecting) return;
  gio.disconnect();
  const { initGlobe, CITIES } = await import('./globe.js');
  let globe = null;
  CITIES.forEach(c => {
    const b = document.createElement('button');
    b.className = 'chip'; b.type = 'button'; b.dataset.id = c.id; b.innerHTML = tx(c.en, c.cn);
    b.addEventListener('click', () => globe && globe.focus(c.id));
    $('#city-list').appendChild(b);
  });
  showCity(CITIES[0]);
  try { globe = await initGlobe({ canvas: $('#g-canvas'), onSelect: showCity }); } catch (err) { console.warn(err); }
}, { rootMargin: '600px 0px' });
gio.observe($('#coverage'));
