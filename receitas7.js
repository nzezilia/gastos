(function () {
  var wrap = document.querySelector('.wrap');
  if (!wrap || window.Receitas7Loaded) return;
  window.Receitas7Loaded = true;

  var ICO = {'Salário': 'wallet', 'Renda extra': 'briefcase', 'Rendimentos': 'trending-up', 'Reembolso': 'receipt-refund', 'Presente': 'gift', 'Outros': 'dots'};
  var lista = [], mesLido = '', aberto = false, timer = null;

  var st = document.createElement('style');
  st.textContent =
    '.rc7{margin-top:12px}' +
    '.rc7 .gh{display:flex;align-items:center;gap:8px;cursor:pointer}' +
    '.rc7 .gh .ch{color:var(--mut);font-size:18px;transition:transform .15s}' +
    '.rc7 .gh.fe .ch{transform:rotate(-90deg)}' +
    '.rc7 .dt{width:10px;height:10px;border-radius:50%;background:#22c55e;flex:none}' +
    '.rc7 .nm{font-size:17px;font-weight:700;flex:1}' +
    '.rc7 .tv{font-size:16px;font-weight:700;color:#22c55e}' +
    '.rc7 .add{width:32px;height:32px;border-radius:50%;border:1px solid var(--bd);background:none;color:var(--mut);font-size:18px;display:flex;align-items:center;justify-content:center;cursor:pointer;padding:0}' +
    '.rc7 .gs{font-size:12px;color:var(--mut);margin:6px 0 0 36px;display:flex;justify-content:space-between}' +
    '.rc7 .rw{display:flex;gap:12px;align-items:center;padding:11px 0;border-top:1px solid var(--bd);cursor:pointer}' +
    '.rc7 .ic2{width:40px;height:40px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:20px;flex:none;background:color-mix(in srgb,#22c55e 16%,transparent);color:#22c55e}' +
    '.rc7 .md{flex:1;min-width:0}' +
    '.rc7 .md b{display:block;font-size:15px}' +
    '.rc7 .md small{display:block;font-size:12px;color:var(--mut);margin-top:1px}' +
    '.rc7 .rt{font-weight:700;font-size:14px;color:#22c55e}';
  document.head.appendChild(st);

  function el(tag, cls, txt) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt !== undefined) e.textContent = txt;
    return e;
  }

  var card = el('div', 'card rc7');
  var ref = wrap.querySelector('.an7');
  if (ref) ref.parentNode.insertBefore(card, ref.nextSibling);
  else wrap.insertBefore(card, document.getElementById('geral'));

  async function ler() {
    var m = mes;
    var r = await db.from('entradas').select('id,data,valor,categoria,descricao,recorrente_id')
      .gte('data', m).lt('data', addMeses(m, 1)).order('data', {ascending: false});
    if (m !== mes) return;
    lista = r.error ? [] : r.data;
    mesLido = m;
    desenhar();
  }

  function recarregar() { mesLido = ''; ler(); }

  function desenhar() {
    card.innerHTML = '';
    var tot = soma(lista);
    var gh = el('div', 'gh' + (aberto ? '' : ' fe'));
    gh.appendChild(el('i', 'ti ti-chevron-down ch'));
    gh.appendChild(el('span', 'dt'));
    gh.appendChild(el('span', 'nm', 'Receitas'));
    gh.appendChild(el('span', 'tv', brl(tot)));
    var add = el('button', 'add');
    add.type = 'button';
    add.setAttribute('aria-label', 'Nova entrada');
    add.appendChild(el('i', 'ti ti-plus'));
    add.onclick = function (e) {
      e.stopPropagation();
      if (window.abrirNovaEntrada) window.abrirNovaEntrada(recarregar);
    };
    gh.appendChild(add);
    gh.onclick = function () { aberto = !aberto; desenhar(); };
    card.appendChild(gh);

    var cats = {};
    lista.forEach(function (x) { cats[x.categoria] = (cats[x.categoria] || 0) + Number(x.valor); });
    var nCat = Object.keys(cats).length;
    var gs = el('div', 'gs');
    gs.appendChild(el('span', '', nCat ? nCat + (nCat === 1 ? ' categoria com entradas' : ' categorias com entradas') : 'Nenhuma entrada neste mês'));
    gs.appendChild(el('span', '', 'recebido este mês'));
    card.appendChild(gs);

    if (aberto && lista.length) {
      Object.keys(cats).sort(function (a, b) { return cats[b] - cats[a]; }).forEach(function (c) {
        var itens = lista.filter(function (x) { return x.categoria === c; });
        var rw = el('div', 'rw');
        rw.onclick = function () {
          if (itens.length === 1 && window.abrirEdicaoEntrada) window.abrirEdicaoEntrada(itens[0].id, recarregar);
          else location.href = 'transacoes.html';
        };
        var ic = el('div', 'ic2');
        ic.appendChild(el('i', 'ti ti-' + (ICO[c] || 'cash')));
        var md = el('div', 'md');
        md.appendChild(el('b', '', c));
        md.appendChild(el('small', '', itens.length + (itens.length === 1 ? ' entrada' : ' entradas')));
        rw.appendChild(ic); rw.appendChild(md);
        rw.appendChild(el('span', 'rt', '+ ' + brl(cats[c])));
        card.appendChild(rw);
      });
    }
  }

  var ro = window.render;
  if (typeof ro === 'function') {
    window.render = function () {
      var r = ro.apply(this, arguments);
      clearTimeout(timer);
      timer = setTimeout(function () { if (mesLido !== mes) ler(); else desenhar(); }, 200);
      return r;
    };
  }
  ler();
})();
