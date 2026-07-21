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
   * ⚠️ 待填：在 Google Ads 里为每个动作建转化操作后，把 label 填进来。
   *   路径：Google Ads → 目标 → 转化 → 创建转化操作 → 网站 → 「手动添加代码」
   *   建好后 Google 给出的代码里有 send_to: 'AW-18319511179/AbCdEfGhIjK'
   *   把斜杠后面那串填到下面对应的位置。
   *
   * label 为空时：该动作只 push 到 dataLayer（便于日后接 GA4/GTM），不调 gtag，
   * 不会产生错误，也不会误报转化。
   */
  var LABELS = {
    leadForm: '',   // 联系表单提交成功（最重要，优先配这个）
    phone: '',      // 点击电话号码
    email: '',      // 点击邮箱地址
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
