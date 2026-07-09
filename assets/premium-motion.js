/* ============================================================
   premium-motion.js · LyctRides 高级动效层
   vanilla · 幂等（防重复 init）· 尊重 prefers-reduced-motion
   职责：导航滚动收拢 / 顶部进度条 / 数字滚动 / 标题细线抽出
   不接管既有 .reveal 系统（各页内联脚本已处理）。
   ============================================================ */
(function () {
  if (window.__pmInit) return;
  window.__pmInit = true;

  var reduce = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    var nav = document.querySelector('nav.ios-glass');

    // 2 · 顶部进度发丝线（reduced-motion 下不渲染）
    var bar = null;
    if (!reduce) {
      bar = document.createElement('div');
      bar.id = 'pm-progress';
      bar.setAttribute('aria-hidden', 'true');
      document.body.appendChild(bar);
    }

    // 1 + 2 · 滚动：导航收拢 + 进度条（rAF 节流，与各页已有 onScroll 幂等共存）
    var ticking = false;
    function onScroll() {
      var y = window.pageYOffset || document.documentElement.scrollTop || 0;
      if (nav) {
        if (y > 8) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
      }
      if (bar) {
        var h = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
      }
      ticking = false;
    }
    function reqScroll() { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }
    window.addEventListener('scroll', reqScroll, { passive: true });
    window.addEventListener('resize', reqScroll, { passive: true });
    onScroll();

    var hasIO = 'IntersectionObserver' in window;

    // 4 · 标题细线抽出（.pm-rule → .pm-in）
    var rules = document.querySelectorAll('.pm-rule');
    if (rules.length) {
      if (reduce || !hasIO) {
        rules.forEach(function (el) { el.classList.add('pm-in'); });
      } else {
        var rio = new IntersectionObserver(function (es) {
          es.forEach(function (e) {
            if (e.isIntersecting) { e.target.classList.add('pm-in'); rio.unobserve(e.target); }
          });
        }, { rootMargin: '0px 0px -60px 0px', threshold: 0.2 });
        rules.forEach(function (el) { rio.observe(el); });
      }
    }

    // 3 · 数字滚动（[data-count]，纯文本节点；保留前后缀）
    function runCount(el) {
      var raw = (el.textContent || '').trim();
      var m = raw.match(/^(\D*)(\d[\d,]*)(.*)$/);
      if (!m) return;
      var prefix = m[1], target = parseInt(m[2].replace(/,/g, ''), 10), suffix = m[3];
      if (reduce) { el.textContent = prefix + target.toLocaleString() + suffix; return; }
      var dur = 1300, start = null;
      function tick(t) {
        if (start === null) start = t;
        var p = Math.min((t - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
        el.textContent = prefix + Math.round(target * eased).toLocaleString() + suffix;
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = prefix + target.toLocaleString() + suffix;
      }
      requestAnimationFrame(tick);
    }
    var counters = document.querySelectorAll('[data-count]');
    if (counters.length) {
      if (reduce || !hasIO) {
        counters.forEach(runCount);
      } else {
        var cio = new IntersectionObserver(function (es) {
          es.forEach(function (e) {
            if (e.isIntersecting) { runCount(e.target); cio.unobserve(e.target); }
          });
        }, { threshold: 0.6 });
        counters.forEach(function (el) { cio.observe(el); });
      }
    }
  });
})();
