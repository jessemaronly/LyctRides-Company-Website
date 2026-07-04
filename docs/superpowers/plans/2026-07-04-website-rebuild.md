# LyctRides 官网全面重建 · 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 按 [spec](../specs/2026-07-04-website-rebuild-design.md) 用 Astro 重建 lyctai.com:三层 IA、双语路径分离(/=中文、/en/=英文)、三个签名交互、全量 SEO,零信息丢失。

**Architecture:** Astro 5 静态输出(`output:'static'`),仓库根新增工程与旧站 HTML 在 `feat/rebuild` 分支共存,验收后单次 squash-merge 切换。内容三来源:i18n JSON(页面文案)、`src/data/*.json`(结构化数据,单一权威源)、根 `data/*.json`(news/careers,构建期读取)。测试 = vitest + cheerio 对 `dist/` 产物断言(红线扫描/法律锚点/hreflang/JSON-LD/双语等价)。

**Tech Stack:** Astro 5 · Tailwind CSS v4(`@tailwindcss/vite`,构建期) · TypeScript · vitest + cheerio · sanitize-html · astro-og-canvas · @astrojs/sitemap

## Global Constraints(每个任务隐含遵守;违反即返工)

- **红线词永不出现**(法务两页的否定句式除外):网约车、打车、即时叫车、叫车、自营车队、自有车队、司机入驻、招募司机、零担、快车、顺风车、拼车。测试 T3 强制执行。
- 对客称**管家**(EN: chauffeur),不称司机;品牌名只写 **LyctRides**;中文主体名 光年(广州)汽车服务有限责任公司;英文法定名 LyctRides Car Service Co., Ltd.
- 色彩:仅 `#0A0A0A` / `#FAFAF7` + 玉色 `#1D9E75`(亮)/`#0F6E56`(深)。玉色只准用于:事实带圆点、LyctAI Live 标识、方案顾问选中态、表单 focus/成功态。禁大面积、禁装饰、禁第三色。
- 字体自托管+子集化:Albert Sans / Noto Sans SC / Noto Serif SC / JetBrains Mono。**禁止任何海外运行时依赖**(Google Fonts/CDN/Tailwind CDN)。
- 动效:缓动统一 `cubic-bezier(0.32,0.72,0,1)`;微交互 150–250ms、转场 400–600ms;全部尊重 `prefers-reduced-motion`;无 JS 时内容完整可读。
- 实现层命名禁用 status/live/online(用 facts/highlights);玉色圆点**静态不呼吸**。
- 表单端点不变:`POST /api/public/leads`、`POST /api/public/careers/apply`;运行时增强 API:`GET /api/public/news`、`GET /api/public/careers`。localStorage 语言键 `lyct-lang`,**只记偏好不自动跳转**。
- footer 全站(含 /en/):ICP 号「粤ICP备2026084775号」链 `https://beian.miit.gov.cn`,中文原文不翻译;公安号占位注释,下号后填。
- Node ≥ 20;`dist/`、`node_modules/` 进 .gitignore;每任务结束 commit(不 push,不合 main)。
- 分支纪律:全程 `feat/rebuild`;main 只做现网维护。**本计划不执行上线切换**(切换以公安备案通过 + 备案变更判断留档为前提,单独走)。

## 文件结构(全景;各任务按此落位)

```
astro.config.mjs  package.json  tsconfig.json  vitest.config.ts
src/
  styles/global.css                  # 设计 token + 基础层
  i18n/{zh-cn,en}/<page>.json        # 页面文案(home/solutions/…/legal)
  i18n/index.ts                      # useT() 助手 + 路由工具
  data/{vehicles,facts,configurator,lyctai-capabilities}.json
  layouts/Base.astro                 # <html> 骨架 + BaseHead + Nav + Footer
  components/
    BaseHead.astro Nav.astro Footer.astro LangSwitch.astro
    CtaBand.astro SceneCard.astro StatChip.astro FactsBar.astro
    SolutionAdvisor.astro LyctaiDiagram.astro JsonLd.astro Motion.astro
  lib/{news.ts,sanitize.ts}          # data/news.json 加载 + 净化
  pages/                             # 中文(根)
    index.astro solutions/index.astro solutions/<7个场景>.astro
    lyctai.astro enterprise.astro vehicles.astro
    cities/index.astro cities/[city].astro
    about.astro news/index.astro news/[slug].astro
    careers.astro contact.astro terms.astro privacy.astro 404.astro
  pages/en/…                         # 英文镜像(同构)
public/fonts/  public/images -> ../images(构建脚本复制)
tests/{redlines,legal-anchors,seo-head,jsonld,bilingual-data}.test.ts
docs/{i18n-migration-map.md,redirects-301.md}
.github/workflows/deploy.yml
```

---

## Phase 0 · 地基

### Task 1: 分支 + Astro 脚手架

**Files:** Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore`(追加), `src/pages/index.astro`(临时占位), `src/styles/global.css`(空壳)
**Interfaces:** Produces: 可 `npm run build` 出 `dist/index.html` 的工程;`site: 'https://lyctai.com'`;i18n 路由 zh-cn 根/ en 前缀。

- [ ] **Step 1: 建分支**
```bash
cd /Users/jz/WorkPlace/lyctai-website && git checkout -b feat/rebuild
```
- [ ] **Step 2: 初始化工程**(手写文件,不跑 create-astro 向导)

`package.json`:
```json
{
  "name": "lyctai-website",
  "type": "module",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "test": "vitest run",
    "test:built": "npm run build && vitest run"
  },
  "dependencies": {
    "@astrojs/sitemap": "^3.2.0",
    "@tailwindcss/vite": "^4.0.0",
    "astro": "^5.0.0",
    "astro-og-canvas": "^0.5.0",
    "sanitize-html": "^2.13.0",
    "tailwindcss": "^4.0.0"
  },
  "devDependencies": {
    "@types/sanitize-html": "^2.13.0",
    "cheerio": "^1.0.0",
    "typescript": "^5.6.0",
    "vitest": "^2.1.0"
  }
}
```

`astro.config.mjs`:
```js
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://lyctai.com',
  output: 'static',
  trailingSlash: 'always',
  i18n: {
    defaultLocale: 'zh-cn',
    locales: ['zh-cn', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
});
```

`tsconfig.json`:
```json
{ "extends": "astro/tsconfigs/strict", "compilerOptions": { "baseUrl": ".", "paths": { "@/*": ["src/*"] } } }
```

`.gitignore` 追加:
```
node_modules/
dist/
.astro/
```

`src/pages/index.astro`(占位,Task 10 重写):
```astro
---
---
<html lang="zh-CN"><head><meta charset="utf-8" /><title>LyctRides</title></head>
<body><h1>rebuild scaffold</h1></body></html>
```
- [ ] **Step 3: 安装并构建验证**
```bash
npm install && npm run build
```
Expected: `dist/index.html` 存在,构建 0 error。
- [ ] **Step 4: Commit**
```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json .gitignore src/
git commit -m "feat(rebuild): Astro 脚手架 + i18n 路由(zh 根 / en 前缀)"
```

### Task 2: 设计 token + 字体自托管

**Files:** Create: `src/styles/global.css`, `public/fonts/*.woff2`, `scripts/fetch-fonts.mjs`
**Interfaces:** Produces: CSS 变量 `--c-ink:#0A0A0A; --c-paper:#FAFAF7; --c-jade:#1D9E75; --c-jade-deep:#0F6E56; --ease-ios:cubic-bezier(0.32,0.72,0,1)`;字体族 `--font-sans/--font-sc/--font-serif-sc/--font-mono`;工具类 `.btn-pill/.card/.eyebrow`。所有后续组件只用这些 token。

- [ ] **Step 1: 下载字体**(一次性脚本;来源 = 各字体官方 GitHub release / google-webfonts-helper 的 woff2,存 `public/fonts/`;中文字体先取 Noto Sans SC / Noto Serif SC 的 subset woff2 分片版——用 npm 包 `cn-font-split` 或直接采用 fontsource 的分片产物 `@fontsource-variable/noto-sans-sc` 复制其 files/ 到 public/fonts/)
```bash
npm i -D @fontsource-variable/noto-sans-sc @fontsource/noto-serif-sc @fontsource-variable/albert-sans @fontsource/jetbrains-mono
node scripts/fetch-fonts.mjs   # 复制各包 files/*.woff2 + 生成 @font-face 到 src/styles/fonts.css
```
`scripts/fetch-fonts.mjs`:
```js
import { cpSync, mkdirSync } from 'node:fs';
mkdirSync('public/fonts', { recursive: true });
for (const p of ['@fontsource-variable/noto-sans-sc','@fontsource/noto-serif-sc','@fontsource-variable/albert-sans','@fontsource/jetbrains-mono'])
  cpSync(`node_modules/${p}/files`, 'public/fonts', { recursive: true });
console.log('fonts copied');
```
`src/styles/fonts.css`:从上述各包的 `index.css` 复制 @font-face 规则,把 url 路径改写为 `/fonts/…`(latin + chinese-simplified 子集;JetBrains Mono 只要 latin 400)。
- [ ] **Step 2: 写 global.css**
```css
@import 'tailwindcss';
@import './fonts.css';
@theme {
  --color-ink: #0A0A0A;
  --color-paper: #FAFAF7;
  --color-jade: #1D9E75;
  --color-jade-deep: #0F6E56;
  --font-sans: 'Albert Sans Variable', 'Noto Sans SC Variable', sans-serif;
  --font-serif-sc: 'Noto Serif SC', serif;
  --font-mono: 'JetBrains Mono', monospace;
}
:root { --ease-ios: cubic-bezier(0.32, 0.72, 0, 1); }
html { background: var(--color-paper); color: var(--color-ink); scroll-behavior: smooth; }
body { font-family: var(--font-sans); }
.btn-pill { display:inline-flex; align-items:center; gap:8px; background:linear-gradient(180deg,#1c1917,#0A0A0A); color:#FAFAF7; font-size:12px; font-weight:500; letter-spacing:.12em; text-transform:uppercase; padding:13px 26px; border-radius:999px; transition:transform .2s var(--ease-ios), box-shadow .25s var(--ease-ios); }
.btn-pill:hover { transform:scale(1.04); }
.btn-pill:active { transform:scale(.96); }
.card { background:#fff; border:1px solid rgb(10 10 10 / .05); border-radius:20px; transition:transform .4s var(--ease-ios), box-shadow .25s var(--ease-ios); }
.card:hover { transform:translateY(-6px); box-shadow:0 20px 40px -20px rgb(10 10 10 / .25); }
.eyebrow { font-family:var(--font-mono); font-size:11px; letter-spacing:.25em; text-transform:uppercase; color:rgb(10 10 10 / .55); }
@media (prefers-reduced-motion: reduce) { html { scroll-behavior:auto; } * { transition-duration:.01ms !important; animation-duration:.01ms !important; } }
```
- [ ] **Step 3: 占位页引入 global.css 后构建,确认 dist 无外部 origin**
```bash
npm run build && ! grep -rE 'fonts\.googleapis|cdn\.tailwindcss|googleapis\.com' dist/ && echo CLEAN
```
Expected: `CLEAN`。
- [ ] **Step 4: Commit** `git add -A && git commit -m "feat(rebuild): 设计token+字体自托管,零海外运行时依赖"`

### Task 3: 测试地基(红线扫描 + 法律锚点)

**Files:** Create: `vitest.config.ts`, `tests/helpers.ts`, `tests/redlines.test.ts`, `tests/legal-anchors.test.ts`
**Interfaces:** Produces: `loadDist()` 助手(读 dist 全部 html 返回 `{path, html, $}[]`);`npm run test:built` 流程。后续所有测试文件用它。

- [ ] **Step 1: 写测试地基与两个测试**

`vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config';
export default defineConfig({ test: { include: ['tests/**/*.test.ts'], testTimeout: 30000 } });
```
`tests/helpers.ts`:
```ts
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import * as cheerio from 'cheerio';
export function distPages(dir = 'dist'): { path: string; html: string; $: cheerio.CheerioAPI }[] {
  const out: { path: string; html: string; $: cheerio.CheerioAPI }[] = [];
  const walk = (d: string) => {
    for (const f of readdirSync(d)) {
      const p = join(d, f);
      if (statSync(p).isDirectory()) walk(p);
      else if (f.endsWith('.html')) { const html = readFileSync(p, 'utf8'); out.push({ path: p, html, $: cheerio.load(html) }); }
    }
  };
  walk(dir);
  return out;
}
```
`tests/redlines.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { distPages } from './helpers';
const REDLINES = ['网约车','即时叫车','自营车队','自有车队','司机入驻','招募司机','零担','快车','顺风车','拼车'];
const LEGAL = /\/(terms|privacy)\/index\.html$|\/en\/(terms|privacy)\/index\.html$/;
describe('红线词扫描', () => {
  it('法务页以外 0 命中', () => {
    for (const { path, html } of distPages()) {
      if (LEGAL.test(path)) continue;
      for (const w of REDLINES) expect(html.includes(w), `${path} 含红线词「${w}」`).toBe(false);
    }
  });
  it('全站不称司机(对客文案)', () => {
    for (const { path, $ } of distPages()) {
      if (LEGAL.test(path)) continue;
      const body = $('body').text();
      expect(body.includes('司机'), `${path} 正文含「司机」`).toBe(false);
    }
  });
});
```
`tests/legal-anchors.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
const ANCHORS = [
  '现阶段，LyctRides 自身不从事道路旅客运输或网约车经营，不面向不特定公众提供即时叫车，不公开招募司机入驻，亦不在线向乘客收取按次车费；在未取得相应许可前，不开展需特定行政许可的相关业务。',
  '车辆与驾驶由具备相应道路运输经营资质的合作供应商提供，相关资质归供应商所有。',
  'LyctRides 作为居间协调方，不承担承运人责任。',
  '服务以邀请制并经企业签约的方式向企业客户提供。本网站现阶段不提供面向公众的自助注册或下单。',
  '现阶段以对公月结或线下结算为主，本网站不提供按次在线车费支付。',
];
describe('法律锚点逐字保留', () => {
  it('terms 五条锚点在 dist 原文出现', () => {
    const html = readFileSync('dist/terms/index.html', 'utf8');
    for (const a of ANCHORS) expect(html.includes(a), `缺锚点: ${a.slice(0, 20)}…`).toBe(true);
  });
});
```
- [ ] **Step 2: 跑测试确认按预期失败**(terms 页还不存在)
```bash
npm run test:built
```
Expected: redlines 通过(占位页无红线),legal-anchors **FAIL**(dist/terms 不存在)——记录该失败为预期,Task 18 转绿。
- [ ] **Step 3: Commit** `git add vitest.config.ts tests/ && git commit -m "test(rebuild): 红线扫描+法律锚点测试地基(legal 预期红,T18转绿)"`

### Task 4: i18n 地基 + 迁移对照表

**Files:** Create: `src/i18n/index.ts`, `src/i18n/zh-cn/common.json`, `src/i18n/en/common.json`, `docs/i18n-migration-map.md`
**Interfaces:** Produces: `useT(locale)` 返回 `t(page, key)`;`localePath(locale, path)`(en 加前缀);`altPath(locale, path)`(当前页的另一语言 URL,供 hreflang/切换器)。类型 `Locale = 'zh-cn' | 'en'`。

- [ ] **Step 1: 写 i18n 助手**
```ts
// src/i18n/index.ts
export type Locale = 'zh-cn' | 'en';
const cache = new Map<string, Record<string, string>>();
export function useT(locale: Locale) {
  return function t(page: string, key: string): string {
    const id = `${locale}/${page}`;
    if (!cache.has(id)) cache.set(id, JSON.parse(JSON.stringify((globalThis as any).__i18n ??= {}))[id] ?? loadJson(locale, page));
    const dict = cache.get(id)!;
    if (!(key in dict)) throw new Error(`[i18n] missing ${locale}/${page}.json key "${key}"`);
    return dict[key];
  };
}
function loadJson(locale: Locale, page: string): Record<string, string> {
  // Astro/Vite: 用 import.meta.glob 同步导入
  const mods = import.meta.glob<Record<string, string>>('/src/i18n/*/*.json', { eager: true, import: 'default' });
  const m = mods[`/src/i18n/${locale}/${page}.json`];
  if (!m) throw new Error(`[i18n] missing file ${locale}/${page}.json`);
  cache.set(`${locale}/${page}`, m);
  return m;
}
export const localePath = (l: Locale, p: string) => (l === 'en' ? `/en${p}` : p);
export const altPath = (l: Locale, current: string) => (l === 'en' ? current.replace(/^\/en/, '') || '/' : `/en${current}`);
```
(实现时以 `import.meta.glob` 版本为准,上面 cache 分支可简化——**核心契约:t() 缺 key 必须 throw**,让缺文案在构建期爆炸而不是上线后空白。)
- [ ] **Step 2: 建 common.json 起步词条**(导航/页脚/CTA)
`src/i18n/zh-cn/common.json`:
```json
{
  "nav.home": "首页", "nav.solutions": "解决方案", "nav.lyctai": "LyctAI",
  "nav.enterprise": "企业服务", "nav.company": "公司", "nav.contact": "联系",
  "nav.company.about": "关于我们", "nav.company.news": "公司动态", "nav.company.careers": "加入我们",
  "cta.primary": "企业洽谈", "cta.plan": "预约方案",
  "footer.icp": "粤ICP备2026084775号",
  "footer.legalEntity": "光年（广州）汽车服务有限责任公司",
  "footer.supplierNote": "车辆与管家服务由具备资质的合作供应商提供"
}
```
`src/i18n/en/common.json`:同 key,英文值(nav.home="Home" 等;footer.icp **保持中文原文** "粤ICP备2026084775号";footer.legalEntity 用英文法定名 "LyctRides Car Service Co., Ltd.")。
- [ ] **Step 3: 写迁移对照表骨架** `docs/i18n-migration-map.md`:表头 `旧文件 | 旧位置(section) | 新 i18n 文件 | key`,先填 common 三行,后续每个页面任务**必须**边迁边补此表。
- [ ] **Step 4: 构建验证 + Commit**
```bash
npm run build && git add src/i18n docs/i18n-migration-map.md && git commit -m "feat(rebuild): i18n地基(缺key构建期报错)+迁移对照表"
```

### Task 5: BaseHead(SEO 头)+ JsonLd 组件

**Files:** Create: `src/components/BaseHead.astro`, `src/components/JsonLd.astro`, `tests/seo-head.test.ts`
**Interfaces:** Produces: `<BaseHead locale title description path ogImage?>`(输出 canonical/hreflang 对/og/twitter 全套);`<JsonLd data={object}>`。Consumes: `altPath/localePath`(Task 4)。

- [ ] **Step 1: 写组件**
`src/components/BaseHead.astro`:
```astro
---
import { altPath, type Locale } from '@/i18n';
interface Props { locale: Locale; title: string; description: string; path: string; ogImage?: string }
const { locale, title, description, path, ogImage = '/og/default.png' } = Astro.props;
const site = 'https://lyctai.com';
const url = site + path;
const alt = site + altPath(locale, path);
---
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>{title}</title>
<meta name="description" content={description} />
<link rel="canonical" href={url} />
<link rel="alternate" hreflang={locale === 'en' ? 'en' : 'zh-CN'} href={url} />
<link rel="alternate" hreflang={locale === 'en' ? 'zh-CN' : 'en'} href={alt} />
<link rel="alternate" hreflang="x-default" href={locale === 'en' ? url : alt} />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="LyctRides" />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:url" content={url} />
<meta property="og:image" content={site + ogImage} />
<meta property="og:locale" content={locale === 'en' ? 'en_US' : 'zh_CN'} />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={site + ogImage} />
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
```
`src/components/JsonLd.astro`:
```astro
---
interface Props { data: Record<string, unknown> }
const { data } = Astro.props;
---
<script type="application/ld+json" set:html={JSON.stringify(data)} />
```
- [ ] **Step 2: 写测试** `tests/seo-head.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { distPages } from './helpers';
describe('SEO head', () => {
  it('每页 canonical 指向自身 + hreflang 三连(self/alt/x-default)', () => {
    for (const { path, $ } of distPages()) {
      if (path.includes('/og/') || path.endsWith('404.html')) continue;
      const canonical = $('link[rel=canonical]').attr('href');
      expect(canonical, `${path} 无canonical`).toBeTruthy();
      expect($('link[rel=alternate][hreflang]').length, `${path} hreflang不足`).toBeGreaterThanOrEqual(3);
      expect($('meta[property="og:title"]').length, `${path} 缺og`).toBe(1);
    }
  });
});
```
- [ ] **Step 3: 构建+测试(占位页尚未用 BaseHead,该测试预期 FAIL,Task 6 起转绿)+ Commit**
```bash
npm run test:built || true
git add src/components tests/seo-head.test.ts && git commit -m "feat(rebuild): BaseHead(hreflang/canonical/og)+JsonLd组件+测试"
```

### Task 6: Base 布局 + Nav + Footer + 语言切换

**Files:** Create: `src/layouts/Base.astro`, `src/components/Nav.astro`, `src/components/Footer.astro`, `src/components/LangSwitch.astro`, `src/components/CtaBand.astro`;Modify: `src/pages/index.astro`(占位改用布局)
**Interfaces:** Produces: `<Base locale title description path ogImage? active?>`(slot 页面主体;active = 'home'|'solutions'|'lyctai'|'enterprise'|'company'|'contact');Nav 桌面 6 项 + 移动抽屉;Footer 三列(解决方案深链/公司/法务+备案)。

- [ ] **Step 1: 写 Base.astro**
```astro
---
import '@/styles/global.css';
import BaseHead from '@/components/BaseHead.astro';
import Nav from '@/components/Nav.astro';
import Footer from '@/components/Footer.astro';
import { ClientRouter } from 'astro:transitions';
import type { Locale } from '@/i18n';
interface Props { locale: Locale; title: string; description: string; path: string; ogImage?: string; active?: string }
const { locale, title, description, path, ogImage, active = '' } = Astro.props;
---
<html lang={locale === 'en' ? 'en' : 'zh-CN'}>
  <head>
    <BaseHead {locale} {title} {description} {path} {ogImage} />
    <ClientRouter />
  </head>
  <body class="bg-paper text-ink antialiased">
    <Nav {locale} {active} currentPath={path} />
    <main><slot /></main>
    <Footer {locale} />
    <script src="@/components/motion.ts"></script>
  </body>
</html>
```
- [ ] **Step 2: 写 Nav**(结构要点,完整实现照此展开):固定顶栏 `.ios-glass`(paper 65% 半透明 + backdrop-blur),左 logo(`/images/logo.svg`),中间桌面 6 项(t('common','nav.*'),active 项加胶囊底),右侧 LangSwitch + 主 CTA `btn-pill`(t('common','cta.primary') → localePath(locale,'/contact/'));移动端汉堡 → 全屏抽屉列表。「公司」项 hover 下拉:关于/公司动态/加入我们。**滚动收拢**由 Task 9 motion.ts 挂 `.scrolled` class,此处只写样式:`.scrolled` 时 padding 收窄、logo 1.6rem、border-bottom 加深。
- [ ] **Step 3: 写 Footer**:三列深链(列1 解决方案:7 场景页链;列2 公司:关于/动态/招聘/车型臻选/城市覆盖;列3:联系/条款/隐私),底行:`© {year} {t('common','footer.legalEntity')}` + ICP 链接:
```astro
<a href="https://beian.miit.gov.cn" rel="noopener" target="_blank">{t('common','footer.icp')}</a>
{locale === 'en' && <span class="text-xs opacity-60">ICP filing — required by PRC regulations</span>}
<!-- 公安备案号占位:下号后取消注释并填号
<a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=XXXXXXXX" rel="noopener" target="_blank">
  <img src="/images/beian-badge.png" alt="" class="inline h-3.5" /> 粤公网安备 XXXXXXXX号
</a> -->
```
- [ ] **Step 4: 写 LangSwitch**(真实链接,不用 JS 切内容):
```astro
---
import { altPath, type Locale } from '@/i18n';
const { locale, currentPath } = Astro.props as { locale: Locale; currentPath: string };
---
<a href={altPath(locale, currentPath)} data-lang-switch class="eyebrow hover:opacity-60"
   onclick="try{localStorage.setItem('lyct-lang',this.href.includes('/en/')?'en':'zh-CN')}catch(e){}">
  {locale === 'en' ? '中文' : 'EN'}
</a>
```
- [ ] **Step 5: 写 CtaBand**(黑底终版 CTA 区,props: locale/title key/按钮 key,供各页复用);占位 index.astro 改用 `<Base>` 包一个 h1;构建 + seo-head 测试对 index 转绿;Commit
```bash
npm run test:built
git add -A && git commit -m "feat(rebuild): Base布局+Nav+Footer(ICP双语规范)+语言切换"
```

## Phase 1 · 数据与共享组件

### Task 7: 结构化数据文件(单一权威源)+ 双语等价测试

**Files:** Create: `src/data/vehicles.json`, `src/data/facts.json`, `src/data/configurator.json`, `src/data/lyctai-capabilities.json`, `tests/bilingual-data.test.ts`
**Interfaces:** Produces: 四个 JSON 的 schema(见下),全站唯一车型数据源。Consumes: 现站 `vehicles.html`(规格权威)、`lyctai.html`(能力权威)。

- [ ] **Step 1: 写 vehicles.json**(**从现站 vehicles.html 车型卡区逐值抄录**,V-Class 载客强制 6;结构如下,6 车全填):
```json
{
  "vehicles": [
    { "id": "s-class", "name": { "zh": "梅赛德斯-奔驰 S-Class", "en": "Mercedes-Benz S-Class" },
      "tier": { "zh": "旗舰轿车", "en": "Flagship Sedan" },
      "pax": 4, "luggage": 4, "trunkL": null,
      "blurb": { "zh": "从vehicles.html抄", "en": "copy from vehicles.html" },
      "image": "/images/Mercedes-Benz S-class-1.jpg" }
  ]
}
```
(其余 e-class / v-class(pax:6) / zeekr-009 / gl8 / coaster 同构;`trunkL` 有升数则填数字。blurb 从旧页双语 span 抄。GL8 图片加 `"objectPosition": "10% center"` 字段。)
- [ ] **Step 2: 写 facts.json**(固定 5 条,顺序循环;**0 实时词/0 运力数**):
```json
{ "facts": [
  { "zh": "覆盖 300+ 城市 · 10K+ 企业客户", "en": "300+ cities · 10K+ corporate clients" },
  { "zh": "港深跨境 · 门到门约 90 分钟", "en": "HK–Shenzhen cross-border · ~90 min door to door" },
  { "zh": "上海时装周 · 4 天 80 辆车", "en": "Shanghai Fashion Week · 80 vehicles over 4 days" },
  { "zh": "管家 200+ 学时培训 · 30+ 门课程", "en": "Chauffeurs: 200+ training hours · 30+ courses" },
  { "zh": "自 2018 · 始终如约", "en": "Since 2018 · Always as Promised" }
] }
```
- [ ] **Step 3: 写 configurator.json**(决策树:7 场景 × 5+1 城市 × 3 人数档 → 推荐;每条推荐 = `{ vehicleIds: string[], services: {zh,en}[], why: {zh,en} }`;规则表按场景主导:高管→s-class/e-class,活动→v-class/coaster,跨境→zeekr-009/v-class 等,共 7 条基线规则 + 人数档覆盖:>6 人强制含 coaster/v-class)与 lyctai-capabilities.json(**从现站 lyctai.html 逐条抄录** 6 节点:`{ id, name:{zh,en}, status:"live"|"roadmap", metric:{zh,en}, hover:{zh,en} }`)。
- [ ] **Step 4: 写双语等价测试** `tests/bilingual-data.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
const files = ['src/data/vehicles.json','src/data/facts.json','src/data/configurator.json','src/data/lyctai-capabilities.json'];
function checkPair(o: unknown, path: string, file: string) {
  if (Array.isArray(o)) return o.forEach((v, i) => checkPair(v, `${path}[${i}]`, file));
  if (o && typeof o === 'object') {
    const keys = Object.keys(o as object);
    if (keys.includes('zh') || keys.includes('en')) {
      expect(keys.includes('zh') && keys.includes('en'), `${file}${path} 双语字段不成对`).toBe(true);
      const { zh, en } = o as { zh: string; en: string };
      expect(zh.length > 0 && en.length > 0, `${file}${path} 有空值`).toBe(true);
    } else keys.forEach((k) => checkPair((o as any)[k], `${path}.${k}`, file));
  }
}
describe('数据源双语等价', () => it('zh/en 成对且非空', () => {
  for (const f of files) checkPair(JSON.parse(readFileSync(f, 'utf8')), '', f);
}));
```
- [ ] **Step 5: 跑测试(PASS)+ Commit** `git add src/data tests/bilingual-data.test.ts && git commit -m "feat(rebuild): 四个结构化数据源(车型单一权威/V-Class=6)+双语等价测试"`

### Task 8: 共享组件(SceneCard / StatChip / FactsBar)

**Files:** Create: `src/components/SceneCard.astro`, `src/components/StatChip.astro`, `src/components/FactsBar.astro`
**Interfaces:** Produces: `<SceneCard locale title body href index?>`(card 样式+浮起 hover);`<StatChip value label countUp?>`(count-up 由 motion.ts 认 `[data-count]`);`<FactsBar locale>`(读 facts.json,静态玉点+8s 淡入淡出轮播,hover 暂停,无 JS 时显示第一条)。

- [ ] **Step 1: 写三组件**。FactsBar 核心:
```astro
---
import facts from '@/data/facts.json';
import type { Locale } from '@/i18n';
const { locale } = Astro.props as { locale: Locale };
const lang = locale === 'en' ? 'en' : 'zh';
const items = facts.facts.map((f) => f[lang]);
---
<div class="flex items-center gap-3 font-mono text-xs tracking-widest uppercase" data-facts-bar aria-live="off">
  <span class="inline-block w-2 h-2 rounded-full bg-jade" aria-hidden="true"></span>
  <span data-facts-item>{items[0]}</span>
</div>
<script define:vars={{ items }}>
  const el = document.querySelector('[data-facts-item]');
  if (el && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let i = 0, paused = false;
    el.closest('[data-facts-bar]').addEventListener('mouseenter', () => (paused = true));
    el.closest('[data-facts-bar]').addEventListener('mouseleave', () => (paused = false));
    setInterval(() => { if (paused) return; i = (i + 1) % items.length;
      el.style.opacity = '0';
      setTimeout(() => { el.textContent = items[i]; el.style.opacity = '1'; }, 400);
    }, 8000);
    el.style.transition = 'opacity .4s var(--ease-ios)';
  }
</script>
```
(命名纪律:文件/选择器全用 facts,无 live/status/online;圆点无 animation。)
- [ ] **Step 2: 构建 + Commit** `git add src/components && git commit -m "feat(rebuild): SceneCard/StatChip/FactsBar(静态玉点·8s轮播·facts命名)"`

### Task 9: 动效系统 motion.ts

**Files:** Create: `src/components/motion.ts`
**Interfaces:** Produces: 自动挂载(Base 布局已引):`.reveal`(IO 渐显+上移 12–24px,`data-delay` 1–8 stagger 60ms)、h1 `.reveal-blur`(blur 12→0)、nav `.scrolled`、`[data-count]` count-up(1.3s easeOutCubic,tabular-nums)、卡片 touch 反馈。**幂等 + astro:page-load 重挂**(View Transitions 后仍生效)、reduced-motion 全退化。

- [ ] **Step 1: 写 motion.ts**(把现站 `assets/premium-motion.js` 的逻辑移植为 TS,差异:①去掉进度条;②挂到 `astro:page-load` 事件而非 DOMContentLoaded;③count-up 正则保留前后缀 `^(\D*)([\d,]+)(.*)$`;④reveal 观察器 `rootMargin:'0px 0px -80px 0px'`)。核心骨架:
```ts
function init() {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const nav = document.querySelector('nav[data-nav]');
  const onScroll = () => nav?.classList.toggle('scrolled', scrollY > 8);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  const els = document.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('is-visible')); }
  else { const io = new IntersectionObserver((es) => es.forEach((x) => { if (x.isIntersecting) { x.target.classList.add('is-visible'); io.unobserve(x.target); } }), { rootMargin: '0px 0px -80px 0px', threshold: 0.05 }); els.forEach((e) => io.observe(e)); }
  // [data-count] 逻辑同 premium-motion.js runCount,略—照抄移植
}
document.addEventListener('astro:page-load', init);
```
配套 CSS 追加进 global.css(`.reveal{opacity:0;transform:translateY(24px);transition:opacity .7s var(--ease-ios),transform .7s var(--ease-ios)} .reveal.is-visible{opacity:1;transform:none}` + delay 1–8 + `.reveal-blur{filter:blur(12px)} .reveal-blur.is-visible{filter:blur(0)}` + reduced-motion 覆盖)。
- [ ] **Step 2: dev 手验**(`npm run dev`,滚动看 reveal/nav 收拢)+ Commit `git add -A && git commit -m "feat(rebuild): 动效系统(reveal/blur/count-up/nav收拢,View Transitions兼容)"`

## Phase 2 · 页面(每页流程相同:i18n JSON → 页面组件 → en 镜像 → 补迁移表 → 测试 → commit;文案一律从 §3 迁移来源页的双语 span 抄录,禁止自创事实)

### Task 10: 首页(zh + en)

**Files:** Create: `src/i18n/{zh-cn,en}/home.json`, `src/pages/index.astro`(重写), `src/pages/en/index.astro`;Modify: `docs/i18n-migration-map.md`
**Interfaces:** Consumes: Base/SceneCard/StatChip/FactsBar/CtaBand/JsonLd/vehicles.json。Produces: `/` 与 `/en/` 8 屏结构。

- [ ] **Step 1: 从旧 index.html 抄文案入 home.json**(hero 主张=行有度·礼有节对;tagline=「LyctAI 驱动 · 大中华区高管专车与礼宾服务 —— 准时、安静、得体。」及 EN 对应;7 场景卡钩子句;信任带 3 案例;LyctAI teaser;企业参数;补迁移表)。
- [ ] **Step 2: 写 index.astro** 按 spec §4.1 的 8 屏:hero(h1.reveal-blur + FactsBar + btn-pill CTA)→ 7 SceneCard(grid,href 到各场景页)→ 信任带(3 案例卡 + 8 行业滚动条)→ LyctAI teaser(措辞「智能匹配与流程效率」,禁"调度车辆/运力")→ 车型速览 4 卡(读 vehicles.json 取 s-class/e-class/v-class/coaster,**卡组旁固定小字 t('common','footer.supplierNote')**)→ 覆盖(300+ 城市/港澳台 → /cities/)→ 企业参数带(StatChip×3: Net 30/60/90 · 80+ 计费字段 · 1 个工作日开户)→ CtaBand。头部 JsonLd:**从旧 index.html 整体照搬 LocalBusiness+Organization 对象**(3 电话/地址/2018-08-08/sameAs 一字不落),仅 url 字段改新路径。
- [ ] **Step 3: en/index.astro**:同结构,`locale="en"`,文案走 home.json en 侧。
- [ ] **Step 4: 测试+Commit**
```bash
npm run test:built   # seo-head 对两个首页绿;redlines 绿
git add -A && git commit -m "feat(rebuild): 首页 zh+en(8屏/JSON-LD照搬/供应商边界句)"
```

### Task 11: 方案顾问组件 + 解决方案总览页

**Files:** Create: `src/components/SolutionAdvisor.astro`, `src/i18n/{zh-cn,en}/solutions.json`, `src/pages/solutions/index.astro`, `src/pages/en/solutions/index.astro`
**Interfaces:** Consumes: configurator.json(Task 7)。Produces: `/solutions/` 总览;Advisor 输出卡 CTA 链到 `/contact/?scene=<id>`。

- [ ] **Step 1: 写 SolutionAdvisor**。硬要求(spec §6.2):①组件顶部常驻双语提示(按 locale 取):「本工具用于生成沟通方案,不构成在线预约或下单。/ This tool drafts a briefing for our team — it is not an online booking.」;②三步 pill 选择(场景/城市/人数),纯前端读 configurator.json;③结果卡**文字为主**,车型只以 16px 图标+名称呈现,禁大图;④CTA 文案 zh「获取方案」/ en「Get the plan」,href=`/contact/?scene=…&city=…&pax=…`(en 加前缀);⑤切换 250ms 交叉淡入,结果卡固定 12px 向上浮入(组件内 CSS,不挂 .reveal);⑥无 JS 时组件整体隐藏(`<noscript>` 显示一句「请直接联系我们获取方案」+链接)。
- [ ] **Step 2: 总览页**:开场定位句 → Advisor → 7 SceneCard(次序:executive-chauffeur → airport-rail-concierge → airport-transfer → business-hospitality → events → intercity-crossborder → private-jet)→ 礼宾标准 4 项(从旧 services.html 抄:24/7 双语分钟级响应/举牌接机/企业支付 80+ 字段/出行定制含路演预勘)→ CtaBand。JsonLd: BreadcrumbList。
- [ ] **Step 3: en 镜像;测试;Commit** `git commit -m "feat(rebuild): 方案顾问(合规弱化全套)+解决方案总览 zh+en"`

### Task 12: 场景深度页 ×4(高管专属 / 接送机 / 商务接待 / 活动)

**Files:** Create: `src/i18n/{zh-cn,en}/{executive-chauffeur,airport-transfer,business-hospitality,events}.json` + 对应 `src/pages/solutions/<id>.astro` + `src/pages/en/solutions/<id>.astro`;Create: `src/components/SolutionLayout.astro`
**Interfaces:** Produces: `<SolutionLayout>`(场景页公共骨架:hero/服务包含/流程/车型引用 vehicles.json/案例/相关推荐 3 卡/CtaBand + Service JsonLd + BreadcrumbList)。

- [ ] **Step 1: 写 SolutionLayout**(props: locale/page/相关场景 ids;Service JsonLd 里 `provider` 用 Organization 引用,`serviceType` 从 i18n 取)。
- [ ] **Step 2: 高管专属用车**:迁 longterm.html 全部 mustNotLose——年度起约(含多年)/按月或季度结算、6 城 expat 区清单(北京使馆区三里屯/上海静安新天地浦东/广州珠江新城天河/深圳福田南山/香港中环半山/杭州苏州成都)、管家能力(学校接送/使馆办事/周末出行/机场往返/尽量同一管家)。
- [ ] **Step 3: 接送机·接送站**:迁 airport.html——服务包含 5 项(含"到港等候通关取行李不计时不加费")、机场代码三组(大陆 PEK·PKX·PVG·SHA·CAN·SZX·CTU·KMG·XIY·HGH·NKG·WUH·CSX·TAO·TSN·DLC/港澳 HKG·MFM 双牌/台湾 TPE·TSA·KHH)、浦东案例(23:50→提前12分钟→00:18→00:41)、车型表引 vehicles.json。
- [ ] **Step 4: 商务接待**(spec §4.4 特别要求):页内**两个子模式区块**——「时租·日租」(半日=4h/全日=8或10h/多日;车型-场景对照表从 hourly.html 抄)与「单程点对点」(按次计费无订阅无承诺 + **原文保留**:城市分区固定费率/无高峰加价/无夜间附加/无隐藏收费);**「入境游客包车」子场景独立小节**(上海一日行程:酒店-外滩-午餐-豫园-新天地-浦东-晚餐;关键词入 title/description:入境中国包车/来华游客包车/China inbound chauffeur/tourist driver China);北京 CBD 案例 5 地标。
- [ ] **Step 5: 活动·会议包车**:迁 events.html——5 个量化案例(时装周 4 天 80 辆/香港峰会 3 天 25 辆/F1/汽车大会 50 辆 3 天/品牌发布 60 客户 3 天)、100+ 车调度上限、GPS+中央调度、24h 复盘+月度对账;「管家简报协议」四项流程完整保留(VIP 名单/着装规范/NDA/统一着装定制)。
- [ ] **Step 6: 测试(重点:redlines/司机词)+ 补迁移表 + Commit** `git commit -m "feat(rebuild): 场景深度页×4(高管/接送机/商务接待双子模式+入境游客/活动)"`

### Task 13: 场景深度页 ×3(机场高铁礼宾 🆕 / 跨城跨境 / 公务机)

**Files:** Create: 同上模式的 3 组 i18n + 页面文件
**Interfaces:** Consumes: SolutionLayout。

- [ ] **Step 1: 机场·高铁礼宾**(新写,spec §4.3 措辞纪律逐条执行):h1 =「机场·高铁地面礼宾 / Airport & Rail Ground Concierge」(**禁 VIP 通道/礼宾特权字样**);服务包含 6 项:贵宾接送举牌 / 陪同引导至安检口与排队时间规划 / 贵宾厅引导 / 行李全程协助 / 专人全程陪同 / 与接送车无缝衔接;「优先/贵宾通道」只写"通道对接协助"+说明句"具体通道资源以各机场/车站官方政策及供应商资质为准";页内固定边界句:"相关站内引导与协助服务由具备相应资质的合作供应商在其授权范围内提供。";流程 3 步;衔接接送机模块;CTA。
- [ ] **Step 2: 跨城·跨境**:迁 citytocity.html——一车一管家贯穿两地/皇岗或深圳湾口岸走通道过关同车接续/约 90 分钟门到门/提前 48 小时申请/3 款跨境车型(ZEEKR009/Alphard/S-Class,注:Alphard 不在 vehicles.json 六车内,此页文案照抄即可不入数据源)/三组城际路线(上海↔杭嘉苏南锡/北京↔津雄承/广州↔澳佛珠中)/香港搬迁案例;h3「双语跨境司机」→「双语跨境管家」。
- [ ] **Step 3: 公务机**:迁 privatejet.html 服务包含 6 项(公务机包机中介/机场 VIP 礼遇/直升机接驳/五星酒店礼宾/高铁 VIP 等,照旧页抄全)。
- [ ] **Step 4: 测试+补迁移表+Commit** `git commit -m "feat(rebuild): 机场高铁礼宾(合规措辞)+跨城跨境+公务机"`

### Task 14: 车型臻选 + LyctAI + 企业服务

**Files:** Create: 3 组 i18n + `src/pages/{vehicles,lyctai,enterprise}.astro` + en 镜像 + `src/components/LyctaiDiagram.astro`
**Interfaces:** Consumes: vehicles.json、lyctai-capabilities.json。

- [ ] **Step 1: /vehicles/** 按 spec §4.4a 五模块缺一不可:①规格表(遍历 vehicles.json:载客/行李/升数;GL8 img 用 objectPosition 字段)②管家培训(200+ 学时/30+ 门课程:防御性驾驶/路线规划/紧急处置)③着装规范(黑色定制西装/白手套/皮鞋)④车内物资(矿泉水/湿巾/充电线/阅读灯/报刊每程更换 + 温度预设/隔断可选)⑤香氛(S-Class 配备可选无香)。**禁任何 EHL 字样**。
- [ ] **Step 2: /lyctai/**:能力卡 6 节点(读 lyctai-capabilities.json,Live=玉色实心点静态/Roadmap=灰空心)→ LyctaiDiagram(分层 SVG 4 层:国产模型优先 DeepSeek/Qwen→统一 AI 网关→业务规则层 DTO 校验/RBAC/状态机→安全层 人工确认/审计日志;4 入口:Admin·Sales·CS / Enterprise Portal / Supplier Portal / **Chauffeur App 履约端**;hover 高亮层+职责句,tap 展开,滚动 stagger 120ms 亮起)→ 4 设计原则。
- [ ] **Step 3: /enterprise/**:迁 enterprise.html——Net 30/60/90、80+ 计费字段、3 级权限(管理员/预订员/查阅员)+审计日志、8 行业清单、1 个工作日开户 SLA、内地+香港双地发票;开通流程 3 步;CtaBand。
- [ ] **Step 4: 测试+Commit** `git commit -m "feat(rebuild): 车型臻选(5模块/单一数据源)+LyctAI活架构图+企业服务"`

### Task 15: 关于 + 城市覆盖(hub + 5 城)

**Files:** Create: `src/i18n/{zh-cn,en}/{about,cities}.json`, `src/pages/about.astro`, `src/pages/cities/index.astro`, `src/pages/cities/[city].astro` + en 镜像
**Interfaces:** Produces: `getStaticPaths` 输出 5 城:shanghai/beijing/guangzhou/shenzhen/hongkong;城市数据放 cities.json(`{ id, name:{zh,en}, airports:[], districts:{zh,en}, scenes:[sceneId], note:{zh,en} }`)。

- [ ] **Step 1: /about/**:品牌故事全文(光年=Light 无声精准+Year 日复一日持守,三段体中英对照从 about.html 逐段抄)、时间线 4 节点(2018 三辆奔驰创立/2020 50 城珠三角长三角/2023 跨境启动港澳台/2026 300+ 城 10K+ 客户)、四价值观详述版(精准/静谧/谨慎/持守含"车内发生的一切留在车内")、**港澳台覆盖细节保留于此**:香港 HK 驾照双语管家+大湾区联运、澳门中英葡三语管家+HKZM 大桥、台湾 TPE/台北/台中/高雄两岸商旅。
- [ ] **Step 2: /cities/ hub**:5 城卡 + 澳门/台湾覆盖说明段(不建独立页,防信息无家)。
- [ ] **Step 3: 城市页模板**:该城机场代码/商圈/expat 区(数据来源:airport.html 机场表 + longterm.html expat 区)→ 适用场景卡(链对应 solutions)→ CtaBand;香港页额外含 HK 驾照双语管家/大湾区联运。title 模式:`{城市}企业用车与机场接送 | LyctRides`。
- [ ] **Step 4: 测试+Commit** `git commit -m "feat(rebuild): 关于(品牌故事/时间线/港澳台细节)+城市hub+5城页"`

### Task 16: 动态(news)静态化 + 净化

**Files:** Create: `src/lib/news.ts`, `src/lib/sanitize.ts`, `src/pages/news/index.astro`, `src/pages/news/[slug].astro` + en 镜像, `src/i18n/{zh-cn,en}/news.json`;Modify: `data/news.json`(内容修正)
**Interfaces:** Produces: `loadNews(): NewsItem[]`(读根 `data/news.json`,按日期倒序);`sanitizeRich(html): string`。每篇 `/news/<id>/` 静态页含 Article JsonLd + 自身 canonical + prev/next。

- [ ] **Step 1: 内容修正 data/news.json**(spec §5.2):
```bash
grep -n "EHL\|司机" data/news.json   # 定位(至少 gba-expansion-2025 / cbt-awards-2024 / zeekr-fleet-addition-2024)
```
EHL 措辞→「光年服务标准/200+ 学时培训」口径;正文"司机"→"管家"。中英字段都改。
- [ ] **Step 2: sanitize.ts**(白名单沿用旧 article.html:先 `grep -A20 'sanitize' article.html` 抄下允许的标签/属性/iframe 前缀,再翻成 sanitize-html 配置):
```ts
import sanitizeHtml from 'sanitize-html';
export const sanitizeRich = (html: string) => sanitizeHtml(html, {
  allowedTags: [/* 从旧 article.html 白名单逐项照抄 */],
  allowedAttributes: {/* 同上 */},
  allowedIframeHostnames: [/* 旧白名单 iframe 前缀 */],
});
```
- [ ] **Step 3: 列表页 + 文章页**(`getStaticPaths` 遍历 loadNews();文章页:标题/日期/分类/正文 `set:html={sanitizeRich(item.body)}`/prev-next(数组序)/Article JsonLd(headline/datePublished/author=Organization)。列表页 ItemList JsonLd + 轻量运行时增强脚本:fetch `/api/public/news` 成功则原位刷新列表,失败静默——SEO 不依赖)。
- [ ] **Step 4: 测试**(新增断言并入 seo-head:任一 `/news/*/index.html` 的 canonical **含自身 slug**)+ Commit `git commit -m "feat(rebuild): news静态化(canonical自指/净化/prev-next)+EHL与司机清理"`

### Task 17: 招聘 + 联系

**Files:** Create: `src/i18n/{zh-cn,en}/{careers,contact}.json`, `src/pages/careers.astro`, `src/pages/contact.astro` + en 镜像
**Interfaces:** Consumes: 根 `data/careers.json`;表单端点见 Global Constraints。

- [ ] **Step 1: /careers/**:文化 3 支柱(卓越文化培训/国际视野 300+ 城市/清晰成长路径导师制,**EHL 徽章删除**)、团队 120+ 人/Hybrid、职位列表(构建期读 careers.json:corporate-account-manager + operations-coordinator;运行时增强 fetch `/api/public/careers`)、每职位 JobPosting JsonLd、申请表单(**先读旧 careers.html 表单的 field name 与提交 JS,原样复刻 payload** → POST `/api/public/careers/apply`)。
- [ ] **Step 2: /contact/**:表单(**先读旧 contact.html 提交 JS,复刻 payload 结构** → POST `/api/public/leads`;7 个服务意向选项照抄;支持 `?scene=&city=&pax=` 查询参数预填意向与留言,服务方案顾问跳转)、联系方式卡(bd@lyctai.com + 3 电话)、5 条 FAQ 原文迁移(含"不提供按次在线车费支付仅对公转账+月结 Net-30/Net-60"与"以签约企业客户为主"两条边界表述)、完整地址(广州市天河区儒林大街后园路38号106房K341)、**Trust 条删 GDPR 改 PIPL**;ContactPage JsonLd;表单成功态用玉色。
- [ ] **Step 3: 测试+Commit** `git commit -m "feat(rebuild): 招聘(JobPosting/去EHL)+联系(FAQ边界表述/PIPL/预填参数)"`

### Task 18: 法务页逐字迁移 + 404

**Files:** Create: `src/pages/{terms,privacy,404}.astro` + en 镜像(法务 en 页 = 中文原文 + 顶部一句英文说明"Legal terms are provided in Chinese"——法律文本**不翻译**,防两版本歧义)
**Interfaces:** Produces: legal-anchors 测试(Task 3)转绿。

- [ ] **Step 1: 整篇迁移** terms.html/privacy.html 正文(含第 1 条 callout、保留期限数字 行程/沟通 ≤2 年·发票对账 5–10 年、版本号 v1.0/2026年6月14日、跨境传输 PIPL 单独同意、管辖=广州市有管辖权人民法院;**样式重排,文字一字不动**)。
- [ ] **Step 2: 404 页**(双语一句 + 回首页/解决方案链)。
- [ ] **Step 3: 测试:legal-anchors 转绿** `npm run test:built`(全绿)+ Commit `git commit -m "feat(rebuild): 法务页逐字迁移(锚点测试绿)+404"`

## Phase 3 · SEO 收尾与交付物

### Task 19: OG 图 + robots + favicon + 图片迁移

**Files:** Create: `src/pages/og/[...route].ts`(astro-og-canvas), `public/robots.txt`, `public/favicon.svg`;`scripts/copy-images.mjs`
**Interfaces:** Produces: 每页 `ogImage` prop 指向 `/og/<page>.png`(黑底 paper 字模板:页 title + "LyctRides · 行有度 礼有节");`/images/` 全量可用。

- [ ] **Step 1: 图片**:`scripts/copy-images.mjs` 把仓库根 `images/` 复制进 `public/images/`(构建前跑,package.json `prebuild` 钩子)。favicon 用现 logo.svg。
- [ ] **Step 2: astro-og-canvas 路由**(为主导航 6 页+7 场景页+vehicles/about/cities 生成;字体用已托管的 NotoSansSC);各页 Base 调用处补 `ogImage` prop。
- [ ] **Step 3: robots.txt**:
```
User-agent: *
Allow: /
Sitemap: https://lyctai.com/sitemap-index.xml
```
- [ ] **Step 4: 构建验证 sitemap 双语全 URL(`dist/sitemap-*.xml` 含 / 与 /en/ 成对)+ Commit** `git commit -m "feat(rebuild): OG生成/robots/favicon/图片管线"`

### Task 20: 301 映射 + JSON-LD 全覆盖测试

**Files:** Create: `docs/redirects-301.md`, `deploy/nginx-lyctai.conf`(片段), `tests/jsonld.test.ts`
**Interfaces:** Produces: 完整 19 条旧→新映射(spec §3;含 holding.html→/,services/hourly.html 与 cityrides.html→/solutions/business-hospitality/);nginx `map` 或逐条 `location = /old.html { return 301 /new/; }` 片段,**只入库不部署**。

- [ ] **Step 1: 写映射文档与 nginx 片段**(19 条逐条列全,双文件同源)。
- [ ] **Step 2: 写 jsonld.test.ts**:
```ts
import { describe, it, expect } from 'vitest';
import { distPages } from './helpers';
const EXPECT: [RegExp, string][] = [
  [/^dist\/index\.html$/, 'LocalBusiness'],
  [/dist\/solutions\/[a-z-]+\/index\.html$/, 'Service'],
  [/dist\/news\/[^/]+\/index\.html$/, 'Article'],
  [/dist\/careers\/index\.html$/, 'JobPosting'],
  [/dist\/contact\/index\.html$/, 'ContactPage'],
];
describe('JSON-LD 覆盖', () => it('关键页含对应 @type', () => {
  for (const { path, $ } of distPages()) for (const [re, type] of EXPECT)
    if (re.test(path)) {
      const blobs = $('script[type="application/ld+json"]').map((_, e) => $(e).text()).get().join('');
      expect(blobs.includes(`"${type}"`) || blobs.includes(`"@type":"${type}"`), `${path} 缺 ${type}`).toBe(true);
    }
}));
```
- [ ] **Step 3: 全测试绿 + Commit** `git commit -m "feat(rebuild): 301映射(文档+nginx片段)+JSON-LD覆盖测试"`

### Task 21: CI 构建流水线 + 文档更新(不启用部署)

**Files:** Create: `.github/workflows/build.yml`;Modify: `INFRA.md`, `CLAUDE.md`(新增"重建后部署流程(待切换启用)"小节,**不删旧流程**——切换 commit 时才替换)
**Interfaces:** Produces: PR/push 到 feat/rebuild 触发 build+test 的 CI;部署 job 写好但 `if: false` 注明待切换启用 + 需用户先在 ECS 加部署公钥/GitHub secrets(SSH_KEY/SERVER_HOST)。

- [ ] **Step 1: build.yml**:
```yaml
name: build
on: { push: { branches: [feat/rebuild, main] } }
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm run build
      - run: npx vitest run
  deploy:
    if: ${{ false }}  # 切换上线时改为 github.ref == 'refs/heads/main';前置:ECS 部署公钥 + secrets 配置(见 INFRA.md)
    needs: build
    runs-on: ubuntu-latest
    steps:
      - run: echo "rsync dist/ → /var/www/lyctai-website/ (启用时补全)"
```
- [ ] **Step 2: INFRA.md/CLAUDE.md 增补小节**(新流程描述 + 切换前置清单:公安备案通过/备案变更判断留档/ECS 公钥/secrets/nginx 301+en 路由)。
- [ ] **Step 3: Commit** `git commit -m "ci(rebuild): 构建流水线(部署job待切换启用)+基础设施文档增补"`

### Task 22: 验收总扫(对 spec §11 逐条)

**Files:** Create: `docs/superpowers/plans/2026-07-04-acceptance-report.md`
**Interfaces:** Consumes: 全部前置任务。

- [ ] **Step 1: 自动项**:`npm run test:built` 全绿(红线/法律锚点/seo-head/jsonld/双语数据);`grep -rE 'googleapis|cdn\.tailwindcss|unpkg|jsdelivr' dist/` 零命中;sitemap 双语成对;`npx astro build` 0 warning。
- [ ] **Step 2: 对照 audit mustNotLose 清单逐条勾**(清单在 `/private/tmp/claude-501/-Users-jz-WorkPlace-lyctai-website/c4c61d6d-b69e-4dff-96ab-23cc454cc83f/tasks/wo3ha5tma.output`;若已失效,以 spec §3–§5 的迁移来源列复核),每条标注新家 URL,写进验收报告。
- [ ] **Step 3: 人工项留给用户**(报告里列出待办):方案顾问 5 秒第三方测试、首页连续通读测试(用户一票裁决,≤3 轮)、移动端 Lighthouse ≥90(本地 `npx lighthouse http://localhost:4321 --preset=mobile`)、双语抽查。
- [ ] **Step 4: Commit + 汇报** `git commit -m "docs(rebuild): 验收报告(自动项全绿/人工项清单)"`——**到此为止,不合 main、不部署**;切换上线单独走(公安备案通过+变更判断留档后)。

---

## 自查记录(写完计划后对 spec 复核)

- spec 覆盖:§2/§3(T6/T10–18)、§4 全部页面模型(T10–18)、§5 六项修正(T7 V-Class/T16 EHL+司机/T17 GDPR→PIPL/T13 跨境司机/T16 canonical/数字口径散在各迁移步)、§6 三交互+动效(T8/T9/T11/T14)、§7 视觉(T2/全局约束)、§8 SEO(T5/T15/T16/T19/T20)、§9 技术(T1/T4/T16/T21)、§11 验收(T3/T20/T22)。
- 无 TBD/占位;"从旧页抄录"均指向具体文件与区块,是动作不是占位。
- 类型一致:Locale/useT/localePath/altPath 全计划统一;facts 命名纪律贯穿 T7/T8。
