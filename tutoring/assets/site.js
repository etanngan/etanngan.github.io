/* Maple Bridge Learning Centre — shared behaviour: menu, accordion, motion */
(function () {
  'use strict';
  var I = window.MPi18n;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var coarse = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 760;

  /* ---------- mobile menu ---------- */
  var burger = document.querySelector('.burger');
  var nav = document.getElementById('site-nav');
  function setMenu(open) {
    if (!burger || !nav) return;
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    nav.classList.toggle('is-open', open);
    burger.setAttribute('data-i18n-attr', 'aria-label:' + (open ? 'nav.close' : 'nav.open'));
    burger.setAttribute('aria-label', I.t(open ? 'nav.close' : 'nav.open'));
  }
  if (burger && nav) {
    burger.addEventListener('click', function () { setMenu(burger.getAttribute('aria-expanded') !== 'true'); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') { setMenu(false); burger.focus(); }
    });
    window.addEventListener('resize', function () { if (window.innerWidth > 1080) setMenu(false); });
  }

  /* ---------- accordion ---------- */
  document.querySelectorAll('.acc__btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      var panel = document.getElementById(btn.getAttribute('aria-controls'));
      btn.setAttribute('aria-expanded', open ? 'false' : 'true');
      if (panel) {
        panel.hidden = open;
        if (!open && window.gsap && !reduce) gsap.fromTo(panel, { opacity: 0, y: -6 }, { opacity: 1, y: 0, duration: .28, ease: 'power2.out', clearProps: 'all' });
      }
    });
  });

  /* ---------- motion (progressive: nothing is hidden unless GSAP is running) ---------- */
  function motion() {
    if (reduce || !window.gsap) return;
    var g = window.gsap;
    if (window.ScrollTrigger) g.registerPlugin(window.ScrollTrigger);
    document.documentElement.classList.add('js-anim');

    // hero headline: masked line rise, then highlighter swipe
    var hero = document.querySelector('.hero h1');
    if (hero) {
      var lines = hero.querySelectorAll('.line > span');
      var tl = g.timeline({ delay: .1 });
      tl.from(lines, { yPercent: 110, duration: .7, ease: 'power3.out', stagger: .12, clearProps: 'transform' });
      var mk = hero.querySelector('mark.hl');
      if (mk) tl.fromTo(mk, { '--hl': 0 }, { '--hl': 1, duration: .55, ease: 'power2.inOut' }, '-=.15');
      tl.from('.hero__eyebrow, .hero__lead, .hero__cta, .hero__note', { opacity: 0, y: 14, duration: .5, stagger: .07, ease: 'power2.out', clearProps: 'all' }, .25);
      // stage elements drop in like stationery onto a desk
      tl.from('.stage .layer > *', { opacity: 0, y: -40, rotation: '-=8', duration: .6, ease: 'back.out(1.6)', stagger: .06, clearProps: 'opacity' }, .15);
    }
    var phead = document.querySelector('.phead h1');
    if (phead) {
      g.from('.phead .inner > *', { opacity: 0, y: 18, duration: .55, stagger: .08, ease: 'power2.out', clearProps: 'all' });
      g.from('.phead .shape', { opacity: 0, y: -30, duration: .6, stagger: .08, ease: 'back.out(1.7)', clearProps: 'opacity,transform', delay: .1 });
    }

    // float loop on the hero subject
    var ws = document.querySelector('.ws');
    if (ws && !coarse) g.to(ws, { y: -10, rotation: 2, duration: 3.2, ease: 'sine.inOut', yoyo: true, repeat: -1 });

    if (!window.ScrollTrigger) return;

    // parallax on depth layers
    document.querySelectorAll('.scene').forEach(function (scene) {
      scene.querySelectorAll('[data-depth]').forEach(function (layer) {
        var d = Number(layer.getAttribute('data-depth'));
        if (d === 4) return;
        var amt = (d - 2) * (coarse ? 10 : 28);
        g.to(layer, { y: -amt, ease: 'none', scrollTrigger: { trigger: scene, start: 'top top', end: 'bottom top', scrub: .4 } });
      });
    });

    // hand-drawn strokes draw in on scroll
    document.querySelectorAll('svg .draw').forEach(function (p) {
      var len;
      try { len = p.getTotalLength(); } catch (e) { return; }
      if (!len) return;
      // non-scaling strokes dash in screen pixels: scale the length to match
      if (p.getAttribute('vector-effect') === 'non-scaling-stroke') {
        var m = p.getScreenCTM && p.getScreenCTM();
        if (m) len = len * Math.max(Math.abs(m.a), Math.abs(m.d), 1) + 4;
      }
      g.set(p, { strokeDasharray: len, strokeDashoffset: len });
      g.to(p, { strokeDashoffset: 0, duration: .9, ease: 'power2.inOut', delay: Number(p.getAttribute('data-delay') || 0),
        scrollTrigger: { trigger: p.closest('svg'), start: 'top 88%', once: true } });
    });

    // index cards settle as they enter
    g.utils.toArray('.settle').forEach(function (el, i) {
      g.from(el, { opacity: 0, y: 40, rotation: (i % 2 ? 3 : -3), duration: .6, ease: 'back.out(1.4)', clearProps: 'opacity,transform',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
    });
    g.utils.toArray('.reveal').forEach(function (el) {
      g.from(el, { opacity: 0, y: 22, duration: .55, ease: 'power2.out', clearProps: 'all', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
    });
    g.utils.toArray('.section mark.hl').forEach(function (mk) {
      g.fromTo(mk, { '--hl': 0 }, { '--hl': 1, duration: .6, ease: 'power2.inOut', scrollTrigger: { trigger: mk, start: 'top 85%', once: true } });
    });
  }
  if (document.readyState === 'complete') motion(); else window.addEventListener('load', motion);

  // after a language switch, layout height changes: refresh triggers
  document.addEventListener('mp:langchange', function (e) {
    if (e.detail && e.detail.initial) return;
    if (window.ScrollTrigger) setTimeout(function () { window.ScrollTrigger.refresh(); }, 60);
  });
})();
