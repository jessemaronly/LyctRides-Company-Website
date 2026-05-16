#!/bin/bash
# ───────────────────────────────────────────────────────────────────
# LyctRides 官网一键部署（在生产服务器上跑）
#
# 用法：
#   ssh lyctrides
#   /root/deploy-website.sh
#
# 流程（Step 6 之后）：
#   1. cd /var/www/lyctai-website && git pull
#   2. 验证 title 本地 + 线上一致
#   3. 不一致时提示去 Cloudflare 清缓存
#
# nginx 直接 serve /var/www/lyctai-website（git checkout 本身），
# 不需要 rsync，git pull 即上线。
#
# 回滚（如有问题）：
#   cd /var/www/lyctai-website && git reset --hard <previous-commit>
# ───────────────────────────────────────────────────────────────────

set -euo pipefail

REPO=/var/www/lyctai-website
BRANCH=claude/jolly-chatelet-049c03
DOMAIN=https://www.lyctai.com

BLUE='\033[1;34m'; GREEN='\033[1;32m'; YELLOW='\033[1;33m'; NC='\033[0m'
log()  { echo -e "${BLUE}▶${NC} $1"; }
ok()   { echo -e "${GREEN}✓${NC} $1"; }
warn() { echo -e "${YELLOW}!${NC} $1"; }

# ─── ① git pull ───
log "git pull $REPO ($BRANCH)"
cd "$REPO"
OLD=$(git rev-parse --short HEAD)
git pull --ff-only origin "$BRANCH"
NEW=$(git rev-parse --short HEAD)

if [ "$OLD" = "$NEW" ]; then
  ok "no change · HEAD $NEW"
  exit 0
fi

ok "pulled $OLD → $NEW"

# ─── ② 验证 nginx 本地直 serve ───
LOCAL_TITLE=$(curl -s -H "Host: lyctai.com" http://localhost/ | grep -oE '<title>[^<]+</title>' | head -1)
log "nginx 本地: $LOCAL_TITLE"

# ─── ③ 验证线上（带 cache buster） ───
sleep 2
ONLINE_TITLE=$(curl -s -A "Mozilla/5.0" "$DOMAIN/?v=$NEW" | grep -oE '<title>[^<]+</title>' | head -1)
log "线上 $DOMAIN: $ONLINE_TITLE"

# ─── ④ 一致性判断 ───
if [ "$LOCAL_TITLE" = "$ONLINE_TITLE" ]; then
  ok "deploy done · $NEW"
else
  warn "本地 vs 线上 title 不同 — Cloudflare 边缘缓存可能未刷"
  warn "→ Cloudflare dashboard → Caching → Configuration → Purge Everything"
fi
