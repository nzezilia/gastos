(function () {
  if (!/inicio\.html$/i.test(location.pathname) || window.Rosca7Loaded) return;
  window.Rosca7Loaded = true;

  var NS = 'http://www.w3.org/2000/svg';
  var limites = {}, limTempo = 0, timer = null;

  var st = document.createElement('style');
  st.textContent =
    '.ro7{position:relative;width:100%;max-width:340px;aspect-ratio:340/300;margin:0 auto}' +
    '.ro7 svg{position:absolute;top:0;left:0;width:100%;height:100%}' +
    '.ro7 .ctr{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);text-align:center;width:120px}' +
    '.ro7 .ctr small{display:block;font-size:12px;color:var(--mut)}' +
    '.ro7 .ctr b{display:block;font-size:17px;letter-spacing:-.01em;margin-top:2px}' +
    '.ro7 .bb{position:absolute;width:34px;height:34px;margin:-17px 0 0 -17px;border-radius:50%;background:var(--card);border:2px solid;display:flex;align-items:center;justify-content:center;font-size:17px}' +
    '.lc7{margin-top:6px}' +
    '.lc7 .it{display:flex;gap:12px;align-items:center;padding:9px 0}' +
    '.lc7 .ic2{width:38px;height:38px;border-radius:50%;border:2px solid;display:flex;align-items:center;justify-content:center;font-size:18px;flex:none}' +
    '.lc7 .md{flex:1;min-width:0}' +
    '.lc7 .l1{display:flex;justify-content:space-between;font-size:15px;font-weight:600}' +
    '.lc7 .l1 .p{color:var(--mut);font-weight:600;font-size:13px}' +
    '.lc7 .l2{font-size:12px;color:var(--mut);margin-top:1px}' +
    '.lc7 .l2.ex{color:var(--err)}' +
    '.lc7 .br{height:6px;border-radius:3px;background:var(--bd);margin-top:6px;overflow:hidden}' +
    '.lc7 .br i{display:block;height:100%;border-radius:3px}' +
    '.lc7 .mais{font-size:13px;color:var(--mut);padding-top:6px}' +
    '.lc7 .ver{display:block;text-align:center;padding:10px 0 2px;color:var(--pri);font-weight:600;font-size:14px;text-decoration:none}';
  document.head.appendChild(st);

  function el(tag, cls, txt) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt !== undefined) e.textContent = txt;
    return e;
  }
  function sv(tag, attrs) {
    var e = document.createElementNS(NS, tag);
    Object.keys(attrs).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    return e;
  }

  var catsCard = document.getElementById('cats');
  if (!catsCard) return;
  var h2Orig = catsCard.previousElementSibling;

  var h2 = el('h2', '', 'Categorias');
  var card = el('div', 'card');
  card.id = 'rosca7';
  catsCard.parentNode.insertBefore(h2, h2Orig || catsCard);
  catsCard.parentNode.insertBefore(card, h2Orig || catsCard);
  if (h2Orig) h2Orig.style.display = 'none';
  catsCard.style.display = 'none';

  async function lerLimites() {
    if (Date.now() - limTempo < 30000) return;
    limTempo = Date.now();
    var r = await db.from('orcamentos_cat').select('categoria,limite');
    limites = {};
    if (!r.error) r.data.forEach(function (x) { limites[x.categoria] = Number(x.limite); });
    desenhar();
  }

  function desenhar() {
    card.innerHTML = '';
    var porCat = {};
    dados.forEach(function (x) { porCat[x.categoria] = (porCat[x.categoria] || 0) + Number(x.valor); });
    var arr = Object.keys(porCat).map(function (c) { return [c, porCat[c]]; })
      .sort(function (a, b) { return b[1] - a[1]; });
    var tot = arr.reduce(function (s, x) { return s + x[1]; }, 0);
    if (!arr.length || tot <= 0) {
      card.appendChild(el('div', 'mut', 'Sem gastos neste mês.'));
      return;
    }

    /* rosca */
    var W = 340, H = 300, CX = 170, CY = 150, R = 82, SW = 26;
    var C = 2 * Math.PI * R;
    var box = el('div', 'ro7');
    var svg = sv('svg', {viewBox: '0 0 ' + W + ' ' + H});
    box.appendChild(svg);
    var inicio = 0;
    arr.forEach(function (p, idx) {
      var frac = p[1] / tot;
      var len = Math.max(frac * C - 2, 1);
      var seg = sv('circle', {
        cx: CX, cy: CY, r: R, fill: 'none', stroke: corCat(p[0]), 'stroke-width': SW,
        'stroke-dasharray': len + ' ' + (C - len),
        'stroke-dashoffset': -(inicio * C),
        transform: 'rotate(-90 ' + CX + ' ' + CY + ')'
      });
      svg.appendChild(seg);
      if (idx < 8 && frac >= 0.025) {
        var ang = (inicio + frac / 2) * 2 * Math.PI - Math.PI / 2;
        var cs = Math.cos(ang), sn = Math.sin(ang);
        svg.appendChild(sv('line', {
          x1: CX + (R + SW / 2 + 2) * cs, y1: CY + (R + SW / 2 + 2) * sn,
          x2: CX + 112 * cs, y2: CY + 112 * sn,
          stroke: corCat(p[0]), 'stroke-width': 1.5, 'stroke-opacity': .7
        }));
        var bb = el('div', 'bb');
        bb.style.left = ((CX + 128 * cs) / W * 100) + '%';
        bb.style.top = ((CY + 128 * sn) / H * 100) + '%';
        bb.style.borderColor = corCat(p[0]);
        bb.style.color = corCat(p[0]);
        var i = el('i', 'ti ti-' + iconeCat(p[0]));
        bb.appendChild(i);
        box.appendChild(bb);
      }
      inicio += frac;
    });
    var ctr = el('div', 'ctr');
    ctr.appendChild(el('small', '', 'Total'));
    ctr.appendChild(el('b', '', brl(tot)));
    box.appendChild(ctr);
    card.appendChild(box);

    /* lista */
    var lista = el('div', 'lc7');
    arr.slice(0, 6).forEach(function (p) {
      var c = p[0], v = p[1], lim = limites[c] || 0;
      var it = el('div', 'it');
      var ic = el('div', 'ic2');
      ic.style.borderColor = corCat(c);
      ic.style.color = corCat(c);
      ic.appendChild(el('i', 'ti ti-' + iconeCat(c)));
      var md = el('div', 'md');
      var l1 = el('div', 'l1');
      l1.appendChild(el('span', '', c));
      l1.appendChild(el('span', 'p', Math.round(v / tot * 100) + '%'));
      var l2 = el('div', 'l2');
      var br = el('div', 'br'), bi = el('i');
      if (lim > 0) {
        var pc = v / lim * 100;
        l2.textContent = brl(v) + ' | ' + brl(lim) + (pc > 100 ? ' · passou ' + brl(v - lim) : '');
        if (pc > 100) l2.className = 'l2 ex';
        bi.style.width = Math.min(pc, 100) + '%';
        bi.style.background = pc > 100 ? '#dc2626' : corCat(c);
      } else {
        l2.textContent = brl(v);
        bi.style.width = Math.max(v / tot * 100, 2) + '%';
        bi.style.background = corCat(c);
      }
      br.appendChild(bi);
      md.appendChild(l1); md.appendChild(l2); md.appendChild(br);
      it.appendChild(ic); it.appendChild(md);
      lista.appendChild(it);
    });
    if (arr.length > 6) {
      var resto = arr.slice(6);
      lista.appendChild(el('div', 'mais', '+ outras ' + resto.length + ' categoria' + (resto.length > 1 ? 's' : '') + ' · ' +
        brl(resto.reduce(function (s, x) { return s + x[1]; }, 0))));
    }
    var ver = el('a', 'ver', 'Definir limites por categoria →');
    ver.href = 'planejamento.html';
    lista.appendChild(ver);
    card.appendChild(lista);
  }

  var renderOriginal = window.render;
  if (typeof renderOriginal === 'function') {
    window.render = function () {
      var r = renderOriginal.apply(this, arguments);
      try { desenhar(); } catch (e) { if (window.console) console.error(e); }
      clearTimeout(timer);
      timer = setTimeout(lerLimites, 400);
      return r;
    };
  }
  try { desenhar(); } catch (e2) {}
  lerLimites();
})();
