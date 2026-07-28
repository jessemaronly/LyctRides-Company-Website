# 官网开发台账

> 新条目加在最上面。格式:`## 日期 | 类型 | commit/动作 | 一句话`,记录 AI 署名。

## 2026-07-28 | Google Ads | 后台暂停 Campaign #1 | 零真实询盘，停止付费投放

Google Ads 账户 `704-561-4847` 的唯一广告系列 `Campaign #1` 已由“已启用”改为
“已暂停”，后台复核账号总日预算为 `US$0.00/天`。停投前数据（2026-07-13 至 07-27）：
展示 2,277、点击 41、费用 US$50.10；Google 显示的 2 次转化受旧“访问 contact 页面”
假转化污染，业务侧确认无真实询盘。历史数据、Google tag 与真实表单埋点保留。记录:Codex

## 2026-07-21 | 埋点 | 分支 feat/conversion-label | 填入 Contact Form Submit 的 conversion label,转化正式开始上报

Google Ads 里新建转化操作 **Contact Form Submit**(Claude 代操作):
类别=提交潜在客户表单 / 创建方式=**手动(添加代码)** / 计数=**仅一次** / 价值=固定 1 USD /
点击型时间窗 90 天 / 归因=以数据为依据。
⚠️ 创建方式必须选「手动」——选「自动」就是让 Google 自己猜转化条件,账户原来那个
"跟踪访问 contact.html 页面"的假转化正是这么来的。

label `wXdTCKHogdQcEIudtp9E` 已填入 `assets/lyct-events.js` 的 LABELS.leadForm
(逐字符比对过 Google 给的 send_to)。至此表单提交会真实上报到 Google Ads。
phone / email 两个 label 仍为空(未建对应转化操作),按设计只 push dataLayer 不调 gtag。

`node scripts/test-lyct-events.js` → 13/13(填入真实 label 后仍全绿,印证上一轮
CodeRabbit 提的解耦修复有效)。记录:Claude(Opus 4.8)

## 2026-07-21 | 埋点 | 分支 feat/conversion-tracking | 真转化跟踪:表单提交成功 + tel/mailto 点击

**根因**:Google Ads 账户唯一的转化动作 `Submit lead form` 实际定义为「访问了以
www.lyctai.com/contact.html 开头的页面」——跟的是**浏览联系页**不是提交表单。导致后台
显示 1 次转化、实际零询盘;另一个 `Lead form - Submit` 恒为 0(从没配过 lead form)。
等于账户**没有任何真实转化跟踪**,加预算=盲投。

**改动**:新增 `assets/lyct-events.js`(复用 head 里已装的 gtag AW-18319511179,
不重复加载);contact.html 表单 fetch 成功回调里调 `LyctTracking.reportLeadForm(data)`,
**放在 .catch 之前**——提交失败走 catch 不会误计;leadNo 作 transaction_id 去重。
全站 tel:/mailto: 点击用 document 事件委托上报。21 个页面在 premium-motion.js 引用旁
挂了 script(每页 1 次,无重复;index-standalone.html 是他人未跟踪 WIP,已排除)。

⚠️ **conversion label 待填**:`LABELS` 三个键当前为空字符串,此时只 push dataLayer、
**不调 gtag**(设计如此,防止 label 未配就误报)。要在 Google Ads → 目标 → 转化 →
创建转化操作 → 网站 → 手动添加代码,拿 `send_to: 'AW-18319511179/xxxx'` 里斜杠后那串填入。

**验证**:`node scripts/test-lyct-events.js` 13 项全过(label 空不调 gtag / 填后
send_to 正确 / 无 leadNo 不崩 / 普通链接不误报 / gtag 缺失(广告拦截插件)静默降级
不影响表单提交)。测试随 PR 提交进仓库,可复跑。
⚠️ 未做浏览器端到端验证(Python 3.14 http.server 起不来);合并前建议真机点一次表单看
Google Ads 转化后台。

**审查后返工**:独立 review(sonnet,只读)无 BLOCKER。据其意见改两处——
(1) 脚本原名 `conversion-tracking.js` 会被 uBlock/AdGuard 按路径关键词整体屏蔽,
连降级逻辑都跑不到,改名 `assets/lyct-events.js`(品牌前缀+中性词,避开通用规则);
(2) 测试原本只在 /tmp 跑完即弃,补提交为 `scripts/test-lyct-events.js`。

**已排除、别再查**:官网语言检测是好的(全站 12 页默认 lang="en" + navigator.language
检测,实测 en-US 浏览器清 localStorage 后渲染英文;曾误判"英文流量落中文页",根因是自己
浏览器存着 lyct-lang=zh-CN);表单 API 通路是好的(/api/public/leads 反代正常,GET 探测
返回 NestJS 格式 404 而非 nginx HTML)。零询盘的真实原因是 21 个点击样本量太小
(B2B 期望询盘 0.2~0.6 个)+ 6 个 sitelink 曾因缺 www 全部拒登。记录:Claude(Opus 4.8)

## 2026-07-17 | 修复批 | 工作区未提交 | Claude 二审 10 bug + 高价值建议批次
Claude(Opus 4.8)五维度审查确认项施工:article 第三处 bodyHtml 裸 || 与 prev/next slug 键对齐、careers/news 脏数据守卫+try/catch、全站导航断点 md→lg(22 页含汉堡/登录/移动菜单)、页脚补 CityRides(22 页)、coverage 顶导误高亮、contact/careers 输入框 16px+44px、轮播多指 pointerId+reduced-motion 不自动播、privacy/terms 删 Material Symbols 死外链、移动菜单 safe-area、面包屑两款统一(services/coverage)、sitemap 补 privacy/terms、首页 hreflang 对齐 sitemap、foundation-bg.jpg PNG 伪装转正 1.85MB→277KB+hero preload。记录:Kimi

## 2026-07-17 | 修复批 | 工作区未提交 | E1 返工 + G1 对比度批次
airport-rail.html lang-en 正文补漏 2 处 driver→chauffeur(grep -i 全文件 0 残留);G1 小标签对比度统一提亮:14 页 305 处 text-[#0A0A0A] /35→/55、/40 /45→/60(净增核验 86→391,恰 305),DESIGN-TOKENS.md 透明度档同步并注明 2026-07-17 决策。记录:Kimi

## 2026-07-17 | 修复批 | 工作区未提交 | A/B/C/D/E/F 六类 23 项全站修复
表单校验与提交态(contact/careers)、JS 潜伏崩溃与语言冻结(article/news)、11 文件死代码清理、3 页语言初始化归一、全站 scroll-padding/移动菜单统一(动态 top+flex+锁滚+Esc)/深色焦点环/skip link/版权双语/hero-signature 铺 16 页、driver→chauffeur 59 处、移动菜单补覆盖城市+公司动态+登录入口。23 文件改动,未 commit,留待审阅验收。记录:Kimi

## 2026-07-15 | 制度建立 | 台账自此强制维护
近期状态(补记):新闻卡片图片封面(43783c9)、机场/高铁礼宾上线文章、备案内容调整(BEIAN-CONTENT-CHANGES.md)。工作区当前有未提交 WIP(约 7 个文件,归属原轨道,勿覆盖)。记录:Claude
