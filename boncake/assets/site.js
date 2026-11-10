/* Bon Cake — concept preview behaviour
   - illustrated round layer cakes (SVG) for every flavour
   - open / closed status in Markham time (closed Tuesdays), hours table with today highlighted
   - mobile nav, scroll reveals
   - whole-cake order request (order.html): preview only, never sends anything */
(function () {
  'use strict';
  var T = MPi18n.t;
  document.documentElement.classList.add('js');

  /* ---------- cake art: round layer cakes with piped rosettes, like the ones in the case ---------- */
  var FLAV = {
    taro:   { side: '#b9a2dd', sponge: '#cdb8ea', light: '#e2d4f5', cream: '#fbf7fe', top: '#efe5fa', ros: '#ffffff', rosS: '#e6dcf3', tint: '#efe7fa' },
    sesame: { side: '#9e9592', sponge: '#b9b0ad', light: '#d4cdca', cream: '#f7f3f1', top: '#ece6e3', ros: '#fffdfb', rosS: '#e6dfdb', tint: '#f2eeec' },
    oval:   { side: '#b48a6c', sponge: '#cba183', light: '#e2c2a8', cream: '#f8ebde', top: '#8a5a3c', ros: '#fff8f0', rosS: '#efdcc8', tint: '#fbeee3' },
    mochi:  { side: '#d3bfe6', sponge: '#e6d8f2', light: '#f3ebfa', cream: '#ffffff', top: '#f7f0fc', ros: '#ffffff', rosS: '#efe4f7', tint: '#fdecf1' }
  };
  var uid = 0;
  function rnd(seed) { return function () { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }; }
  function edgeY(x, cy) { var d = (x - 100) / 70; return cy + 18 * Math.sqrt(Math.max(0, 1 - d * d)); }
  function rosettes(f, front) {
    var out = [];
    for (var i = 0; i < 14; i++) {
      var a = i / 14 * Math.PI * 2, sn = Math.sin(a);
      if ((sn > 0) !== front) continue;
      var x = 100 + 58 * Math.cos(a), y = 86 + 12.5 * sn, r = 6 + 2.4 * (sn + 1) / 2;
      var X = x.toFixed(1), Y = y.toFixed(1), k1 = (r * .18).toFixed(2), k2 = (r * .36).toFixed(2), k3 = (r * .54).toFixed(2);
      out.push({ y: y, s: '<g><ellipse cx="' + X + '" cy="' + (y + r * .55).toFixed(1) + '" rx="' + (r * .95).toFixed(1) + '" ry="' + (r * .35).toFixed(1) + '" fill="' + f.rosS + '" opacity=".7"/>' +
        '<circle cx="' + X + '" cy="' + Y + '" r="' + r.toFixed(1) + '" fill="' + f.ros + '" stroke="' + f.rosS + '" stroke-width="1"/>' +
        '<path d="M' + X + ' ' + Y + 'm' + (-r * .18).toFixed(2) + ' 0a' + k1 + ' ' + k1 + ' 0 1 1 ' + (r * .36).toFixed(2) + ' 0a' + k2 + ' ' + k2 + ' 0 1 1 ' + (-r * .72).toFixed(2) + ' 0a' + k3 + ' ' + k3 + ' 0 0 1 ' + (r * 1.08).toFixed(2) + ' 0" fill="none" stroke="' + f.rosS + '" stroke-width="1.1" stroke-linecap="round"/></g>' });
    }
    return out.sort(function (p, q) { return p.y - q.y; }).map(function (p) { return p.s; }).join('');
  }
  function topping(key, f) {
    var r = rnd(key.length * 977 + 13), s = '', i, x, y;
    function inTop() { var t = r() * Math.PI * 2, d = Math.sqrt(r()); return [100 + 40 * d * Math.cos(t), 86 + 8 * d * Math.sin(t)]; }
    if (key === 'taro') {
      for (i = 0; i < 34; i++) { var p = inTop(); s += '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="' + (1.6 + r() * 2.2).toFixed(1) + '" fill="' + ['#a685d6', '#c4a9ea', '#8e6bc4', '#d8c6f1'][i % 4] + '"/>'; }
      [[94, 84, '#ffffff'], [109, 87, '#e9dcfa']].forEach(function (fl) {
        for (var p2 = 0; p2 < 5; p2++) { var ang = p2 / 5 * Math.PI * 2; s += '<circle cx="' + (fl[0] + 3.2 * Math.cos(ang)).toFixed(1) + '" cy="' + (fl[1] + 2.4 * Math.sin(ang)).toFixed(1) + '" r="2.3" fill="' + fl[2] + '" stroke="#c9b2e6" stroke-width=".6"/>'; }
        s += '<circle cx="' + fl[0] + '" cy="' + fl[1] + '" r="1.4" fill="#f7cd6b"/>';
      });
    } else if (key === 'sesame') {
      for (i = 0; i < 30; i++) { var q = inTop(); s += '<circle cx="' + q[0].toFixed(1) + '" cy="' + q[1].toFixed(1) + '" r="' + (1.5 + r() * 2).toFixed(1) + '" fill="' + ['#d9b98c', '#c9a473', '#e8d1ad'][i % 3] + '"/>'; }
      for (i = 0; i < 22; i++) { var z = inTop(); s += '<ellipse cx="' + z[0].toFixed(1) + '" cy="' + z[1].toFixed(1) + '" rx="1.4" ry=".8" fill="#3b3333"/>'; }
      s += '<path d="M96 78c2-6 6-8 9-10" stroke="#8fb07a" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M100 74l3-2M102 72l2 2" stroke="#8fb07a" stroke-width="1.4" stroke-linecap="round"/>';
    } else if (key === 'oval') {
      for (i = 0; i < 16; i++) { var c = inTop(); s += '<rect x="' + (c[0] - 2.5).toFixed(1) + '" y="' + (c[1] - 2).toFixed(1) + '" width="5" height="4" rx="1.2" fill="' + ['#ecc999', '#f5dcb4', '#d9a866'][i % 3] + '" transform="rotate(' + Math.round(r() * 60 - 30) + ' ' + c[0].toFixed(1) + ' ' + c[1].toFixed(1) + ')"/>'; }
      s += '<circle cx="100" cy="82" r="7" fill="#fff8f0" stroke="#efdcc8"/><rect x="96" y="70" width="12" height="9" rx="2" fill="#e9c58d" transform="rotate(-12 102 74)"/>';
    } else if (key === 'mochi') {
      [[84, 84], [100, 80], [116, 85], [92, 90], [108, 91], [100, 86]].forEach(function (m, k) {
        s += '<rect x="' + (m[0] - 6) + '" y="' + (m[1] - 5) + '" width="12" height="10" rx="4" fill="#ffffff" stroke="#e2d2ef" stroke-width="1.3"/>' + (k % 2 ? '' : '<circle cx="' + (m[0] - 2) + '" cy="' + (m[1] - 2) + '" r="1.2" fill="#f1e6f8"/>');
      });
      for (i = 0; i < 18; i++) { var d2 = inTop(); s += '<circle cx="' + d2[0].toFixed(1) + '" cy="' + d2[1].toFixed(1) + '" r=".9" fill="#c9b2e2"/>'; }
    }
    return s;
  }
  function cake(key, opt) {
    opt = opt || {};
    var f = FLAV[key], id = 'bc' + (++uid), s = '';
    s += '<defs><linearGradient id="' + id + 's" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="' + f.side + '"/><stop offset=".35" stop-color="' + f.sponge + '"/><stop offset=".6" stop-color="' + f.light + '"/><stop offset="1" stop-color="' + f.side + '"/></linearGradient>' +
      '<radialGradient id="' + id + 't" cx=".42" cy=".35" r=".75"><stop offset="0" stop-color="' + (key === 'oval' ? '#a57452' : '#ffffff') + '"/><stop offset="1" stop-color="' + f.top + '"/></radialGradient></defs>';
    if (!opt.noPlate) s += '<ellipse cx="100" cy="168" rx="90" ry="19" fill="#ffffff" stroke="#f0dfe4" stroke-width="2"/><ellipse cx="100" cy="165" rx="75" ry="12" fill="none" stroke="#f8eef1" stroke-width="2"/>';
    var body = 'M30 88 L30 156 A70 18 0 0 0 170 156 L170 88 A70 18 0 0 1 30 88Z';
    s += '<clipPath id="' + id + 'c"><path d="' + body + '"/></clipPath><path d="' + body + '" fill="url(#' + id + 's)"/><g clip-path="url(#' + id + 'c)">';
    [111, 134].forEach(function (y) { s += '<path d="M24 ' + y + ' A76 19 0 0 0 176 ' + y + '" fill="none" stroke="' + f.cream + '" stroke-width="7"/><path d="M24 ' + (y + 4) + ' A76 19 0 0 0 176 ' + (y + 4) + '" fill="none" stroke="' + f.side + '" stroke-width="1.2" opacity=".35"/>'; });
    if (key === 'sesame') { var r = rnd(71); for (var i = 0; i < 60; i++) { var x = 34 + r() * 132, y = 92 + r() * 62; s += '<circle cx="' + x.toFixed(1) + '" cy="' + Math.min(y, edgeY(x, 154)).toFixed(1) + '" r=".9" fill="#5e5555" opacity=".55"/>'; } }
    if (key === 'mochi') { s += '<g fill="#ffffff" stroke="#e2d2ef" stroke-width="1"><rect x="52" y="116" width="8" height="7" rx="2.5"/><rect x="96" y="140" width="8" height="7" rx="2.5"/><rect x="134" y="118" width="8" height="7" rx="2.5"/><rect x="74" y="96" width="8" height="7" rx="2.5"/></g>'; }
    s += '</g>';
    s += '<ellipse cx="100" cy="88" rx="70" ry="18" fill="url(#' + id + 't)"/>';
    if (key === 'oval') {
      var dp = '';
      [36, 50, 63, 78, 92, 106, 121, 136, 150, 163].forEach(function (x, k) { var e = edgeY(x, 88), len = [12, 20, 9, 16, 24, 11, 18, 10, 22, 13][k]; dp += '<rect x="' + (x - 4) + '" y="' + (e - 6).toFixed(1) + '" width="8" height="' + (len + 6) + '" rx="4"/>'; });
      s += '<g fill="#8a5a3c">' + dp + '</g><path d="M30 88 A70 18 0 0 0 170 88" fill="none" stroke="#8a5a3c" stroke-width="6"/>';
    }
    s += rosettes(f, false) + topping(key, f) + rosettes(f, true);
    if (opt.candles) {
      [86, 100, 114].forEach(function (x, k) { var t = 50 + (k === 1 ? -8 : 0); s += '<rect x="' + (x - 3) + '" y="' + t + '" width="6" height="' + (86 - t) + '" rx="2" fill="#ffffff" stroke="#f0c9d3"/><path d="M' + (x - 3) + ' ' + (t + 8) + 'l6 -4M' + (x - 3) + ' ' + (t + 18) + 'l6 -4M' + (x - 3) + ' ' + (t + 28) + 'l6 -4" stroke="#f6a9ba" stroke-width="2"/><path d="M' + x + ' ' + (t - 14) + 'c-5 6-5 10 0 12 5-2 5-6 0-12z" fill="#f7cd6b"/>'; });
    } else if (!opt.noTag) {
      s += '<line x1="140" y1="54" x2="140" y2="82" stroke="#d5bfa6" stroke-width="2" stroke-linecap="round"/><rect x="140" y="50" width="36" height="13" rx="2.5" fill="#ffffff" stroke="#f3d2da"/><text x="158" y="59.5" text-anchor="middle" font-family="Fredoka,Nunito,Inter,sans-serif" font-size="7" font-weight="600" fill="#e0798f">Bon Cake</text>';
    }
    return s;
  }
  function cakeSVG(key, opt) {
    return '<svg viewBox="' + (opt && opt.candles ? '6 24 188 168' : '6 44 188 148') + '" aria-hidden="true" focusable="false">' + cake(key, opt) + '</svg>';
  }
  window.BonArt = { cake: cake, cakeSVG: cakeSVG, FLAV: FLAV };

  function paintArt() {
    document.querySelectorAll('[data-slice]').forEach(function (el) {
      var k = el.getAttribute('data-slice');
      el.style.setProperty('--tint', FLAV[k].tint);
      el.innerHTML = cakeSVG(k, { candles: el.hasAttribute('data-candles'), noTag: el.hasAttribute('data-notag') });
    });
    var hero = document.getElementById('hero-art');
    if (hero && !hero.firstChild) {
      hero.innerHTML =
        '<svg viewBox="0 0 560 540" role="img" focusable="false" aria-label="' + T('art.aria') + '">' +
        '<defs><radialGradient id="heroBg" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="#fff3f6"/><stop offset=".6" stop-color="#fbe4ec"/><stop offset="1" stop-color="#ece0f7"/></radialGradient></defs>' +
        '<circle cx="280" cy="270" r="262" fill="url(#heroBg)"/>' +
        '<circle cx="280" cy="270" r="240" fill="none" stroke="#ffffff" stroke-width="5" stroke-dasharray="1 13" stroke-linecap="round"/>' +
        '<circle cx="452" cy="96" r="44" fill="#fff8e6"/>' +
        // cake stand
        '<ellipse cx="280" cy="446" rx="76" ry="15" fill="#f2d7df"/><ellipse cx="280" cy="440" rx="72" ry="13" fill="#ffffff" stroke="#f0dfe4" stroke-width="2"/>' +
        '<path d="M268 352 L292 352 L286 438 L274 438 Z" fill="#ffffff" stroke="#f0dfe4" stroke-width="2"/>' +
        '<ellipse cx="280" cy="356" rx="158" ry="26" fill="#f2d7df"/><ellipse cx="280" cy="350" rx="158" ry="26" fill="#ffffff" stroke="#f0dfe4" stroke-width="2"/>' +
        '<g transform="translate(90 40) scale(1.9)"><g class="float">' + cake('taro', { noPlate: true }) + '</g></g>' +
        '<g transform="translate(10 330) scale(.9)"><g class="float b">' + cake('sesame', { noTag: true }) + '</g></g>' +
        '<g transform="translate(372 330) scale(.9)"><g class="float c">' + cake('oval', { noTag: true }) + '</g></g>' +
        '<g transform="translate(30 60) scale(.58)"><g class="float c">' + cake('mochi', { noTag: true }) + '</g></g>' +
        // coffee cup
        '<g transform="translate(410 46)"><ellipse cx="44" cy="96" rx="44" ry="8" fill="#ffffff" stroke="#f0dfe4"/><path d="M8 34h72l-8 56c-1 5-5 8-10 8H26c-5 0-9-3-10-8z" fill="#ffffff" stroke="#5a3a2c" stroke-width="4"/><path d="M80 46c22 0 22 30 -4 30" fill="none" stroke="#5a3a2c" stroke-width="4"/><path d="M14 46h60" stroke="#f6c1cc" stroke-width="7"/>' +
        '<g class="steam" fill="none" stroke="#d9b9c3" stroke-width="3.5" stroke-linecap="round"><path d="M32 24c-6-8 6-12 0-22"/><path d="M52 24c-6-8 6-12 0-22"/></g></g>' +
        '</svg>';
    }
  }

  /* ---------- hours (0 = Sunday); from the Google listing, to confirm with Bon Cake ---------- */
  var HOURS = { 0: [12, 20], 1: [12, 20], 2: null, 3: [12, 20], 4: [12, 20], 5: [12, 20], 6: [12, 20] };
  var ORDER_DAYS = [1, 2, 3, 4, 5, 6, 0];
  function locale() { return { en: 'en-CA', 'zh-Hant': 'zh-HK', 'zh-Hans': 'zh-CN' }[MPi18n.lang] || 'en-CA'; }
  function hourLabel(h) {
    var l = MPi18n.lang, h12 = h % 12 === 0 ? 12 : h % 12;
    if (l === 'zh-Hant') return (h === 12 ? '中午' : h < 12 ? '上午' : '晚上') + h12 + '時';
    if (l === 'zh-Hans') return (h === 12 ? '中午' : h < 12 ? '上午' : '晚上') + h12 + '点';
    if (h === 12) return 'noon';
    return h12 + (h < 12 ? ' am' : ' pm');
  }
  function rangeLabel(r) {
    if (!r) return T('st.off');
    return MPi18n.lang === 'en' ? hourLabel(r[0]) + ' – ' + hourLabel(r[1]) : hourLabel(r[0]) + '至' + hourLabel(r[1]);
  }
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
      if (d === today) tr.classList.add('today');
      if (!HOURS[d]) tr.classList.add('off');
      a.textContent = dayName(d);
      if (d === today) a.setAttribute('data-today', T('st.todaytag'));
      b.textContent = rangeLabel(HOURS[d]);
      tr.appendChild(a); tr.appendChild(b); tb.appendChild(tr);
    });
  }

  /* ---------- nav ---------- */
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

  /* ---------- reveal ---------- */
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.rv').forEach(function (el, i) { el.style.transitionDelay = (i % 4) * 70 + 'ms'; io.observe(el); });
  } else {
    document.querySelectorAll('.rv').forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- order request (preview only) ---------- */
  var form = document.getElementById('order-form');
  function ymd(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function setMinDate() {
    var inp = document.getElementById('f-date');
    if (!inp) return;
    var d = new Date(); d.setDate(d.getDate() + 2);
    if (d.getDay() === 2) d.setDate(d.getDate() + 1);
    inp.min = ymd(d);
    if (!inp.value) inp.value = ymd(d);
  }
  if (form) {
    setMinDate();
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var err = document.getElementById('f-err'), res = document.getElementById('result');
      var flav = form.querySelector('input[name="flavour"]:checked');
      var dateStr = form.elements.date.value, name = form.elements.name.value.trim(), phone = form.elements.phone.value.trim();
      var d = dateStr ? new Date(dateStr + 'T12:00:00') : null;
      function fail(k) { err.textContent = T(k); res.hidden = true; }
      if (!flav) return fail('f.errFlav');
      if (!d || dateStr < form.elements.date.min || d.getDay() === 2) return fail('f.errDate');
      if (!name || !phone) return fail('f.errContact');
      err.textContent = '';
      var size = form.querySelector('input[name="size"]:checked');
      var via = form.querySelector('input[name="via"]:checked');
      var msg = form.elements.msg.value.trim();
      res.innerHTML = '';
      function add(tag, cls, txt) { var n = document.createElement(tag); if (cls) n.className = cls; n.textContent = txt; res.appendChild(n); return n; }
      add('span', 'tag', T('r.tag'));
      add('h3', '', T('r.h'));
      var ul = document.createElement('ul');
      var li = document.createElement('li'); li.textContent = T(flav.value + '.n') + ' · ' + T(size ? size.value : 'f.size6'); ul.appendChild(li);
      res.appendChild(ul);
      add('p', '', T('r.pick').replace('{d}', new Intl.DateTimeFormat(locale(), { weekday: 'long', month: 'long', day: 'numeric' }).format(d)) + ' · ' + name);
      if (msg) add('p', '', T('r.msg').replace('{m}', msg));
      if (via) add('p', '', T('r.via').replace('{v}', T(via.value)));
      add('p', '', T('r.live'));
      res.hidden = false;
      res.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  function all() { paintArt(); renderStatus(); renderHours(); setHeadH(); }
  document.addEventListener('mp:langchange', function () {
    var hero = document.getElementById('hero-art');
    if (hero) { var svg = hero.querySelector('svg'); if (svg) svg.setAttribute('aria-label', T('art.aria')); }
    all();
  });
  all();
  setInterval(renderStatus, 60000);
  window.addEventListener('resize', setHeadH);
})();
