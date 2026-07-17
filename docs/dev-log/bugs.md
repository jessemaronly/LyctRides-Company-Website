# 官网防复发登记册

> 修 bug 前先搜本文件;修完必须登记:症状|根因|修复|防复发规则|记录 AI。平台仓协议同源。

## 2026-07-17 | 表单/语言/提交态 四类(本批 A1/A2/B1/B2)
- 症状:contact 空表单直接 POST,后端 400 显示「提交失败」误导|根因:novalidate 且 submit handler 无校验路径|修复:提交前 checkValidity+reportValidity,400 单独双语提示,结果 msg scrollIntoView+focus|防复发:表单 submit 必须先校验再禁用按钮,后端 4xx 要区分文案。记录:Kimi
- 症状:careers 10MB 简历弱网连点重复投递触发 429|根因:handleSubmit 全程不禁用按钮|修复:进入即 disabled+aria-busy+「提交中…」,finally 恢复;成功提示改 role=status 常驻|防复发:任何 fetch 提交都要乐观锁按钮。记录:Kimi
- 症状:article 切语言偶发整页失效|根因:MutationObserver 裸读 article.body.en(CMS 只有 bodyHtml)|修复:bodyHtml/body 双回退空安全|防复发:CMS 字段访问一律 `(a.b && a.b.c) || ''`。记录:Kimi
- 症状:news 空分类时切语言整页冻结|根因:render() early-return 跳过语言显隐刷新|修复:抽 applyLang(),return 前也调用|防复发:early-return 路径必须过一遍副作用清单。记录:Kimi

(暂无条目——第一个修 bug 的 AI 从这里开始记。)
