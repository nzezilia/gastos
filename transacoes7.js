(function () {
  var wrap = document.querySelector('.wrap');
  if (!wrap || window.Transacoes7Loaded) return;
  window.Transacoes7Loaded = true;

  var MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  var CORES = ['#2563eb', '#7c3aed', '#db2777', '#ea580c', '#16a34a', '#0891b2', '#ca8a04', '#475569'];

  var st = document.createElement('style');
  st.textContent =
    '.hdr{display:none!important}' +
    '.tt7{display:flex;align-items:center;justify-content:space-between;margin:20px 0 12px}' +
    '.tt7 h1{margin:0!important}' +
    '.per7{display:flex;align-items:center;gap:8px;margin-bottom:12px}' +
    '.per7 select{width:auto;flex:none;padding:10px 12px;border-radius:999px;font-size:14px;font-weight:600}' +
    '.per7 .ms{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch;flex:1}' +
    '.per7 .ms::-webkit-scrollbar{display:none}' +
    '.per7 .ms button{flex:none;padding:10px 16px;border-radius:999px;border:1px solid var(--bd);background:var(--card);color:var(--mut);font:inherit;font-size:14px;font-weight:600;cursor:pointer}' +
    '.per7 .ms button.on{background:var(--txt);border-color:var(--txt);color:var(--bg)}' +
    '.dh7{display:flex;justify-content:space-between;align-items:baseline;font-size:13px;color:var(--mut);padding:16px 0 4px}' +
    '.dh7:first-child{padding-top:0}' +
    '.dh7 b{font-weight:600}' +
    '.l7w{position:relative;width:44px;height:44px;flex:none}' +
    '.lgb7{width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:14px}' +
    '.l7w .mi7{position:absolute;right:-3px;bottom:-3px;width:20px;height:20px;border-radius:50%;border:2px solid var(--card);color:#fff;display:flex;align-items:center;justify-content:center;font-size:11px}' +
    '.tx .st7{font-size:11px;font-weight:600;margin-top:1px}';
  document.head.appendChild(st);

  function el(tag, cls, txt) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt !== undefined) e.textContent = txt;
    return e;
  }
  function corDe(nome) {
    var h = 0;
    for (var i = 0; i < nome.length; i++) h = (h * 31 + nome.charCodeAt(i)) >>> 0;
    return CORES[h % CORES.length];
  }
  function inicial(nome) {
    var p = nome.replace(/^(cart[aã]o|conta)\s+/i, '').trim().split(/\s+/).filter(Boolean);
    var gr = p.filter(function (w) { return w.length > 2; });
    if (gr.length >= 2) return (gr[0][0] + gr[1][0]).toUpperCase();
    var w = gr[0] || p[0] || '?';
    return w.slice(0, 2).toUpperCase();
  }

  /* ---------- título e seletor de período ---------- */
  var busca = wrap.querySelector('.busca');
  var tt = el('div', 'tt7');
  tt.appendChild(el('h1', '', 'Transações'));
  var per = el('div', 'per7');
  var selAno = document.createElement('select');
  var ms = el('div', 'ms');
  per.appendChild(selAno);
  per.appendChild(ms);
  wrap.insertBefore(tt, busca);
  wrap.insertBefore(per, busca);

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

  var carregarOriginal = window.carregar;
  window.carregar = async function () {
    desenharPeriodo();
    return carregarOriginal.apply(this, arguments);
  };
  desenharPeriodo();

  /* ---------- linhas com logo e status ---------- */
  function trocarIcone(row, nome, categoria) {
    var ic = row.querySelector('.ic');
    if (!ic) return;
    var w = el('div', 'l7w');
    var b = el('div', 'lgb7');
    if (nome === 'Pix' || nome === 'Dinheiro') {
      b.style.background = 'var(--tint)';
      b.style.color = 'var(--pri)';
      b.appendChild(el('i', 'ti ti-' + (nome === 'Pix' ? 'bolt' : 'cash')));
      b.firstChild.style.fontSize = '22px';
    } else {
      b.setAttribute('data-logo', nome);
      b.style.background = corDe(nome);
      b.textContent = inicial(nome);
    }
    w.appendChild(b);
    var mi = el('span', 'mi7');
    mi.style.background = corCat(categoria);
    mi.appendChild(el('i', 'ti ti-' + iconeCat(categoria)));
    w.appendChild(mi);
    ic.parentNode.replaceChild(w, ic);
  }
  function status(row, texto, cor) {
    var vl = row.querySelector('.vl');
    if (!vl) return;
    var s = el('div', 'st7', texto);
    s.style.color = cor;
    vl.appendChild(s);
  }

  function linhaSaida(g, aoSalvar) {
    var row = criarTx(g, aoSalvar);
    trocarIcone(row, g.meio_pagamento, g.categoria);
    var futuro = g.data > hoje();
    status(row, futuro ? 'Pendente' : 'Pago', futuro ? 'var(--warn)' : 'var(--ok)');
    return row;
  }
  function linhaEntrada(e, aoSalvar) {
    var row = window.criarTxEntrada(e, aoSalvar);
    if (e.conta) {
      trocarIcone(row, e.conta, e.categoria);
      var ic = row.querySelector('.s');
      if (ic) ic.textContent = (e.descricao ? e.categoria + ' · ' : '') + e.conta + (e.recorrente_id ? ' · fixa' : '');
    }
    status(row, e.data > hoje() ? 'Previsto' : 'Recebido', e.data > hoje() ? 'var(--warn)' : 'var(--ok)');
    return row;
  }

  /* ---------- cabeçalho do dia com o total líquido ---------- */
  function rotuloDia(s) {
    var d = paraData(s);
    var sem = d.toLocaleDateString('pt-BR', {weekday: 'long'}).split('-')[0];
    sem = sem.charAt(0).toUpperCase() + sem.slice(1);
    return sem + ', ' + d.getDate() + ' de ' + d.toLocaleDateString('pt-BR', {month: 'long'});
  }

  window.agruparMisto = function (items, aoSalvar, box) {
    box.innerHTML = '';
    var grupos = [], atual = null;
    items.forEach(function (x) {
      if (!atual || atual.data !== x.data) { atual = {data: x.data, itens: []}; grupos.push(atual); }
      atual.itens.push(x);
    });
    grupos.forEach(function (gp) {
      var liq = 0;
      gp.itens.forEach(function (x) { liq += x._e ? Number(x.valor) : -Number(x.valor); });
      var h = el('div', 'dh7');
      h.appendChild(el('span', '', rotuloDia(gp.data)));
      h.appendChild(el('b', '', (liq >= 0 ? '+' : '-') + brl(Math.abs(liq))));
      box.appendChild(h);
      gp.itens.forEach(function (x) {
        box.appendChild(x._e ? linhaEntrada(x, aoSalvar) : linhaSaida(x, aoSalvar));
      });
    });
  };
})();
