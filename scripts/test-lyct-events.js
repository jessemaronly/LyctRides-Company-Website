#!/usr/bin/env node
/*
 * assets/lyct-events.js 的回归测试。
 *
 * 跑法：node scripts/test-lyct-events.js（无需依赖，退出码非 0 即失败）
 *
 * 为什么需要它：转化埋点出错是静默的——不会报错、页面照常运行，只是数据悄悄错掉，
 * 而这正是本次要修的原问题（转化动作跟错了动作，后台有数、实际零询盘）。
 * 所以这里用最小 DOM stub 把关键行为钉死，避免以后改动重蹈覆辙。
 */
'use strict';

const fs = require('fs');
const path = require('path');

const SRC = fs.readFileSync(
  path.join(__dirname, '..', 'assets', 'lyct-events.js'),
  'utf8'
);

function makeEnv() {
  const listeners = {};
  const doc = {
    readyState: 'complete',
    addEventListener: (ev, fn) => {
      (listeners[ev] = listeners[ev] || []).push(fn);
    },
    _fire: (ev, target) => (listeners[ev] || []).forEach((fn) => fn({ target })),
  };
  const win = { document: doc, dataLayer: [], gtagCalls: [] };
  win.gtag = function () {
    win.gtagCalls.push([...arguments]);
  };
  return { win, doc };
}

const run = (src, win, doc) => new Function('window', 'document', src)(win, doc);
const link = (href) => ({ closest: () => ({ getAttribute: () => href }) });
const withLabel = (key, val) => SRC.replace(`${key}: ''`, `${key}: '${val}'`);

let pass = 0;
let fail = 0;
const check = (name, cond) => {
  if (cond) {
    pass++;
    console.log('  ✅ ' + name);
  } else {
    fail++;
    console.log('  ❌ ' + name);
  }
};

console.log('\n[1] LABELS 为空（合并后的初始状态）— 绝不能调 gtag');
{
  const { win, doc } = makeEnv();
  run(SRC, win, doc);
  win.LyctTracking.reportLeadForm({ leadNo: 'L-2026-001' });
  check('dataLayer 记录了 lyct_leadForm', win.dataLayer.some((e) => e.event === 'lyct_leadForm'));
  check('未调用 gtag（label 未配就上报=误报）', win.gtagCalls.length === 0);
}

console.log('\n[2] LABELS 填好后 — 上报格式正确');
{
  const { win, doc } = makeEnv();
  run(withLabel('leadForm', 'AbCdEfGhIjK'), win, doc);
  win.LyctTracking.reportLeadForm({ leadNo: 'L-2026-002' });
  check('调用 gtag 恰好一次', win.gtagCalls.length === 1);
  const [ev, name, payload] = win.gtagCalls[0] || [];
  check("事件名为 'conversion'", ev === 'event' && name === 'conversion');
  check('send_to 拼接正确', payload && payload.send_to === 'AW-18319511179/AbCdEfGhIjK');
  check('leadNo 进 transaction_id（防重复计数）', payload && payload.transaction_id === 'L-2026-002');
}

console.log('\n[3] 后端未返回 leadNo — 不能崩');
{
  const { win, doc } = makeEnv();
  run(withLabel('leadForm', 'XYZ'), win, doc);
  let ok = true;
  try {
    win.LyctTracking.reportLeadForm({});
    win.LyctTracking.reportLeadForm(undefined);
  } catch (e) {
    ok = false;
  }
  check('空数据不抛异常', ok);
  check('无 transaction_id 时仍上报', win.gtagCalls.length === 2);
}

console.log('\n[4] tel: / mailto: 点击委托');
{
  const { win, doc } = makeEnv();
  run(withLabel('phone', 'PHONE1').replace("email: ''", "email: 'MAIL1'"), win, doc);
  doc._fire('click', link('tel:+8615822918415'));
  doc._fire('click', link('mailto:bd@lyctai.com'));
  doc._fire('click', link('/services.html'));
  check('tel: 上报', win.gtagCalls.some((c) => c[2].send_to.endsWith('/PHONE1')));
  check('mailto: 上报', win.gtagCalls.some((c) => c[2].send_to.endsWith('/MAIL1')));
  check('普通链接不上报（只 2 次）', win.gtagCalls.length === 2);
}

console.log('\n[5] gtag 被广告拦截插件屏蔽 — 必须静默降级');
{
  const { win, doc } = makeEnv();
  delete win.gtag;
  run(withLabel('leadForm', 'ABC'), win, doc);
  let ok = true;
  try {
    win.LyctTracking.reportLeadForm({ leadNo: 'X' });
  } catch (e) {
    ok = false;
  }
  check('不抛异常（否则会打断表单提交流程）', ok);
  check('dataLayer 仍记录（日后可接 GA4/GTM 补数）', win.dataLayer.some((e) => e.event === 'lyct_leadForm'));
}

console.log('\n' + '='.repeat(46));
console.log(`结果: ${pass} 通过 / ${fail} 失败`);
process.exit(fail === 0 ? 0 : 1);
