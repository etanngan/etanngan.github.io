/* Jade Basket — shared behaviour for index.html and menu.html */
(function () {
  'use strict';
  var T = function (k, f) { return MPi18n.t(k, f); };
  var JB = window.JB;
  var body = document.body;
  var isHome = body.classList.contains('page-home');
  var isMenu = body.classList.contains('page-menu');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var coarse = window.matchMedia('(pointer: coarse)').matches;
  var wide = function () { return window.innerWidth >= 960; };
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* ---------- header ---------- */
  var head = document.getElementById('head');
  var burger = document.querySelector('.burger');
  var nav = document.getElementById('nav');
  var dock = document.querySelector('.dock');
  function setMenu(open) {
    if (!burger) return;
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', T(open ? 'nav.close' : 'nav.open'));
    nav.classList.toggle('is-open', open);
    body.style.overflow = open ? 'hidden' : '';
  }
  if (burger) {
    burger.addEventListener('click', function () { setMenu(burger.getAttribute('aria-expanded') !== 'true'); });
    nav.addEventListener('click', function (e) {
      var a = e.target.closest('a'); if (!a) return;
      var h = a.getAttribute('href');
      setMenu(false);
      if (h.charAt(0) === '#') {
        var t = document.querySelector(h); if (!t) return;
        e.preventDefault();
        requestAnimationFrame(function () { t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); history.replaceState(null, '', h); });
      }
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
    window.addEventListener('resize', function () { if (wide()) setMenu(false); });
  }
  var lastY = 0;
  function onScroll() {
    var y = window.scrollY;
    if (head) head.classList.toggle('is-solid', y > 40);
    // Hide the dock while the home hero (which has its own call/menu buttons) is on screen, and while scrolling down.
    var heroEl = document.querySelector('section.hero');
    var inHero = heroEl && y < heroEl.offsetHeight * 0.55;
    if (dock) dock.classList.toggle('is-hidden', inHero || (y > lastY && y > 500 && y < document.documentElement.scrollHeight - window.innerHeight - 200));
    lastY = y;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- art ---------- */
  if (window.JBArt) JBArt.mount();

  /* ---------- today ---------- */
  function today() {
    var d = new Date().getDay();
    var el = document.getElementById('today-hours');
    if (el) el.textContent = T(d === 5 || d === 6 ? 'status.late' : 'status.wk');
    document.querySelectorAll('.hours-table tr[data-day]').forEach(function (tr) {
      var on = +tr.getAttribute('data-day') === d;
      tr.classList.toggle('is-today', on);
      if (on) { tr.setAttribute('data-today', T('hours.today')); tr.querySelector('th').setAttribute('data-today', T('hours.today')); }
    });
  }

  /* ---------- home: ticker + trolley ---------- */
  var ART = { s01: 'hargow', s02: 'siumai', s06: 'lausa', f02: 'bakedbao', r01: 'redroll', b01: 'porkbelly' };
  function ticker() {
    var el = document.getElementById('ticker');
    if (!el || !JB) return;
    var ids = ['s01', 's02', 's05', 'f01', 's03', 'r02', 's08', 'f04', 'c01', 'b02', 'd01', 'r05', 's06', 'b03'];
    var h = ids.map(function (id) { var it = JB.byId(id); return '<span><b>' + esc(JB.zhName(it)) + '</b>' + esc(it.n[2]) + '</span>'; }).join('');
    el.innerHTML = h + h;
  }
  function trolley() {
    var el = document.getElementById('trolley-track');
    if (!el || !JB) return;
    el.innerHTML = JB.signatures.map(function (id, i) {
      var it = JB.byId(id);
      var tier = it.t ? '<span class="chip-seal" aria-hidden="true">' + esc(MPi18n.pick(JB.tierChar[it.t])) + '</span>' : '';
      var unit = it.t ? T('sig.order') : T('sig.plate');
      var second = MPi18n.lang === 'en' ? '' : '<span class="dish-en" lang="en" data-lang-neutral>' + esc(it.n[2]) + '</span>';
      var first = MPi18n.lang === 'en'
        ? '<span class="dish-zh" lang="zh-Hant" data-lang-neutral>' + esc(it.n[0]) + '</span><span class="dish-en">' + esc(it.n[2]) + '</span>'
        : '<span class="dish-zh">' + esc(JB.name(it)) + '</span>' + second;
      return '<li class="dish-card">' +
        '<span class="dish-no" aria-hidden="true">0' + (i + 1) + '</span>' +
        '<div class="art" data-art="' + ART[id] + '"></div>' +
        '<h3 style="margin:0">' + first + '</h3>' +
        '<p>' + esc(JB.desc(it)) + '</p>' +
        '<div class="dish-foot"><span class="tierwrap">' + tier + '<span>' + esc(unit) + '</span></span><strong>' + JB.money(JB.price(it)) + '</strong></div>' +
        '</li>';
    }).join('');
    JBArt.mount(el);
  }

  /* ---------- menu page ---------- */
  function marksHtml(it) {
    var s = '';
    ['g', 'v', 'p', 's'].forEach(function (k) {
      if (JB.has(it, k)) s += '<span class="mk mk-' + k + '" title="' + esc(T('mark.' + k)) + '" role="img" aria-label="' + esc(T('mark.' + k)) + '">' + { g: '招', v: '素', p: '生', s: '辣' }[k] + '</span>';
    });
    return s ? '<span class="marks">' + s + '</span>' : '';
  }
  function priceHtml(it) {
    if (it.incl) return '<span class="amt" aria-hidden="true">—</span><small>' + esc(T('menu.incl')) + '</small>';
    if (it.t) return '<span class="chip-seal" aria-hidden="true">' + esc(MPi18n.pick(JB.tierChar[it.t])) + '</span><span class="amt">' + JB.money(JB.tiers[it.t]) + '</span>';
    return '<span class="amt">' + JB.money(it.p) + '</span>' + (it.unit === 'pot' ? '<small>' + esc(T('menu.pot')) + '</small>' : '');
  }
  function renderMenu() {
    var root = document.getElementById('menu-root');
    var bar = document.getElementById('catbar-list');
    if (!root || !JB) return;
    var L = MPi18n.lang;
    bar.innerHTML = JB.cats.map(function (c) {
      var zh = L === 'zh-Hans' ? c.name['zh-Hans'] : c.name['zh-Hant'];
      return '<li><a href="#cat-' + c.id + '" data-cat="' + c.id + '">' + (L === 'en' ? '<b lang="zh-Hant" data-lang-neutral>' + esc(zh) + '</b>' + esc(c.name.en) : '<b>' + esc(zh) + '</b>') + '</a></li>';
    }).join('');
    root.innerHTML = JB.cats.map(function (c) {
      var items = JB.items.filter(function (it) { return it.c === c.id; });
      var zh = L === 'zh-Hans' ? c.name['zh-Hans'] : c.name['zh-Hant'];
      return '<section class="cat" id="cat-' + c.id + '" aria-labelledby="h-' + c.id + '">' +
        '<header class="cat-head"><span class="cat-zh" aria-hidden="true">' + esc(zh) + '</span>' +
        '<h2 id="h-' + c.id + '">' + esc(MPi18n.pick(c.name)) + '</h2><p class="cat-note">' + esc(MPi18n.pick(c.note)) + '</p></header>' +
        '<ul class="dishes">' + items.map(function (it) {
          var names = L === 'en'
            ? '<span class="zh" lang="zh-Hant" data-lang-neutral>' + esc(it.n[0]) + '</span><span class="en">' + esc(it.n[2]) + '</span>'
            : '<span class="zh">' + esc(JB.name(it)) + '</span><span class="en" lang="en" data-lang-neutral>' + esc(it.n[2]) + '</span>';
          var qty = it.q ? ' <span class="dish-qty">· ' + esc(T('menu.pcs').replace('{n}', it.q)) + '</span>' : '';
          return '<li class="dish"><h3 class="dish-names" style="margin:0;font-weight:inherit">' + names + marksHtml(it) + '</h3>' +
            '<p class="dish-desc">' + esc(JB.desc(it)) + qty + '</p>' +
            '<div class="dish-price">' + priceHtml(it) + '</div></li>';
        }).join('') + '</ul></section>';
    }).join('');
    spy();
  }
  var spyObs = null;
  function spy() {
    var links = document.querySelectorAll('#catbar-list a');
    if (!links.length || !('IntersectionObserver' in window)) return;
    if (spyObs) spyObs.disconnect();
    function activate(id) {
      links.forEach(function (a) {
        var on = a.getAttribute('data-cat') === id;
        a.classList.toggle('is-active', on);
        if (on) {
          a.setAttribute('aria-current', 'true');
          var ul = a.closest('ul'); var l = a.offsetLeft - ul.clientWidth / 2 + a.offsetWidth / 2;
          ul.scrollTo({ left: l, behavior: reduce ? 'auto' : 'smooth' });
        } else a.removeAttribute('aria-current');
      });
    }
    spyObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) activate(e.target.id.replace('cat-', '')); });
    }, { rootMargin: '-40% 0px -55% 0px' });
    document.querySelectorAll('.cat').forEach(function (s) { spyObs.observe(s); });
    activate(JB.cats[0].id);
  }
  function qr() {
    var box = document.getElementById('qr-code');
    if (!box || typeof window.qrcode !== 'function') return;
    var url = new URL('qr.html', location.href);
    url.hash = ''; url.search = '';
    var href = url.href;
    var q = qrcode(0, 'H');
    q.addData(href);
    q.make();
    var n = q.getModuleCount(), pad = 2, size = n + pad * 2, scale = 8;
    var cv = document.createElement('canvas');
    cv.width = cv.height = size * scale;
    var g = cv.getContext('2d');
    g.fillStyle = '#ffffff'; g.fillRect(0, 0, cv.width, cv.height);
    g.fillStyle = '#1a0f0a';
    for (var r = 0; r < n; r++) for (var c = 0; c < n; c++) if (q.isDark(r, c)) g.fillRect((c + pad) * scale, (r + pad) * scale, scale, scale);
    cv.setAttribute('role', 'img');
    cv.setAttribute('data-i18n-attr', 'aria-label:qrb.alt');
    cv.setAttribute('aria-label', T('qrb.alt'));
    cv.setAttribute('data-url', href);
    box.innerHTML = '';
    box.appendChild(cv);
    var u = document.getElementById('qr-url');
    if (u) u.textContent = href.replace(/^https?:\/\//, '');
  }

  /* ---------- motion ---------- */
  var gsap = window.gsap, ST = window.ScrollTrigger;
  var trolleyST = null;
  function motion() {
    if (!gsap || !ST || reduce) return;
    gsap.registerPlugin(ST);
    document.documentElement.classList.add('js-anim');
    var small = !wide() || coarse;

    /* hero intro: masked line reveal */
    var lines = gsap.utils.toArray('.hero-title .line-in');
    if (lines.length) {
      var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from('.hero-steamer', { y: 60, opacity: 0, scale: .92, rotate: -20, duration: 1.6 }, 0)
        .from('.hero-vert', { opacity: 0, y: 40, duration: 1.4 }, .1)
        .from(lines, { yPercent: 110, duration: 1.1, stagger: .14 }, .25)
        .from('.hero-copy [data-in]', { y: 18, opacity: 0, duration: .8, stagger: .1, clearProps: 'transform,opacity' }, .6);
      /* float loop */
      gsap.to('.hero-subject .float', { y: -16, rotate: 4, duration: 4.2, ease: 'sine.inOut', yoyo: true, repeat: -1 });
      /* parallax by depth */
      gsap.utils.toArray('.hero [data-depth]').forEach(function (layer) {
        var d = +layer.getAttribute('data-depth');
        var amt = { 0: 8, 1: 22, 2: 34, 3: 50, 4: 18, 5: 80 }[d];
        if (small) amt *= .5;
        gsap.to(layer, { yPercent: d === 4 ? -amt / 2 : amt * (d === 5 ? -1 : 1) * .6, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      });
      gsap.to('.hero-steamer', { rotate: 40, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    }

    /* menu hero: depth parallax + slow turn of the steamer */
    if (document.querySelector('.menu-hero')) {
      gsap.from('.menu-hero-art', { opacity: 0, rotate: -50, scale: .9, duration: 1.4, ease: 'power3.out' });
      gsap.from('.menu-hero .depth-4 > *', { y: 24, opacity: 0, duration: .8, stagger: .08, ease: 'power2.out', clearProps: 'transform,opacity' });
      gsap.utils.toArray('.menu-hero [data-depth]').forEach(function (layer) {
        var d = +layer.getAttribute('data-depth'); if (d === 4) return;
        gsap.to(layer, { yPercent: [6, 18, 0, 28][d] * (small ? .5 : 1), ease: 'none', scrollTrigger: { trigger: '.menu-hero', start: 'top top', end: 'bottom top', scrub: true } });
      });
      gsap.to('.menu-hero-art', { rotate: 30, ease: 'none', scrollTrigger: { trigger: '.menu-hero', start: 'top top', end: 'bottom top', scrub: true } });
    }

    /* generic reveals */
    gsap.utils.toArray('[data-reveal]').forEach(function (el) {
      gsap.from(el, { y: 30, opacity: 0, duration: .9, ease: 'power2.out', clearProps: 'transform,opacity', scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
    });

    /* story steamer slow spin */
    var sp = document.querySelector('[data-spin]');
    if (sp) gsap.fromTo(sp, { rotate: -30 }, { rotate: 30, ease: 'none', scrollTrigger: { trigger: '.story', start: 'top bottom', end: 'bottom top', scrub: true } });

    /* lid lift — pinned on wide screens, simple scrub on phones */
    var lid = document.querySelector('.lid-top');
    if (lid) {
      gsap.set(lid, { x: 0, y: 0, rotate: 0, scale: 1, xPercent: 0, yPercent: 0 });
      var ltl = gsap.timeline({
        scrollTrigger: small
          ? { trigger: '.lid', start: 'top 70%', end: 'center 40%', scrub: .6 }
          : { trigger: '.lid', start: 'top top', end: '+=140%', scrub: .8, pin: true, anticipatePin: 1 }
      });
      ltl.to(lid, { yPercent: -16, scale: 1.04, duration: .25, ease: 'power1.in' })
        .to(lid, { xPercent: small ? -34 : -40, yPercent: small ? -40 : -46, rotate: -18, scale: small ? .66 : .8, duration: .6, ease: 'power2.out' })
        .from('.lid .steam i', { opacity: 0, duration: .3 }, .2)
        .from('.lid-title .line-in', { yPercent: 110, stagger: .08, duration: .35 }, .25)
        .from('.lid-p, .lid-dish, .lid-copy .eyebrow', { opacity: 0, y: 20, stagger: .06, duration: .3 }, .45)
        .fromTo('.lid-vert', { opacity: 0 }, { opacity: 1, duration: .5 }, .2);
    }

    /* horizontal trolley — pinned scrub on wide fine-pointer screens */
    buildTrolley();
  }
  function buildTrolley() {
    if (!gsap || !ST || reduce) return;
    var wrap = document.getElementById('trolley'), track = document.getElementById('trolley-track');
    if (!wrap || !track) return;
    if (trolleyST) { trolleyST.kill(true); trolleyST = null; gsap.set(track, { x: 0 }); }
    if (!wide() || coarse) { wrap.classList.remove('is-pinned'); return; }
    wrap.classList.add('is-pinned');
    var dist = function () { return Math.max(0, track.scrollWidth - window.innerWidth); };
    var tw = gsap.to(track, {
      x: function () { return -dist(); }, ease: 'none',
      scrollTrigger: { trigger: '.sig', start: 'top top', end: function () { return '+=' + dist(); }, scrub: .6, pin: true, invalidateOnRefresh: true, anticipatePin: 1 }
    });
    trolleyST = tw.scrollTrigger;
  }

  /* ---------- language changes ---------- */
  var first = true;
  document.addEventListener('mp:langchange', function () {
    today();
    if (burger) burger.setAttribute('aria-label', T(burger.getAttribute('aria-expanded') === 'true' ? 'nav.close' : 'nav.open'));
    if (isHome) { ticker(); trolley(); }
    if (isMenu) { renderMenu(); qr(); }
    if (first) { first = false; motion(); }
    else if (ST) { requestAnimationFrame(function () { ST.refresh(); }); }
  });
  // if i18n already fired before this script ran
  if (document.documentElement.classList.contains('i18n-ready') && first) {
    MPi18n.set(MPi18n.lang, { force: true });
  }
})();
