# LyctRides 基础设施地图 · 单一可信源

> 写这份是为了**以后再也不迷路**：所有代码、服务器、域名、部署流程、能删的废物，一张图说清楚。
>
> **任何 Claude / 工程师在 LyctRides 项目里干活前，必须先读这一份。**
>
> 最后核对日期：2026-05-16（生产 commit `b2d7bd8`）

---

## 1. 一图看完

```
┌───────────────────────────────────────────────────────────────────────┐
│                            INTERNET                                    │
└──────────────────────────────────┬────────────────────────────────────┘
                                   │
                          DNS: Cloudflare CDN
                                   │
                                   ▼
                      ┌──────────────────────────┐
                      │  Cloudflare Tunnel       │
                      │  lyctai-prod             │
                      │  cffed891-7950-4424-…   │
                      │  Status: HEALTHY         │
                      └─────────────┬────────────┘
                                    │
                                    ▼
              ┌─────────────────────────────────────────────┐
              │  Aliyun ECS · 8.166.115.148                  │
              │  Hostname: iZ7xvfr8c1nkdddev18bhdZ           │
              │  SSH alias: lyctrides                        │
              │  Key: ~/.ssh/lyctrides_deploy                │
              │                                              │
              │  Process: cloudflared (PID varies)           │
              │  ─────────────────────────────────           │
              │  路由按 hostname 分流：                       │
              │                                              │
              │  lyctai.com    → 静态文件                     │
              │                  /root/lyctai-website/        │
              │                  (nginx / cloudflared serve)  │
              │                                              │
              │  lyctrides.com → localhost:3000               │
              │                  systemd: lyctrides-web       │
              │                  /root/lyctrides-platform/    │
              │                  apps/web (Next.js v16.2.4)   │
              │                                              │
              │  /api/*        → localhost:3001（推测）        │
              │                  systemd: lyctrides-api       │
              │                  /root/lyctrides-platform/    │
              │                  apps/api (NestJS)            │
              └─────────────────────────────────────────────┘
```

---

## 2. 本地工作区（/Users/jz/WorkPlace/）

| 路径 | 含义 | 状态 | 怎么用 |
|---|---|---|---|
| `lyctai-website-jolly/` | git worktree · 分支 `claude/jolly-chatelet-049c03` | ✅ **生产分支，所有官网改动都在这** | 日常工作目录 |
| `lyctai-website-repo/` | git worktree · 分支 `main` | ⚠️ **已脱节、不再代表生产**。两个 worktree 共用一份 `.git`（在 repo 这边） | 别在这里改东西。可保留作为 main 历史 reference |
| `lyctrides-platform/` | 独立 monorepo（admin + API + iOS） | ✅ 后台 / iOS APP 改动在这 | 跟 jolly 是**两个独立 GitHub repo**，不要混 |

### git worktree 关系
```
lyctai-website-repo/.git/   ← 真实 git 数据库（PRIMARY clone）
lyctai-website-jolly/.git    ← 只是一个 file，指向上面的 worktree 目录
```

⚠️ **不能直接 `rm -rf lyctai-website-repo/`** — 会同时干掉 jolly 的 git 历史。要清理见 §6。

---

## 3. 远端 GitHub repo

| Repo | 地址 | 用途 |
|---|---|---|
| 官网静态站 | `https://github.com/jessemaronly/LyctRides-Company-Website` | jolly 分支 = 生产；main 分支 = 旧/废 |
| 后台 + API + iOS | （在 `lyctrides-platform/` 目录） | 后台 SaaS + REST API |

---

## 4. 生产服务器 · Aliyun ECS

### 接入

```bash
ssh lyctrides
# = ssh -i ~/.ssh/lyctrides_deploy root@8.166.115.148
```

### 关键目录

| 路径 | 大小 | 内容 | 谁服务 | 域名 |
|---|---|---|---|---|
| `/root/lyctai-website/` | 75M | git 仓库（jolly 分支 checkout） | — | （仅 deploy 源，nginx **不**直接 serve） |
| `/var/www/lyctai-website/` | — | **nginx 实际 serve 的文件** | nginx `server_name lyctai.com` | **lyctai.com** |
| `/var/www/lyctai-website.bak.<YYYYMMDD-HHMMSS>/` | — | 历史 rsync 部署备份（可清理） | — | — |
| `/root/lyctrides-platform/apps/web/` | — | Next.js 后台前端 | systemd: `lyctrides-web.service` → localhost:3000 | **lyctrides.com** |
| `/root/lyctrides-platform/apps/api/` | — | NestJS API | systemd: `lyctrides-api.service` | `*/api/*` |

⚠️ **关键事实**：`/root/lyctai-website/` 跟 `/var/www/lyctai-website/` 是**两份独立文件**。`git pull` 只更新 `/root/`，**还需要 `rsync` 同步到 `/var/www/`** 才能上线。当前**没有任何自动同步**（无 cron、无 systemd timer、无 git hook）。

### 关键 systemd 服务

```bash
systemctl status cloudflared        # Cloudflare Tunnel 守护
systemctl status nginx              # nginx 反代 + 静态 serve
systemctl status lyctrides-web      # Next.js 后台前端 (localhost:3000)
systemctl status lyctrides-api      # NestJS API (localhost:3001)
```

### nginx 路由表

| location | 实际行为 |
|---|---|
| `lyctai.com` / `www.lyctai.com` | `root /var/www/lyctai-website` 静态 serve |
| `lyctrides.com` / `www.lyctrides.com` | `proxy_pass http://127.0.0.1:3001`（注：proxy 到 API 端口；实际 Next.js 是 :3000，但 nginx 经 :3001 转 — 当前可工作就保留观察） |
| `*/api/*` | `proxy_pass http://127.0.0.1:3001` |

### Cloudflare Tunnel 配置

- 名称：`lyctai-prod`
- Tunnel ID：`cffed891-7950-4424-88bf-ae1c23e596ad`
- Connector ID：`90d29212-57d4-4e21-a46c-27b2c5515903`
- Public hostnames（已确认）：
  - `lyctai.com/*` → `http://localhost:80`
  - `www.lyctai.com/*` → `http://localhost:80`
  - Catch-all: 404
- **lyctrides.com 不在这个 Tunnel** —— 它走另外的方式接入（推测 Cloudflare DNS 直 proxy 到 ECS IP）
- 管理：dashboard → Zero Trust → Networks → Tunnels → `lyctai-prod` → **Published application routes** tab

---

## 5. 部署流程（真实管用的）

### 改官网静态站（3 步必走）

```bash
# ─── 本地 ───
cd ~/WorkPlace/lyctai-website-jolly
# ... 改代码 ...
git add <具体文件>
git commit -m "feat(xxx): ..."
git push origin claude/jolly-chatelet-049c03

# ─── 服务器 ───
ssh lyctrides

# ① 拉新代码到 /root/
cd /root/lyctai-website
git pull --ff-only origin claude/jolly-chatelet-049c03

# ② 同步到 /var/www（nginx 实际 serve 的地方）
cp -a /var/www/lyctai-website /var/www/lyctai-website.bak.$(date +%Y%m%d-%H%M%S)
rsync -av --delete \
  --exclude='.git' --exclude='.gitignore' \
  --exclude='preview-all.html' --exclude='*.md' \
  /root/lyctai-website/ /var/www/lyctai-website/

# ③ 清 Cloudflare 边缘缓存
# Cloudflare dashboard → 选 lyctai.com → Caching → Configuration → Purge Everything

# 验证
curl -s -A "Mozilla/5.0" "https://www.lyctai.com/?$(date +%s)" | grep '<title>'
```

**简化版**：可以把这一坨写成 `/root/deploy-website.sh`（参见 §6.D 一键脚本）。

### 清 Cloudflare 边缘缓存（重要内容更新后）

- Cloudflare dashboard → Caching → Configuration → Purge Cache
- 选 "Purge Everything" 或单条 URL

### 改后台 / API

```bash
cd ~/WorkPlace/lyctrides-platform
# ... 改代码 ...
git push

ssh lyctrides
cd /root/lyctrides-platform
git pull && pnpm install && pnpm build
systemctl restart lyctrides-web   # Next.js 要重启才生效
# API 同理 systemctl restart lyctrides-api
```

### ⚠️ 已废弃，不要用

- `lyctai-website-repo/deploy.sh` —— 指向已删除的 `NEW-Lyctai.com` 同步源，**整个文件作废**
- main 分支的任何"部署"指引 —— 全过时

---

## 6. 可以清理的东西

### A. 本地可删（安全）

| 路径 | 为何安全删 |
|---|---|
| `lyctai-website-jolly/preview-all.html` | 本地预览专用，部署到生产无害但是冗余 |
| `lyctai-website-repo/.DS_Store` | macOS 噪音 |

### B. 服务器 `/root/lyctai-website/` 可删（已 noindex，但生产存在显得脏）

```bash
ssh lyctrides
cd /root/lyctai-website
rm -f article.html page-a.html page-b.html hero-preview-a.html hero-preview-b.html
```

这些是早期 mockup / template 文件，新设计完全没引用到，robots.txt 也已 Disallow。

### C. 本地 `lyctai-website-repo/` 改名让你不再迷惑（**不删 .git**）

```bash
cd ~/WorkPlace
mv lyctai-website-repo lyctai-git-store
```

之后 jolly worktree 仍能正常 git 操作（worktree 内部用绝对路径跟踪），看起来更干净 —— `lyctai-website-jolly/` 才是工作区，`lyctai-git-store/` 是元数据归档。

### D. 等彻底 ready 后才做：把 main 升级为生产分支

详见 §7。

---

## 7. 长期规划：把 main 拉回生产线

现状是历史包袱：分支名 `claude/jolly-chatelet-049c03` 是 Claude Code 随机生成的，不像生产分支应有的名字。

**未来某天**（不是现在）想清理：

```bash
# 1) 备份当前 main
ssh lyctrides "cd /root/lyctai-website && git tag backup-main-$(date +%Y%m%d)"

# 2) 让 main = jolly 内容
cd ~/WorkPlace/lyctai-website-jolly
git push origin claude/jolly-chatelet-049c03:main --force-with-lease

# 3) 服务器切到 main
ssh lyctrides "cd /root/lyctai-website && git fetch && git checkout main && git pull --ff-only origin main"

# 4) GitHub 设 default branch 回 main

# 5) 删 jolly 分支
git push origin --delete claude/jolly-chatelet-049c03
```

⚠️ 在做之前确认：
- jolly 上的 commit 全在 main 之外
- Cloudflare Tunnel 的部署目标分支配置（如果有自动 pull script，要同步改）

---

## 8. 快速诊断手册（出问题时）

| 症状 | 检查 |
|---|---|
| `lyctai.com` 打不开 | `ssh lyctrides && systemctl status cloudflared` |
| `lyctai.com` 内容不是最新 | 在服务器跑 `cd /root/lyctai-website && git log -1` 看是否 ≥ b2d7bd8；不是的话 `git pull` |
| `lyctrides.com` 打不开 | `ssh lyctrides && systemctl status lyctrides-web` |
| 后台 API 不响应 | `ssh lyctrides && systemctl status lyctrides-api && journalctl -u lyctrides-api -n 50` |
| 表单提交失败 | 检查浏览器 console，看是 CORS（生产应同源）还是 API 500 |
| Cloudflare cache 没刷新 | dashboard purge OR URL 加 `?v=<timestamp>` |

---

## 9. 内容数据源

`lyctai.com` 的新闻和招聘页有两层加载策略：

1. **优先** `/api/public/news` / `/api/public/careers` —— 后台数据库实时（在 `lyctrides-platform/apps/api`）
2. **失败 fallback** `/data/news.json` / `/data/careers.json` —— 静态 JSON（在 `lyctai-website-jolly/data/`）

意味着：
- 后台管理新闻 / 招聘 → 写 DB → API 返回 → 网站自动显示
- 本地开发 / 后台挂掉时 → 自动用静态 JSON 兜底 → 不空白

**不会失去后台管理能力。**

---

## 10. 联系信息（公司层面）

- 域名：lyctai.com（公司官网） / lyctrides.com（后台）
- 联系邮箱：bd@lyctai.com
- 公司电话：+86 158 2291 8415

---

## 附：以前哪些地方写错了/过时了

| 来源 | 错误 | 真相（本文档已修正） |
|---|---|---|
| 旧 CLAUDE.md | "Tunnel host 不是 8.166.115.148" | **就是** 8.166.115.148（同一台 Aliyun ECS 上有 cloudflared + nginx + Next.js + API） |
| 旧 CLAUDE.md | "用户不记得 Tunnel host 在哪" | 这份文档已锁定 |
| 旧 CLAUDE.md | 指向 `deploy.sh` | 那个脚本已废，不要跑 |
