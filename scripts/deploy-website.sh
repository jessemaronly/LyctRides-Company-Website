#!/bin/bash
# ───────────────────────────────────────────────────────────────────
# LyctRides 官网一键部署（在生产服务器上跑）
#
# 用法：
#   ssh lyctrides
#   /root/deploy-website.sh
#
# 流程：
#   1. /root/lyctai-website/ 拉最新 git
#   2. 备份当前 /var/www/lyctai-website/
#   3. rsync 同步（含清理旧文件）
#   4. 提示去 Cloudflare 清缓存（必要时）
#   5. 自动 curl 验证 title
#
# 安全：
#   - 任何步骤失败立即停止（set -e）
#   - 备份保留至少 3 份（自动清理 4+ 份旧备份）
# ───────────────────────────────────────────────────────────────────

set -euo pipefail

SRC=/root/lyctai-website
DST=/var/www/lyctai-website
BAK_PREFIX=/var/www/lyctai-website.bak
TS=$(date +%Y%m%d-%H%M%S)
DOMAIN=https://www.lyctai.com

BLUE='\033[1;34m'; GREEN='\033[1;32m'; YELLOW='\033[1;33m'; NC='\033[0m'
log()  { echo -e "${BLUE}▶${NC} $1"; }
ok()   { echo -e "${GREEN}✓${NC} $1"; }
warn() { echo -e "${YELLOW}!${NC} $1"; }

# ─── ① git pull ───
log "git pull /root/lyctai-website"
cd "$SRC"
OLD_COMMIT=$(git rev-parse HEAD)
git pull --ff-only origin claude/jolly-chatelet-049c03
NEW_COMMIT=$(git rev-parse HEAD)

if [ "$OLD_COMMIT" = "$NEW_COMMIT" ]; then
  warn "git 没新 commit (HEAD 仍是 $NEW_COMMIT 的前 7 位: $(echo $NEW_COMMIT | cut -c1-7))"
  echo "  即便如此，rsync 仍会执行以确保 /var/www 与 /root 一致。"
fi

# ─── ② 备份 /var/www ───
log "备份 $DST → ${BAK_PREFIX}.${TS}"
cp -a "$DST" "${BAK_PREFIX}.${TS}"
ok "备份完成"

# ─── ③ rsync 同步 ───
log "rsync /root → /var/www (--delete 清理旧文件)"
rsync -a --delete \
  --exclude='.git' --exclude='.gitignore' \
  --exclude='preview-all.html' --exclude='*.md' \
  --exclude='scripts' \
  "$SRC/" "$DST/"
ok "rsync 完成"

# ─── ④ 验证（本地直 curl 绕 Cloudflare） ───
LOCAL_TITLE=$(curl -s -H "Host: lyctai.com" http://localhost/ | grep -oE '<title>[^<]+</title>' | head -1)
log "nginx 本地 serve: $LOCAL_TITLE"

# ─── ⑤ 验证线上 ───
sleep 2
ONLINE_TITLE=$(curl -s -A "Mozilla/5.0" "$DOMAIN/?v=$TS" | grep -oE '<title>[^<]+</title>' | head -1)
log "线上 $DOMAIN: $ONLINE_TITLE"

if [ "$LOCAL_TITLE" = "$ONLINE_TITLE" ]; then
  ok "本地 vs 线上一致 · 部署成功"
else
  warn "本地与线上 title 不同 - Cloudflare 缓存可能还没刷"
  warn "→ 去 Cloudflare dashboard → Caching → Purge Everything"
fi

# ─── ⑥ 清理旧备份（保留最近 3 份） ───
OLD_BAKS=$(ls -dt ${BAK_PREFIX}.* 2>/dev/null | tail -n +4)
if [ -n "$OLD_BAKS" ]; then
  log "清理旧备份（保留最近 3 份）："
  echo "$OLD_BAKS" | while read d; do
    echo "  rm -rf $d"
    rm -rf "$d"
  done
  ok "旧备份清理完成"
fi

echo
ok "deploy done · commit ${NEW_COMMIT:0:7}"
