/* Bon Cake — concept preview behaviour
   - illustrated cake slices (SVG) for every flavour
   - open / closed status in Markham time (closed Tuesdays), hours table with today highlighted
   - mobile nav, scroll reveals
   - whole-cake order request (order.html): preview only, never sends anything */
(function () {
  'use strict';
  var T = MPi18n.t;
  document.documentElement.classList.add('js');

  /* ---------- cake slice art ---------- */
  var FLAV = {
    taro:   { sponge: '#cdb8ea', side: '#b9a2dd', cream: '#f8f2fd', top: '#eee4f9', dot: '#b393dd', tint: '#f1eafa' },
    sesame: { sponge: '#bdb4b1', side: '#a79d9a', cream: '#f5f1ef', top: '#ebe5e2', dot: '#4a4040', tint: '#f3f0ee' },
    oval:   { sponge: '#cfa688', side: '#b98f72', cream: '#f8ebde', top: '#a87b5d', dot: '#ecc999', tint: '#fdf0e6' },
    mochi:  { sponge: '#e9daf3', side: '#d6c3e8', cream: '#fffafd', top: '#f6eefb', dot: '#ffffff', tint: '#fdeef2' }
  };
  function slice(key) {
    var f = FLAV[key];
    var s = '<g>' +
      '<ellipse cx="88" cy="206" rx="74" ry="10" fill="#ffffff" stroke="#f0dfe4"/>' +
      // side face
      '<path d="M130 60 L150 48 L150 188 L130 200 Z" fill="' + f.side + '"/>' +
      // front face layers
      '<rect x="30" y="60" width="100" height="140" fill="' + f.sponge + '"/>' +
      '<rect x="30" y="60" width="100" height="14" fill="' + f.cream + '"/>' +
      '<rect x="30" y="98" width="100" height="8" fill="' + f.cream + '"/>' +
      '<rect x="30" y="130" width="100" height="8" fill="' + f.cream + '"/>' +
      '<rect x="30" y="162" width="100" height="8" fill="' + f.cream + '"/>' +
      '<g fill="' + f.cream + '" opacity=".55"><path d="M130 74 L150 62 L150 66 L130 78Z"/><path d="M130 98 L150 86 L150 92 L130 104Z"/><path d="M130 130 L150 118 L150 124 L130 136Z"/><path d="M130 162 L150 150 L150 156 L130 168Z"/></g>' +
      // top face
      '<path d="M30 60 L50 48 L150 48 L130 60 Z" fill="' + f.top + '"/>';
    // chiffon crumb texture
    s += '<g fill="#ffffff" opacity=".18"><circle cx="48" cy="86" r="2"/><circle cx="92" cy="84" r="1.6"/><circle cx="70" cy="118" r="2"/><circle cx="112" cy="120" r="1.6"/><circle cx="52" cy="150" r="1.6"/><circle cx="98" cy="152" r="2"/><circle cx="64" cy="184" r="2"/><circle cx="110" cy="186" r="1.6"/></g>';
    if (key === 'taro') {
      s += '<g fill="' + f.dot + '"><path d="M58 50c-8 0-10-10 0-14 4 6 10 6 10 14z"/><path d="M92 46c-8 0-10-10 0-14 4 6 10 6 10 14z"/><path d="M124 44c-8 0-10-10 0-14 4 6 10 6 10 14z"/></g><g fill="#ffffff" opacity=".5"><circle cx="62" cy="42" r="2"/><circle cx="96" cy="38" r="2"/><circle cx="128" cy="36" r="2"/></g>';
    } else if (key === 'sesame') {
      s += '<g fill="#efe8e4"><ellipse cx="62" cy="46" rx="10" ry="6"/><ellipse cx="96" cy="44" rx="10" ry="6"/><ellipse cx="128" cy="42" rx="10" ry="6"/></g><g fill="' + f.dot + '"><ellipse cx="44" cy="56" rx="1.8" ry="1"/><ellipse cx="70" cy="54" rx="1.8" ry="1"/><ellipse cx="84" cy="51" rx="1.8" ry="1"/><ellipse cx="110" cy="52" rx="1.8" ry="1"/><ellipse cx="136" cy="50" rx="1.8" ry="1"/><ellipse cx="58" cy="44" rx="1.8" ry="1"/><ellipse cx="94" cy="42" rx="1.8" ry="1"/><ellipse cx="126" cy="40" rx="1.8" ry="1"/><ellipse cx="120" cy="56" rx="1.8" ry="1"/><ellipse cx="62" cy="57" rx="1.8" ry="1"/></g>';
    } else if (key === 'oval') {
      s += '<g fill="' + f.dot + '"><rect x="48" y="44" width="9" height="7" rx="1.5" transform="rotate(-14 52 47)"/><rect x="76" y="46" width="9" height="7" rx="1.5" transform="rotate(10 80 49)"/><rect x="100" y="41" width="9" height="7" rx="1.5" transform="rotate(-8 104 44)"/><rect x="122" y="44" width="9" height="7" rx="1.5" transform="rotate(16 126 47)"/><rect x="64" y="52" width="7" height="5" rx="1.2"/><rect x="112" y="52" width="7" height="5" rx="1.2"/></g><g fill="#f4d9a8"><circle cx="90" cy="54" r="2"/><circle cx="58" cy="54" r="2"/><circle cx="138" cy="49" r="2"/></g>';
    } else if (key === 'mochi') {
      s += '<g fill="' + f.dot + '" stroke="#d9c6e6" stroke-width="1.5"><rect x="50" y="40" width="14" height="12" rx="4"/><rect x="82" y="38" width="14" height="12" rx="4"/><rect x="114" y="36" width="14" height="12" rx="4"/></g><g fill="#ffffff" stroke="#d9c6e6" stroke-width="1"><rect x="44" y="110" width="9" height="8" rx="3"/><rect x="86" y="112" width="9" height="8" rx="3"/><rect x="112" y="142" width="9" height="8" rx="3"/><rect x="60" y="146" width="9" height="8" rx="3"/><rect x="96" y="80" width="9" height="8" rx="3"/></g>';
    }
    return s + '</g>';
  }
  function sliceSVG(key, label) {
    return '<svg viewBox="0 0 176 220" ' + (label ? 'role="img" aria-label="' + label + '"' : 'aria-hidden="true"') + ' focusable="false">' + slice(key) + '</svg>';
  }
  window.BonArt = { slice: slice, sliceSVG: sliceSVG, FLAV: FLAV };

  function paintArt() {
    document.querySelectorAll('[data-slice]').forEach(function (el) {
      var k = el.getAttribute('data-slice');
      el.style.setProperty('--tint', FLAV[k].tint);
      el.innerHTML = sliceSVG(k);
    });
    var hero = document.getElementById('hero-art');
    if (hero && !hero.firstChild) {
      hero.innerHTML =
        '<svg viewBox="0 0 560 520" role="img" focusable="false" aria-label="' + T('art.aria') + '">' +
        '<ellipse cx="280" cy="470" rx="250" ry="22" fill="#f6dfe6"/>' +
        '<g transform="translate(150 70) scale(1.75)"><g class="float">' + slice('taro') + '</g></g>' +
        '<g transform="translate(24 230) scale(1.05)"><g class="float b">' + slice('sesame') + '</g></g>' +
        '<g transform="translate(392 214) scale(1.05)"><g class="float c">' + slice('oval') + '</g></g>' +
        '<g transform="translate(2 18) scale(.8)"><g class="float c">' + slice('mochi') + '</g></g>' +
        // coffee cup
        '<g transform="translate(430 66)"><ellipse cx="44" cy="96" rx="52" ry="9" fill="#ffffff" stroke="#f0dfe4"/><path d="M8 34h72l-8 56c-1 5-5 8-10 8H26c-5 0-9-3-10-8z" fill="#ffffff" stroke="#5a3a2c" stroke-width="4"/><path d="M80 46c22 0 22 30 -4 30" fill="none" stroke="#5a3a2c" stroke-width="4"/><path d="M14 46h60" stroke="#f6c1cc" stroke-width="7"/>' +
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
