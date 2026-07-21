/*
 * LyctRides — Google Ads 转化跟踪
 *
 * 背景：账户此前唯一的转化动作 "Submit lead form" 实际定义为「访问了以
 * www.lyctai.com/contact.html 开头的页面」——跟的是浏览联系页，不是真的提交表单。
 * 结果是后台显示有转化、实际零询盘。本文件负责上报真实的转化动作。
 *
 * 依赖：全站 <head> 里已装的 gtag.js（AW-18319511179）。本文件不重复加载 gtag。
 * 若 gtag 未就绪（广告拦截插件、脚本加载失败），所有函数静默降级，不影响页面功能。
 */
(function (window, document) {
  'use strict';

  var ADS_ID = 'AW-18319511179';

  /*
   * Google Ads 转化操作的 label（send_to 里斜杠后面那串）。
   *   新增时：Google Ads → 目标 → 转化 → 创建转化操作 → 网站 →「手动（添加代码）」
   *   ⚠️ 务必选「手动」而不是「自动」——自动模式会让 Google 自己猜转化条件，
   *   账户原来那个"跟踪访问 contact.html 页面"的假转化就是这么来的。
   *   建好后在「查看事件代码段」里取 send_to: 'AW-18319511179/xxxx' 的 xxxx。
   *
   * label 为空时：该动作只 push 到 dataLayer（便于日后接 GA4/GTM），不调 gtag，
   * 不会产生错误，也不会误报转化。
   */
  var LABELS = {
    // 「Contact Form Submit」· 2026-07-21 建 · 类别=提交潜在客户表单 · 计数=仅一次
    leadForm: 'wXdTCKHogdQcEIudtp9E',
    phone: '',      // 点击电话号码 —— 待建转化操作后填
    email: '',      // 点击邮箱地址 —— 待建转化操作后填
  };

  function hasGtag() {
    return typeof window.gtag === 'function';
  }

  function pushDataLayer(eventName, params) {
    window.dataLayer = window.dataLayer || [];
    var payload = { event: eventName };
    for (var k in params) {
      if (Object.prototype.hasOwnProperty.call(params, k)) payload[k] = params[k];
    }
    window.dataLayer.push(payload);
  }

  /**
   * 上报一次转化。
   * @param {string} key    LABELS 里的键
   * @param {object} [params] 附加参数（value/currency/transaction_id 等）
   */
  function report(key, params) {
    params = params || {};
    pushDataLayer('lyct_' + key, params);

    var label = LABELS[key];
    if (!label || !hasGtag()) return;

    var payload = { send_to: ADS_ID + '/' + label };
    for (var k in params) {
      if (Object.prototype.hasOwnProperty.call(params, k)) payload[k] = params[k];
    }
    window.gtag('event', 'conversion', payload);
  }

  /**
   * 表单提交成功后调用。由 contact.html 在 fetch 成功回调里触发。
   * @param {object} [data] 后端返回体，含 leadNo 时用作 transaction_id 去重
   */
  function reportLeadForm(data) {
    var params = {};
    if (data && data.leadNo) params.transaction_id = String(data.leadNo);
    report('leadForm', params);
  }

  /*
   * 全站自动绑定：点击电话 / 邮箱也是真实的询盘意图，一并上报。
   * 用事件委托挂在 document 上，动态插入的链接同样生效。
   */
  function bindContactClicks() {
    document.addEventListener(
      'click',
      function (e) {
        var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
        if (!a) return;
        var href = (a.getAttribute('href') || '').toLowerCase();
        if (href.indexOf('tel:') === 0) report('phone');
        else if (href.indexOf('mailto:') === 0) report('email');
      },
      true
    );
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindContactClicks);
  } else {
    bindContactClicks();
  }

  // 暴露给页面内联脚本调用
  window.LyctTracking = {
    reportLeadForm: reportLeadForm,
    report: report,
  };
})(window, document);
