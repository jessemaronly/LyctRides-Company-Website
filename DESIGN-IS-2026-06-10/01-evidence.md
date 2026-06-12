# 01 · 证据汇总（6 路取证 agent + orchestrator 实机截图）

> 所有发现均带 file:line。INFERRED = 静态源码推断未经浏览器实测。

## A. 结构证据（Structural）

- index.html 交互元素 61 个（59 a + 2 button），0 表单；contact.html 39a/3btn/4input/1select/1textarea
- 嵌套深度最大 10（nav@544 / tiles@708 / fleet@920），健康范围
- 重复模式：ios-tile ×12、内联右箭头 SVG 逐字相同 ×13（index.html:566-1021）、双语 span 对 ×95、FAB 整块标记每页复制（index.html:1060 / services.html:1066 / contact.html:991）、设计系统 `<style>` 块每页整块复制
- **重复 CTA**：/contact.html ×7（nav 608 / 移动菜单 636+637 / hero 671 / banner 1019 / footer 1050 / FAB 1086）；/services.html ×6 —— 其中"All Services"在同一 section 出现两次（header pill index.html:718 + ghost tile index.html:833）
- 死代码：.stat-chip 在 index/contact 定义未使用（index.html:208-210, contact.html:253-262）；`html class="light"` 无对应选择器（index.html:2）；`data-delay="8"` 无对应 CSS 规则（index.html:833，规则只到 7，index.html:215-221）

## B. 视觉证据（Visual，INFERRED + 实机截图）

- **字号失控**：6 个 --fs-* token（index.html:128-133）中 --fs-display/--fs-body-lg/--fs-body **定义后 0 引用**；token 外另有 ≥16 个硬编码字号（10–80px 共 22 档），含 2 处内联 style（index.html:1009, contact.html:784）
- **颜色**：5 页内 11 个唯一 hex + 61 个 rgba 变体；违反"纯黑白"项：#50606f(×23)、#1c1917(×8)、#f5f5f0(×10)、#e7e5e4(×3)、#f0ede8(×8，fleet 内联)、#25D366/#07C160（品牌绿，contact.html:832,843）
- **对比度**（INFERRED）：正文最低 text-[#0A0A0A]/25 ≈ 1.8:1（values 卡编号，index.html:869-899）；/50 ≈ 3.7:1（hero metadata 10px，index.html:691）；/55 ≈ 4.4:1（13.5px 卡片正文，index.html:873-903）—— 多个 token 低于 AA 4.5:1
- **六态清单**：empty 仅 news 有；**loading 缺失**（contact 提交时按钮无任何 UI 变化 contact.html:1112；news 加载中白屏 news.html:643-645）；error/success 有（contact）；**focus 几乎缺失**（仅 .ios-input 有 focus 环，全站 .ios-pill/.nav-pill/FAB 零 :focus-visible 规则）；**disabled 无视觉样式**（行为有、CSS 0 条）
- **图片**：31 个 `<img>` 0 个带 width/height（CLS 风险）；hero.jpg 无 srcset；6 张 fleet 车图无 loading 属性
- 响应式以 md: 为主（index 64 处），mobile nav = 汉堡 + 玻璃面板
- **实机截图发现（orchestrator）**：
  1. 玻璃 nav `saturate(200%) blur(32px)`（DESIGN-TOKENS §5.4）在 hero 照片上方吸色严重 —— 桌面端 nav 右侧泛金、左侧泛绿，黑白品牌被染色（截图证实）
  2. 移动端 hero metadata 行折行尴尬："台湾 ·" 分隔点孤悬行尾、"24/7" 掉到第二行（375px 宽实测）
  3. 移动端菜单非全屏：底部露出内容 + FAB，"立即咨询"同屏出现两次（菜单 pill + FAB）；面板半透明、下层内容透出
  4. 移动端 hero 照片被白色蒙版洗至几乎不可见（opacity 0.36 + radial mask，index.html:279-283），高级感折损
  5. **no-JS 空白风险**：`.reveal{opacity:0}` 写死在 CSS（index.html:213），reveal 依赖 JS IO（index.html:1119-1133），禁 JS 用户 hero 以下全部不可见，无 `<noscript>` fallback

## C. 文案与诚实（Copy & Honesty）

- index.html 共 115 条可见字符串（102 双语对 + 13 单语）
- **夸大/绝对化 12 处**，典型：
  - "Every arrival is on plan. Not one minute over. / 绝不超时一分"（index.html:874-875）—— 绝对准点承诺，无准点率数据或赔付条款
  - "leading executive chauffeur service"（careers.html:17）、"world-class"（careers.html:635-636）、"Serve the Best. Be the Best."（careers.html:664-665）
  - **口径矛盾**：enterprise.html:1023-1024 明确标注客户列表"示意，非完整"；careers.html:668-669 却以肯定句声明 "Fortune 500 executives" 客户
  - "all major airports"（services/airport.html:794）、"any procurement system"（enterprise.html:758-759）
  - EHL 认证多处引用（fleet.html:874-875, careers.html:711）无证书编号/链接/适用范围
- 暗黑模式：无虚假稀缺/confirmshaming；但**全站 0 处价格**（schema 只有 "$$$$" index.html:78），且长包车"一年起"最低期限在中文 FAQ 被省略（contact.html:941-942 EN 写明 / CN 缺失）
- **行话 7 处**：零单（contact.html:928 首现无解释）、EHL chip（先于解释出现 fleet.html:741）、SLA、Net-30/60、∞ Cost Centre Tags（enterprise.html:720-722）、"每单结构化字段（22）"（lyctai.html:436-437）、80+ billing fields
- **标签→行为不符 4 处**：「开通企业账户」→ login 页（enterprise.html:728-729）；nav「企业门户」→ 营销页非门户（index.html:598-600）；「查看全部」同标签两个目的地（index.html:719 vs 931）；Talk to Us 同 EN 两种 CN 译法（lyctai.html:444-445 vs 893）
- **数据矛盾**：index 首页 Premium MPV 列 "Lexus LM"（index.html:976-977），fleet.html 全清单无此车型；JSON-LD 声明 3 个电话，页面可见仅 1 个（index.html:38-57 vs contact.html:814）
- 双语混排违规 6 处（about.html:946、services/citytocity.html:782 等）

## D. 重量与摩擦（Weight & Friction，实测字节）

- **Tailwind Play CDN 生产运行**：126,597 B gzip / 418,973 B 原始（index.html:103），运行时 JIT 编译，控制台明确 warn "should not be used in production"（实测 ×12 条）
- 字体：5 家族 13 个 weight 变体；fonts CSS 156,657 B gzip；EN 模式 ~8 个 woff2 ≈ 250KB；**Crimson Pro italic 实际使用（index.html:234,310）但 Google Fonts URL 未请求 ital 轴（index.html:106）→ 浏览器伪斜体**
- 图片：hero.jpg 427,749 B 无 srcset 全端同图（index.html:646）；>300KB 共 6 张（最大 service-events-vans.png 500KB）；**wechat-qr.png 202,206 B**（二维码 PNG 正常应 <30KB）
- TTI 估算（ESTIMATED）：快网 0.9–1.3s / 慢 4G 2.5–3.5s；关键路径 ~300KB 阻塞 + Tailwind 运行时编译 100–300ms
- 空闲动画 5 组无限循环（pulse-dot 2.4s ×3、ambient-shift 40s、hero-drift 32s、hero-breath 11s、line-pulse 6s ×2；index.html:204-303），有 prefers-reduced-motion 总闸（index.html:342）
- 初始无 modal/cookie banner；FAB 常驻 + body 预留 104px（index.html:349）

## E. 可达性（Accessibility）

- **表单 label 关联 0/12**：contact 6 字段、careers 6 字段全部无 for/id（contact.html:750-782, careers.html:987-1033）
- contact form `novalidate`（contact.html:747）禁了原生校验但 JS 未做必填检查；careers 错误用 **window.alert()**（careers.html:1176）
- 焦点：无 skip-link（全站 grep 0）；FAB popover 链接在 DOM 中先于触发 pill，正向 Tab 无法到达（仅 Shift+Tab，index.html:392-398, 1060-1090）；dropdown 无 Esc 关闭
- 语义：**全站无 `<main>`**（index 5 个兄弟 section）；nav 无 aria-label；mobile-menu-btn 无 aria-expanded
- hero img 的 19 词描述性 alt 被外层 `aria-hidden="true"` 抹除（index.html:645-646）
- 加分项：100% img 有 alt；键盘全部原生元素可达（无 div 点击陷阱）；prefers-reduced-motion CSS+JS 双覆盖；lang 属性切换时同步更新；FAQ 用原生 details/summary

## F. 跨页一致性（Cross-Page）

- **样式漂移（系统性）**：15 个非 index 页 `--fs-display: clamp(2.25rem,5vw,4rem)` ≠ DESIGN-TOKENS.md:63 规定值（仅 index 一致）；token 文档外变量每页多 4–8 个；lyctai 定义 .hero-signature 后 0 使用（lyctai.html:322-323）；services/* 定义 .hero-fixed-h 后 0 使用
- **article.html 是旧版孤儿模板**：零 token、旧版单页锚点 nav（article.html:94-121）、引用未定义的 .nav-pill class（article.html:105 vs 42-89）
- **`<style>` 复制粘贴量化**：抽样 3 页去重行 88–94% 相同（about 565 行 / contact 586 / airport 605-610）；24 个 canon 变量在 16 页各重复定义一次；**无任何共享 CSS 文件**
- nav 不一致 5 组：7 个 services 子页 nav 缺 LyctAI 项；enterprise nav CTA 指 login 而非 contact；Enterprise 中文标签「企业」/「企业门户」两种写法各 4+ 页；services 子页 logo ?v=2 其余 ?v=4
- **品牌签名覆盖 3/17**：DESIGN-TOKENS.md:316 要求每页出现 "Always as Promised / 始终如约"，实际 14 页零出现
- **服务子页编号错乱**：'NN / Service' 序号重复 —— cityrides 与 citytocity 都是 03、longterm 与 privatejet 都是 05（无 06/07）；hourly 页内 § 编号 05→06→03→07 乱序（services/hourly.html:921-1055）
- **服务子页零互链**：7 页之间 `href="/services/` 0 命中，无 related-services
- 单薄页：article 61 英文词 / news 100 / careers 194 / cityrides 195（hourly 552 —— 同模板内容量差 65%）

## 已知盲区

- 对比度为 alpha 混合近似值，未经浏览器实测；玻璃/照片上的文字对比无法静态计算
- 生产 nginx 压缩配置、真实 TTI 未测；lyctrides.com/login 未访问
- careers 职位卡为 JS 模板生成，审计的是模板串非运行时输出
