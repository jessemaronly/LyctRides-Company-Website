# LyctRides Company Website — Claude Instructions

## 🗺️ 第一件事：读 INFRA.md

完整的基础设施 / 部署架构 / 服务器路径 / 域名映射 / 清理建议在：

**`/Users/jz/WorkPlace/lyctai-website/INFRA.md`** ← 单一可信源

下面是简版速查 + 项目特定开发约定。

---

## ⚡ 部署速查

| 改什么 | 怎么部署 |
|---|---|
| 官网静态站（本项目） | `git push origin main` → `ssh lyctrides && /root/deploy-website.sh` |
| 后台 / API | 走 `~/WorkPlace/lyctrides-platform`（另一个 repo） |

**生产分支** = `main`
**生产服务器** = Aliyun ECS `8.166.115.148`（SSH 别名 `lyctrides`）
**生产部署目录** = `/var/www/lyctai-website/`（git checkout + nginx 直 serve 同一目录）
**生产域名** = lyctai.com（前端） / lyctrides.com（后台）

---

## 🛠️ 项目开发约定

### 技术栈

- 纯静态站：HTML + Tailwind CDN + vanilla JS（无构建步骤）
- 本地预览：`python3 -m http.server 8787`
- 字体栈：Albert Sans · JetBrains Mono · Noto Sans SC · Noto Serif SC · Crimson Pro
- 颜色：仅 `#0A0A0A`（黑） + `#FAFAF7`（暖白）。无第三色

### 设计系统单一来源

读 `/Users/jz/WorkPlace/lyctai-website/DESIGN-TOKENS.md` —— 所有 CSS class（`.ios-pill` / `.nav-glass-pill` / `.hero-signature` / `.nav-pill-active` 等）的权威定义在这里。新组件要跟随同一套 token。

### 双语机制

- 每段文案用 `<span class="lang-en">...</span><span class="lang-cn">...</span>` 配对
- 切换：`html[lang="en"] .lang-cn { display:none }` / `html[lang="cn"] .lang-en { display:none }`
- localStorage key（跟后台共用）：`lyct-lang`
- **不要混排**（不要在 `lang-en` 里塞中文，反之亦然）

### 内容数据源

- 新闻：`data/news.json` + API `/api/public/news`（双层 fallback）
- 招聘：`data/careers.json` + API `/api/public/careers`（双层 fallback）

### Forms Backend

相对路径同源（生产走 Cloudflare Tunnel）：

- `POST /api/public/leads` — contact form
- `POST /api/public/careers/apply` — careers form

API 后端在 `~/WorkPlace/lyctrides-platform/apps/api`。

---

## 📋 Token Efficiency 规则

- 简短。改完一句话确认。不复述刚做的事
- 不重复已建立的上下文
- 先执行再解释
- 代码改用 Edit 工具，只显 diff
- 不写"总结"段落
- 低风险任务（Read / Grep / Edit）直接动手，不问允许

---

## 🚫 不要做的事

- ❌ 引入第三种主色（仅 `#0A0A0A` + `#FAFAF7`）
- ❌ 使用「零担」物流术语（公司不做物流；零担 = on-demand order，单次出行）
- ❌ 把品牌名写成 LYCT-RIDES / Lyctrides / Photon-Year（**只**写 LyctRides 驼峰）
- ❌ 在生产服务器上手动改文件（永远 git push → deploy.sh，保 git 是单一可信源）

---

## 🎯 Model Selection

```bash
claude --model claude-haiku-4-5     # 日常 HTML / CSS 编辑用 Haiku 够
```

Sonnet 用于设计决策 / 复杂 review。Opus 不需要。
