# 03 · Verdict

**REDESIGN** — 总分 12/30，低于 20 分阈值；视觉语言本身（黑白 + 双语衬线 + 玻璃组件）是全站最强资产应当保留，但承载它的交付结构（19 页 × 复制粘贴 600 行 `<style>`、无共享 CSS、token 漂移）、文案诚实度与细节完成度是系统性失败，修补式 refine 无法阻止继续漂移，需要从结构层重做。

> 注意这不是"推倒视觉重画"——hero、卡片、pill 的视觉决策得分恰恰最高（#5 unobtrusive = 2）。Redesign 的对象是**工程结构 + 内容层**：样式交付方式、文案口径、状态完整性、信息标签。

## 最高杠杆 5 步（按优先序）

1. **#3 aesthetic — 抽出共享 CSS，消灭 19 份复制**：抽样 3 页 `<style>` 去重行 88–94% 相同；15 页 `--fs-display` 值与 DESIGN-TOKENS.md:63 漂移；article.html 完全脱离体系并引用未定义 class（article.html:105）。→ 建 `/css/tokens.css` + `/css/components.css` 单一来源，逐页替换 `<style>` 块，重做或下线 article.html。
2. **#6 honest — 全站文案诚实化**：12 处夸大/绝对化（"绝不超时一分" index.html:874-875；careers "Fortune 500" 肯定句 careers.html:668-669 与 enterprise.html:1023-1024 "示意非完整" 口径矛盾）；幽灵车型 Lexus LM（index.html:976-977）；中文 FAQ 省略一年起约（contact.html:941-942）。→ 每条声明要么配数据要么降级措辞，中英含义逐对对齐。
3. **#8 thorough — 补全交互状态与细节**：loading 态 0（contact.html:1112 提交无反馈）、disabled 无样式、.ios-pill/.nav-pill 零 :focus-visible、careers 错误用 alert()（careers.html:1176）、表单 label 关联 0/12、31 img 无 width/height、Crimson italic 未请求 ital 轴（index.html:106）、服务子页编号 03/03·05/05 重复（services/cityrides.html:747 等）。
4. **#4 understandable — 行话与标签修正**：零单（contact.html:928）、EHL chip 先于解释（fleet.html:741）、∞ Cost Centre Tags（enterprise.html:720-722）、「开通企业账户」→login（enterprise.html:728-729）、「企业门户」→营销页（index.html:598-600）、双「查看全部」（index.html:719 vs 931）。
5. **#9 environmentally friendly — 重量减半**：Tailwind Play CDN 127KB gzip 运行时 JIT 换构建期编译产物（index.html:103）；hero.jpg 428KB 加 srcset/WebP（index.html:646）；wechat-qr.png 202KB 重导出（应 <30KB）；裁字体 weight（13 变体 → 实际使用集）。

## 反模式自检

- 非沉没成本驱动：不因"代码量大"选 REFINE —— 漂移证据表明无共享层时 refine 后仍会继续发散
- 非单屏丑陋驱动：失败横跨 17 页（token 漂移 15 页、签名缺失 14 页、文案问题 8+ 页）
- 不躲闪：视觉语言保留清单非空（见 04），不是 NEW
