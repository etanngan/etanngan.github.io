/* Cantonese Best BBQ 港式燒味大王 — concept preview behaviour
   - open / closed status in Markham time, hours table with today highlighted
   - mobile nav, scroll reveals */
(function () {
  'use strict';
  var T = MPi18n.t;
  document.documentElement.classList.add('js');

  /* hours (0 = Sunday) from the Google listing: daily 11 am – 7 pm; to confirm with the shop */
  var HOURS = { 0: [11, 19], 1: [11, 19], 2: [11, 19], 3: [11, 19], 4: [11, 19], 5: [11, 19], 6: [11, 19] };
  var ORDER_DAYS = [1, 2, 3, 4, 5, 6, 0];
  function locale() { return { en: 'en-CA', 'zh-Hant': 'zh-HK', 'zh-Hans': 'zh-CN' }[MPi18n.lang] || 'en-CA'; }
  function hourLabel(h) {
    var l = MPi18n.lang, h12 = h % 12 === 0 ? 12 : h % 12;
    var part = h < 12 ? '上午' : h === 12 ? '中午' : h < 18 ? '下午' : '晚上';
    if (l === 'zh-Hant') return part + h12 + '時';
    if (l === 'zh-Hans') return part + h12 + '点';
    return h === 12 ? 'noon' : h12 + (h < 12 ? ' am' : ' pm');
  }
  function rangeLabel(r) { return MPi18n.lang === 'en' ? hourLabel(r[0]) + ' – ' + hourLabel(r[1]) : hourLabel(r[0]) + '至' + hourLabel(r[1]); }
  function dayName(d) { return new Intl.DateTimeFormat(locale(), { weekday: 'long' }).format(new Date(Date.UTC(2023, 0, 1 + d, 12))); }
  function markhamNow() {
    var o = {};
    new Intl.DateTimeFormat('en-US', { timeZone: 'America/Toronto', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' })
      .formatToParts(new Date()).forEach(function (p) { o[p.type] = p.value; });
    return { day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(o.weekday), mins: (+o.hour % 24) * 60 + (+o.minute) };
  }
  function renderStatus() {
    var el = document.getElementById('status');
    if (!el) return;
    var now = markhamNow(), r = HOURS[now.day], open = !!r && now.mins >= r[0] * 60 && now.mins < r[1] * 60, txt;
    if (open) txt = T('st.open').replace('{t}', hourLabel(r[1]));
    else if (r && now.mins < r[0] * 60) txt = T('st.closed').replace('{d}', T('st.today')).replace('{t}', hourLabel(r[0]));
    else {
      for (var i = 1; i <= 7; i++) {
        var d = (now.day + i) % 7;
        if (HOURS[d]) { txt = T('st.closed').replace('{d}', i === 1 ? T('st.tomorrow') : dayName(d)).replace('{t}', hourLabel(HOURS[d][0])); break; }
      }
    }
    el.querySelector('span').textContent = txt;
    el.classList.toggle('is-open', open);
    el.classList.toggle('is-closed', !open);
  }
  function renderHours() {
    var tb = document.getElementById('hours-body');
    if (!tb) return;
    var today = markhamNow().day;
    tb.innerHTML = '';
    ORDER_DAYS.forEach(function (d) {
      var tr = document.createElement('tr'), a = document.createElement('td'), b = document.createElement('td');
      if (d === today) { tr.className = 'today'; a.setAttribute('data-today', T('st.todaytag')); }
      a.textContent = dayName(d);
      b.textContent = rangeLabel(HOURS[d]);
      tr.appendChild(a); tr.appendChild(b); tb.appendChild(tr);
    });
  }

  /* nav */
  var head = document.querySelector('.head'), nav = document.getElementById('nav'), burger = document.querySelector('.burger');
  function setHeadH() { if (head) document.documentElement.style.setProperty('--head-h', Math.round(head.getBoundingClientRect().bottom) + 'px'); }
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = burger.getAttribute('aria-expanded') !== 'true';
      setHeadH();
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', T(open ? 'nav.close' : 'nav.open'));
      nav.classList.toggle('open', open);
    });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) { burger.setAttribute('aria-expanded', 'false'); nav.classList.remove('open'); } });
    window.addEventListener('scroll', setHeadH, { passive: true });
  }

  /* reveal */
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.rv').forEach(function (el, i) { el.style.transitionDelay = (i % 4) * 70 + 'ms'; io.observe(el); });
  } else {
    document.querySelectorAll('.rv').forEach(function (el) { el.classList.add('in'); });
  }

  function all() { renderStatus(); renderHours(); setHeadH(); }
  document.addEventListener('mp:langchange', all);
  all();
  setInterval(renderStatus, 60000);
  window.addEventListener('resize', setHeadH);
})();
