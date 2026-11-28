(function () {
  if (!/inicio\.html$/i.test(location.pathname) || window.Balanco7Loaded) return;
  window.Balanco7Loaded = true;

  var NS = 'http://www.w3.org/2000/svg';
  var VERDE = '#22c55e', VERM = '#f87171';
  var per = 'ano', estilo = 'area', ano = new Date().getFullYear();
  var cacheAno = {ano: 0, t: 0, g: [], e: []};
  var card = null, corpo = null, timer = null;

  var st = document.createElement('style');
  st.textContent =
    '.b7h{display:flex;justify-content:space-between;align-items:center;gap:8px}' +
    '.b7h strong{font-size:16px}' +
    '.b7seg{display:inline-flex;border:1px solid var(--bd);border-radius:12px;padding:3px;gap:2px}' +
    '.b7seg button{border:0;background:none;color:var(--mut);font:inherit;font-size:13px;font-weight:600;padding:6px 12px;border-radius:9px;cursor:pointer}' +
    '.b7seg button.on{background:var(--tint);color:var(--txt)}' +
    '.b7r2{display:flex;justify-content:space-between;align-items:center;margin-top:12px}' +
    '.b7ano{display:flex;align-items:center;gap:2px;font-weight:700;font-size:14px;border:1px solid var(--bd);border-radius:12px;padding:3px 4px}' +
    '.b7ano button{border:0;background:none;color:var(--mut);font-size:18px;padding:4px 6px;cursor:pointer;line-height:1}' +
    '.b7lg{display:flex;gap:14px;font-size:12px;color:var(--mut);margin:14px 0 6px}' +
    '.b7lg i{display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:5px}' +
    '.b7svg{width:100%;height:auto;display:block}' +
    '.b7res{font-size:13px;color:var(--mut);margin-top:6px}';
  document.head.appendChild(st);

  function el(tag, cls, txt) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt !== undefined) e.textContent = txt;
    return e;
  }
  function sv(tag, a) {
    var e = document.createElementNS(NS, tag);
    Object.keys(a).forEach(function (k) { e.setAttribute(k, a[k]); });
    return e;
  }
  function seg(opcoes, atual, aoClicar) {
    var s = el('div', 'b7seg');
    opcoes.forEach(function (o) {
      var b = el('button', o[0] === atual ? 'on' : '', o[1]);
      b.type = 'button';
      b.onclick = function () { aoClicar(o[0]); };
      s.appendChild(b);
    });
    return s;
  }

  async function buscar(tabela, campos, ini, fim) {
    var tudo = [], de = 0;
    while (true) {
      var r = await db.from(tabela).select(campos).gte('data', ini).lt('data', fim)
        .order('data').order('id').range(de, de + 999);
      if (r.error) return tudo;
      tudo = tudo.concat(r.data);
      if (r.data.length < 1000) break;
      de += 1000;
    }
    return tudo;
  }
  async function carregarAno() {
    if (cacheAno.ano === ano && Date.now() - cacheAno.t < 30000) return;
    var a = ano;
    var g = await buscar('gastos', 'id,data,valor', a + '-01-01', (a + 1) + '-01-01');
    var e = await buscar('entradas', 'id,data,valor', a + '-01-01', (a + 1) + '-01-01');
    if (a !== ano) return;
    cacheAno = {ano: a, t: Date.now(), g: g, e: e};
    desenhar();
  }

  function grafico(labels, rec, des, passoLabel) {
    var W = 340, H = 170, PL = 8, PR = 8, PT = 10, PB = 22;
    var n = labels.length;
    var max = Math.max.apply(null, rec.concat(des).concat([1]));
    var svg = sv('svg', {viewBox: '0 0 ' + W + ' ' + H, 'class': 'b7svg'});
    var base = H - PB, alt = base - PT;
    var X = function (i) { return n > 1 ? PL + i * (W - PL - PR) / (n - 1) : W / 2; };
    var Y = function (v) { return base - v / max * alt; };
    svg.appendChild(sv('line', {x1: PL, y1: base, x2: W - PR, y2: base, stroke: 'var(--bd)', 'stroke-width': 1}));

    if (estilo === 'barra') {
      var slot = (W - PL - PR) / n, bw = Math.max(2, Math.min(12, slot / 2.6));
      for (var i = 0; i < n; i++) {
        var cx = PL + slot * i + slot / 2;
        [[rec[i], VERDE, -bw], [des[i], VERM, 0]].forEach(function (p) {
          var h = Math.max(p[0] > 0 ? 2 : 0, p[0] / max * alt);
          svg.appendChild(sv('rect', {x: cx + p[2], y: base - h, width: bw - 1, height: h, rx: 2, fill: p[1]}));
        });
      }
    } else {
      [[rec, VERDE], [des, VERM]].forEach(function (s, k) {
        var pts = s[0].map(function (v, i) { return X(i).toFixed(1) + ',' + Y(v).toFixed(1); });
        if (estilo === 'area') {
          var gid = 'g7' + k;
          var defs = sv('defs', {});
          var lg = sv('linearGradient', {id: gid, x1: 0, y1: 0, x2: 0, y2: 1});
          lg.appendChild(sv('stop', {offset: '0%', 'stop-color': s[1], 'stop-opacity': .35}));
          lg.appendChild(sv('stop', {offset: '100%', 'stop-color': s[1], 'stop-opacity': 0}));
          defs.appendChild(lg);
          svg.appendChild(defs);
          svg.appendChild(sv('polygon', {points: X(0).toFixed(1) + ',' + base + ' ' + pts.join(' ') + ' ' + X(n - 1).toFixed(1) + ',' + base, fill: 'url(#' + gid + ')'}));
        }
        svg.appendChild(sv('polyline', {points: pts.join(' '), fill: 'none', stroke: s[1], 'stroke-width': 2.2, 'stroke-linejoin': 'round', 'stroke-linecap': 'round'}));
      });
    }
    labels.forEach(function (l, i) {
      if (i % passoLabel) return;
      var cx = estilo === 'barra' ? PL + (W - PL - PR) / n * i + (W - PL - PR) / n / 2 : X(i);
      var t = sv('text', {x: cx.toFixed(1), y: H - 6, 'text-anchor': 'middle', 'font-size': 10, fill: 'var(--mut)'});
      t.textContent = l;
      svg.appendChild(t);
    });
    return svg;
  }

  function desenhar() {
    if (!card) return;
    corpo.innerHTML = '';
    var cab = el('div', 'b7h');
    cab.appendChild(el('strong', '', 'Balanço mensal'));
    cab.appendChild(seg([['ano', 'Ano'], ['mes', 'Mês']], per, function (v) { per = v; desenhar(); if (v === 'ano') carregarAno(); }));
    corpo.appendChild(cab);

    var r2 = el('div', 'b7r2');
    r2.appendChild(seg([['area', 'Área'], ['linha', 'Linha'], ['barra', 'Barra']], estilo, function (v) { estilo = v; desenhar(); }));
    if (per === 'ano') {
      var an = el('div', 'b7ano');
      var bp = el('button', '', '‹'), bn = el('button', '', '›');
      bp.type = bn.type = 'button';
      bp.onclick = function () { ano--; desenhar(); carregarAno(); };
      bn.onclick = function () { ano++; desenhar(); carregarAno(); };
      an.appendChild(bp); an.appendChild(el('span', '', String(ano))); an.appendChild(bn);
      r2.appendChild(an);
    } else {
      r2.appendChild(el('span', 'mut', nomeMes(mes, 'long') + ' ' + mes.slice(0, 4)));
    }
    corpo.appendChild(r2);

    var lg = el('div', 'b7lg');
    lg.innerHTML = '<span><i style="background:' + VERDE + '"></i>Receitas</span><span><i style="background:' + VERM + '"></i>Despesas</span>';
    corpo.appendChild(lg);

    var labels = [], rec = [], des = [], passo = 1;
    if (per === 'ano') {
      for (var m = 1; m <= 12; m++) {
        var k = ano + '-' + ('0' + m).slice(-2);
        labels.push(['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'][m - 1]);
        rec.push(cacheAno.ano === ano ? soma(cacheAno.e.filter(function (x) { return x.data.slice(0, 7) === k; })) : 0);
        des.push(cacheAno.ano === ano ? soma(cacheAno.g.filter(function (x) { return x.data.slice(0, 7) === k; })) : 0);
      }
    } else {
      var dias = new Date(+mes.slice(0, 4), +mes.slice(5, 7), 0).getDate();
      for (var d = 1; d <= dias; d++) {
        var iso = mes.slice(0, 8) + ('0' + d).slice(-2);
        labels.push(String(d));
        rec.push(soma(entradas.filter(function (x) { return x.data === iso; })));
        des.push(soma(dados.filter(function (x) { return x.data === iso; })));
      }
      passo = 5;
    }
    corpo.appendChild(grafico(labels, rec, des, passo));
    var tr = rec.reduce(function (s, v) { return s + v; }, 0), td = des.reduce(function (s, v) { return s + v; }, 0);
    corpo.appendChild(el('div', 'b7res', 'Receitas ' + brl(tr) + ' · Despesas ' + brl(td) + ' · Saldo ' + (tr - td >= 0 ? '+' : '-') + brl(Math.abs(tr - td))));
  }

  var tent = 0;
  var espera = setInterval(function () {
    tent++;
    card = document.querySelector('.bal7');
    if (card) {
      clearInterval(espera);
      [].slice.call(card.children).forEach(function (c) { c.style.display = 'none'; });
      corpo = el('div');
      card.appendChild(corpo);
      var ro = window.render;
      if (typeof ro === 'function') {
        window.render = function () {
          var r = ro.apply(this, arguments);
          clearTimeout(timer);
          timer = setTimeout(function () { desenhar(); if (per === 'ano') carregarAno(); }, 700);
          return r;
        };
      }
      desenhar();
      carregarAno();
    } else if (tent > 150) {
      clearInterval(espera);
    }
  }, 100);
})();
