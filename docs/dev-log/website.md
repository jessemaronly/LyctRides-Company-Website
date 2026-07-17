# 官网开发台账

> 新条目加在最上面。格式:`## 日期 | 类型 | commit/动作 | 一句话`,记录 AI 署名。

## 2026-07-17 | 修复批 | 工作区未提交 | Claude 二审 10 bug + 高价值建议批次
Claude(Opus 4.8)五维度审查确认项施工:article 第三处 bodyHtml 裸 || 与 prev/next slug 键对齐、careers/news 脏数据守卫+try/catch、全站导航断点 md→lg(22 页含汉堡/登录/移动菜单)、页脚补 CityRides(22 页)、coverage 顶导误高亮、contact/careers 输入框 16px+44px、轮播多指 pointerId+reduced-motion 不自动播、privacy/terms 删 Material Symbols 死外链、移动菜单 safe-area、面包屑两款统一(services/coverage)、sitemap 补 privacy/terms、首页 hreflang 对齐 sitemap、foundation-bg.jpg PNG 伪装转正 1.85MB→277KB+hero preload。记录:Kimi

## 2026-07-17 | 修复批 | 工作区未提交 | E1 返工 + G1 对比度批次
airport-rail.html lang-en 正文补漏 2 处 driver→chauffeur(grep -i 全文件 0 残留);G1 小标签对比度统一提亮:14 页 305 处 text-[#0A0A0A] /35→/55、/40 /45→/60(净增核验 86→391,恰 305),DESIGN-TOKENS.md 透明度档同步并注明 2026-07-17 决策。记录:Kimi

## 2026-07-17 | 修复批 | 工作区未提交 | A/B/C/D/E/F 六类 23 项全站修复
表单校验与提交态(contact/careers)、JS 潜伏崩溃与语言冻结(article/news)、11 文件死代码清理、3 页语言初始化归一、全站 scroll-padding/移动菜单统一(动态 top+flex+锁滚+Esc)/深色焦点环/skip link/版权双语/hero-signature 铺 16 页、driver→chauffeur 59 处、移动菜单补覆盖城市+公司动态+登录入口。23 文件改动,未 commit,留待审阅验收。记录:Kimi

## 2026-07-15 | 制度建立 | 台账自此强制维护
近期状态(补记):新闻卡片图片封面(43783c9)、机场/高铁礼宾上线文章、备案内容调整(BEIAN-CONTENT-CHANGES.md)。工作区当前有未提交 WIP(约 7 个文件,归属原轨道,勿覆盖)。记录:Claude
