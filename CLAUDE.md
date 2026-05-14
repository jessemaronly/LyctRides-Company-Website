# LyctRides Company Website — Claude Instructions

## ⚠️ 部署现状 (Read Me First)

**生产分支 = `claude/jolly-chatelet-049c03`，不是 `main`。**

| 事实 | 状态 |
|---|---|
| `lyctai.com` DNS | → Cloudflare CDN（确认） |
| 实际 origin | Cloudflare Tunnel 后面某台机器（**用户当前不记得是哪台**；不是 ECS `8.166.115.148`，ECS 现在返回 403） |
| 生产分支 | `claude/jolly-chatelet-049c03`（HTML 特征比对确认，含 SEO schema / `lyctai.com/api` Tunnel routing） |
| `main` 分支 | **已脱节** —— 落后生产一大截，没有 Cloudflare Tunnel 适配 / 没有 SEO baseline |
| `deploy.sh` | **已废** —— 描述的 ECS 路径不通；NEW-Lyctai.com 同步源也已删除。**不要跑！** |

**给以后的 Claude / 操作者**：
- 改生产网站 = 切到 `claude/jolly-chatelet-049c03` worktree → 改 → commit → push
- 这个 worktree 在 `/Users/jz/WorkPlace/lyctai-website-jolly`
- main 分支上的 `deploy.sh` 不要执行，等用户清楚记起 Tunnel host 是哪台机后再决定怎么改造部署流程

## Worktree 物理布局

```
/Users/jz/WorkPlace/lyctai-website-repo/      → main (adbf720)，已废 deploy.sh 在这
/Users/jz/WorkPlace/lyctai-website-jolly/     → claude/jolly-chatelet-049c03，生产分支
```

`git worktree list` 查看实时状态。

## Token Efficiency Rules

These rules apply to every response in this project.

**Be brief. Don't summarize what you just did.**
After completing a task, confirm in one line. No need to list every change made.

**Don't repeat established context.**
If a file path, variable, or decision was already discussed, don't re-introduce it. Reference it directly.

**Execute first, explain only if asked.**
When the intent is clear, take action immediately. Skip "I'll now..." or "Let me..." preambles.

**Code edits: use Edit tool, show only the diff.**
Never restate unchanged code. Never print a whole file when only part changed.

**No closing summaries.**
Don't end responses with "In summary..." or bullet lists of what was done. The work speaks for itself.

**Skip permission confirmations on low-risk tasks.**
For file edits, code searches, and read operations in this repo — act directly. Only ask for confirmation before destructive or irreversible actions.

## Project Context

- Static site: pure HTML + Tailwind CDN + vanilla JS
- Preview server: `python3 -m http.server 8787`
- Brand colors: `#0A0A0A` (black) · `#FAFAF7` (warm white) — no third color
- Font stack: Albert Sans · JetBrains Mono · Noto Sans SC · Noto Serif SC
- Bilingual toggle: `html[lang="en"] .lang-cn { display:none }` / `html[lang="cn"] .lang-en { display:none }`
- Data: `data/news.json` · `data/careers.json` (JSON-driven pages)
- Bilingual `localStorage` key shared with the operations portal: `lyct-lang`

## Forms Backend

The contact / careers forms POST to (relative paths, same-origin via Cloudflare Tunnel):

- `POST /api/public/leads` — contact form (index.html)
- `POST /api/public/careers/apply` — careers form (careers.html)

These endpoints live in the LyctRides backend (`apps/api`). When working on the
forms, verify the API is reachable; failed submits show inline error UI rather
than alerts.

## Model Selection

To use a smaller/faster model for this project, run in terminal:
```
claude --model claude-haiku-4-5
```
Or set globally via Claude Code's `/config` command → change "Model".
For tasks in this project (HTML edits, code search, CSS fixes), Sonnet is sufficient — Opus is not needed.
