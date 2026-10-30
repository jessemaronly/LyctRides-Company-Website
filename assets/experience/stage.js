/* ============================================================
   stage.js · 主舞台：影棚环境 + 车辆 + 滚动镜头 + 拖拽旋转 + 热点
   ============================================================ */
import * as THREE from 'three';
import { Reflector } from 'three/addons/objects/Reflector.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { buildVehicle, VEHICLE_LENGTH, VEHICLE_HEIGHT } from './vehicle.js';

const BG = new THREE.Color(0x07080b);
const lerp = (a, b, t) => a + (b - a) * t;
const ease = (t) => t * t * (3 - 2 * t);

/* 镜头章节：pos / target / 画面水平偏移 / 夜间 / 车身朝向 */
const CHAPTERS = [
  { pos: [6.2, 1.55, 6.4], tgt: [0.2, 0.62, 0], off: 0.0, night: 0, yaw: 0 },
  { pos: [0.4, 1.0, 8.6], tgt: [0, 0.72, 0], off: 0.0, night: 0, yaw: 0 },
  { pos: [-6.4, 1.25, 5.2], tgt: [-0.4, 0.7, 0], off: -0.12, night: 1, yaw: 0 },
  { pos: [6.8, 2.6, 7.4], tgt: [0, 0.8, 0], off: -0.18, night: 0, yaw: -0.25 },
];

/* 车型热点（车身局部坐标，+z 侧） */
const HOTSPOTS = {
  sedan: [
    { p: [-0.3, 1.22, 0.78], en: ['Acoustic laminated glass', 'Double-layer glazing keeps the cabin under 60 dB at highway speed.'], cn: ['双层夹胶隔音玻璃', '高速行驶时车内噪音低于 60 分贝。'] },
    { p: [-0.75, 0.72, 0.95], en: ['Executive rear seats', 'Massage, ventilation and reclining rear seats.'], cn: ['后排行政座椅', '按摩、通风、电动调节。'] },
    { p: [1.55, 0.36, 0.86], en: ['Air suspension', 'Road imperfections absorbed before they reach you.'], cn: ['空气悬架', '路面颠簸在抵达您之前已被吸收。'] },
  ],
  mpv: [
    { p: [-0.6, 1.5, 0.86], en: ['Panoramic privacy glass', 'Full-length tinted glazing for discreet travel.'], cn: ['全景隐私玻璃', '全长隐私玻璃，出行更私密。'] },
    { p: [-0.9, 0.8, 1.0], en: ['Lounge captain seats', 'Lie-flat seats with ottomans for long transfers.'], cn: ['航空式独立座椅', '可平躺，配腿托，长途更从容。'] },
    { p: [1.62, 0.37, 0.88], en: ['6 guests · 6 bags', 'Executive teams and family travel.'], cn: ['6 人 · 6 件行李', '高管团队、家庭出行。'] },
  ],
  coach: [
    { p: [0.4, 1.9, 0.94], en: ['Panoramic windows', 'Every seat gets a window view.'], cn: ['全景车窗', '每一个座位都有窗景。'] },
    { p: [-1.2, 0.8, 1.04], en: ['19–23 seats', 'Delegations, roadshows and events.'], cn: ['19–23 座', '代表团、路演、会议活动。'] },
    { p: [2.15, 0.4, 0.98], en: ['Dedicated luggage bay', 'Space for the whole team\'s luggage.'], cn: ['独立行李舱', '整个团队的行李都放得下。'] },
  ],
};

export function initStage({ canvas, hotspotLayer, stageEl }) {
  const isMobile = matchMedia('(max-width: 768px)').matches;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, isMobile ? 1.5 : 1.75));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  renderer.localClippingEnabled = true;
  renderer.setClearColor(BG);

  const scene = new THREE.Scene();
  scene.background = BG.clone();

  /* —— 影棚环境：顶部柔光条 + 侧面灯板 + 暖色背光 → PMREM 反射 —— */
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = new THREE.Scene();
  env.background = new THREE.Color(0x030304);
  const panel = (w, h, k, color, pos, rot) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(k), side: THREE.DoubleSide }));
    m.position.set(...pos); m.rotation.set(...rot); env.add(m);
  };
  [-2.4, 0, 2.4].forEach(z => panel(9, 0.9, 2.6, 0xffffff, [0, 6, z], [Math.PI / 2, 0, 0]));
  panel(1.4, 5, 2.2, 0xdfe8ff, [-8, 2.5, 0], [0, Math.PI / 2, 0]);
  panel(1.4, 5, 2.2, 0xdfe8ff, [8, 2.5, 0], [0, -Math.PI / 2, 0]);
  panel(10, 2.2, 1.6, 0xffd6a0, [0, 2, -9], [0, 0, 0]);
  panel(10, 0.6, 1.2, 0xffffff, [0, 1, 9], [0, Math.PI, 0]);
  scene.environment = pmrem.fromScene(env, 0.035).texture;

  const key = new THREE.DirectionalLight(0xffffff, 1.4); key.position.set(4, 7, 5); scene.add(key);
  const rim = new THREE.DirectionalLight(0x9fc3ff, 1.1); rim.position.set(-6, 3, -5); scene.add(rim);

  /* —— 地面：镜面反射 + 渐隐遮罩 + 接触阴影 —— */
  const mirror = new Reflector(new THREE.CircleGeometry(30, 64), {
    textureWidth: (isMobile ? 512 : 1024), textureHeight: (isMobile ? 512 : 1024), color: 0x8a8a8a, clipBias: 0.003,
  });
  mirror.rotation.x = -Math.PI / 2;
  scene.add(mirror);
  const fadeMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false,
    uniforms: { uBg: { value: BG.clone() }, uNight: { value: 0 } },
    vertexShader: 'varying vec2 vP; void main(){ vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: `uniform vec3 uBg; uniform float uNight; varying vec2 vP;
      void main(){ float d = length(vP);
        float a = mix(0.62, 1.0, smoothstep(2.5, 13.0, d));
        float grid = (1.0 - smoothstep(0.0, 0.02, abs(fract(vP.x*0.5)-0.5)-0.48)) + (1.0 - smoothstep(0.0, 0.02, abs(fract(vP.y*0.5)-0.5)-0.48));
        vec3 c = uBg + vec3(0.06,0.07,0.09) * clamp(grid,0.0,1.0) * (1.0 - smoothstep(4.0, 14.0, d)) * (0.35 + 0.65*uNight);
        gl_FragColor = vec4(c, a); }`,
  });
  const fade = new THREE.Mesh(new THREE.CircleGeometry(30, 64), fadeMat);
  fade.rotation.x = -Math.PI / 2; fade.position.y = 0.002; scene.add(fade);

  const shadowTex = (() => {
    const c = document.createElement('canvas'); c.width = c.height = 128;
    const g = c.getContext('2d'); const gr = g.createRadialGradient(64, 64, 4, 64, 64, 64);
    gr.addColorStop(0, 'rgba(0,0,0,0.95)'); gr.addColorStop(0.55, 'rgba(0,0,0,0.6)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c);
  })();
  const contact = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false }));
  contact.rotation.x = -Math.PI / 2; contact.position.y = 0.004;

  /* —— 转台：车辆 + 扫描光幕 + 接触阴影 —— */
  const turn = new THREE.Group();
  scene.add(turn);
  turn.add(contact);

  const paint = new THREE.MeshPhysicalMaterial({ color: 0xb8955f, metalness: 0.8, roughness: 0.32, clearcoat: 1, clearcoatRoughness: 0.03 });
  const ambient = new THREE.Color(0xffb36b);

  const scanMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
    uniforms: { uA: { value: 0 }, uC: { value: new THREE.Color(0x62d8ff) } },
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: `uniform float uA; uniform vec3 uC; varying vec2 vUv;
      void main(){ float e = smoothstep(0.0,0.15,vUv.y)*smoothstep(1.0,0.75,vUv.y)*smoothstep(0.0,0.1,vUv.x)*smoothstep(1.0,0.9,vUv.x);
        float lines = 0.5 + 0.5*step(0.5, fract(vUv.y*40.0));
        gl_FragColor = vec4(uC * e * lines * uA * 1.6, e * uA); }`,
  });
  const scan = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), scanMat);
  scan.rotation.y = Math.PI / 2; scan.visible = false; turn.add(scan);

  let car = null, outgoing = null, morph = null;
  const allMats = () => [car, outgoing].filter(Boolean).map(v => v.userData.mats);

  function make(type, keepSide) {
    const plane = new THREE.Plane(new THREE.Vector3(keepSide, 0, 0), 99);
    const v = buildVehicle(type, { paint, ambient, clipPlanes: [plane] });
    v.userData.plane = plane; v.userData.local = new THREE.Plane(new THREE.Vector3(keepSide, 0, 0), 99);
    v.userData.side = keepSide;
    turn.add(v);
    return v;
  }
  car = make('sedan', -1);

  function setVehicle(type) {
    if (morph || car.userData.type === type) { if (morph) morph.queued = type; return; }
    outgoing = car;
    outgoing.userData.side = 1;
    outgoing.userData.local.normal.set(1, 0, 0);
    car = make(type, -1);
    applyLook();
    const span = Math.max(VEHICLE_LENGTH[type], VEHICLE_LENGTH[outgoing.userData.type]) / 2 + 0.5;
    morph = { t: 0, from: -span, to: span, dur: reduce ? 0.01 : 1.5 };
    scan.visible = true;
    const h = Math.max(VEHICLE_HEIGHT[type], VEHICLE_HEIGHT[outgoing.userData.type]) + 0.5;
    scan.scale.set(2.8, h, 1); scan.position.y = h / 2;
    buildHotspots(type);
  }

  /* 外观状态 */
  const look = { paint: new THREE.Color(0xb8955f), metal: 0.8, ambient: new THREE.Color(0xffb36b), night: 0, nightOverride: null };
  function applyLook() {
    allMats().forEach(m => {
      m.paint.color.copy(look.paint); m.paint.metalness = look.metal;
      m.glass.emissive.copy(look.ambient);
    });
  }
  function setPaint(hex, metal = 0.55) { look.paint.set(hex); look.metal = metal; applyLook(); }
  function setAmbient(hex) { look.ambient.set(hex); applyLook(); }
  function setNight(on) { look.nightOverride = on; }

  /* —— 热点 —— */
  let hotspots = [];
  function buildHotspots(type) {
    hotspotLayer.innerHTML = '';
    hotspots = HOTSPOTS[type].map((h, i) => {
      const el = document.createElement('button');
      el.className = 'hs';
      el.type = 'button';
      el.innerHTML = `<span class="hs-dot"></span><span class="hs-card"><b><span class="lang-en">${h.en[0]}</span><span class="lang-cn">${h.cn[0]}</span></b><span class="lang-en">${h.en[1]}</span><span class="lang-cn">${h.cn[1]}</span></span>`;
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const open = el.classList.contains('open');
        hotspotLayer.querySelectorAll('.hs.open').forEach(x => x.classList.remove('open'));
        if (!open) el.classList.add('open');
      });
      hotspotLayer.appendChild(el);
      return { el, local: new THREE.Vector3(...h.p), i };
    });
  }
  buildHotspots('sedan');
  document.addEventListener('click', () => hotspotLayer.querySelectorAll('.hs.open').forEach(x => x.classList.remove('open')));

  /* —— 拖拽旋转（带惯性）—— */
  let yawUser = 0, yawVel = 0, dragging = false, lastX = 0, lastT = 0;
  const pointerTarget = stageEl;
  pointerTarget.addEventListener('pointerdown', (e) => {
    if (e.target.closest('button, input, a, .panel')) return;
    dragging = true; lastX = e.clientX; lastT = performance.now(); yawVel = 0;
    stageEl.classList.add('grabbing');
  });
  addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX, now = performance.now();
    yawUser += dx * 0.008; yawVel = (dx * 0.008) / Math.max(now - lastT, 8) * 16;
    lastX = e.clientX; lastT = now;
  });
  addEventListener('pointerup', () => { dragging = false; stageEl.classList.remove('grabbing'); });

  /* —— 相机 & 后期 —— */
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.28, 0.55, 0.92);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  let W = 0, H = 0;
  function resize() {
    W = innerWidth; H = innerHeight;
    renderer.setSize(W, H, false);
    composer.setSize(W, H);
    camera.aspect = W / H;
    camera.fov = W < H ? 46 : 32;
    camera.updateProjectionMatrix();
  }
  resize();
  addEventListener('resize', resize);

  /* 滚动进度 → 章节插值 */
  let progress = 0;
  // 章节 i 的顶边抵达视口顶部时 progress = i
  const chapterEls = [...stageEl.querySelectorAll('.chapter')];
  function readScroll() {
    const tops = chapterEls.map(el => el.getBoundingClientRect().top);
    let p = 0;
    for (let i = 0; i < tops.length - 1; i++) {
      if (tops[i + 1] <= 0) { p = i + 1; continue; }
      if (tops[i] <= 0) p = i + (-tops[i]) / (tops[i + 1] - tops[i]);
      break;
    }
    progress = Math.min(p, CHAPTERS.length - 1);
  }
  addEventListener('scroll', readScroll, { passive: true });
  readScroll();

  const cur = { pos: new THREE.Vector3(...CHAPTERS[0].pos), tgt: new THREE.Vector3(...CHAPTERS[0].tgt), off: 0, night: 0, yaw: 0, scale: 1 };
  const tmpA = new THREE.Vector3(), tmpB = new THREE.Vector3(), proj = new THREE.Vector3(), camDir = new THREE.Vector3();

  let visible = true;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 }).observe(stageEl);

  const clock = new THREE.Clock();
  let t = 0;
  function frame() {
    requestAnimationFrame(frame);
    if (!visible) { clock.getDelta(); return; }
    const dt = Math.min(clock.getDelta(), 0.05);
    t += dt;

    const i = Math.min(Math.floor(progress), CHAPTERS.length - 2);
    const f = ease(Math.min(Math.max(progress - i, 0), 1));
    const A = CHAPTERS[i], B = CHAPTERS[i + 1];
    const k = reduce ? 1 : 1 - Math.pow(0.0015, dt);

    // 镜头距离按车长缩放
    const type = car.userData.type;
    const sTarget = type === 'coach' ? 1.42 : type === 'mpv' ? 1.08 : 1;
    cur.scale = lerp(cur.scale, sTarget, k * 0.6);
    tmpA.set(...A.pos).lerp(tmpB.set(...B.pos), f).multiplyScalar(cur.scale * (W < H ? 1.55 : 1));
    cur.pos.lerp(tmpA, k);
    tmpA.set(...A.tgt).lerp(tmpB.set(...B.tgt), f); tmpA.y *= cur.scale * (type === 'coach' ? 1.15 : 1);
    cur.tgt.lerp(tmpA, k);
    const offT = isMobile ? 0 : lerp(A.off, B.off, f);
    cur.off = lerp(cur.off, offT, k);
    const chapterNight = lerp(A.night, B.night, f);
    const nightT = look.nightOverride === null ? chapterNight : (look.nightOverride ? 1 : 0);
    cur.night = lerp(cur.night, nightT, k * 0.7);
    cur.yaw = lerp(cur.yaw, lerp(A.yaw, B.yaw, f), k);

    camera.position.copy(cur.pos);
    camera.lookAt(cur.tgt);
    // 竖屏：车型匹配章节把车推到画面上部，避开底部面板
    const offY = isMobile ? lerp(i + 1 === 3 ? 0 : 0, 0.3, i + 1 === 3 ? f : 0) : 0;
    cur.offY = lerp(cur.offY || 0, offY, k);
    if (Math.abs(cur.off) > 0.001 || Math.abs(cur.offY) > 0.001) camera.setViewOffset(W, H, cur.off * W, cur.offY * H, W, H); else camera.clearViewOffset();

    // 转台：章节朝向 + 用户拖拽 + 首屏缓慢自转
    if (!dragging) { yawUser += yawVel * dt * 60; yawVel *= Math.pow(0.04, dt); }
    const idle = (!reduce && progress < 0.6) ? Math.sin(t * 0.25) * 0.18 : 0;
    turn.rotation.y = cur.yaw + yawUser + idle;
    contact.scale.set(VEHICLE_LENGTH[type] * 1.25, 2.6, 1);

    // 夜间：环境压暗、灯组点亮、氛围灯透出车窗
    const n = cur.night;
    scene.environmentIntensity = lerp(1.0, 0.16, n);
    key.intensity = lerp(1.4, 0.15, n); rim.intensity = lerp(1.1, 0.6, n);
    fadeMat.uniforms.uNight.value = n;
    bloom.strength = lerp(0.32, 0.9, n);
    allMats().forEach(m => {
      m.head.emissiveIntensity = lerp(0.8, 14, n);
      m.tail.emissiveIntensity = lerp(0.8, 9, n);
      m.glass.emissiveIntensity = lerp(0, 0.09, n);
      m.beam.uniforms.uOn.value = n;
    });

    // 扫描生成过渡
    turn.updateMatrixWorld(true);
    if (morph) {
      morph.t = Math.min(morph.t + dt / morph.dur, 1);
      const s = lerp(morph.from, morph.to, ease(morph.t));
      car.userData.local.constant = s;          // 保留 x <= s：新车从车尾长出
      outgoing.userData.local.constant = -s;    // 保留 x >= s：旧车从车尾消失
      scan.position.x = s;
      scanMat.uniforms.uA.value = Math.sin(morph.t * Math.PI);
      if (morph.t >= 1) {
        turn.remove(outgoing);
        outgoing.traverse(o => { if (o.isMesh) o.geometry.dispose(); });
        outgoing = null; scan.visible = false;
        car.userData.local.constant = 99;
        const q = morph.queued; morph = null;
        if (q && q !== car.userData.type) setVehicle(q);
      }
    }
    [car, outgoing].forEach(v => { if (v) v.userData.plane.copy(v.userData.local).applyMatrix4(turn.matrixWorld); });

    // 热点投影（只在侧面章节及车身朝向镜头时显示）
    const hsOn = progress > 0.55 && progress < 2.5 && !morph;
    camera.getWorldDirection(camDir);
    hotspots.forEach(h => {
      tmpA.copy(h.local).applyMatrix4(car.matrixWorld);
      tmpB.set(0, 0, 1).transformDirection(car.matrixWorld);
      const facing = tmpB.dot(tmpA.clone().sub(camera.position).normalize()) < -0.15;
      proj.copy(tmpA).project(camera);
      const show = hsOn && facing && proj.z < 1;
      h.el.style.opacity = show ? 1 : 0;
      h.el.style.pointerEvents = show ? 'auto' : 'none';
      h.el.style.transform = `translate(${(proj.x * 0.5 + 0.5) * W}px, ${(-proj.y * 0.5 + 0.5) * H}px)`;
      if (!show) h.el.classList.remove('open');
    });

    composer.render();
  }
  frame();

  return { setVehicle, setPaint, setAmbient, setNight, get progress() { return progress; }, get night() { return cur.night; } };
}
