# LyctRides 基础设施地图 · 单一可信源

> 写这份是为了**以后再也不迷路**：所有代码、服务器、域名、部署流程、能删的废物，一张图说清楚。
>
> **任何 Claude / 工程师在 LyctRides 项目里干活前，必须先读这一份。**
>
> 最后核对日期：2026-05-16（生产分支 `main`，nginx 直 serve git checkout）

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
              │                  /var/www/lyctai-website/     │
              │                  (nginx direct serve git ckt) │
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

| 路径 | 含义 | 用途 |
|---|---|---|
| `lyctai-website-repo/` | git PRIMARY clone · 分支 `main` | 日常工作目录（含 `.git/` 真目录） |
| `lyctrides-platform/` | 独立 monorepo（admin + API + iOS） | 后台 / API / iOS 项目，跟官网无关 |

Step 7 后 `lyctai-website-jolly/` worktree 已移除，只保留一个 `lyctai-website-repo/`。可选改名为 `lyctai-website/` 更直观（命令：`cd ~/WorkPlace && mv lyctai-website-repo lyctai-website`）。

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
| `/var/www/lyctai-website/` | ~36M | **git checkout + nginx 直 serve（合一）** | nginx `server_name lyctai.com` | **lyctai.com** |
| `/root/lyctrides-platform/apps/web/` | — | Next.js 后台前端 | systemd: `lyctrides-web.service` → localhost:3000 | **lyctrides.com** |
| `/root/lyctrides-platform/apps/api/` | — | NestJS API | systemd: `lyctrides-api.service` → localhost:3001 | `*/api/*` |

✅ **Step 6 之后**：git 仓库本身就在 nginx 服务目录，无需 rsync。`git pull` 即上线。

### nginx 安全屏蔽

`/etc/nginx/conf.d/lyctai.conf` 已配置 deny 规则，禁止外网访问以下路径：
- `.git/` 及任何 dotfile（`location ~ /\.`）
- `*.md`（CLAUDE.md / INFRA.md / DESIGN-TOKENS.md）
- `/scripts/`（含 deploy-website.sh）
- `/preview-all.html`

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

### 改官网静态站（一行 deploy）

```bash
# ─── 本地 ───
cd ~/WorkPlace/lyctai-website-jolly
# ... 改代码 ...
git add <具体文件>
git commit -m "feat(xxx): ..."
git push origin main

# ─── 服务器 ───
ssh lyctrides
/root/deploy-website.sh         # = cd /var/www/lyctai-website && git pull + 验证

# 或裸命令版（不通过脚本）：
# cd /var/www/lyctai-website && git pull --ff-only origin main
```

`deploy-website.sh` 会自动 curl 本地 + 线上 title 对比，**不一致时提示去 Cloudflare 清缓存**。Cloudflare 清缓存路径：dashboard → 选 lyctai.com → Caching → Configuration → Purge Everything。

### 回滚（如果新版有问题）

```bash
ssh lyctrides
cd /var/www/lyctai-website
git log --oneline | head -5      # 看历史
git reset --hard <good-commit>   # 回滚到之前 commit
```

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

### A. 服务器 24h 观察期后清理

```bash
ssh lyctrides
rm -rf /var/www/lyctai-website.bak.20260516-150330       # 5/16 第一次 rsync 备份
rm -rf /var/www/lyctai-website.bak.20260516-150909       # 5/16 deploy.sh 备份
rm -rf /var/www/lyctai-website.pre-swap-20260516-151842  # Step 6 swap 备份
```

### B. 服务器旧 mockup 文件（可删，已 noindex）

```bash
ssh lyctrides
cd /var/www/lyctai-website
rm -f article.html page-a.html page-b.html hero-preview-a.html hero-preview-b.html
git add -u && git commit -m "chore: remove deprecated mockup files" && git push
```

### C. 本地 lyctai-website-repo / lyctai-website-jolly 收尾

Step 7 后只保留一个工作目录，详见 §2 末尾。

---

## 7. 快速诊断手册（出问题时）

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
