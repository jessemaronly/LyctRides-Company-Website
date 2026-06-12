# Design-Is Audit · Scope Lock

**Date:** 2026-06-10
**Auditor:** design-is (Dieter Rams 十原则审计)

## 审计对象

LyctRides 官网 — 纯静态站（HTML + Tailwind CDN + vanilla JS，无构建步骤），仓库本地源码审计 + 本地 http.server 截图验证。

- 主表面：`index.html`（1146 行）
- 二级页面：about / services / fleet / enterprise / contact / careers / news / article / lyctai（共 12 个顶层页面）
- 服务子页：services/{airport, cityrides, citytocity, events, hourly, longterm, privatejet}.html（7 个）
- 不审计：baidu/google 验证文件、robots.txt、sitemap.xml、后台（lyctrides-platform 另一 repo）

## 主要用户与任务

- **主要用户**：高端商务出行客户 —— 企业行政/差旅决策人、来华外籍商务人士、高净值个人
- **主要任务**：了解服务与车队 → 建立信任 → 留资联系（contact 表单 / WhatsApp / WeChat QR / 电话）

## 约束

- 品牌：LyctRides（驼峰）/ 光年专车；slogan "Always as Promised / 始终如约"
- 严格黑白双色：`#0A0A0A` + `#FAFAF7`（次要 `#50606f`），禁止第三主色
- 字体栈：Albert Sans · Crimson Pro · JetBrains Mono · Noto Sans SC · Noto Serif SC
- 双语机制：`lang-en` / `lang-cn` 配对 span，localStorage `lyct-lang`
- 技术：无构建步骤，Tailwind CDN，生产 nginx 直 serve
- 设计系统单一来源：`DESIGN-TOKENS.md`

## 参考竞品（行业基准）

Blacklane、Wheely 等国际高端 chauffeur 品牌官网。

## 输入材料

- 仓库源码（worktree `strange-lichterman-dcd2b3`，与 main 同步，工作区干净）
- `DESIGN-TOKENS.md`（设计 token 权威定义）
- 本地预览截图（python3 http.server + 浏览器截图，desktop + mobile 宽度）
