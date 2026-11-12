/* Stillwater: phone menu, today's hours on the appointment card (America/Toronto time, holiday-aware),
   the hours table's "today" mark, map language, and lang attributes for the other-language name. No libraries. */
(function () {
  'use strict';
  var I = window.MPi18n, doc = document;

  /* ---------- schedule (shared with book.js through window.StillwaterHours) ---------- */
  var WEEK = [null, [9, 20], [9, 20], [9, 20], [9, 20], [9, 20], [9, 16]]; // index = day of week, 0 = Sunday (closed)
  var SPECIAL = {
    '2026-12-24': [9, 14], '2026-12-25': null, '2026-12-26': null, '2026-12-31': [9, 14], '2027-01-01': null,
    '2027-02-15': null, '2027-03-26': null, '2027-05-24': null, '2027-07-01': null, '2027-08-02': null,
    '2027-09-06': null, '2027-10-11': null, '2027-12-24': [9, 14], '2027-12-25': null, '2027-12-27': null, '2027-12-28': null
  };
  function ymd(y, m, d) { return y + '-' + String(m).padStart(2, '0') + '-' + String(d).padStart(2, '0'); }
  function keyOf(dt) { return ymd(dt.getFullYear(), dt.getMonth() + 1, dt.getDate()); }
  function hoursFor(dt) {
    var k = keyOf(dt);
    if (Object.prototype.hasOwnProperty.call(SPECIAL, k)) return SPECIAL[k];
    return WEEK[dt.getDay()];
  }
  // "now" as a wall-clock date in Toronto, whatever the visitor's own time zone
  function torontoNow() {
    var p = {};
    try {
      new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Toronto', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' })
        .formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });
      return new Date(+p.year, +p.month - 1, +p.day, +p.hour % 24, +p.minute);
    } catch (e) { return new Date(); }
  }
  function fmtTime(h) {
    var L = I.lang;
    if (L === 'en') return (h % 12 || 12) + ':00 ' + (h < 12 ? 'am' : 'pm');
    if (L === 'zh-Hant') return (h < 12 ? '上午' : h < 18 ? '下午' : '晚上') + (h % 12 || 12) + ':00';
    return h + ':00';
  }
  function fmtRange(r) { return I.lang === 'zh-Hans' ? fmtTime(r[0]) + '–' + fmtTime(r[1]) : fmtTime(r[0]) + ' – ' + fmtTime(r[1]); }
  var DAYS = {
    en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    'zh-Hant': ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    'zh-Hans': ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  };
  var SHORT = { en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], 'zh-Hant': ['日', '一', '二', '三', '四', '五', '六'], 'zh-Hans': ['日', '一', '二', '三', '四', '五', '六'] };
  var RING = '<svg class="ring" viewBox="0 0 100 60" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path pathLength="1" d="M14 36C9 18 46 5 78 11c19 4 22 27 2 37-22 11-66 9-72-9C4 25 24 10 47 9"/></svg>';
  // the printed Mon–Sat row with one day circled (shared with book.js)
  function dayStrip(dow, noPre) {
    var L = I.lang, h = '';
    var pre = noPre ? '' : I.t('card.days.pre');
    if (pre) h += '<li class="pre">' + pre + '</li>';
    for (var i = 1; i <= 6; i++) h += '<li' + (i === dow ? ' class="on"' : '') + '>' + SHORT[L][i] + (i === dow ? RING : '') + '</li>';
    return h;
  }
  window.StillwaterHours = { hoursFor: hoursFor, torontoNow: torontoNow, fmtTime: fmtTime, fmtRange: fmtRange, keyOf: keyOf, DAYS: DAYS, SHORT: SHORT, dayStrip: dayStrip };

  /* ---------- the card: today ---------- */
  function renderToday() {
    var now = torontoNow(), today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var dow = today.getDay(), r = hoursFor(today), mins = now.getHours() * 60 + now.getMinutes();
    var strip = doc.getElementById('days');
    if (strip) strip.innerHTML = dayStrip(dow);
    var sr = doc.getElementById('today-sr');
    if (sr) sr.textContent = I.t('today.sr').replace('{day}', DAYS[I.lang][dow]);
    var out = doc.getElementById('today-hours');
    if (!out) return;
    var main = r ? fmtRange(r) : I.t('today.closed');
    var next = '';
    if (!r || mins >= r[1] * 60) {
      // find the next day we open
      for (var i = 1; i <= 10; i++) {
        var d = new Date(today); d.setDate(d.getDate() + i);
        var h = hoursFor(d);
        if (h) {
          var dayName = i === 1 ? I.t('today.tomorrow') : DAYS[I.lang][d.getDay()];
          next = I.t('today.next').replace('{day}', dayName).replace('{time}', fmtTime(h[0]));
          break;
        }
      }
    }
    out.innerHTML = '';
    var ink = doc.createElement('span'); ink.className = 'ink'; ink.textContent = main; // the pen underlines it on the home card
    out.appendChild(ink);
    if (next) { var s = doc.createElement('small'); s.textContent = next; out.appendChild(s); }
  }

  /* ---------- hours table: mark today ---------- */
  function markHours() {
    var now = torontoNow(), key = keyOf(now), day = String(now.getDay()), holiday = false;
    doc.querySelectorAll('.hours tr[data-date]').forEach(function (tr) {
      var on = tr.getAttribute('data-date').split(' ').indexOf(key) > -1;
      tr.classList.toggle('is-today', on);
      if (on) holiday = true;
    });
    doc.querySelectorAll('.hours tr[data-days]').forEach(function (tr) {
      var on = !holiday && tr.getAttribute('data-days').split(',').indexOf(day) > -1;
      tr.classList.toggle('is-today', on);
    });
    doc.querySelectorAll('.hours tr th').forEach(function (th) { th.setAttribute('data-today', I.t('card.today')); });
  }

  /* ---------- the other-language name keeps the right lang attribute ---------- */
  function otherLang() {
    doc.querySelectorAll('[data-other-lang]').forEach(function (el) {
      el.setAttribute('lang', I.lang === 'en' ? 'zh-Hant-HK' : 'en');
    });
    doc.querySelectorAll('.brand-zh').forEach(function (el) { el.setAttribute('lang', I.lang === 'zh-Hans' ? 'zh-Hans' : 'zh-Hant-HK'); });
  }

  /* ---------- map in the visitor's language ---------- */
  function mapLang() {
    var f = doc.querySelector('iframe[data-map-q]'); if (!f) return;
    var hl = { en: 'en', 'zh-Hant': 'zh-TW', 'zh-Hans': 'zh-CN' }[I.lang] || 'en';
    var src = 'https://maps.google.com/maps?q=' + encodeURIComponent(f.getAttribute('data-map-q')) + '&z=15&hl=' + hl + '&output=embed';
    if (f.getAttribute('src') !== src) f.setAttribute('src', src);
  }

  /* ---------- phone menu ---------- */
  var btn = doc.querySelector('.menu-btn'), nav = doc.getElementById('nav');
  function setNav(open) {
    if (!btn) return;
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    doc.body.classList.toggle('nav-open', open);
  }
  if (btn && nav) {
    btn.addEventListener('click', function () { setNav(btn.getAttribute('aria-expanded') !== 'true'); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setNav(false); });
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') { setNav(false); btn.focus(); }
    });
    doc.addEventListener('click', function (e) {
      if (btn.getAttribute('aria-expanded') === 'true' && !e.target.closest('.site-head')) setNav(false);
    });
    window.addEventListener('resize', function () { if (window.innerWidth >= 1000) setNav(false); });
  }

  function all() { renderToday(); markHours(); otherLang(); mapLang(); }
  all();
  doc.addEventListener('mp:langchange', all);

  if (!doc.body.classList.contains('page-home')) return;
  var root = doc.documentElement;

  /* ---------- blinds intro: ends by itself, or on a tap, scroll or key ---------- */
  var intro = root.classList.contains('intro'), EV = ['wheel', 'touchmove', 'keydown', 'pointerdown'];
  function endIntro() { root.classList.add('intro-done'); EV.forEach(function (t) { window.removeEventListener(t, endIntro); }); }
  if (intro) { setTimeout(endIntro, 1600); EV.forEach(function (t) { window.addEventListener(t, endIntro, { passive: true }); }); }
  // the pen marks on the hero card draw once; after that a language switch shows them already drawn
  setTimeout(function () { root.classList.add('drawn'); }, intro ? 3200 : 2000);

  /* ---------- the window light pauses when the hero is off screen ---------- */
  var hero = doc.querySelector('.hero');
  if (hero && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { hero.classList.toggle('is-away', !es[0].isIntersecting); }).observe(hero);
  }

  /* ---------- the fill-in card: circle a service, a day and a time ---------- */
  var pick = doc.getElementById('pick');
  var PRAC = { physio: ['p.jl.n'], massage: ['p.mc.n', 'p.dh.n'], acupuncture: ['p.wz.n'], osteo: ['p.sm.n'] };
  var FEE = { physio: 'svc.phy.f', massage: 'svc.mas.f', acupuncture: 'svc.acu.f', osteo: 'svc.ost.f' };
  function fmtDay(d) {
    try { return new Intl.DateTimeFormat({ en: 'en-CA', 'zh-Hant': 'zh-HK', 'zh-Hans': 'zh-CN' }[I.lang], { weekday: 'long', month: 'long', day: 'numeric' }).format(d); }
    catch (e) { return keyOf(d); }
  }
  // the next open day with this weekday, from tomorrow on (the request form's own rule)
  function nextDate(dow) {
    var n = torontoNow(), d = new Date(n.getFullYear(), n.getMonth(), n.getDate() + 1);
    for (var i = 0; i < 21; i++, d.setDate(d.getDate() + 1)) if (d.getDay() === dow && hoursFor(d)) return new Date(d);
    return null;
  }
  function picked(name) { var c = pick.querySelector('input[name="' + name + '"]:checked'); return c ? c.value : ''; }
  function write(el, nodes, animate) {
    el.textContent = '';
    nodes.forEach(function (n) { el.appendChild(n); });
    if (animate) { el.classList.remove('inking'); void el.offsetWidth; el.classList.add('inking'); }
  }
  function txt(s, cls) { var e = doc.createElement(cls ? 'small' : 'span'); if (cls) e.className = cls; e.textContent = s; return e; }
  function buildDays() {
    var box = doc.getElementById('pick-days');
    if (!box.children.length) {
      for (var i = 1; i <= 6; i++) box.insertAdjacentHTML('beforeend', '<label class="opt"><input type="radio" name="date" value=""><span></span></label>');
      pick.querySelectorAll('.opt').forEach(function (l) { l.insertAdjacentHTML('beforeend', RING); });
    }
    box.querySelectorAll('input').forEach(function (inp, k) {
      var d = nextDate(k + 1);
      if (!d && inp.checked) inp.checked = false;
      inp.value = d ? keyOf(d) : ''; inp.disabled = !d;
      inp.nextElementSibling.textContent = SHORT[I.lang][k + 1];
      inp.setAttribute('aria-label', d ? fmtDay(d) : DAYS[I.lang][k + 1]);
    });
  }
  function update(e) {
    var svc = picked('service'), key = picked('date');
    var d = key ? new Date(+key.slice(0, 4), +key.slice(5, 7) - 1, +key.slice(8, 10)) : null, dow = d ? d.getDay() : -1, hrs = d ? hoursFor(d) : null;
    var eve = pick.querySelector('input[value="eve"]'), noEve = !!(hrs && hrs[1] < 18);
    eve.disabled = noEve; if (noEve) eve.checked = false;
    var ev = picked('win') === 'eve', who = e && e.target && e.target.name;
    write(doc.getElementById('pick-date'), d ? [txt(fmtDay(d))] : [], who === 'date');
    var withNodes = [], fee = doc.getElementById('pick-fee');
    if (!svc) withNodes.push(txt(I.t('pick.first'), 'hint'));
    else {
      var names = PRAC[svc];
      if (svc === 'massage' && ev && (dow === 1 || dow === 3)) names = ['p.mc.n'];
      else if (svc === 'massage' && ((ev && dow === 5) || dow === 6)) names = ['p.dh.n'];
      withNodes.push(txt(names.map(function (k) { return I.t(k); }).join(I.t('pick.or'))));
      var note = svc === 'physio' && ev && dow > 0 && dow !== 2 && dow !== 4 ? I.t('pick.n.phy')
        : svc === 'massage' && ev && (dow === 2 || dow === 4) ? I.t('pick.n.mas')
        : svc === 'acupuncture' && dow === 6 ? I.t('pick.n.acu')
        : svc === 'osteo' && (dow === 2 || dow === 4 || dow === 5) ? I.t('pick.n.ost')
        : noEve ? I.t('bk.close.note').replace('{time}', fmtTime(hrs[1])) : '';
      if (note) withNodes.push(txt(note, 'note'));
    }
    write(doc.getElementById('pick-with'), withNodes, !!who);
    fee.innerHTML = svc ? I.t(FEE[svc]) : ''; // trusted, author-written string (osteo carries a nowrap span)
    if (who === 'service') { fee.classList.remove('inking'); void fee.offsetWidth; fee.classList.add('inking'); }
  }
  if (pick) {
    buildDays(); update();
    pick.addEventListener('change', update);
    doc.addEventListener('mp:langchange', function () { buildDays(); update(); });
  }

  /* ---------- scroll motion with GSAP ScrollTrigger (3.12.5, loaded with defer) ----------
     Without GSAP, or with reduced motion, the page stays a normal page: a still room with the
     day as a plain list, every photo open, nothing pinned. Slow eases and scrub lag only. */
  var dayP = 0, lastHour = -1;
  function setHour(p, force) {
    dayP = p;
    var h = 9 + Math.round(p * 11), clock = doc.getElementById('clock');
    if (h === lastHour && !force) return;
    lastHour = h;
    if (clock) clock.textContent = fmtTime(h);
    var part = h < 12 ? 0 : h < 17 ? 1 : h < 20 ? 2 : 3;
    doc.querySelectorAll('.parts li').forEach(function (li, i) { li.classList.toggle('on', i === part); });
  }
  function initMotion() {
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    var head = doc.querySelector('.site-head');
    var top = function () { return 'top ' + (head ? head.offsetHeight : 61) + 'px'; };
    gsap.matchMedia().add({ mobile: '(max-width: 999px)', motion: '(prefers-reduced-motion: no-preference)' }, function (ctx) {
      if (!ctx.conditions.motion) return;
      var mobile = ctx.conditions.mobile;
      root.classList.add('gsap'); // before the pin is measured: switches the room to its pinned layout

      /* hero: the card lifts a little and the window light slides as you leave */
      gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.2 } })
        .to('.hero-card', { y: mobile ? -20 : -56, ease: 'none' }, 0)
        .to('.hero .sun', { xPercent: mobile ? 6 : 10, ease: 'none' }, 0);

      /* service photos open like blinds */
      gsap.utils.toArray('.svc .pic').forEach(function (el, i) {
        gsap.fromTo(el, { '--slat': '16px' }, { '--slat': '0px', duration: 1.6, ease: 'power2.inOut', delay: mobile ? 0 : (i % 2) * 0.18,
          scrollTrigger: { trigger: el, start: 'top 90%' } });
      });

      /* a day in the room: pinned while the clock runs from 9 am to 8 pm */
      if (doc.getElementById('day')) {
        gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: '.day-pin', start: top, end: mobile ? '+=200%' : '+=240%',
          pin: true, scrub: 1, invalidateOnRefresh: true, onUpdate: function (self) { setHour(self.progress); } } })
          .fromTo('.r-sun', { xPercent: -16 }, { xPercent: 22, duration: 1 }, 0)
          .to('.r-sun', { opacity: 0.45, duration: 0.2 }, 0.2)
          .to('.r-sun', { opacity: 0.9, duration: 0.2 }, 0.48)
          .to('.r-sun', { opacity: 0, duration: 0.16 }, 0.7)
          .fromTo('.r-warm', { opacity: 0 }, { opacity: 1, duration: 0.25 }, 0.45)
          .to('.r-warm', { opacity: 0.3, duration: 0.2 }, 0.75)
          .fromTo('.r-dusk', { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.68)
          .fromTo('.r-lamp', { opacity: 0 }, { opacity: 1, duration: 0.22 }, 0.74);
      }

      /* the back of the card, then the fill-in card, slide square on the counter */
      [['.back-card', 2.2], ['.pick-card', 3]].forEach(function (c) {
        gsap.fromTo(c[0], { x: mobile ? 14 : 60, rotation: mobile ? c[1] / 2 : c[1] }, { x: 0, rotation: 0, ease: 'none',
          scrollTrigger: { trigger: c[0], start: 'top bottom', end: 'top 40%', scrub: 1.2 } });
      });

      return function () { root.classList.remove('gsap'); setHour(0, true); };
    });
    /* fonts change text heights; measure again once they are in */
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(function () { ScrollTrigger.refresh(); });
  }
  doc.addEventListener('mp:langchange', function () {
    setHour(dayP, true);
    if (window.ScrollTrigger && root.classList.contains('gsap')) ScrollTrigger.refresh(); // text lengths changed
  });
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', initMotion); else initMotion();
})();
