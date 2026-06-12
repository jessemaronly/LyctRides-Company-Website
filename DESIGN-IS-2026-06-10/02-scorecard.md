# 02 · Rams 十原则评分卡

> 0–3 整数分，等权重，总分 30。按锚点逐字适用；不确定时取低分；同原则多实例取最差实例。

1. **Good design is innovative — Score: 1/3**
   Evidence: iOS 玻璃/弹簧语言移植 + 双语衬线排印（index.html:234-236, 310-311）是对 Apple 设计语言与 chauffeur 行业模板的组合，非新形式（01-evidence B）。
   Justification: 属"模仿既有模式加小变化"（锚点 1）；双语排印有巧思但不构成"明确改进既有模式"（锚点 2），不确定时取低。

2. **Good design makes a product useful — Score: 2/3**
   Evidence: 留资主任务 1–2 步可达（hero CTA→contact、tel:、FAB）；但「开通企业账户」实指 login 页（enterprise.html:728-729）、全站 0 价格信息增加决策摩擦（01-evidence C）。
   Justification: 主任务完成但邻接面添堵（锚点 2）；未到"无诱饵动作"（锚点 3）。

3. **Good design is aesthetic — Score: 1/3**
   Evidence: token 体系存在但失守 —— 3 个 --fs-* 定义后 0 引用、16+ 硬编码字号、61 个 rgba 变体、15 页 --fs-display 漂移、article.html 完全脱离体系（01-evidence B/F）。
   Justification: 不一致远超 3–5 处（锚点 1 上限），但体系可见、渲染结果整体优雅，未到"无可见体系"（锚点 0）；最差实例 article.html 锁定 1。

4. **Good design makes a product understandable — Score: 1/3**
   Evidence: 行话 7 处（零单/EHL/SLA/∞/LYCTAI nav 项）+ 标签失配 4 处（企业门户→营销页、查看全部双目的地）（01-evidence C）。
   Justification: ">2–3 控件不清晰且有行话"（锚点 1）；主操作"预约用车"仍可识别，未到锚点 0。

5. **Good design is unobtrusive — Score: 2/3**
   Evidence: 黑白克制、内容为主；但 5 组无限空闲动画 + nav saturate(200%) 吸色染金/绿（01-evidence B 截图发现 1、D）。
   Justification: chrome 可见但总体安静（锚点 2）；吸色与微动效尚未到"装饰与内容争抢"（锚点 1）。

6. **Good design is honest — Score: 1/3**
   Evidence: 夸大/绝对化 12 处（"绝不超时一分" index.html:874-875、Fortune 500 口径与 enterprise 页自相矛盾）；幽灵车型 Lexus LM（index.html:976-977 vs fleet.html 全清单）；中文 FAQ 省略一年起约期限（contact.html:941-942）（01-evidence C）。
   Justification: "2+ 处夸大"（锚点 1）成立；无强制连续/隐藏成本类欺骗流程，不到锚点 0。

7. **Good design is long-lasting — Score: 1/3**
   Evidence: 黑白衬线基底耐老；但 liquid-glass/backdrop-blur（index.html:226-227 等）、spring scale-1.04 hover、Ken Burns+breath 呼吸动画为 2024–26 期 Apple 潮流标记（01-evidence B/D）。
   Justification: 2–3 个时代标记（锚点 1）；玻璃层遍布全站，按"最差实例"取 1。

8. **Good design is thorough down to the last detail — Score: 1/3**
   Evidence: loading 态缺失、disabled 无视觉、focus 环仅输入框有；careers 错误用 alert()；label 关联 0/12；31 img 0 width/height；Crimson italic 未加载 ital 轴→伪斜体；服务子页编号 03/03、05/05 重复 + hourly § 乱序；移动端 metadata 折行孤点（01-evidence B/E/F + 截图发现 2）。
   Justification: 缺/糙状态 ≈3 个（锚点 1 = 2–3 缺失）；error/success/empty 存在，未到"4+ 缺失"（锚点 0）。

9. **Good design is environmentally friendly — Score: 1/3**
   Evidence: 初始传输 EN 模式约 0.8–1MB（Tailwind Play CDN 127KB gzip 运行时 JIT + fonts ~400KB + hero.jpg 428KB 无 srcset）；动画有 prefers-reduced-motion 总闸；dark mode 未适配（01-evidence D）。
   Justification: 500KB–2MB 带（锚点 1）精确命中；motion 已 gated 但重量不达 <500KB（锚点 2），dark-mode-ignored 单项不足以压到 0。

10. **Good design is as little design as possible — Score: 1/3**
    Evidence: "All Services" 同 section 双入口（index.html:718 + 833）；/contact CTA ×7，FAB 与 CTA banner、移动菜单 pill 同屏冗余（截图发现 3）；死代码 .stat-chip/.light/data-delay-8（01-evidence A）。
    Justification: 3–5 个可移除元素（锚点 1）；多数 section 各有职责，未到"装饰主导"（锚点 0）。

---

**总分：12 / 30**

| # | 原则 | 分 |
|---|---|---|
| 1 | innovative | 1 |
| 2 | useful | 2 |
| 3 | aesthetic | 1 |
| 4 | understandable | 1 |
| 5 | unobtrusive | 2 |
| 6 | honest | 1 |
| 7 | long-lasting | 1 |
| 8 | thorough | 1 |
| 9 | environmentally friendly | 1 |
| 10 | as little design as possible | 1 |
