/* ============================================================
   vehicle.js · 程序化建模的三款车型（示意，非原厂模型）
   sedan（行政轿车）/ mpv（商务车）/ coach（考斯特中巴）
   侧面轮廓挤出 + 平面收窄 + 车顶内倾，避免依赖外部模型授权
   ============================================================ */
import * as THREE from 'three';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';

/* 每款车：尺寸 + 车身侧轮廓 + 玻璃舱轮廓（x 向前，y 向上，单位 m） */
const SPECS = {
  sedan: {
    L: 5.1, W: 1.92, R: 0.36, axles: [1.55, -1.55], belt: 0.92, hoodTop: 0.72,
    body(p) {
      p.moveTo(-2.48, 0.2);
      arch(p, -1.55, 0.36, 0.44, 0.2);
      arch(p, 1.55, 0.36, 0.44, 0.2);
      p.lineTo(2.42, 0.2);
      p.quadraticCurveTo(2.6, 0.22, 2.6, 0.44);
      p.quadraticCurveTo(2.6, 0.66, 2.36, 0.72);
      p.quadraticCurveTo(1.6, 0.8, 0.95, 0.9);
      p.lineTo(-1.6, 0.94);
      p.quadraticCurveTo(-2.32, 0.96, -2.48, 0.86);
      p.quadraticCurveTo(-2.56, 0.78, -2.56, 0.5);
      p.lineTo(-2.56, 0.3);
      p.quadraticCurveTo(-2.56, 0.2, -2.48, 0.2);
    },
    glass(p) {
      p.moveTo(1.02, 0.86);
      p.quadraticCurveTo(0.62, 1.22, 0.22, 1.42);
      p.quadraticCurveTo(-0.55, 1.5, -1.12, 1.4);
      p.quadraticCurveTo(-1.58, 1.2, -1.8, 0.9);
      p.lineTo(1.02, 0.86);
    },
    glassW: 0.84,
    lights: { head: [2.5, 0.62], tail: [-2.55, 0.8], grille: [2.6, 0.4, 0.26] },
  },
  mpv: {
    L: 5.2, W: 1.98, R: 0.37, axles: [1.62, -1.58], belt: 1.02, hoodTop: 0.92,
    body(p) {
      p.moveTo(-2.5, 0.22);
      arch(p, -1.58, 0.37, 0.45, 0.22);
      arch(p, 1.62, 0.37, 0.45, 0.22);
      p.lineTo(2.45, 0.22);
      p.quadraticCurveTo(2.62, 0.24, 2.62, 0.48);
      p.quadraticCurveTo(2.62, 0.84, 2.4, 0.9);
      p.quadraticCurveTo(2.0, 0.96, 1.72, 1.02);
      p.lineTo(-2.42, 1.04);
      p.quadraticCurveTo(-2.58, 1.02, -2.6, 0.86);
      p.lineTo(-2.6, 0.34);
      p.quadraticCurveTo(-2.6, 0.22, -2.5, 0.22);
    },
    glass(p) {
      p.moveTo(1.8, 0.98);
      p.quadraticCurveTo(1.4, 1.62, 1.02, 1.86);
      p.quadraticCurveTo(0.6, 1.94, -0.2, 1.95);
      p.lineTo(-2.25, 1.93);
      p.quadraticCurveTo(-2.5, 1.9, -2.55, 1.6);
      p.lineTo(-2.58, 1.0);
      p.lineTo(1.8, 0.98);
    },
    glassW: 0.9,
    lights: { head: [2.52, 0.78], tail: [-2.6, 0.95], grille: [2.62, 0.5, 0.3] },
  },
  coach: {
    L: 7.0, W: 2.08, R: 0.4, axles: [2.15, -1.75], belt: 1.22, hoodTop: 1.22,
    body(p) {
      p.moveTo(-3.38, 0.3);
      arch(p, -1.75, 0.4, 0.5, 0.3);
      arch(p, 2.15, 0.4, 0.5, 0.3);
      p.lineTo(3.36, 0.3);
      p.quadraticCurveTo(3.5, 0.32, 3.52, 0.5);
      p.lineTo(3.55, 1.12);
      p.quadraticCurveTo(3.55, 1.22, 3.45, 1.24);
      p.lineTo(-3.4, 1.26);
      p.quadraticCurveTo(-3.5, 1.24, -3.5, 1.1);
      p.lineTo(-3.5, 0.4);
      p.quadraticCurveTo(-3.5, 0.3, -3.38, 0.3);
    },
    glass(p) {
      p.moveTo(3.5, 1.18);
      p.quadraticCurveTo(3.42, 2.2, 3.12, 2.52);
      p.quadraticCurveTo(2.9, 2.62, 2.3, 2.64);
      p.lineTo(-3.25, 2.64);
      p.quadraticCurveTo(-3.46, 2.6, -3.48, 2.3);
      p.lineTo(-3.48, 1.2);
      p.lineTo(3.5, 1.18);
    },
    glassW: 0.94,
    lights: { head: [3.5, 0.72], tail: [-3.5, 1.0], grille: [3.53, 0.55, 0.28] },
  },
};

/* 底边 → 轮拱半圆（从后向前画） */
function arch(p, cx, cy, r, bottom) {
  p.lineTo(cx - r, bottom);
  p.lineTo(cx - r, cy);
  p.absarc(cx, cy, r, Math.PI, 0, true);
  p.lineTo(cx + r, bottom);
}

const smooth = (a, b, x) => { const t = Math.min(Math.max((x - a) / (b - a), 0), 1); return t * t * (3 - 2 * t); };

/* 挤出 + 收窄：两端平面收窄（俯视圆润）+ 高处内倾（tumblehome） */
function extrude(drawFn, width, spec, { tumbleFrom, tumble, segs = 6, bevel = 0.1 }) {
  const shape = new THREE.Shape();
  drawFn(shape);
  const depth = Math.max(width - bevel * 2, 0.05);
  const g = new THREE.ExtrudeGeometry(shape, {
    depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel * 0.55,
    bevelSegments: segs, curveSegments: 40, steps: 1,
  });
  g.translate(0, 0, -depth / 2);
  const half = spec.L / 2;
  const f = (x, y) => (1 - 0.2 * smooth(half * 0.62, half + 0.12, Math.abs(x)) ** 2) * (1 - tumble * smooth(tumbleFrom, tumbleFrom + 0.8, y));

  // 侧盖（group 0）：解析法线，避免大三角形插值出斜向条纹；
  // 侧壁与倒角（group 1）：合并顶点后平滑法线
  const pos = g.attributes.position;
  const capCount = g.groups[0].count, e = 1e-3;
  const capPos = [], capNor = [];
  for (let i = 0; i < capCount; i++) {
    const x = pos.getX(i), y = pos.getY(i), z0 = pos.getZ(i), k = f(x, y), sg = Math.sign(z0) || 1;
    const fx = (f(x + e, y) - f(x - e, y)) / (2 * e), fy = (f(x, y + e) - f(x, y - e)) / (2 * e);
    const n = new THREE.Vector3(-z0 * fx, -z0 * fy, 1).multiplyScalar(sg).normalize();
    capPos.push(x, y, z0 * k); capNor.push(n.x, n.y, n.z);
  }
  const side = new THREE.BufferGeometry();
  const sp = [];
  for (let i = capCount; i < pos.count; i++) { const x = pos.getX(i), y = pos.getY(i); sp.push(x, y, pos.getZ(i) * f(x, y)); }
  side.setAttribute('position', new THREE.Float32BufferAttribute(sp, 3));
  const sm = mergeVertices(side, 1e-4);
  sm.computeVertexNormals();
  const sn = sm.toNonIndexed();
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.Float32BufferAttribute([...capPos, ...sn.attributes.position.array], 3));
  out.setAttribute('normal', new THREE.Float32BufferAttribute([...capNor, ...sn.attributes.normal.array], 3));
  g.dispose(); side.dispose(); sm.dispose();
  return out;
}

function wheel(spec, mats) {
  const R = spec.R, w = 0.26;
  const g = new THREE.Group();
  // 轮胎：圆角截面车削
  const prof = [];
  for (let i = 0; i <= 16; i++) {
    const a = -Math.PI / 2 + (i / 16) * Math.PI;
    prof.push(new THREE.Vector2(R - 0.07 + Math.cos(a) * 0.07, Math.sin(a) * w / 2));
  }
  prof.unshift(new THREE.Vector2(R * 0.72, -w / 2));
  prof.push(new THREE.Vector2(R * 0.72, w / 2));
  const tire = new THREE.Mesh(new THREE.LatheGeometry(prof, 48), mats.tire);
  tire.rotation.x = Math.PI / 2;
  g.add(tire);
  // 轮毂：盘面 + 10 辐条 + 中心盖
  const rim = new THREE.Group();
  const disc = new THREE.Mesh(new THREE.CylinderGeometry(R * 0.73, R * 0.73, 0.04, 48), mats.rimDark);
  disc.rotation.x = Math.PI / 2; disc.position.z = w / 2 - 0.06; rim.add(disc);
  const lip = new THREE.Mesh(new THREE.TorusGeometry(R * 0.72, 0.014, 8, 64), mats.chrome);
  lip.position.z = w / 2 - 0.02; rim.add(lip);
  for (let i = 0; i < 10; i++) {
    const s = new THREE.Mesh(new THREE.BoxGeometry(R * 0.62, 0.045, 0.03), mats.rim);
    s.geometry.translate(R * 0.34, 0, 0);
    s.rotation.z = (i / 10) * Math.PI * 2;
    s.position.z = w / 2 - 0.03;
    rim.add(s);
  }
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.03, 24), mats.chrome);
  cap.rotation.x = Math.PI / 2; cap.position.z = w / 2 - 0.02; rim.add(cap);
  g.add(rim);
  g.userData.spin = rim;
  g.userData.tire = tire;
  return g;
}

/* 创建一辆车。sharedPaint 让三款车共用车漆色；clip 用于"扫描生成"过渡 */
export function buildVehicle(type, { paint, ambient, clipPlanes }) {
  const spec = SPECS[type];
  const withClip = (m) => { m.clippingPlanes = clipPlanes; m.clipShadows = true; return m; };
  const mats = {
    paint: withClip(paint.clone()),
    glass: withClip(new THREE.MeshPhysicalMaterial({
      color: 0x07090c, metalness: 0.3, roughness: 0.22, envMapIntensity: 0.9,
      emissive: ambient.clone(), emissiveIntensity: 0,
    })),
    trim: withClip(new THREE.MeshStandardMaterial({ color: 0x0c0c0d, metalness: 0.4, roughness: 0.5 })),
    chrome: withClip(new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 1, roughness: 0.12 })),
    tire: withClip(new THREE.MeshStandardMaterial({ color: 0x111112, roughness: 0.88 })),
    rim: withClip(new THREE.MeshStandardMaterial({ color: 0xc9cbd0, metalness: 1, roughness: 0.22 })),
    rimDark: withClip(new THREE.MeshStandardMaterial({ color: 0x1a1b1e, metalness: 0.8, roughness: 0.4 })),
    head: withClip(new THREE.MeshStandardMaterial({ color: 0x111111, emissive: 0xeaf4ff, emissiveIntensity: 1.2 })),
    tail: withClip(new THREE.MeshStandardMaterial({ color: 0x220000, emissive: 0xff1a2a, emissiveIntensity: 0.6 })),
    inner: withClip(new THREE.MeshBasicMaterial({ color: 0x020202 })),
  };
  mats.paint.userData.isPaint = true;

  const root = new THREE.Group();
  root.userData = { type, spec, mats, wheels: [] };

  const body = new THREE.Mesh(extrude(spec.body, spec.W, spec, { tumbleFrom: spec.belt - 0.45, tumble: 0.1, bevel: 0.16 }), mats.paint);
  root.add(body);

  const gw = spec.W * spec.glassW;
  const glass = new THREE.Mesh(extrude(spec.glass, gw, spec, { tumbleFrom: spec.belt, tumble: 0.16, bevel: 0.1, segs: 5 }), mats.glass);
  root.add(glass);

  // 轮拱内衬（挡住穿透视线）
  spec.axles.forEach(ax => {
    const box = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.55, spec.W - 0.62), mats.inner);
    box.position.set(ax, spec.R + 0.14, 0);
    root.add(box);
  });

  // 车轮
  spec.axles.forEach(ax => [1, -1].forEach(side => {
    const wh = wheel(spec, mats);
    wh.position.set(ax, spec.R, side * (spec.W / 2 - 0.16));
    if (side < 0) wh.rotation.y = Math.PI;
    root.add(wh);
    root.userData.wheels.push(wh);
  }));

  // 灯组：前大灯两条 + 贯穿式尾灯 + 格栅
  const half = spec.L / 2, plan = (x) => 1 - 0.2 * smooth(half * 0.62, half + 0.12, Math.abs(x)) ** 2;
  const [hx, hy] = spec.lights.head;
  const hz = (spec.W / 2) * plan(hx);
  [1, -1].forEach(side => {
    const h = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.05, hz * 0.42), mats.head);
    h.position.set(hx + 0.04, hy, side * hz * 0.62);
    h.rotation.y = side * 0.32;
    root.add(h);
  });
  const [tx, ty] = spec.lights.tail;
  const tz = (spec.W / 2) * plan(tx);
  const tail = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.045, tz * 1.86), mats.tail);
  tail.position.set(tx - 0.035, ty, 0);
  root.add(tail);
  const [gx, gy, gh] = spec.lights.grille;
  const grille = new THREE.Mesh(new THREE.BoxGeometry(0.06, gh, hz * 0.85), mats.trim);
  grille.position.set(gx, gy, 0); root.add(grille);
  const frame = new THREE.Mesh(new THREE.BoxGeometry(0.062, gh + 0.03, hz * 0.85 + 0.03), mats.chrome);
  frame.position.set(gx - 0.006, gy, 0); frame.scale.set(1, 1, 1); root.add(frame);
  for (let i = 1; i < 6; i++) {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.066, 0.012, hz * 0.83), mats.chrome);
    bar.position.set(gx + 0.002, gy - gh / 2 + (i * gh) / 6, 0); root.add(bar);
  }

  // 腰线镀铬饰条
  [1, -1].forEach(side => {
    const len = spec.L * 0.62;
    const s = new THREE.Mesh(new THREE.BoxGeometry(len, 0.018, 0.012), mats.chrome);
    s.position.set(-spec.L * 0.06, spec.belt - 0.02, side * (spec.W / 2 - 0.005) * 0.955);
    root.add(s);
  });

  // 前大灯光束（夜间模式，加色锥体）
  const beamMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
    uniforms: { uOn: { value: 0 } },
    vertexShader: 'varying float vY; void main(){ vY = uv.y; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: 'uniform float uOn; varying float vY; void main(){ float a = pow(vY, 2.2) * 0.22 * uOn; gl_FragColor = vec4(vec3(0.85,0.92,1.0) * a, a); }',
  });
  beamMat.clippingPlanes = clipPlanes;
  mats.beam = beamMat;
  [1, -1].forEach(side => {
    const cone = new THREE.Mesh(new THREE.ConeGeometry(1.1, 5.5, 32, 1, true), beamMat);
    cone.geometry.translate(0, -2.75, 0);
    cone.rotation.z = Math.PI / 2 - 0.1;
    cone.position.set(hx + 0.1, hy, side * hz * 0.62);
    root.add(cone);
  });

  root.traverse(o => { if (o.isMesh) { o.castShadow = false; o.receiveShadow = false; } });
  return root;
}

export const VEHICLE_LENGTH = { sedan: SPECS.sedan.L, mpv: SPECS.mpv.L, coach: SPECS.coach.L };
export const VEHICLE_HEIGHT = { sedan: 1.5, mpv: 1.95, coach: 2.65 };
