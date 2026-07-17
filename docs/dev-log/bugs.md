# 官网防复发登记册

> 修 bug 前先搜本文件;修完必须登记:症状|根因|修复|防复发规则|记录 AI。平台仓协议同源。

## 2026-07-17 | Claude 二审确认 10 bug(本批 #1-#9,gzip 归 Claude 基础设施)
- 症状:后台单语 bodyHtml 文章打开崩「无法加载」(上轮漏网第三处)|根因:article.html:700 `|| article.body.en` 裸访问|修复:三处统一 `(a.body && a.body.en) || ''`|防复发:CMS 字段访问一律可选链+空串兜底,改完 grep 同模式余量。记录:Kimi
- 症状:一条脏职位数据炸掉整份 careers 列表|根因:renderJob 对 tags/title/location/type 无判空(description 却有)|修复:title/loc/jtype 局部兜底对象+tags Array.isArray+部门空串,node 脏数据冒烟测试入档|防复发:模板渲染入口对 API 数据一律先兜底再插值,新渲染函数必须过脏数据用例。记录:Kimi
- 症状:iPad 竖屏/中小平板顶导横向溢出|根因:桌面导航 md:flex 768px 即展开,5 pill+logo+登录挤不下|修复:导航/汉堡/登录/移动菜单四处断点 md→lg(22 页批量)|防复发:断点改动必须四处同步,批量替换脚本校验每文件恰好 1 处。记录:Kimi
- 症状:news 语言切换遇脏数据整页冻结|根因:MutationObserver 直调 render 无 try/catch,卡片字段裸访问|修复:observer 包 try/catch+renderCard/renderFeatured 字段兜底+filter 空安全|防复发:副作用回调(observer/事件)一律容错,同 #2 渲染守卫规则。记录:Kimi
- 症状:vehicles 轮播第二根手指按下轨道跳变|根因:pointerdown 不校验 pointerId,多指共用 startX|修复:记录 activeId,非主指针/重复按下忽略,move/up/cancel 按 id 过滤|防复发:触摸拖拽实现必须考虑多指与 pointercancel。记录:Kimi
- 症状:slug 键文章 prev/next 串位|根因:prev/next 以 a.id 定位而合并列表以 id||slug 建键|修复:定位键对齐 keyOf 口径,idx<0 不渲染上下篇|防复发:同一数据集多处查找必须用同一取键函数。记录:Kimi
- 症状:页脚服务列表 8 缺 1(少 CityRides)|根因:全站硬编码页脚未跟随导航下拉更新|修复:22 页统一补 CityRides(顺序同导航下拉)|防复发:导航/页脚/移动菜单三处服务清单改动必须同步,批量脚本校验。记录:Kimi
- 症状:coverage 页把顶导「出行服务」误高亮为当前页|根因:nav-pill-active 挂错 pill(coverage 无桌面 pill 归属)|修复:摘除 active 类|防复发:新页面挂 active 前先确认该页在桌面导航有对应 pill。记录:Kimi
- 症状:iOS Safari 聚焦 contact/careers 输入框自动放大页面|根因:表单字号 15/14px<16px|修复:ios-input 统一 16px,careers 另补 min-height 44px 触摸目标|防复发:表单控件字号不得低于 16px,触摸目标不低于 44px。记录:Kimi

## 2026-07-17 | 表单/语言/提交态 四类(本批 A1/A2/B1/B2)
- 症状:contact 空表单直接 POST,后端 400 显示「提交失败」误导|根因:novalidate 且 submit handler 无校验路径|修复:提交前 checkValidity+reportValidity,400 单独双语提示,结果 msg scrollIntoView+focus|防复发:表单 submit 必须先校验再禁用按钮,后端 4xx 要区分文案。记录:Kimi
- 症状:careers 10MB 简历弱网连点重复投递触发 429|根因:handleSubmit 全程不禁用按钮|修复:进入即 disabled+aria-busy+「提交中…」,finally 恢复;成功提示改 role=status 常驻|防复发:任何 fetch 提交都要乐观锁按钮。记录:Kimi
- 症状:article 切语言偶发整页失效|根因:MutationObserver 裸读 article.body.en(CMS 只有 bodyHtml)|修复:bodyHtml/body 双回退空安全|防复发:CMS 字段访问一律 `(a.b && a.b.c) || ''`。记录:Kimi
- 症状:news 空分类时切语言整页冻结|根因:render() early-return 跳过语言显隐刷新|修复:抽 applyLang(),return 前也调用|防复发:early-return 路径必须过一遍副作用清单。记录:Kimi

(暂无条目——第一个修 bug 的 AI 从这里开始记。)
