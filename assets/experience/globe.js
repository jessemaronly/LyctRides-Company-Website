/* ============================================================
   globe.js · 服务网络 3D 点阵地球
   陆地点阵（Natural Earth 110m 预采样）+ 城市光柱 + 航线流光
   ============================================================ */
import * as THREE from 'three';

const deg = Math.PI / 180;
const vec = (lat, lon, r = 1) => new THREE.Vector3(
  r * Math.cos(lat * deg) * Math.sin(lon * deg), r * Math.sin(lat * deg), r * Math.cos(lat * deg) * Math.cos(lon * deg));

export const CITIES = [
  { id: 'sha', lat: 31.23, lon: 121.47, en: 'Shanghai', cn: '上海', hub: true, air: ['PVG · Pudong', 'SHA · Hongqiao'], rail: ['Hongqiao Station'], airCn: ['浦东国际机场', '虹桥国际机场'], railCn: ['虹桥站'] },
  { id: 'bjs', lat: 39.9, lon: 116.4, en: 'Beijing', cn: '北京', air: ['PEK · Capital', 'PKX · Daxing'], rail: ['Beijing South'], airCn: ['首都国际机场', '大兴国际机场'], railCn: ['北京南站'] },
  { id: 'can', lat: 23.13, lon: 113.26, en: 'Guangzhou', cn: '广州', air: ['CAN · Baiyun'], rail: ['Guangzhou South'], airCn: ['白云国际机场'], railCn: ['广州南站'] },
  { id: 'szx', lat: 22.54, lon: 114.06, en: 'Shenzhen', cn: '深圳', air: ['SZX · Bao\'an'], rail: ['Shenzhen North'], airCn: ['宝安国际机场'], railCn: ['深圳北站'] },
  { id: 'hkg', lat: 22.32, lon: 114.17, en: 'Hong Kong', cn: '香港', air: ['HKG · Chek Lap Kok'], rail: ['Cross-border HK ↔ SZ plates'], airCn: ['香港国际机场'], railCn: ['港深双牌车跨境直送'] },
  { id: 'mfm', lat: 22.2, lon: 113.54, en: 'Macau', cn: '澳门', air: ['MFM · Macau Intl'], rail: ['Macau ↔ Zhuhai plates'], airCn: ['澳门国际机场'], railCn: ['澳珠双牌车'] },
  { id: 'tpe', lat: 25.03, lon: 121.56, en: 'Taipei', cn: '台北', air: ['TPE · Taoyuan', 'TSA · Songshan'], rail: ['Taipei Main Station'], airCn: ['桃园国际机场', '松山机场'], railCn: ['台北车站'] },
  { id: 'ctu', lat: 30.57, lon: 104.07, en: 'Chengdu', cn: '成都', air: ['TFU · Tianfu', 'CTU · Shuangliu'], rail: ['Chengdu East'], airCn: ['天府国际机场', '双流国际机场'], railCn: ['成都东站'] },
  { id: 'hgh', lat: 30.27, lon: 120.15, en: 'Hangzhou', cn: '杭州', air: ['HGH · Xiaoshan'], rail: ['Hangzhou East'], airCn: ['萧山国际机场'], railCn: ['杭州东站'] },
  { id: 'xiy', lat: 34.34, lon: 108.94, en: 'Xi\'an', cn: '西安', air: ['XIY · Xianyang'], rail: ['Xi\'an North'], airCn: ['咸阳国际机场'], railCn: ['西安北站'] },
  { id: 'nkg', lat: 32.06, lon: 118.8, en: 'Nanjing', cn: '南京', air: ['NKG · Lukou'], rail: ['Nanjing South'], airCn: ['禄口国际机场'], railCn: ['南京南站'] },
  { id: 'wuh', lat: 30.59, lon: 114.3, en: 'Wuhan', cn: '武汉', air: ['WUH · Tianhe'], rail: ['Wuhan Station'], airCn: ['天河国际机场'], railCn: ['武汉站'] },
  { id: 'ckg', lat: 29.56, lon: 106.55, en: 'Chongqing', cn: '重庆', air: ['CKG · Jiangbei'], rail: ['Chongqing North'], airCn: ['江北国际机场'], railCn: ['重庆北站'] },
];
/* 入境航线示意（境外主要客源城市） */
const INBOUND = [[35.68, 139.69], [37.57, 126.98], [1.35, 103.82], [25.2, 55.27], [51.47, -0.45], [50.03, 8.57], [40.64, -73.78], [37.62, -122.38], [-33.94, 151.18]];

export async function initGlobe({ canvas, onSelect }) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
  camera.position.set(0, 0, 4.4);

  const globe = new THREE.Group();
  scene.add(globe);

  // 遮挡球 + 大气辉光
  globe.add(new THREE.Mesh(new THREE.SphereGeometry(0.992, 64, 64), new THREE.MeshBasicMaterial({ color: 0x080a10 })));
  const atmo = new THREE.Mesh(new THREE.SphereGeometry(1.1, 64, 64), new THREE.ShaderMaterial({
    side: THREE.BackSide, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: 'varying vec3 vN; void main(){ vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: 'varying vec3 vN; void main(){ float i = pow(max(0.62 - dot(vN, vec3(0.0,0.0,1.0)), 0.0), 2.4); gl_FragColor = vec4(vec3(0.3,0.7,1.0) * i * 0.75, i * 0.6); }',
  }));
  scene.add(atmo);

  // 陆地点阵
  const raw = await fetch('/assets/experience/land-dots.json').then(r => r.json());
  // 三元组 [lat, lon, 是否大中华区]
  const n = raw.length / 3, pos = new Float32Array(n * 3), china = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const v = vec(raw[i * 3], raw[i * 3 + 1], 1.0);
    pos.set([v.x, v.y, v.z], i * 3);
    china[i] = raw[i * 3 + 2];
  }
  const dg = new THREE.BufferGeometry();
  dg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  dg.setAttribute('aHi', new THREE.BufferAttribute(china, 1));
  const dots = new THREE.Points(dg, new THREE.ShaderMaterial({
    transparent: true, depthWrite: false,
    uniforms: { uSize: { value: 3.2 * renderer.getPixelRatio() } },
    vertexShader: `attribute float aHi; uniform float uSize; varying float vF; varying float vH;
      void main(){ vec4 mv = modelViewMatrix * vec4(position,1.0);
        vec3 n = normalize(normalMatrix * position); vF = clamp(dot(n, vec3(0.0,0.0,1.0)),0.0,1.0); vH = aHi;
        gl_PointSize = uSize * (0.6 + 0.4*vF); gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `varying float vF; varying float vH;
      void main(){ vec2 c = gl_PointCoord - 0.5; if(length(c) > 0.5) discard;
        vec3 base = mix(vec3(0.42,0.47,0.56), vec3(0.95,0.8,0.55), vH);
        gl_FragColor = vec4(base, (0.25 + 0.75*vF) * (0.55 + 0.45*vH)); }`,
  }));
  globe.add(dots);

  // 城市：光柱 + 光点 + 拾取球
  const pickables = [];
  const markers = CITIES.map(c => {
    const g = new THREE.Group();
    const p = vec(c.lat, c.lon, 1.0);
    g.position.copy(p);
    g.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), p.clone().normalize());
    const h = c.hub ? 0.32 : 0.12 + Math.random() * 0.08;
    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, h, 6), new THREE.MeshBasicMaterial({ color: 0xffd28a, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending }));
    pillar.position.y = h / 2; g.add(pillar);
    const dot = new THREE.Mesh(new THREE.SphereGeometry(c.hub ? 0.016 : 0.011, 16, 16), new THREE.MeshBasicMaterial({ color: 0xfff1d6 }));
    g.add(dot);
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.02, 0.026, 32), new THREE.MeshBasicMaterial({ color: 0xffd28a, transparent: true, side: THREE.DoubleSide, blending: THREE.AdditiveBlending }));
    ring.rotation.x = -Math.PI / 2; ring.position.y = 0.002; g.add(ring);
    const hit = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), new THREE.MeshBasicMaterial({ visible: false }));
    hit.userData.city = c; g.add(hit); pickables.push(hit);
    globe.add(g);
    return { c, g, ring, pillar, h };
  });

  // 航线：二次贝塞尔抬升 + 流光着色器
  const arcMat = (color, speed, offset) => new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uT: { value: 0 }, uC: { value: new THREE.Color(color) }, uS: { value: speed }, uO: { value: offset } },
    vertexShader: 'varying float vU; void main(){ vU = uv.x; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: `uniform float uT; uniform vec3 uC; uniform float uS; uniform float uO; varying float vU;
      void main(){ float head = fract(uT*uS + uO); float d = head - vU; if (d < 0.0) d += 1.0;
        float pulse = exp(-d * 9.0); float base = 0.16;
        gl_FragColor = vec4(uC * (base + pulse * 1.6), base + pulse); }`,
  });
  const arcs = [];
  const addArc = (a, b, color, lift) => {
    const mid = a.clone().add(b).multiplyScalar(0.5);
    const dist = a.distanceTo(b);
    mid.normalize().multiplyScalar(1 + dist * lift);
    const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
    const m = arcMat(color, 0.18 + Math.random() * 0.12, Math.random());
    globe.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 64, dist > 1 ? 0.0032 : 0.0024, 6, false), m));
    arcs.push(m);
  };
  const hub = vec(31.23, 121.47, 1.0);
  CITIES.filter(c => !c.hub).forEach(c => addArc(hub, vec(c.lat, c.lon, 1.0), 0xffc978, 0.55));
  INBOUND.forEach(([lat, lon]) => addArc(vec(lat, lon, 1.0), hub, 0x62d8ff, 0.28));

  // 交互：拖拽旋转 + 点击城市 + 聚焦动画
  const rot = { x: 0.42, y: -121.47 * deg, tx: 0.42, ty: -121.47 * deg };
  let drag = null, auto = !reduce, focusId = null;
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  canvas.addEventListener('pointerdown', (e) => { drag = { x: e.clientX, y: e.clientY, rx: rot.tx, ry: rot.ty, moved: false }; canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    if (!drag) { ray.setFromCamera(ndc, camera); canvas.style.cursor = ray.intersectObjects(pickables).length ? 'pointer' : 'grab'; return; }
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (Math.abs(dx) + Math.abs(dy) > 4) drag.moved = true;
    rot.ty = drag.ry + dx * 0.006; rot.tx = Math.max(-1.1, Math.min(1.1, drag.rx + dy * 0.006));
    auto = false;
  });
  canvas.addEventListener('pointerup', (e) => {
    if (drag && !drag.moved) {
      ray.setFromCamera(ndc, camera);
      const hit = ray.intersectObjects(pickables)[0];
      if (hit) focus(hit.object.userData.city.id);
    }
    drag = null;
  });

  function focus(id) {
    const c = CITIES.find(x => x.id === id); if (!c) return;
    focusId = id; auto = false;
    rot.tx = c.lat * deg - 0.12;
    let ty = -c.lon * deg;
    while (ty - rot.ty > Math.PI) ty -= Math.PI * 2;
    while (ty - rot.ty < -Math.PI) ty += Math.PI * 2;
    rot.ty = ty;
    onSelect && onSelect(c);
  }

  function resize() {
    const r = canvas.parentElement.getBoundingClientRect();
    renderer.setSize(r.width, r.height, false);
    camera.aspect = r.width / r.height;
    camera.position.z = camera.aspect < 1 ? 5.6 : 4.4;
    camera.updateProjectionMatrix();
  }
  resize(); addEventListener('resize', resize);

  let visible = false;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 }).observe(canvas);
  const clock = new THREE.Clock(); let t = 0;
  (function loop() {
    requestAnimationFrame(loop);
    const dt = Math.min(clock.getDelta(), 0.05);
    if (!visible) return;
    t += dt;
    if (auto && !drag) rot.ty += dt * 0.06;
    const k = 1 - Math.pow(0.002, dt);
    rot.x += (rot.tx - rot.x) * k; rot.y += (rot.ty - rot.y) * k;
    globe.rotation.set(rot.x, rot.y, 0);
    arcs.forEach(m => { m.uniforms.uT.value = t; });
    markers.forEach((m, i) => {
      const s = 1 + ((t * 0.6 + i * 0.13) % 1) * 1.3;
      m.ring.scale.set(s, s, s);
      m.ring.material.opacity = 1 - ((t * 0.6 + i * 0.13) % 1);
      const on = m.c.id === focusId;
      m.pillar.scale.y += ((on ? 2.2 : 1) - m.pillar.scale.y) * k;
      m.pillar.position.y = (m.h * m.pillar.scale.y) / 2;
      m.pillar.material.color.set(on ? 0x8fe3ff : 0xffd28a);
    });
    renderer.render(scene, camera);
  })();

  return { focus };
}
