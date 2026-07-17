# LyctRides · Design Tokens Reference

> 本文件是 LyctRides 新设计语言的**唯一可信源**。任何二级产品（后台、APP、其他子站）跟主站对齐都读这里。
>
> **⚠️ 不要 fetch lyctai.com 生产域名 —— 那是旧设计。新设计只在 `claude/jolly-chatelet-049c03` 分支本地未发布。**

工作路径：`/Users/jz/WorkPlace/lyctai-website/`

---

## 1. 品牌基本

| 项 | 值 |
|---|---|
| 品牌名（英） | `LyctRides`（驼峰，不要 LYCT-RIDES / Lyctrides / LyctaiRides） |
| 品牌名（中） | `光年专车` 或 `光年出行` |
| 公司主张（英） | `Always as Promised` |
| 公司主张（中） | `始 终 如 约`（大字距 letter-spacing: 0.25em） |
| 域名 | lyctai.com（官网）/ lyctrides.com（后台 / 登录） |

---

## 2. 配色（严格黑白）

```css
--color-primary:    #0A0A0A;   /* 黑色：所有正文、强调、CTA */
--color-surface:    #FAFAF7;   /* 暖白：页面背景 */
--color-secondary:  #50606f;   /* 次要：导航文字、placeholder */

/* 透明度变体（2026-07-17 对比度决策：/35 /40 /45 三档统一提亮，方案 B）*/
text-[#0A0A0A]/65   /* 正文 */
text-[#0A0A0A]/60   /* 信息标签 / mono 小字（原 /40 /45 档并入）*/
text-[#0A0A0A]/55   /* 副标 / eyebrow / 装饰序号（原 /35 档并入）*/
border-[#0A0A0A]/8  /* 浅边 */
```

**禁止**：任何蓝、绿、橙、灰等第三色（除黑白外）。SVG icon 用 currentColor 跟随。

---

## 3. 字体栈（Google Fonts）

```html
<link href="https://fonts.googleapis.com/css2?family=Albert+Sans:wght@300;400;500;600;700&family=Crimson+Pro:ital,wght@0,400;0,700;1,400&family=JetBrains+Mono:wght@400&family=Noto+Sans+SC:wght@300;400;500&family=Noto+Serif+SC:wght@400;500&display=swap" rel="stylesheet"/>
```

| 用途 | 字体 |
|---|---|
| 正文（英 + 中） | `Albert Sans` + `Noto Sans SC` fallback |
| 大标题英文 | `Crimson Pro`（衬线，常 italic） |
| 大标题中文 | `Noto Serif SC`（衬线） |
| 数字 / mono 标签 | `JetBrains Mono` |

中英文切换：`html[lang="en"] .lang-cn { display:none }` / `html[lang="cn"] .lang-en { display:none }`，localStorage 键 `lyct-lang`。

---

## 4. CSS Tokens（来自 index.html）

```css
:root {
  /* 字号 */
  --fs-display: clamp(2.5rem, 6vw, 4.5rem);
  --fs-h1:      clamp(1.75rem, 3.5vw, 2.625rem);
  --fs-h2:      clamp(1.25rem, 2vw, 1.5rem);
  --fs-body-lg: 1.0625rem;
  --fs-body:    1rem;
  --fs-label:   0.6875rem;

  /* 字距 */
  --tracking-tight: -0.015em;
  --tracking-label: 0.2em;     /* uppercase 小标签 */

  /* 行高 */
  --lh-tight: 1.1;
  --lh-body:  1.55;

  /* 圆角 */
  --r-sm:   8px;
  --r-md:   12px;
  --r-lg:   18px;
  --r-xl:   22px;
  --r-pill: 999px;

  /* 阴影 */
  --shadow-card:       0 1px 2px rgba(10,10,10,0.04), 0 6px 20px rgba(10,10,10,0.04);
  --shadow-card-hover: 0 2px 6px rgba(10,10,10,0.06), 0 18px 50px rgba(10,10,10,0.10);
  --inner-highlight:   inset 0 1px 0 rgba(255,255,255,0.7);

  /* iOS 缓动 */
  --ease-spring:      cubic-bezier(0.34, 1.56, 0.36, 1);   /* 弹簧（hover / 进入） */
  --ease-spring-soft: cubic-bezier(0.25, 1.25, 0.5, 1);
  --ease-ios:         cubic-bezier(0.32, 0.72, 0, 1);      /* iOS 标准 */
  --dur-fast:    200ms;
  --dur-base:    380ms;
  --dur-spring:  540ms;
}
```

---

## 5. 核心组件 class（**复制即用**）

### 5.1 `.ios-pill` — 主 CTA 黑色胶囊按钮

```css
.ios-pill {
  display: inline-flex; align-items: center; justify-content: center;
  gap: 8px;
  background: linear-gradient(180deg, #1c1917 0%, #0A0A0A 100%);
  color: #FAFAF7;
  font-size: 11px; font-weight: 500;
  letter-spacing: 0.2em; text-transform: uppercase;
  padding: 13px 26px;
  border-radius: 999px;
  box-shadow: 0 1px 0 rgba(255,255,255,0.08) inset, 0 4px 16px rgba(10,10,10,0.18);
  transition: transform 200ms var(--ease-spring), box-shadow 380ms var(--ease-ios);
}
.ios-pill:hover  { transform: scale(1.04); box-shadow: 0 1px 0 rgba(255,255,255,0.12) inset, 0 8px 28px rgba(10,10,10,0.28); }
.ios-pill:active { transform: scale(0.96); }
.ios-pill svg               { transition: transform 380ms var(--ease-spring-soft); }
.ios-pill:hover svg         { transform: translateX(4px); }
```

### 5.2 `.ios-pill-outline` — 次按钮

```css
.ios-pill-outline {
  display: inline-flex; align-items: center; gap: 8px;
  background: rgba(10,10,10,0.05);
  color: #0A0A0A;
  border: 1px solid rgba(10,10,10,0.08);
  padding: 13px 26px;
  font-size: 11px; font-weight: 500;
  letter-spacing: 0.2em; text-transform: uppercase;
  border-radius: 999px;
  transition: transform 200ms var(--ease-spring), background 200ms var(--ease-ios);
}
.ios-pill-outline:hover { transform: scale(1.04); background: rgba(10,10,10,0.1); }
```

### 5.3 `.ios-card` — 白底卡片

```css
.ios-card {
  background: #fff;
  border-radius: 18px;
  border: 1px solid rgba(10,10,10,0.05);
  box-shadow: var(--shadow-card), var(--inner-highlight);
  transition: transform 540ms var(--ease-spring),
              box-shadow 380ms var(--ease-ios),
              border-color 380ms var(--ease-ios);
}
.ios-card:hover  { transform: translateY(-4px); box-shadow: var(--shadow-card-hover), var(--inner-highlight); border-color: rgba(10,10,10,0.1); }
.ios-card:active { transform: translateY(-1px); }
```

### 5.4 `.ios-glass` — 顶部 nav / dialog 玻璃容器

```css
.ios-glass {
  background: rgba(250,250,247,0.65);
  backdrop-filter:         saturate(200%) blur(32px);
  -webkit-backdrop-filter: saturate(200%) blur(32px);
  box-shadow: 0 1px 0 rgba(10,10,10,0.04), inset 0 1px 0 rgba(255,255,255,0.5);
  border-bottom: 1px solid rgba(10,10,10,0.05);
}
```

### 5.5 `.nav-glass-pill` — 顶部右侧小玻璃 chip（语言切换、Sign In）

```css
.nav-glass-pill {
  display: inline-flex; align-items: center;
  padding: 7px 14px;
  font-size: 11px; font-weight: 500;
  letter-spacing: 0.18em; text-transform: uppercase;
  color: #0A0A0A;
  background: rgba(255,255,255,0.55);
  border: 1px solid rgba(10,10,10,0.08);
  border-radius: 999px;
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.7), 0 1px 2px rgba(10,10,10,0.04);
  transition: background 380ms var(--ease-ios),
              transform 200ms var(--ease-spring),
              box-shadow 380ms var(--ease-ios);
  cursor: pointer;
}
.nav-glass-pill:hover  { background: rgba(255,255,255,0.78); transform: scale(1.04); }
.nav-glass-pill:active { transform: scale(0.97); }
```

### 5.6 `.nav-pill` + `.nav-pill-active` — nav 链接 + 当前页玻璃 pill 高亮

```css
.nav-pill {
  position: relative;
  display: inline-flex; align-items: center;
  padding: 6px 12px;
  border-radius: 999px;
  color: #50606f;
  border: 1px solid transparent;
  background: transparent;
  transition: color 200ms var(--ease-ios),
              background 380ms var(--ease-ios),
              border-color 380ms var(--ease-ios),
              box-shadow 380ms var(--ease-ios);
}
.nav-pill:hover         { color: #0A0A0A; background: rgba(10,10,10,0.04); }
.nav-pill-active {
  color: #0A0A0A;
  background: rgba(255,255,255,0.6);
  border-color: rgba(10,10,10,0.08);
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.7), 0 1px 2px rgba(10,10,10,0.04);
}
```

### 5.7 `.hero-signature` — Always as Promised 签名行（Crimson italic / Noto Serif SC）

```css
.hero-signature {
  font-family: 'Crimson Pro', serif;
  font-style: italic; font-weight: 400;
  font-size: clamp(1rem, 1.6vw, 1.25rem);
  color: rgba(10,10,10,0.7);
  letter-spacing: 0.02em;
}
.hero-signature .lang-cn {
  font-family: 'Noto Serif SC', serif;
  font-style: normal; font-weight: 500;
  letter-spacing: 0.25em;
  color: rgba(10,10,10,0.75);
}
```

HTML 用法（中间一条短横线 + signature + 短横线）：

```html
<p class="flex items-center justify-center gap-4">
  <span class="w-10 h-px bg-[#0A0A0A]/25"></span>
  <span class="hero-signature">
    <span class="lang-en">Always as Promised</span>
    <span class="lang-cn">始 终 如 约</span>
  </span>
  <span class="w-10 h-px bg-[#0A0A0A]/25"></span>
</p>
```

### 5.8 表单输入框（建议给登录页用的）

```css
.ios-input {
  width: 100%;
  padding: 14px 16px;
  background: #fff;
  border: 1px solid rgba(10,10,10,0.08);
  border-radius: 12px;
  font-size: 15px;
  color: #0A0A0A;
  transition: border-color 380ms var(--ease-ios),
              box-shadow 380ms var(--ease-ios),
              background 380ms var(--ease-ios);
  outline: none;
}
.ios-input::placeholder { color: rgba(10,10,10,0.35); }
.ios-input:hover  { border-color: rgba(10,10,10,0.18); }
.ios-input:focus  {
  border-color: rgba(10,10,10,0.7);
  background: rgba(255,255,255,0.95);
  box-shadow: 0 0 0 4px rgba(10,10,10,0.04), inset 0 1px 0 rgba(255,255,255,0.7);
}
.ios-label {
  display: block;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(10,10,10,0.55);
  margin-bottom: 8px;
}
```

---

## 6. Logo

文件：`/Users/jz/WorkPlace/lyctai-website/images/logo.svg`（圆形 L + LyctRides 文本）。后台用一份相同 SVG，不要再画新 logo。

```html
<img src="/images/logo.svg" alt="LyctRides" class="h-8 w-auto">
```

---

## 7. 参考实现（直接读这几个文件）

| 模式 | 文件 |
|---|---|
| 主 hero（满屏 + signature + metadata 一行） | `/Users/jz/WorkPlace/lyctai-website/index.html` line ~426–520 |
| 子页 hero（紧凑 380/440px min-height） | `/Users/jz/WorkPlace/lyctai-website/about.html` line ~625–680 |
| 玻璃 nav（含 dropdown + nav-pill-active） | `/Users/jz/WorkPlace/lyctai-website/index.html` line ~377–420 |
| 表单（含 input / textarea / submit pill） | `/Users/jz/WorkPlace/lyctai-website/contact.html` line ~700–810 |
| FAB 浮标 + QR popover | 任何主页面底部 `<div class="fab-group">` |

---

## 8. 设计原则（短版）

1. **低调商务**，不要活泼/装饰/促销词
2. **纯黑白**，没有第三种主色
3. **大圆角 18–22px** 卡片 / 999px pill 按钮
4. **iOS 弹簧 hover**（spring 缓动 + scale 1.04 / translateY-4px）
5. **双语必须配对** 用 `lang-en` + `lang-cn` 兄弟 span，不要混排
6. **紧凑节奏**，section padding 56/88px，避免大面积空白
7. **Always as Promised / 始终如约** 在每个独立页面都应出现一次（不强制但是品牌签名）
