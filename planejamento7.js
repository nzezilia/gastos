(function () {
  var wrap = document.querySelector('.wrap');
  if (!wrap || window.Plan7Loaded) return;
  window.Plan7Loaded = true;

  var NS = 'http://www.w3.org/2000/svg';
  var MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  var GRUPOS = [
    {id: 'ess', nome: 'Essencial', cor: '#60a5fa', cats: ['Mercado', 'Alimentação', 'Transporte', 'Moradia', 'Saúde', 'Educação']},
    {id: 'est', nome: 'Estilo de vida', cor: '#f472b6', cats: ['Lazer', 'Assinaturas', 'Compras', 'Outros']}
  ];
  var abertos = {ess: true, est: true};

  var st = document.createElement('style');
  st.textContent =
    '.hdr{display:none!important}' +
    '#geral,#cats,#notaCats{display:none!important}' +
    '.tt7{display:flex;align-items:center;justify-content:space-between;margin:20px 0 12px}' +
    '.tt7 h1{margin:0!important}' +
    '.per7{display:flex;align-items:center;gap:8px;margin-bottom:14px}' +
    '.per7 select{width:auto;flex:none;padding:10px 12px;border-radius:999px;font-size:14px;font-weight:600}' +
    '.per7 .ms{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch;flex:1}' +
    '.per7 .ms::-webkit-scrollbar{display:none}' +
    '.per7 .ms button{flex:none;padding:10px 16px;border-radius:999px;border:1px solid var(--bd);background:var(--card);color:var(--mut);font:inherit;font-size:14px;font-weight:600;cursor:pointer}' +
    '.per7 .ms button.on{background:var(--txt);border-color:var(--txt);color:var(--bg)}' +
    '.sm7 small{display:block;color:var(--mut);font-size:13px}' +
    '.sm7 .v{font-size:38px;font-weight:700;letter-spacing:-.02em;margin:2px 0;color:var(--pri)}' +
    '.sm7 .v.neg{color:var(--err)}' +
    '.sm7 .s{font-size:13px;color:var(--mut)}' +
    '.sm7 .bar{height:8px;border-radius:4px;background:var(--bd);margin-top:12px;overflow:hidden}' +
    '.sm7 .bar i{display:block;height:100%;border-radius:4px}' +
    '.sm7 .lk{display:inline-block;margin-top:12px;color:var(--pri);font-size:13px;font-weight:600;cursor:pointer}' +
    '.an7 .tt{font-size:13px;color:var(--mut);margin-bottom:14px}' +
    '.an7 .gr{display:grid;grid-template-columns:1fr 1fr;gap:10px;text-align:center}' +
    '.an7 .gr svg{width:92px;height:92px;display:block;margin:0 auto 8px}' +
    '.an7 .gr b{display:block;font-size:14px}' +
    '.an7 .gr small{display:block;font-size:12px;color:var(--mut);margin-top:2px}' +
    '.gp7{margin-top:12px}' +
    '.gp7 .gh{display:flex;align-items:center;gap:8px;cursor:pointer}' +
    '.gp7 .gh .ch{color:var(--mut);font-size:18px;transition:transform .15s}' +
    '.gp7 .gh.fe .ch{transform:rotate(-90deg)}' +
    '.gp7 .gh .dt{width:10px;height:10px;border-radius:50%;flex:none}' +
    '.gp7 .gh .nm{font-size:17px;font-weight:700;flex:1}' +
    '.gp7 .gh .tv{font-size:16px;font-weight:700}' +
    '.gp7 .gs{font-size:12px;color:var(--mut);margin:6px 0 0 36px}' +
    '.gp7 .gb{height:6px;border-radius:3px;background:var(--bd);margin:8px 0 4px;overflow:hidden}' +
    '.gp7 .gb i{display:block;height:100%;border-radius:3px}' +
    '.gp7 .rows{margin-top:6px}' +
    '.gp7 .rw{display:flex;gap:12px;align-items:center;padding:11px 0;border-top:1px solid var(--bd);cursor:pointer}' +
    '.gp7 .ic2{width:40px;height:40px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:20px;flex:none}' +
    '.gp7 .md{flex:1;min-width:0}' +
    '.gp7 .md b{display:block;font-size:15px}' +
    '.gp7 .md small{display:block;font-size:12px;color:var(--mut);margin-top:1px}' +
    '.gp7 .md .br{height:5px;border-radius:3px;background:var(--bd);margin-top:7px;overflow:hidden;max-width:160px}' +
    '.gp7 .md .br i{display:block;height:100%;border-radius:3px}' +
    '.gp7 .rt{text-align:right;flex:none}' +
    '.gp7 .rt b{display:block;font-size:14px}' +
    '.gp7 .rt small{display:block;font-size:12px;color:var(--mut);margin-top:1px}';
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
  function corPct(p) { return p > 100 ? '#ef4444' : p >= 80 ? '#d97706' : '#16a34a'; }

  /* ---------- estrutura ---------- */
  var geral = document.getElementById('geral');
  var tt = el('div', 'tt7');
  tt.appendChild(el('h1', '', 'Orçamento'));
  var per = el('div', 'per7');
  var selAno = document.createElement('select');
  var ms = el('div', 'ms');
  per.appendChild(selAno);
  per.appendChild(ms);
  var resumo = el('div', 'card sm7');
  var aneis = el('div', 'card an7');
  aneis.style.marginTop = '12px';
  var grupos = el('div');
  [tt, per, resumo, aneis, grupos].forEach(function (n) { wrap.insertBefore(n, geral); });
  var h2cat = wrap.querySelector('h2');
  if (h2cat && h2cat.textContent.indexOf('Orçamento por categoria') >= 0) h2cat.style.display = 'none';

  function ir(ano, m) {
    mes = ano + '-' + ('0' + m).slice(-2) + '-01';
    carregar();
  }
  function desenharPeriodo() {
    var ano = +mes.slice(0, 4), mm = +mes.slice(5, 7);
    var y0 = new Date().getFullYear();
    selAno.innerHTML = '';
    for (var y = y0 - 3; y <= y0 + 3; y++) {
      var o = document.createElement('option');
      o.value = y;
      o.textContent = y;
      selAno.appendChild(o);
    }
    selAno.value = ano;
    selAno.onchange = function () { ir(+selAno.value, mm); };
    ms.innerHTML = '';
    MESES.forEach(function (n, i) {
      var b = el('button', i + 1 === mm ? 'on' : '', n);
      b.type = 'button';
      b.onclick = function () { ir(ano, i + 1); };
      ms.appendChild(b);
    });
    var on = ms.querySelector('.on');
    if (on) ms.scrollLeft = on.offsetLeft - ms.clientWidth / 2 + on.offsetWidth / 2;
  }

  /* ---------- dados por grupo ---------- */
  function dadosGrupos() {
    var porCat = {};
    dados.forEach(function (x) { porCat[x.categoria] = (porCat[x.categoria] || 0) + Number(x.valor); });
    var conhecidas = {};
    GRUPOS.forEach(function (g) { g.cats.forEach(function (c) { conhecidas[c] = true; }); });
    return GRUPOS.map(function (g, i) {
      var cats = g.cats.slice();
      if (i === GRUPOS.length - 1) {
        Object.keys(porCat).forEach(function (c) { if (!conhecidas[c]) cats.push(c); });
        Object.keys(limitesCat).forEach(function (c) { if (!conhecidas[c] && cats.indexOf(c) < 0) cats.push(c); });
      }
      var linhas = cats.map(function (c) { return {c: c, gasto: porCat[c] || 0, lim: limitesCat[c] || 0}; });
      return {
        g: g, linhas: linhas,
        gasto: linhas.reduce(function (s, x) { return s + x.gasto; }, 0),
        plan: linhas.reduce(function (s, x) { return s + x.lim; }, 0)
      };
    });
  }

  function desenharResumo(gs) {
    resumo.innerHTML = '';
    var gasto = soma(dados);
    var somaLim = gs.reduce(function (s, x) { return s + x.plan; }, 0);
    var plan = somaLim > 0 ? somaLim : limite;
    var nome = nomeMes(mes, 'long');
    if (!(plan > 0)) {
      resumo.appendChild(el('small', '', 'Gasto em ' + nome));
      resumo.appendChild(el('div', 'v', brl(gasto)));
      resumo.appendChild(el('div', 's', 'Defina limites por categoria (toque numa categoria abaixo) ou um orçamento do mês.'));
    } else {
      var dif = plan - gasto;
      resumo.appendChild(el('small', '', dif >= 0 ? 'Sobrou em ' + nome : 'Passou em ' + nome));
      resumo.appendChild(el('div', 'v' + (dif < 0 ? ' neg' : ''), brl(Math.abs(dif))));
      resumo.appendChild(el('div', 's', 'Gastou ' + brl(gasto) + ' de ' + brl(plan) + ' planejado'));
      var bar = el('div', 'bar'), bi = el('i');
      var p = gasto / plan * 100;
      bi.style.width = Math.min(p, 100) + '%';
      bi.style.background = p > 100 ? '#ef4444' : 'var(--pri)';
      bar.appendChild(bi);
      resumo.appendChild(bar);
    }
    var lk = el('span', 'lk', limite > 0 ? 'Orçamento do mês: ' + brl(limite) + ' · editar' : 'Definir orçamento do mês');
    lk.onclick = function () { editarLimite(); };
    resumo.appendChild(lk);
  }

  function anel(p, temPlan) {
    var R = 36, C = 2 * Math.PI * R;
    var svg = sv('svg', {viewBox: '0 0 92 92'});
    svg.appendChild(sv('circle', {cx: 46, cy: 46, r: R, fill: 'none', stroke: 'var(--bd)', 'stroke-width': 8}));
    if (temPlan) {
      var len = Math.min(p, 100) / 100 * C;
      svg.appendChild(sv('circle', {
        cx: 46, cy: 46, r: R, fill: 'none', stroke: corPct(p), 'stroke-width': 8, 'stroke-linecap': 'round',
        'stroke-dasharray': len + ' ' + (C - len), transform: 'rotate(-90 46 46)'
      }));
    }
    var t = sv('text', {x: 46, y: 51, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 700, fill: temPlan ? corPct(p) : 'var(--mut)'});
    t.textContent = Math.round(p) + '%';
    svg.appendChild(t);
    return svg;
  }

  function desenharAneis(gs) {
    aneis.innerHTML = '';
    aneis.appendChild(el('div', 'tt', 'Quanto do planejado já foi usado'));
    var gr = el('div', 'gr');
    gs.forEach(function (x) {
      var d = el('div');
      var p = x.plan > 0 ? x.gasto / x.plan * 100 : 0;
      d.appendChild(anel(p, x.plan > 0));
      d.appendChild(el('b', '', x.g.nome));
      d.appendChild(el('small', '', x.plan > 0 ? 'de ' + brl(x.plan) : 'sem planejado'));
      gr.appendChild(d);
    });
    aneis.appendChild(gr);
  }

  function desenharGrupos(gs) {
    grupos.innerHTML = '';
    gs.forEach(function (x) {
      var card = el('div', 'card gp7');
      var gh = el('div', 'gh' + (abertos[x.g.id] ? '' : ' fe'));
      gh.appendChild(el('i', 'ti ti-chevron-down ch'));
      var dt = el('span', 'dt');
      dt.style.background = x.g.cor;
      gh.appendChild(dt);
      gh.appendChild(el('span', 'nm', x.g.nome));
      var tv = el('span', 'tv', brl(x.gasto));
      if (x.plan > 0 && x.gasto > x.plan) tv.style.color = '#ef4444';
      gh.appendChild(tv);
      gh.onclick = function () { abertos[x.g.id] = !abertos[x.g.id]; desenharGrupos(gs); };
      card.appendChild(gh);
      card.appendChild(el('div', 'gs', x.plan > 0 ? brl(x.gasto) + ' de ' + brl(x.plan) : 'Sem limite definido neste grupo'));
      if (x.plan > 0) {
        var gb = el('div', 'gb'), gi = el('i');
        var pg = x.gasto / x.plan * 100;
        gi.style.width = Math.min(pg, 100) + '%';
        gi.style.background = corPct(pg);
        gb.appendChild(gi);
        card.appendChild(gb);
      }
      if (abertos[x.g.id]) {
        var rows = el('div', 'rows');
        var ord = x.linhas.slice().sort(function (a, b) {
          if ((b.lim > 0) !== (a.lim > 0)) return (b.lim > 0) - (a.lim > 0);
          if (a.lim > 0) return (b.gasto / b.lim) - (a.gasto / a.lim);
          return b.gasto - a.gasto;
        });
        ord.forEach(function (l) {
          var rw = el('div', 'rw');
          rw.onclick = function () { editarLimiteCat(l.c); };
          var ic = el('div', 'ic2');
          ic.style.background = 'color-mix(in srgb, ' + corCat(l.c) + ' 16%, transparent)';
          ic.style.color = corCat(l.c);
          ic.appendChild(el('i', 'ti ti-' + iconeCat(l.c)));
          var md = el('div', 'md');
          md.appendChild(el('b', '', l.c));
          var rt = el('div', 'rt');
          if (l.lim > 0) {
            var pc = l.gasto / l.lim * 100;
            md.appendChild(el('small', '', brl(l.gasto) + ' de ' + brl(l.lim)));
            var br = el('div', 'br'), bi = el('i');
            bi.style.width = Math.min(pc, 100) + '%';
            bi.style.background = corPct(pc);
            br.appendChild(bi);
            md.appendChild(br);
            var b = el('b', '', pc > 100 ? 'Passou ' + brl(l.gasto - l.lim) : 'Sobra ' + brl(l.lim - l.gasto));
            b.style.color = pc > 100 ? '#ef4444' : '#16a34a';
            rt.appendChild(b);
            rt.appendChild(el('small', '', pc > 100 ? Math.round(pc) + '% do limite' : Math.round(pc) + '% usado'));
          } else {
            md.appendChild(el('small', '', l.gasto > 0 ? brl(l.gasto) : 'Sem gastos'));
            var b2 = el('b', '', 'Definir limite');
            b2.style.color = 'var(--mut)';
            b2.style.fontWeight = '500';
            rt.appendChild(b2);
          }
          rw.appendChild(ic); rw.appendChild(md); rw.appendChild(rt);
          rows.appendChild(rw);
        });
        card.appendChild(rows);
      }
      grupos.appendChild(card);
    });
  }

  function desenhar() {
    desenharPeriodo();
    if (typeof semTabelas !== 'undefined' && semTabelas) {
      resumo.innerHTML = '';
      resumo.appendChild(el('div', 'mut', 'As tabelas de planejamento ainda não existem no banco.'));
      aneis.style.display = 'none';
      grupos.innerHTML = '';
      return;
    }
    aneis.style.display = '';
    var gs = dadosGrupos();
    desenharResumo(gs);
    desenharAneis(gs);
    desenharGrupos(gs);
  }

  var renderOriginal = window.render;
  window.render = function () {
    var r = renderOriginal.apply(this, arguments);
    try { desenhar(); } catch (e) { if (window.console) console.error(e); }
    return r;
  };
  try { desenhar(); } catch (e2) {}
})();
