/* Maple Bridge: phone menu, today's hours in Toronto time, today's row in the hours table, map language,
   the phone action bar, and on the home page the fee sum, the page-turn intro and the GSAP scroll motion. */
(function () {
  'use strict';
  var I = window.MPi18n;
  if (!I) return;
  var html = document.documentElement;

  /* ---------- phone menu ---------- */
  var burger = document.querySelector('.burger'), nav = document.getElementById('nav');
  function setNav(open) {
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('data-i18n-attr', 'aria-label:' + (open ? 'nav.close' : 'nav.open'));
    burger.setAttribute('aria-label', I.t(open ? 'nav.close' : 'nav.open'));
    document.body.classList.toggle('nav-open', open);
  }
  if (burger && nav) {
    burger.addEventListener('click', function () { setNav(burger.getAttribute('aria-expanded') !== 'true'); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setNav(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') { setNav(false); burger.focus(); }
    });
    document.addEventListener('click', function (e) {
      if (burger.getAttribute('aria-expanded') === 'true' && !e.target.closest('.site-head')) setNav(false);
    });
    window.addEventListener('resize', function () { if (window.innerWidth >= 1100) setNav(false); });
  }

  /* ---------- opening hours, always in Toronto time ---------- */
  var HOURS = { 0: null, 1: [930, 1230], 2: [930, 1230], 3: [930, 1230], 4: [930, 1230], 5: [930, 1230], 6: [540, 930] };
  var CLOSED = [['2026-12-24', '2027-01-03', 'why.winter'], ['2027-02-15', '2027-02-15', 'why.family'], ['2027-03-26', '2027-03-26', 'why.good']];
  var CAMP = ['2027-03-15', '2027-03-19', [540, 960]];

  function toronto() {
    var o = {};
    try {
      new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Toronto', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
        .formatToParts(new Date()).forEach(function (p) { o[p.type] = p.value; });
    } catch (e) {
      var n = new Date(); o = { year: n.getFullYear(), month: n.getMonth() + 1, day: n.getDate(), hour: n.getHours(), minute: n.getMinutes() };
    }
    return { date: Date.UTC(+o.year, +o.month - 1, +o.day), mins: (+o.hour % 24) * 60 + (+o.minute) };
  }
  function iso(t) { return new Date(t).toISOString().slice(0, 10); }
  function dayInfo(t) {
    var s = iso(t), dow = new Date(t).getUTCDay(), i;
    for (i = 0; i < CLOSED.length; i++) if (s >= CLOSED[i][0] && s <= CLOSED[i][1]) return { closed: true, why: CLOSED[i][2], dow: dow };
    if (s >= CAMP[0] && s <= CAMP[1]) return { span: CAMP[2], camp: true, dow: dow };
    return HOURS[dow] ? { span: HOURS[dow], dow: dow } : { closed: true, dow: dow };
  }
  function clock(m, lang) {
    var h = Math.floor(m / 60), mm = ('0' + (m % 60)).slice(-2);
    if (lang === 'zh-Hans') return h + ':' + mm;
    var h12 = h > 12 ? h - 12 : h;
    if (lang === 'zh-Hant') return (h < 12 ? '上午' : (h < 18 ? '下午' : '晚上')) + h12 + ':' + mm;
    return h12 + ':' + mm + ' ' + (h < 12 ? 'am' : 'pm');
  }
  function range(span, lang) {
    if (lang === 'zh-Hans') return clock(span[0], lang) + '–' + clock(span[1], lang);
    if (lang === 'en' && (span[0] < 720) === (span[1] < 720)) return clock(span[0], lang).replace(/ [ap]m$/, '') + ' – ' + clock(span[1], lang);
    return clock(span[0], lang) + ' – ' + clock(span[1], lang);
  }
  var DAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  function when(t, diff, lang) {
    if (diff === 1) return I.t('today.tomorrow');
    var dow = new Date(t).getUTCDay();
    if (diff < 7) return I.t('day.' + DAYS[dow]);
    var d = new Date(t), mo = d.getUTCMonth(), da = d.getUTCDate();
    if (lang === 'en') return I.t('day.' + DAYS[dow]) + ', ' + ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][mo] + ' ' + da + ',';
    return (mo + 1) + '月' + da + '日（' + I.t('day.' + DAYS[dow]) + '）';
  }
  function fill(key, vars) { var s = I.t(key); for (var k in vars) s = s.split('{' + k + '}').join(vars[k]); return s; }
  function nextOpen(t0) {
    for (var i = 1; i < 30; i++) { var t = t0 + i * 864e5, d = dayInfo(t); if (!d.closed) return { t: t, diff: i, d: d }; }
    return null;
  }
  function todayLine() {
    var el = document.getElementById('today');
    if (!el) return;
    var lang = I.lang, now = toronto(), d = dayInfo(now.date), out, nx;
    if (d.closed || now.mins >= d.span[1]) {
      nx = nextOpen(now.date);
      var vars = nx ? { when: when(nx.t, nx.diff, lang), t: range(nx.d.span, lang), why: d.why ? I.t(d.why) : '' } : {};
      out = fill(d.closed ? (d.why ? 'today.holiday' : 'today.closed') : 'today.after', vars);
    } else if (d.camp) out = fill('today.camp', { t: range(d.span, lang) });
    else if (now.mins >= d.span[0]) out = fill('today.now', { end: clock(d.span[1], lang) });
    else out = fill('today.before', { t: range(d.span, lang) });
    el.removeAttribute('data-i18n');
    el.innerHTML = out.replace('） ', '）');
  }
  function todayRow() {
    var dow = String(new Date(toronto().date).getUTCDay());
    document.querySelectorAll('.hours tr[data-days]').forEach(function (tr) {
      tr.classList.toggle('is-today', tr.getAttribute('data-days').split(',').indexOf(dow) > -1);
    });
  }

  /* ---------- map follows the page language ---------- */
  function mapLang() {
    var f = document.querySelector('iframe[data-map-q]'); if (!f) return;
    var hl = { en: 'en', 'zh-Hant': 'zh-TW', 'zh-Hans': 'zh-CN' }[I.lang] || 'en';
    var src = 'https://maps.google.com/maps?q=' + encodeURIComponent(f.getAttribute('data-map-q')) + '&z=15&hl=' + hl + '&output=embed';
    if (f.getAttribute('src') !== src) f.setAttribute('src', src);
  }

  /* ---------- phone action bar: shows once the hero button has scrolled away ---------- */
  var dock = document.getElementById('dock');
  if (dock && 'IntersectionObserver' in window) {
    var seen = [], heroCta = document.getElementById('hero-cta');
    var watch = Array.prototype.slice.call(document.querySelectorAll('main .btn-main')).concat([document.querySelector('.site-foot')]).filter(Boolean);
    var update = function () {
      var past = heroCta && heroCta.getBoundingClientRect().bottom < 0;
      var show = past && !watch.some(function (w, i) { return seen[i]; });
      dock.hidden = !show;
      document.body.classList.toggle('has-dock', show);
    };
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { seen[watch.indexOf(en.target)] = en.isIntersecting; });
      update();
    });
    watch.forEach(function (w) { io.observe(w); });
    window.addEventListener('scroll', update, { passive: true });
  }

  /* ---------- work out your fees: grade + classes, added up like the front desk does ----------
     Fees from the fee table: Grades 1-6 $440, 7-8 $550, 9-12 $660 a term; Mandarin $330; OSSLT $400;
     Homework Club $280 (3 days) or $420 (5 days) a month; $40 registration per family; second child 10% off.
     Which subjects a grade can take comes from the timetable (schedule-data.js). */
  var S = window.MB_SCHEDULE, kidsBox = document.getElementById('cost-kids');
  var kids = [{ g: 5, subs: ['math'], club: 0 }], lastTotal = null;
  function fee(id, g) { return id === 'mandarin' ? 330 : id === 'osslt' ? 400 : g <= 6 ? 440 : g <= 8 ? 550 : 660; }
  var CLUB = { 3: 280, 5: 420 };
  function money(n) { return '$' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function subjectsFor(g) {
    return S.subjects.filter(function (s) {
      return s.id !== 'club' && S.classes.some(function (c) { return c.subject === s.id && c.lo <= g && g <= c.hi; });
    });
  }
  function subLabel(id) { return id === 'osslt' ? I.t('fees.r4') : I.pick(S.subjects.filter(function (s) { return s.id === id; })[0].label); }
  function chip(k, label, on) {
    return '<button type="button" class="fchip" data-k="' + k + '" aria-pressed="' + (on ? 'true' : 'false') + '">' + esc(label) + '</button>';
  }
  function kidHtml(kid, i) {
    var id = 'k' + i, h = '<div class="kid"><h3 class="kid-h"><span>' + esc(I.t(i ? 'cost.kid2' : 'cost.kid1')) + '</span>' +
      (i ? '<button type="button" class="link-btn" data-k="rm">' + esc(I.t('cost.rm')) + '</button>' : '') + '</h3>';
    h += '<p class="flabel" id="' + id + '-g">' + esc(I.t('cost.grade')) + '</p><div class="fchips fchips--grade" role="group" aria-labelledby="' + id + '-g">';
    for (var g = 1; g <= 12; g++) h += chip(i + ':g:' + g, g, kid.g === g);
    h += '</div>';
    if (!kid.g) return h + '<p class="nogr">' + esc(I.t('cost.nogr')) + '</p></div>';
    h += '<p class="flabel" id="' + id + '-s">' + esc(I.t('cost.classes')) + '</p><div class="fchips" role="group" aria-labelledby="' + id + '-s">';
    subjectsFor(kid.g).forEach(function (s) { h += chip(i + ':s:' + s.id, subLabel(s.id), kid.subs.indexOf(s.id) > -1); });
    h += '</div>';
    if (kid.g <= 8) {
      h += '<p class="flabel" id="' + id + '-c">' + esc(I.t('cost.club')) + '</p><div class="fchips" role="group" aria-labelledby="' + id + '-c">';
      [0, 3, 5].forEach(function (n) { h += chip(i + ':c:' + n, I.t('cost.club.' + n), kid.club === n); });
      h += '</div>';
    }
    return h + '</div>';
  }
  function costSum() {
    var lines = [], term = 0, month = 0;
    kids.forEach(function (kid, i) {
      var t = 0, m = kid.g && kid.g <= 8 ? (CLUB[kid.club] || 0) : 0;
      if (!kid.g) return;
      kid.subs.forEach(function (id) {
        var f = fee(id, kid.g); t += f;
        lines.push({ k: i + id, label: I.t('cost.line').replace('{s}', subLabel(id)).replace('{g}', I.t('grade.' + kid.g)), amt: money(f) });
      });
      if (i && t) { lines.push({ k: 'sib', label: I.t('cost.sib'), amt: '−' + money(Math.round(t / 10)), minus: true }); t -= Math.round(t / 10); }
      term += t; month += i ? m - Math.round(m / 10) : m;
    });
    if (term || month) { lines.push({ k: 'reg', label: I.t('cost.reg'), amt: money(40) }); term += 40; }
    return { lines: lines, term: term, month: month };
  }
  function renderCost(focusKey) {
    if (!kidsBox || !S) return;
    var old = {};
    [].forEach.call(document.querySelectorAll('#cost-sum li'), function (li) { old[li.getAttribute('data-k')] = 1; });
    kidsBox.innerHTML = kids.map(kidHtml).join('') + (kids.length < 2 ? '<button type="button" class="link-btn add-kid" data-k="add">' + esc(I.t('cost.add')) + '</button>' : '');
    var r = costSum(), first = !Object.keys(old).length && lastTotal === null;
    document.getElementById('cost-sum').innerHTML = r.lines.map(function (l) {
      return '<li data-k="' + l.k + '"' + (l.minus ? ' class="minus' : ' class="') + (old[l.k] || first ? '' : ' new') + '"><span>' + esc(l.label) + '</span><b>' + l.amt + '</b></li>';
    }).join('');
    document.getElementById('cost-empty').hidden = !!r.lines.length;
    document.getElementById('cost-total-row').hidden = !r.lines.length;
    var amt = document.getElementById('cost-total');
    amt.innerHTML = esc(money(r.term)) + '<svg class="mk" viewBox="0 0 200 60" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path pathLength="1" d="M120 6C66 2 12 13 12 31s54 24 100 23 78-12 76-28S142 4 92 6c-18 1-34 4-46 9"/></svg>';
    amt.classList.toggle('new', lastTotal !== null && lastTotal !== r.term);
    lastTotal = r.term;
    var club = document.getElementById('cost-club');
    club.hidden = !r.month;
    club.textContent = r.month ? I.t('cost.clubm').replace('{m}', money(r.month)) : '';
    var k0 = kids[0], q = k0.g ? '?grade=' + k0.g + (k0.subs.length === 1 ? '&subject=' + k0.subs[0] : '') : '';
    document.getElementById('cost-link').setAttribute('href', 'schedule.html' + q);
    if (focusKey) { var f = kidsBox.querySelector('[data-k="' + focusKey + '"]') || kidsBox.querySelector('[data-k="add"]') || kidsBox.querySelector('.fchip'); if (f) f.focus(); }
  }
  if (kidsBox && S) kidsBox.addEventListener('click', function (e) {
    var b = e.target.closest('[data-k]'); if (!b) return;
    var k = b.getAttribute('data-k'), p = k.split(':'), kid = kids[+p[0]], focusKey = k;
    if (k === 'add') { kids.push({ g: 0, subs: [], club: 0 }); focusKey = '1:g:1'; }
    else if (k === 'rm') { kids.pop(); focusKey = 'add'; }
    else if (p[1] === 'g') {
      kid.g = +p[2];
      var ok = subjectsFor(kid.g).map(function (s) { return s.id; });
      kid.subs = kid.subs.filter(function (id) { return ok.indexOf(id) > -1; });
      if (kid.g > 8) kid.club = 0;
    } else if (p[1] === 's') {
      var at = kid.subs.indexOf(p[2]);
      if (at > -1) kid.subs.splice(at, 1); else kid.subs.push(p[2]);
    } else if (p[1] === 'c') kid.club = +p[2];
    renderCost(focusKey);
  });

  /* ---------- home only: the intro and the scroll motion ---------- */
  var home = document.body.classList.contains('page-home');
  var headEl = document.querySelector('.site-head');
  function headH() { return headEl ? headEl.offsetHeight : 60; }
  html.style.setProperty('--hh', headH() + 'px');

  /* page-turn intro: ends by itself, or on a tap, scroll or key */
  if (home && html.classList.contains('intro')) {
    var layer = document.querySelector('.intro-layer');
    var endIntro = function () {
      html.classList.add('intro-done');
      ['wheel', 'touchmove', 'keydown'].forEach(function (t) { window.removeEventListener(t, endIntro); });
    };
    setTimeout(endIntro, 1450);
    if (layer) layer.addEventListener('click', endIntro);
    ['wheel', 'touchmove', 'keydown'].forEach(function (t) { window.addEventListener(t, endIntro, { passive: true }); });
  }

  /* GSAP ScrollTrigger (3.12.5, loaded with defer). Without it, or with reduced motion, the page stays a
     normal page: the worksheet is shown already marked and every red-pen mark is simply drawn. */
  function initMotion() {
    if (!home || !window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    var trial = document.getElementById('trial');
    var steps = trial ? [].slice.call(trial.querySelectorAll('.steps li')) : [];
    gsap.matchMedia().add({ mobile: '(max-width: 759px)', motion: '(prefers-reduced-motion: no-preference)' }, function (ctx) {
      if (!ctx.conditions.motion) return;
      var mobile = ctx.conditions.mobile, top = function () { return 'top ' + headH() + 'px'; };
      html.classList.add('gsap'); /* before the pin is measured: switches the trial section to its one-screen layout */
      html.style.setProperty('--hh', headH() + 'px');
      var pen = 'power3.out', draw0 = { strokeDashoffset: 1.05 }, write0 = { clipPath: 'inset(-30% 100% -30% 0%)' }, write1 = { clipPath: 'inset(-30% 0% -30% 0%)' };

      /* hero: the sheet slides up over the photo */
      gsap.to('.hero-sheet', { y: mobile ? -18 : -56, ease: 'none', scrollTrigger: { trigger: '.hero', start: top, end: 'bottom top', scrub: 0.4 } });

      /* every section opens on a strip of ruled paper: rules ruled left to right, then the margin line */
      gsap.utils.toArray('.sec-head').forEach(function (h) {
        gsap.fromTo(h, { '--rx': 0, '--ry': 0 }, { '--rx': 1, '--ry': 1, duration: 0.55, ease: pen, scrollTrigger: { trigger: h, start: 'top 90%' } });
      });

      /* the trial class on one page: pin, then grade and subject, answers in pencil, red-pen marking */
      if (trial) {
        var tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: {
          trigger: '.trial-pin', start: top, end: function () { return '+=' + Math.round(window.innerHeight * (mobile ? 2.2 : 2.4)); },
          pin: true, scrub: 0.4, invalidateOnRefresh: true,
          onUpdate: function (self) {
            var s = Math.min(2, Math.floor(self.progress * 3));
            if (trial.getAttribute('data-step') !== String(s)) {
              trial.setAttribute('data-step', String(s));
              steps.forEach(function (li, i) { li.classList.toggle('on', i === s); });
            }
          } } });
        tl.fromTo('.ws .w-in', write0, Object.assign({ duration: 0.8, stagger: 0.7 }, write1), 0.3)
          .fromTo('.ws .a', write0, Object.assign({ duration: 0.45, stagger: 0.55 }, write1), 3.6)
          .fromTo('.ws .tk path', draw0, { strokeDashoffset: 0, duration: 0.3, stagger: 0.32 }, 6.9)
          .fromTo('.ws .x path', draw0, { strokeDashoffset: 0, duration: 0.3 }, 8.2)
          .fromTo('.ws .fix', write0, Object.assign({ duration: 0.4 }, write1), 8.5)
          .fromTo('.ws .score .pen', write0, Object.assign({ duration: 0.3 }, write1), 8.95)
          .fromTo('.ws .score path', draw0, { strokeDashoffset: 0, duration: 0.35 }, 9.2)
          .fromTo('.ws-note', write0, Object.assign({ duration: 0.6 }, write1), 9.5)
          .to({}, { duration: 0.4 }, 10.1); /* a short hold on the finished page before the pin lets go */
      }
      gsap.fromTo('.trial-foot img', { yPercent: -6, scale: 1.14 }, { yPercent: 6, scale: 1.14, ease: 'none', scrollTrigger: { trigger: '.trial-foot', start: 'top bottom', end: 'bottom top', scrub: 0.5 } });

      /* red pen as you read: the fee note, OCT circled, closed days struck, the phone number circled, a last tick */
      [['.fee-pen path', '.fee-pen', 0], ['.oct path', '.staff', 0.22], ['.strike path', '.dates', 0.2], ['.phone-ring path', '.big-phone', 0], ['.end-tick path', '.end-sheet', 0]].forEach(function (m) {
        gsap.fromTo(m[0], draw0, { strokeDashoffset: 0, duration: 0.4, ease: 'power2.inOut', stagger: m[2], scrollTrigger: { trigger: m[1], start: 'top 82%' } });
      });
      gsap.fromTo('.par-photo', { yPercent: -5, scale: 1.12 }, { yPercent: 5, scale: 1.12, ease: 'none', scrollTrigger: { trigger: '.par-ph', start: 'top bottom', end: 'bottom top', scrub: 0.5 } });

      return function () { html.classList.remove('gsap'); steps.forEach(function (li, i) { li.classList.toggle('on', i === 0); }); };
    });
    /* fonts change text heights; measure again once they are in */
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
  }
  if (home) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initMotion); /* runs after the deferred GSAP files */
    else initMotion();
  }

  function onLang() {
    todayLine(); mapLang(); renderCost();
    if (window.ScrollTrigger && html.classList.contains('gsap')) ScrollTrigger.refresh(); /* text lengths changed */
  }
  todayRow();
  document.addEventListener('mp:langchange', onLang);
  if (html.classList.contains('i18n-ready')) onLang();
})();
