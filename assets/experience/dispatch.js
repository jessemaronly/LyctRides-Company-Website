/* ============================================================
   dispatch.js · LyctAI 调度模拟（Canvas 2D，示意）
   点击地图下单 → 最近空闲车辆接单；高峰模式；航班延误自动改派
   ============================================================ */

const T = (en, cn) => ({ en, cn });

export function initDispatch({ canvas, logEl, kpi, onClockTick }) {
  const ctx = canvas.getContext('2d');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let W = 0, H = 0, dpr = 1, cell = 56, cols = 0, rows = 0;
  let cars = [], orders = [], fx = [], blocks = [];
  let rush = false, simMin = 8 * 60 + 30, spawnAcc = 0, orderSeq = 4810, visible = false;
  const stats = { done: 0, etaSum: 0, etaN: 0 };
  let airport = { c: 1, r: 1 };

  const node = (c, r) => ({ x: c * cell + cell / 2, y: r * cell + cell / 2 });
  const rnd = (n) => Math.floor(Math.random() * n);
  const randNode = () => ({ c: rnd(cols), r: rnd(rows) });
  const manhattan = (a, b) => Math.abs(a.c - b.c) + Math.abs(a.r - b.r);
  const clock = () => `${String(Math.floor(simMin / 60) % 24).padStart(2, '0')}:${String(Math.floor(simMin % 60)).padStart(2, '0')}`;

  function resize() {
    const r = canvas.getBoundingClientRect();
    dpr = Math.min(devicePixelRatio, 2);
    W = r.width; H = r.height;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cell = W < 640 ? 42 : 56;
    cols = Math.floor(W / cell); rows = Math.floor(H / cell);
    airport = { c: cols - 2, r: 1 };
    blocks = [];
    for (let c = 0; c < cols - 1; c++) for (let r = 0; r < rows - 1; r++) {
      const p = node(c, r), k = 1 + rnd(3);
      for (let i = 0; i < k; i++) blocks.push({ x: p.x + 7 + rnd(cell - 30), y: p.y + 7 + rnd(cell - 30), w: 8 + rnd(16), h: 8 + rnd(16), a: 0.03 + Math.random() * 0.05 });
    }
    const n = Math.max(10, Math.min(30, Math.round((cols * rows) / 9)));
    cars = Array.from({ length: n }, (_, i) => {
      const s = randNode(), p = node(s.c, s.r);
      return { id: (i % 3 === 0 ? 'S-' : i % 3 === 1 ? 'V-' : 'E-') + String(i + 1).padStart(2, '0'), at: s, x: p.x, y: p.y, path: [], state: 'idle', order: null, trail: [], heading: 0 };
    });
    orders = [];
  }

  /* 曼哈顿路径：随机先横后竖或先竖后横 */
  function route(a, b) {
    const path = [], hFirst = Math.random() < 0.5;
    let c = a.c, r = a.r;
    const stepC = () => { while (c !== b.c) { c += Math.sign(b.c - c); path.push({ c, r }); } };
    const stepR = () => { while (r !== b.r) { r += Math.sign(b.r - r); path.push({ c, r }); } };
    if (hFirst) { stepC(); stepR(); } else { stepR(); stepC(); }
    return path;
  }

  function log(msg, tone = '') {
    const li = document.createElement('li');
    li.className = tone;
    li.innerHTML = `<time>${clock()}</time><span class="lang-en">${msg.en}</span><span class="lang-cn">${msg.cn}</span>`;
    logEl.prepend(li);
    while (logEl.children.length > 7) logEl.lastChild.remove();
  }

  function addOrder(at, opts = {}) {
    const o = { id: ++orderSeq, at, born: performance.now(), car: null, readyAt: opts.readyAt || 0, flight: opts.flight || null, dest: opts.dest || randNode() };
    orders.push(o);
    if (!opts.silent) log(T(`Order #${o.id} received`, `收到订单 #${o.id}`));
    return o;
  }

  function assign(o) {
    let best = null, bd = 1e9;
    cars.forEach(c => { if (c.state === 'idle') { const d = manhattan(c.at, o.at); if (d < bd) { bd = d; best = c; } } });
    if (!best) return false;
    if (o.readyAt && simMin + bd * 0.9 < o.readyAt - 3) return false; // 航班未到：暂缓派车，避免空等
    o.car = best; best.order = o; best.state = 'pickup';
    best.path = route(best.at, o.at);
    const eta = Math.max(1, Math.round(bd * 0.9));
    stats.etaSum += eta; stats.etaN++;
    fx.push({ type: 'link', a: best, b: node(o.at.c, o.at.r), t: 0 });
    log(T(`#${o.id} → ${best.id} · ETA ${eta} min`, `#${o.id} → 车辆 ${best.id} · 预计 ${eta} 分钟`), o.flight ? 'warn' : 'ok');
    return true;
  }

  function flightDelay() {
    const p = node(airport.c, airport.r);
    // 已在途前往机场的车：释放改派
    const waiting = orders.find(o => o.flight && o.car);
    const flight = 'MU' + (500 + rnd(400));
    const delay = 35 + rnd(30);
    if (waiting) {
      const c = waiting.car;
      c.state = 'idle'; c.order = null; c.path = [];
      waiting.car = null; waiting.readyAt = simMin + delay;
      log(T(`${waiting.flight} delayed ${delay} min · ${c.id} released to nearby demand`, `${waiting.flight} 延误 ${delay} 分钟 · ${c.id} 释放，就近承接其他订单`), 'warn');
    } else {
      addOrder({ ...airport }, { readyAt: simMin + delay, flight, silent: true, dest: { c: rnd(Math.max(cols - 4, 1)), r: rows - 1 - rnd(2) } });
      log(T(`Flight ${flight} delay detected (+${delay} min) · pickup retimed`, `监测到航班 ${flight} 延误 ${delay} 分钟 · 接机时间已自动顺延`), 'warn');
    }
    fx.push({ type: 'ping', x: p.x, y: p.y, t: 0, color: '255,184,77' });
  }

  function addAirportOrder() {
    const flight = 'CA' + (900 + rnd(90));
    addOrder({ ...airport }, { flight, silent: true, readyAt: simMin + 6, dest: { c: rnd(Math.max(cols - 3, 1)), r: rows - 1 - rnd(2) } });
    log(T(`Flight ${flight} tracked · landing in 6 min`, `航班 ${flight} 已追踪 · 6 分钟后落地`));
  }

  canvas.addEventListener('click', (e) => {
    const r = canvas.getBoundingClientRect();
    const c = Math.max(0, Math.min(cols - 1, Math.round((e.clientX - r.left - cell / 2) / cell)));
    const rr = Math.max(0, Math.min(rows - 1, Math.round((e.clientY - r.top - cell / 2) / cell)));
    const o = addOrder({ c, r: rr });
    const p = node(c, rr);
    fx.push({ type: 'ping', x: p.x, y: p.y, t: 0, color: '98,216,255' });
    assign(o);
  });

  function step(dt) {
    simMin += dt * (rush ? 1.6 : 1);
    spawnAcc += dt * (rush ? 1.6 : 0.42);
    while (spawnAcc > 1) { spawnAcc -= 1; addOrder(randNode(), { silent: !rush && Math.random() < 0.6 }); }
    if (Math.random() < dt * 0.03) addAirportOrder();
    orders.forEach(o => { if (!o.car) assign(o); });

    const speed = (rush ? 1.25 : 1) * cell * 2.3;
    cars.forEach(c => {
      if (!c.path.length && c.state === 'idle' && Math.random() < dt * 0.5) {
        const d = { c: Math.max(0, Math.min(cols - 1, c.at.c + rnd(5) - 2)), r: Math.max(0, Math.min(rows - 1, c.at.r + rnd(5) - 2)) };
        c.path = route(c.at, d);
      }
      if (c.path.length) {
        const nx = node(c.path[0].c, c.path[0].r);
        const dx = nx.x - c.x, dy = nx.y - c.y, d = Math.hypot(dx, dy);
        const s = (c.state === 'idle' ? 0.55 : 1) * speed * dt;
        c.heading = Math.atan2(dy, dx);
        if (d <= s) { c.x = nx.x; c.y = nx.y; c.at = c.path.shift(); } else { c.x += (dx / d) * s; c.y += (dy / d) * s; }
      } else if (c.state === 'pickup' && c.order && (!c.order.readyAt || simMin >= c.order.readyAt)) {
        c.state = 'trip'; c.path = route(c.at, c.order.dest);
        fx.push({ type: 'ping', x: c.x, y: c.y, t: 0, color: '255,201,120' });
        if (c.order.flight) log(T(`${c.order.flight} guest met · ${c.id} departing`, `${c.order.flight} 宾客已接到 · ${c.id} 出发`), 'ok');
        orders = orders.filter(o => o !== c.order);
      } else if (c.state === 'trip') {
        stats.done++; c.state = 'idle'; c.order = null;
      }
      if (c.state !== 'idle') { c.trail.push({ x: c.x, y: c.y }); if (c.trail.length > 26) c.trail.shift(); }
      else if (c.trail.length) c.trail.shift();
    });
    orders = orders.filter(o => o.car || performance.now() - o.born < 30000 || o.flight);
  }

  function draw(t) {
    ctx.clearRect(0, 0, W, H);
    // 街区
    blocks.forEach(b => { ctx.fillStyle = `rgba(160,180,220,${b.a})`; ctx.fillRect(b.x, b.y, b.w, b.h); });
    // 道路
    ctx.lineWidth = 1;
    for (let c = 0; c < cols; c++) { const x = node(c, 0).x; ctx.strokeStyle = c % 4 === 1 ? 'rgba(120,150,200,0.16)' : 'rgba(120,150,200,0.07)'; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let r = 0; r < rows; r++) { const y = node(0, r).y; ctx.strokeStyle = r % 4 === 2 ? 'rgba(120,150,200,0.16)' : 'rgba(120,150,200,0.07)'; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    // 江
    ctx.strokeStyle = 'rgba(70,140,255,0.13)'; ctx.lineWidth = cell * 0.55;
    ctx.beginPath(); ctx.moveTo(W * 0.42, -20); ctx.bezierCurveTo(W * 0.55, H * 0.35, W * 0.38, H * 0.6, W * 0.58, H + 20); ctx.stroke();
    // 机场
    const ap = node(airport.c, airport.r);
    ctx.fillStyle = 'rgba(98,216,255,0.08)'; ctx.fillRect(ap.x - cell * 0.9, ap.y - cell * 0.5, cell * 1.8, cell);
    ctx.font = '600 11px "JetBrains Mono", monospace'; ctx.fillStyle = 'rgba(98,216,255,0.9)';
    ctx.fillText('✈ PVG', ap.x - cell * 0.8, ap.y - cell * 0.5 - 6);

    // 订单
    orders.forEach(o => {
      const p = node(o.at.c, o.at.r), k = (t / 1000 + o.id * 0.37) % 1;
      const col = o.flight ? '255,184,77' : '98,216,255';
      ctx.strokeStyle = `rgba(${col},${1 - k})`; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(p.x, p.y, 5 + k * 16, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = `rgb(${col})`; ctx.beginPath(); ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2); ctx.fill();
      if (o.flight && o.readyAt > simMin) {
        ctx.fillStyle = 'rgba(255,184,77,0.9)'; ctx.font = '600 10px "JetBrains Mono", monospace';
        ctx.fillText(`${o.flight} · ${Math.ceil(o.readyAt - simMin)}m`, p.x + 10, p.y + 22);
      }
    });

    // 车辆：尾迹 + 光点
    cars.forEach(c => {
      if (c.trail.length > 1) {
        for (let i = 1; i < c.trail.length; i++) {
          const a = i / c.trail.length;
          ctx.strokeStyle = c.state === 'trip' ? `rgba(255,255,255,${a * 0.55})` : `rgba(255,201,120,${a * 0.7})`;
          ctx.lineWidth = 2.2 * a; ctx.beginPath(); ctx.moveTo(c.trail[i - 1].x, c.trail[i - 1].y); ctx.lineTo(c.trail[i].x, c.trail[i].y); ctx.stroke();
        }
      }
      if (c.state === 'pickup' && c.path.length) {
        ctx.setLineDash([3, 5]); ctx.strokeStyle = 'rgba(255,201,120,0.35)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(c.x, c.y); c.path.forEach(n => { const p = node(n.c, n.r); ctx.lineTo(p.x, p.y); }); ctx.stroke(); ctx.setLineDash([]);
      }
      ctx.save(); ctx.translate(c.x, c.y); ctx.rotate(c.heading);
      ctx.shadowColor = c.state === 'idle' ? 'rgba(255,201,120,0.4)' : 'rgba(255,201,120,0.95)'; ctx.shadowBlur = c.state === 'idle' ? 4 : 14;
      ctx.fillStyle = c.state === 'idle' ? 'rgba(255,214,150,0.55)' : '#ffd08a';
      ctx.beginPath(); ctx.roundRect(-6, -3.2, 12, 6.4, 2.5); ctx.fill();
      ctx.restore();
    });

    // 效果：派单连线 / 涟漪
    fx = fx.filter(f => f.t < 1);
    fx.forEach(f => {
      f.t += 0.016 / (f.type === 'link' ? 1.2 : 0.9);
      if (f.type === 'link') {
        ctx.strokeStyle = `rgba(98,216,255,${1 - f.t})`; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(f.a.x, f.a.y); ctx.lineTo(f.b.x, f.b.y); ctx.stroke();
      } else {
        ctx.strokeStyle = `rgba(${f.color},${1 - f.t})`; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(f.x, f.y, 6 + f.t * 40, 0, Math.PI * 2); ctx.stroke();
      }
    });
  }

  function updateKpi() {
    const active = cars.filter(c => c.state !== 'idle').length;
    kpi.active.textContent = active;
    kpi.fleet.textContent = cars.length;
    kpi.eta.textContent = stats.etaN ? (stats.etaSum / stats.etaN).toFixed(1) : '—';
    kpi.done.textContent = stats.done;
    onClockTick && onClockTick(clock());
  }

  resize();
  addEventListener('resize', () => { clearTimeout(resize.t); resize.t = setTimeout(resize, 200); });
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 }).observe(canvas);
  for (let i = 0; i < 4; i++) addOrder(randNode(), { silent: true });

  let last = performance.now(), kAcc = 0;
  (function loop(now) {
    requestAnimationFrame(loop);
    const dt = Math.min((now - last) / 1000, 0.05); last = now;
    if (!visible) return;
    step(reduce ? dt * 0.5 : dt);
    draw(now);
    kAcc += dt; if (kAcc > 0.25) { kAcc = 0; updateKpi(); }
  })(last);

  return {
    setRush(on) { rush = on; log(on ? T('Rush hour · demand ×4, fleet rebalancing', '高峰模式 · 订单量 ×4，运力自动再平衡') : T('Demand back to normal', '订单量恢复常态'), on ? 'warn' : ''); },
    flightDelay,
    addAirportOrder,
  };
}
