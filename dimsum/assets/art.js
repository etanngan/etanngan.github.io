/* Jade Basket — hand-drawn SVG art: bamboo steamers and plates seen from above.
   JBArt.dish(kind)  -> svg string   (hargow | siumai | bao | lausa | bakedbao | redroll | porkbelly)
   JBArt.lid()       -> svg string   (woven steamer lid)
   JBArt.mount(root) -> fills every [data-art="kind"] element inside root */
(function () {
  'use strict';
  var uid = 0;

  function ring(n, r, start, fn) {
    var s = '';
    for (var i = 0; i < n; i++) {
      var a = (start + (360 / n) * i) * Math.PI / 180;
      s += fn((Math.cos(a) * r).toFixed(1), (Math.sin(a) * r).toFixed(1), start + (360 / n) * i, i);
    }
    return s;
  }

  /* ---------- vessels ---------- */
  function steamerBase(u) {
    var s = '<defs>' +
      '<radialGradient id="bm' + u + '" cx="42%" cy="38%" r="70%"><stop offset="0" stop-color="#e0b872"/><stop offset=".6" stop-color="#b98a44"/><stop offset="1" stop-color="#7c5426"/></radialGradient>' +
      '<radialGradient id="vg' + u + '" cx="50%" cy="50%" r="50%"><stop offset=".62" stop-color="#1a0d04" stop-opacity="0"/><stop offset="1" stop-color="#1a0d04" stop-opacity=".78"/></radialGradient>' +
      '<radialGradient id="pp' + u + '" cx="45%" cy="40%" r="70%"><stop offset="0" stop-color="#fbf3df"/><stop offset="1" stop-color="#e3d4b1"/></radialGradient>' +
      '<clipPath id="cl' + u + '"><circle cx="200" cy="200" r="160"/></clipPath>' +
      '</defs>';
    s += '<circle cx="200" cy="200" r="197" fill="#3d2710"/>';
    s += '<circle cx="200" cy="200" r="193" fill="url(#bm' + u + ')"/>';
    s += '<circle cx="200" cy="200" r="186" fill="none" stroke="#6b4720" stroke-width="1.5"/>';
    s += '<circle cx="200" cy="200" r="178" fill="none" stroke="#f3d69a" stroke-opacity=".55" stroke-width="6" stroke-dasharray="26 5"/>';
    s += '<circle cx="200" cy="200" r="178" fill="none" stroke="#6b4720" stroke-opacity=".5" stroke-width="6" stroke-dasharray="1.5 29.5"/>';
    s += '<circle cx="200" cy="200" r="169" fill="#3a2410"/>';
    s += '<g clip-path="url(#cl' + u + ')">';
    for (var y = 36, i = 0; y < 364; y += 15, i++) {
      s += '<rect x="36" y="' + y + '" width="328" height="12" rx="2" fill="' + (i % 2 ? '#b88c4b' : '#c9a05e') + '"/>';
      s += '<rect x="36" y="' + (y + 9) + '" width="328" height="3" fill="#8a6230" opacity=".55"/>';
    }
    s += '</g>';
    s += '<circle cx="200" cy="200" r="160" fill="url(#vg' + u + ')"/>';
    /* rattan ties on the rim */
    s += '<g fill="#5a3a18"><rect x="192" y="4" width="16" height="20" rx="3"/><rect x="192" y="376" width="16" height="20" rx="3"/></g>';
    s += '<g stroke="#e9c98a" stroke-opacity=".6" stroke-width="1.2"><path d="M194 9h12M194 14h12M194 19h12M194 381h12M194 386h12M194 391h12"/></g>';
    return s;
  }
  function liner(u) {
    var s = '<circle cx="200" cy="200" r="136" fill="url(#pp' + u + ')" opacity=".96"/>';
    s += '<circle cx="200" cy="200" r="136" fill="none" stroke="#cdbb93" stroke-width="1"/>';
    s += '<g fill="#bfa97c" opacity=".7" transform="translate(200 200)">' + ring(18, 122, 5, function (x, y) { return '<circle cx="' + x + '" cy="' + y + '" r="2.2"/>'; }) + '</g>';
    return s;
  }
  function plate(u) {
    var s = '<defs><radialGradient id="pl' + u + '" cx="42%" cy="36%" r="72%"><stop offset="0" stop-color="#fdf9ef"/><stop offset=".7" stop-color="#ece2cc"/><stop offset="1" stop-color="#c9bb9c"/></radialGradient></defs>';
    s += '<circle cx="200" cy="200" r="196" fill="#8f8266"/>';
    s += '<circle cx="200" cy="200" r="194" fill="url(#pl' + u + ')"/>';
    s += '<circle cx="200" cy="200" r="181" fill="none" stroke="#b4321f" stroke-width="2.5"/>';
    s += '<circle cx="200" cy="200" r="175" fill="none" stroke="#b4321f" stroke-width=".8"/>';
    s += '<circle cx="200" cy="200" r="140" fill="none" stroke="#d6c8a8" stroke-width="1.5"/>';
    s += '<circle cx="200" cy="200" r="140" fill="#fffdf6" opacity=".35"/>';
    return s;
  }
  function shadow(x, y, rx, ry, o) {
    return '<ellipse cx="' + x + '" cy="' + y + '" rx="' + rx + '" ry="' + ry + '" fill="#2a1606" opacity="' + (o || 0.22) + '"/>';
  }

  /* ---------- food ---------- */
  function hargow(u) {
    var one = '<g>' + shadow(3, 10, 54, 38, 0.2) +
      '<path d="M-54,16 C-60,-22 -26,-46 0,-46 C26,-46 60,-22 54,16 C42,38 -42,38 -54,16Z" fill="url(#hg' + u + ')" stroke="#d9c9bb" stroke-width="1.4"/>' +
      '<ellipse cx="0" cy="6" rx="30" ry="15" fill="#f0a488" opacity=".42"/>' +
      '<path d="M-22,8 C-10,0 10,0 22,8" fill="none" stroke="#e98f73" stroke-width="3" stroke-linecap="round" opacity=".45"/>' +
      '<g fill="none" stroke="#cbb9aa" stroke-width="1.6" stroke-linecap="round">' +
      '<path d="M-42,-22 C-36,-12 -32,-8 -30,-2"/><path d="M-30,-34 C-25,-22 -22,-16 -20,-8"/><path d="M-16,-42 C-13,-30 -11,-22 -10,-12"/><path d="M0,-45 C0,-32 0,-24 0,-14"/><path d="M16,-42 C13,-30 11,-22 10,-12"/><path d="M30,-34 C25,-22 22,-16 20,-8"/><path d="M42,-22 C36,-12 32,-8 30,-2"/>' +
      '</g>' +
      '<path d="M-40,22 C-20,31 20,31 40,22" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".75"/>' +
      '</g>';
    var s = '<defs><radialGradient id="hg' + u + '" cx="50%" cy="60%" r="65%"><stop offset="0" stop-color="#fbeee6"/><stop offset=".7" stop-color="#f6efe6"/><stop offset="1" stop-color="#e6dccf"/></radialGradient></defs>';
    var pos = [[-58, -52, -28], [60, -56, 34], [-60, 62, 205], [58, 58, 150]];
    s += '<g transform="translate(200 200)">';
    pos.forEach(function (p) { s += '<g transform="translate(' + p[0] + ' ' + p[1] + ') rotate(' + p[2] + ') scale(.98)">' + one + '</g>'; });
    return s + '</g>';
  }
  function siumai(u) {
    var roe = '';
    [[0, 0], [-5, -4], [5, -3], [-3, 5], [4, 5], [-7, 2], [7, 1], [0, -7]].forEach(function (p) {
      roe += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="2.6" fill="#ff8a3c"/>';
    });
    var one = '<g>' + shadow(3, 8, 46, 44, 0.22) +
      '<circle r="45" fill="#d9ad3c"/>' +
      '<circle r="41" fill="none" stroke="#f3d877" stroke-width="9" stroke-dasharray="11 4.6"/>' +
      '<circle r="46" fill="none" stroke="#b88a22" stroke-width="1.2" stroke-dasharray="11 4.6" opacity=".7"/>' +
      '<circle r="31" fill="url(#sm' + u + ')"/>' +
      '<g fill="#b9795a" opacity=".55"><circle cx="-14" cy="-10" r="5"/><circle cx="15" cy="-8" r="4"/><circle cx="-10" cy="16" r="4.5"/><circle cx="16" cy="14" r="5"/></g>' +
      '<g fill="#4a2d1a" opacity=".5"><circle cx="-18" cy="6" r="3.5"/><circle cx="6" cy="-19" r="3"/></g>' +
      '<circle r="12" fill="#e9601c"/>' + roe +
      '<circle cx="-3" cy="-4" r="1.3" fill="#fff" opacity=".8"/>' +
      '</g>';
    var s = '<defs><radialGradient id="sm' + u + '" cx="45%" cy="40%" r="65%"><stop offset="0" stop-color="#eebb98"/><stop offset="1" stop-color="#c98765"/></radialGradient></defs>';
    s += '<g transform="translate(200 200)">';
    [[-56, -56], [58, -54], [-58, 58], [56, 60]].forEach(function (p, i) { s += '<g transform="translate(' + p[0] + ' ' + p[1] + ') rotate(' + (i * 37) + ')">' + one + '</g>'; });
    return s + '</g>';
  }
  function bunDefs(u, a, b) {
    return '<defs><radialGradient id="bn' + u + '" cx="40%" cy="34%" r="72%"><stop offset="0" stop-color="' + a + '"/><stop offset=".75" stop-color="' + b + '"/><stop offset="1" stop-color="#cdbd9b"/></radialGradient></defs>';
  }
  function bao(u) {
    var one = '<g>' + shadow(4, 10, 62, 58, 0.22) +
      '<circle r="62" fill="url(#bn' + u + ')"/>' +
      '<path d="M0,-34 C7,-12 12,-4 32,16 C10,9 -10,9 -32,16 C-12,-4 -7,-12 0,-34Z" fill="#7a2c14"/>' +
      '<path d="M0,-22 C5,-8 9,-2 20,10 C7,6 -7,6 -20,10 C-9,-2 -5,-8 0,-22Z" fill="#b5522a"/>' +
      '<g fill="#e8a05a" opacity=".8"><circle cx="-4" cy="2" r="3"/><circle cx="6" cy="-4" r="2.4"/></g>' +
      '<path d="M0,-34 C7,-12 12,-4 32,16 M0,-34 C-7,-12 -12,-4 -32,16 M-32,16 C-10,9 10,9 32,16" fill="none" stroke="#fffaf0" stroke-width="5" stroke-linejoin="round" opacity=".9"/>' +
      '<path d="M-44,-22 C-30,-46 30,-46 44,-22" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".6"/>' +
      '</g>';
    var s = bunDefs(u, '#fffdf7', '#f0e6d2') + '<g transform="translate(200 200)">';
    [[0, -66, 0], [-60, 40, -120], [60, 40, 120]].forEach(function (p) { s += '<g transform="translate(' + p[0] + ' ' + p[1] + ') rotate(' + p[2] + ')">' + one + '</g>'; });
    return s + '</g>';
  }
  function lausa(u) {
    var whole = '<g>' + shadow(4, 10, 60, 56, 0.22) + '<circle r="60" fill="url(#bn' + u + ')"/>' +
      '<path d="M-42,-22 C-28,-45 28,-45 42,-22" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".6"/>' +
      '<circle cy="-2" r="6" fill="#d8432b"/></g>';
    var torn = '<g>' + shadow(4, 10, 60, 56, 0.22) + '<circle r="60" fill="url(#bn' + u + ')"/>' +
      '<path d="M-36,-14 C-20,-30 22,-32 38,-12 C44,6 30,30 22,52 C16,76 -2,80 -8,58 C-12,40 -44,14 -36,-14Z" fill="#e79a12"/>' +
      '<path d="M-28,-10 C-14,-22 18,-23 30,-9 C34,6 22,26 16,46 C12,62 0,64 -3,50 C-8,34 -34,10 -28,-10Z" fill="#f8bf2c"/>' +
      '<path d="M-16,-6 C-6,-12 10,-12 18,-4" fill="none" stroke="#fff3c4" stroke-width="4" stroke-linecap="round" opacity=".9"/>' +
      '<circle cx="6" cy="56" r="4" fill="#fff3c4" opacity=".7"/>' +
      '<path d="M-36,-14 C-20,-30 22,-32 38,-12" fill="none" stroke="#fffaf0" stroke-width="5" stroke-linecap="round"/>' +
      '</g>';
    var s = bunDefs(u, '#fffbea', '#f1e2bd') + '<g transform="translate(200 200)">';
    s += '<g transform="translate(-56 -50)">' + whole + '</g><g transform="translate(62 -40)">' + whole + '</g><g transform="translate(-4 54) rotate(8)">' + torn + '</g>';
    return s + '</g>';
  }
  function bakedbao(u) {
    var one = '<g>' + shadow(5, 12, 62, 58, 0.25) +
      '<circle r="62" fill="url(#bk' + u + ')"/>' +
      '<circle r="51" fill="#f4dfa6"/><circle r="51" fill="none" stroke="#d9a548" stroke-width="2"/>' +
      '<path d="M-50,-8 L-22,-14 L-10,-49 M-22,-14 L-8,8 L-36,34 M-8,8 L20,0 L28,-42 M20,0 L49,14 M-8,8 L4,34 L-6,50 M4,34 L36,36" fill="none" stroke="#c07a1e" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M-50,-8 L-22,-14 L-10,-49 M-22,-14 L-8,8 L-36,34 M-8,8 L20,0 L28,-42 M20,0 L49,14 M-8,8 L4,34 L-6,50 M4,34 L36,36" fill="none" stroke="#e8ab45" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M-44,-28 C-28,-50 28,-50 44,-28" fill="none" stroke="#fff6da" stroke-width="3" stroke-linecap="round" opacity=".5"/>' +
      '</g>';
    var s = '<defs><radialGradient id="bk' + u + '" cx="40%" cy="34%" r="74%"><stop offset="0" stop-color="#e8ab45"/><stop offset=".7" stop-color="#c47c22"/><stop offset="1" stop-color="#8f5312"/></radialGradient></defs>';
    s += '<g transform="translate(200 200)">';
    [[0, -62, 10], [-58, 42, 130], [60, 40, 250]].forEach(function (p) { s += '<g transform="translate(' + p[0] + ' ' + p[1] + ') rotate(' + p[2] + ')">' + one + '</g>'; });
    return s + '</g>';
  }
  function redroll(u) {
    var roll = '<g>' + shadow(4, 9, 112, 24, 0.3) +
      '<rect x="-110" y="-23" width="220" height="46" rx="23" fill="url(#rr' + u + ')"/>' +
      '<rect x="-98" y="-17" width="196" height="9" rx="4.5" fill="#fff" opacity=".28"/>' +
      '<g stroke="#5e1f18" stroke-width="2.2" opacity=".75"><path d="M-37,-23V23M37,-23V23"/></g>' +
      '<g fill="#e9b74c"><ellipse cx="-104" rx="7" ry="13"/><ellipse cx="104" rx="7" ry="13"/></g>' +
      '<g fill="#fbe3a0"><ellipse cx="-105" rx="3" ry="7"/><ellipse cx="105" rx="3" ry="7"/></g>' +
      '</g>';
    var s = '<defs><linearGradient id="rr' + u + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c2604f"/><stop offset=".55" stop-color="#a13f33"/><stop offset="1" stop-color="#7c2a22"/></linearGradient></defs>';
    s += '<g transform="translate(200 200) rotate(-18)">';
    s += '<ellipse cx="0" cy="8" rx="128" ry="92" fill="#3a1b0c" opacity=".88"/><ellipse cx="-30" cy="-20" rx="60" ry="30" fill="#6a3516" opacity=".5"/>';
    s += '<g transform="translate(0 -54)">' + roll + '</g><g transform="translate(6 0)">' + roll + '</g><g transform="translate(-4 54)">' + roll + '</g>';
    s += '<g fill="#f5ecd3">' + [[-60, -60], [-20, -48], [30, -58], [70, -50], [-50, -4], [10, 4], [56, -4], [-64, 50], [-14, 58], [40, 50], [80, 58]].map(function (p) { return '<ellipse cx="' + p[0] + '" cy="' + p[1] + '" rx="2.6" ry="1.5" transform="rotate(' + (p[0] * 3) + ' ' + p[0] + ' ' + p[1] + ')"/>'; }).join('') + '</g>';
    s += '<g fill="#6fae5c">' + [[-84, -56], [0, -62], [88, -8], [-30, 6], [64, 60], [-88, 46]].map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="3.4"/><circle cx="' + p[0] + '" cy="' + p[1] + '" r="1.4" fill="#d7ecc0"/>'; }).join('') + '</g>';
    return s + '</g>';
  }
  function porkbelly(u) {
    function piece(x, y, r) {
      var dots = '';
      [[-12, -10], [6, -13], [14, 2], [-4, 3], [-14, 12], [8, 13], [0, -4]].forEach(function (p) { dots += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="2.1"/>'; });
      return '<g transform="translate(' + x + ' ' + y + ') rotate(' + r + ')">' + shadow(4, 8, 30, 26, 0.3) +
        '<rect x="-27" y="-17" width="54" height="42" rx="5" fill="#c98f79"/>' +
        '<rect x="-27" y="12" width="54" height="5" fill="#f1dccd"/><rect x="-27" y="18" width="54" height="7" rx="3" fill="#a9634e"/>' +
        '<rect x="-27" y="-25" width="54" height="36" rx="6" fill="url(#pb' + u + ')"/>' +
        '<g fill="#a86a12" opacity=".7">' + dots + '</g>' +
        '<rect x="-22" y="-21" width="44" height="5" rx="2.5" fill="#fff0c0" opacity=".55"/></g>';
    }
    var s = '<defs><linearGradient id="pb' + u + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f0bd52"/><stop offset="1" stop-color="#c98722"/></linearGradient></defs>';
    s += '<g transform="translate(200 200) rotate(-10)">';
    var xs = [-90, -30, 30, 90];
    xs.forEach(function (x, i) { s += piece(x, -34, i % 2 ? 3 : -3); });
    xs.forEach(function (x, i) { s += piece(x + 8, 32, i % 2 ? -2 : 4); });
    s += '</g>';
    s += '<g transform="translate(296 296)"><circle r="30" fill="#f6efe0" stroke="#b4321f" stroke-width="1.5"/><circle r="21" fill="#d8b521"/><path d="M-12,-6 C-4,-12 6,-12 12,-5" fill="none" stroke="#f4e27a" stroke-width="3" stroke-linecap="round"/></g>';
    return s;
  }

  var FOOD = { hargow: hargow, siumai: siumai, bao: bao, lausa: lausa, bakedbao: bakedbao, redroll: redroll, porkbelly: porkbelly };
  var ON_PLATE = { bakedbao: 1, redroll: 1, porkbelly: 1 };

  function dish(kind) {
    var u = ++uid;
    var inner = ON_PLATE[kind] ? plate(u) : steamerBase(u) + liner(u);
    inner += (FOOD[kind] || hargow)(u);
    return '<svg viewBox="0 0 400 400" aria-hidden="true" focusable="false">' + inner + '</svg>';
  }

  function lid() {
    var u = ++uid, s = '';
    s += '<defs><radialGradient id="ld' + u + '" cx="42%" cy="36%" r="72%"><stop offset="0" stop-color="#e3bd78"/><stop offset=".65" stop-color="#b98a44"/><stop offset="1" stop-color="#75501f"/></radialGradient>' +
      '<radialGradient id="lv' + u + '" cx="50%" cy="50%" r="50%"><stop offset=".55" stop-color="#1a0d04" stop-opacity="0"/><stop offset="1" stop-color="#1a0d04" stop-opacity=".5"/></radialGradient></defs>';
    s += '<circle cx="200" cy="200" r="199" fill="#3d2710"/><circle cx="200" cy="200" r="195" fill="url(#ld' + u + ')"/>';
    for (var r = 14, i = 0; r <= 168; r += 11, i++) {
      var dash = Math.max(8, Math.min(26, r * 0.42));
      s += '<circle cx="200" cy="200" r="' + r + '" fill="none" stroke="' + (i % 2 ? '#d9b26c' : '#c39a55') + '" stroke-width="9.5" stroke-dasharray="' + dash.toFixed(1) + ' 2.4" stroke-dashoffset="' + (i % 2 ? dash / 2 : 0).toFixed(1) + '"/>';
      s += '<circle cx="200" cy="200" r="' + (r + 5.2) + '" fill="none" stroke="#6e4a20" stroke-width="1" opacity=".6"/>';
    }
    s += '<circle cx="200" cy="200" r="181" fill="none" stroke="#6b4720" stroke-width="2"/>';
    s += '<circle cx="200" cy="200" r="188" fill="none" stroke="#f3d69a" stroke-opacity=".5" stroke-width="5" stroke-dasharray="26 5"/>';
    s += '<circle cx="200" cy="200" r="195" fill="url(#lv' + u + ')"/>';
    s += '<g transform="translate(200 200) rotate(-24)"><rect x="-56" y="-11" width="112" height="22" rx="11" fill="#2a1606" opacity=".35" transform="translate(4 7)"/><rect x="-56" y="-11" width="112" height="22" rx="11" fill="#9a6c30" stroke="#5a3a18" stroke-width="1.5"/><path d="M-44,-4H44" stroke="#e9c98a" stroke-width="3" stroke-linecap="round" opacity=".7"/><g stroke="#5a3a18" stroke-width="1.6"><path d="M-36,-11V11M-28,-11V11M28,-11V11M36,-11V11"/></g></g>';
    return '<svg viewBox="0 0 400 400" aria-hidden="true" focusable="false">' + s + '</svg>';
  }

  function mount(root) {
    (root || document).querySelectorAll('[data-art]').forEach(function (el) {
      if (el.getAttribute('data-art-done')) return;
      var k = el.getAttribute('data-art');
      el.innerHTML = k === 'lid' ? lid() : dish(k);
      el.setAttribute('data-art-done', '1');
    });
  }

  window.JBArt = { dish: dish, lid: lid, mount: mount };
})();
