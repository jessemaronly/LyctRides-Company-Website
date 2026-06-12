# 04 · /make-plan 交接提示词

下面这段可直接复制给 `/make-plan`（自包含，无需回看本审计目录）：

````
/make-plan Redesign LyctRides 官网（19 页纯静态站，HTML + Tailwind + vanilla JS）。当前设计 Rams 审计 12/30，关键缺口在原则 #3 aesthetic、#4 understandable、#6 honest、#8 thorough。

Verdict（引自审计）：
> REDESIGN — 总分 12/30，低于 20 分阈值；视觉语言本身（黑白 + 双语衬线 + 玻璃组件）是全站最强资产应当保留，但承载它的交付结构（19 页 × 复制粘贴 600 行 <style>、无共享 CSS、token 漂移）、文案诚实度与细节完成度是系统性失败，修补式 refine 无法阻止继续漂移，需要从结构层重做。

为什么 redesign 而非 refine：样式以每页内联 <style> 复制交付（抽样 3 页去重行 88–94% 相同），token 已在 15 页漂移（--fs-display 与 DESIGN-TOKENS.md:63 不一致），任何单页修补都会在下一次复制粘贴时再次发散 —— 必须改结构。

保留（不要动）：
- 品牌 token：#0A0A0A + #FAFAF7 双色、Albert Sans/Crimson Pro/JetBrains Mono/Noto Sans SC/Noto Serif SC 字体栈、DESIGN-TOKENS.md §4 的 :root 变量（以 index.html:124-153 版本为准）
- 组件视觉：.ios-pill / .ios-card / .ios-tile / .nav-glass-pill / .hero-signature 的现有外观（DESIGN-TOKENS.md §5）
- index.html hero 版式（满屏照片分栏 + 衬线大标 + signature，index.html:641-705）与子页紧凑 hero 模式
- 双语 lang-en/lang-cn 配对机制 + localStorage lyct-lang
- 无构建步骤约束可放宽为"最多一步 Tailwind CLI 编译"（产出静态 CSS，nginx 直 serve 不变）

废弃（造成失败的结构模式）：
- 每页内联复制 600 行 <style>。证据：about.html:31-595 / contact.html:31-616 / services/airport.html:31-612 去重行 88–94% 相同。导致原则 #3 失败。
- article.html 旧版孤儿模板（零 token、旧单页锚点 nav article.html:94-121、引用未定义 class article.html:105）。导致 #3/#7 失败。
- Tailwind Play CDN 生产运行时 JIT（index.html:103，127KB gzip + 控制台生产警告）。导致 #9 失败。
- 未经数据支撑的绝对化文案模式。导致 #6 失败。

审计最高杠杆 5 步（逐字）：
1. #3 aesthetic — 抽出共享 CSS：建 /css/tokens.css + /css/components.css 单一来源，逐页替换 <style> 块，重做或下线 article.html；--fs-display 等 token 以 DESIGN-TOKENS.md 为准全站统一。
2. #6 honest — 全站文案诚实化：12 处夸大/绝对化（"绝不超时一分" index.html:874-875；careers "Fortune 500" careers.html:668-669 与 enterprise.html:1023-1024 口径矛盾）；删除幽灵车型 Lexus LM（index.html:976-977，fleet 清单无此车）；中文 FAQ 补回一年起约期限（contact.html:941-942）；每条声明配数据或降级措辞。
3. #8 thorough — 补全状态与细节：contact 提交 loading 态（contact.html:1112）；disabled 样式；.ios-pill/.nav-pill 加 :focus-visible；careers alert() 改 inline 提示（careers.html:1176）；12 个表单字段补 label for/id；31 张 img 补 width/height；Google Fonts URL 加 Crimson Pro ital 轴（index.html:106）；服务子页序号去重（cityrides/citytocity 均 03，longterm/privatejet 均 05）。
4. #4 understandable — 行话与标签：零单首现加注（contact.html:928）；EHL chip 配全称（fleet.html:741）；∞ Cost Centre Tags 改人话（enterprise.html:720-722）；「开通企业账户」改为指向 contact 或改文案（enterprise.html:728-729）；nav「企业门户」改「企业服务」（index.html:598-600）；两个「查看全部」补宾语（index.html:719, 931）。
5. #9 environment — 重量减半：Tailwind 构建期编译；hero.jpg 428KB 出 srcset/WebP（index.html:646）；wechat-qr.png 202KB→<30KB；字体 13 个 weight 裁到实际使用集。

另需纳入计划的实测发现：
- nav 玻璃 saturate(200%) 在照片上吸色泛金/绿（DESIGN-TOKENS §5.4），降 saturate 或加中性底色层
- .reveal{opacity:0} 无 no-JS fallback（index.html:213 + 1119-1133），禁 JS 首屏以下全空白，加 <noscript> 或 html.js 作用域
- 移动端 hero metadata 折行孤点（375px 实测）；移动菜单非全屏导致「立即咨询」同屏 ×2
- 7 个 services 子页互链为零，加 related-services 区块；子页 nav 缺 LyctAI 项；Enterprise 中文标签「企业/企业门户」两写法统一
- 品牌签名 "Always as Promised / 始终如约" 仅 3/17 页出现（DESIGN-TOKENS.md:316 要求每页一次）

Redesign 原则优先序：
1. Honest (#6) — 每条声明可验证或已降级；中英含义逐对等价
2. Thorough (#8) — empty/loading/error/success/focus/disabled 六态全覆盖；细节（编号、折行、italic）零已知瑕疵
3. As little design as possible (#10) — 同屏同目标 CTA 只留一个；All Services 单入口；删死代码（.stat-chip、html.light、data-delay-8）

计划交付物：
- 新交付架构：共享 CSS 文件结构图 + 每页迁移清单（19 页）
- 文案诚实化对照表（原句 → 新句 → 依据）
- 六态清单逐表单覆盖（contact + careers）
- 旧 article.html 迁移/下线路径
- 切换标准：所有页面引用共享 CSS、零内联 <style> 设计系统块、Lighthouse a11y ≥ 90 时旧结构退役

防呆（REDESIGN 专属反模式）：
- 不要在新样式下照搬旧结构（逐页内联 <style> 不得回流）
- 不要新旧两套 CSS 长期并存于 main
- 不要为追新趋势重画视觉 —— 视觉保留清单是硬约束
- Preserve 清单不是可选项
````
