(function () {
  if (!/inicio\.html$/i.test(location.pathname) || window.AbasLoaded) return;
  window.AbasLoaded = true;
  var wrap = document.querySelector('.wrap');
  if (!wrap) return;

  var st = document.createElement('style');
  st.textContent =
    '.abas7{display:flex;gap:8px;margin:0 0 14px}' +
    '.abas7 button{display:inline-flex;align-items:center;gap:6px;padding:10px 18px;border-radius:999px;border:1px solid var(--bd);background:var(--card);color:var(--mut);font:inherit;font-size:14px;font-weight:600;cursor:pointer}' +
    '.abas7 button.on{background:var(--txt);border-color:var(--txt);color:var(--bg)}' +
    '.abas7 button i{font-size:18px}' +
    '.saldo7{margin-bottom:14px}' +
    '.saldo7 small{display:block;color:var(--mut);font-size:13px}' +
    '.saldo7 .sv{font-size:38px;font-weight:700;letter-spacing:-.02em;color:var(--pri);margin:2px 0}' +
    '.saldo7 .ss{font-size:13px;color:var(--mut)}' +
    '.saldo7 .ss.pos{color:var(--ok)}.saldo7 .ss.neg{color:var(--err)}' +
    '.fr7{display:grid;grid-template-columns:1fr 1fr;margin-top:12px}' +
    '.fr7>div{padding-right:12px}' +
    '.fr7>div+div{border-left:1px solid var(--bd);padding:0 0 0 16px}' +
    '.fr7 .t{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--mut)}' +
    '.fr7 .t i{width:28px;height:28px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:16px}' +
    '.fr7 .t i.in{background:color-mix(in srgb,var(--ok) 18%,transparent);color:var(--ok)}' +
    '.fr7 .t i.out{background:color-mix(in srgb,var(--err) 18%,transparent);color:var(--err)}' +
    '.fr7 b{display:block;font-size:19px;margin-top:8px}' +
    '.fr7 small{display:block;font-size:12px;color:var(--mut);margin-top:2px}' +
    '.pl7{margin-top:12px;cursor:pointer}' +
    '.pl7 .l{display:flex;justify-content:space-between;align-items:baseline;gap:8px;font-size:14px;color:var(--mut)}' +
    '.pl7 .l b{color:var(--txt);margin-left:4px}' +
    '.pl7 .l .r{font-weight:700}' +
    '.pl7 .bar{height:8px;border-radius:4px;background:var(--bd);margin-top:10px;overflow:hidden}' +
    '.pl7 .bar i{display:block;height:100%;border-radius:4px}' +
    '.bal7 .lg{display:flex;gap:14px;font-size:12px;color:var(--mut);margin:8px 0 12px}' +
    '.bal7 .lg i{display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:5px}' +
    '.bal7 .bl{display:flex;gap:6px;align-items:flex-end}' +
    '.bal7 .g{flex:1;display:flex;flex-direction:column;align-items:center;gap:6px}' +
    '.bal7 .pair{display:flex;align-items:flex-end;gap:3px;height:110px}' +
    '.bal7 .pair i{width:11px;border-radius:4px 4px 2px 2px;min-height:3px}' +
    '.bal7 .g span{font-size:11px;color:var(--mut);text-transform:capitalize}' +
    '.bal7 .g.sel span{color:var(--txt);font-weight:700}' +
    '#credito7>.card{margin-bottom:12px}';
  document.head.appendChild(st);

  function el(tag, cls, txt) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt !== undefined) e.textContent = txt;
    return e;
  }

  /* ---- abas ---- */
  var tab = 'conta';
  var barra = el('div', 'abas7');
  var bConta = el('button'); bConta.type = 'button';
  bConta.innerHTML = '<i class="ti ti-building-bank"></i>Conta';
  var bCred = el('button'); bCred.type = 'button';
  bCred.innerHTML = '<i class="ti ti-credit-card"></i>Crédito';
  barra.appendChild(bConta); barra.appendChild(bCred);

  var hdr = wrap.querySelector('.hdr');
  wrap.insertBefore(barra, hdr ? hdr.nextSibling : wrap.firstChild);

  var cred = el('div'); cred.id = 'credito7';
  wrap.insertBefore(cred, barra.nextSibling);

  /* ---- cartão de saldo ---- */
  var saldo = el('div', 'card saldo7');
  var sL = el('small', '', 'Saldo total nas contas');
  var sV = el('div', 'sv', '—');
  var sS = el('div', 'ss');
  saldo.appendChild(sL); saldo.appendChild(sV); saldo.appendChild(sS);
  var car = document.getElementById('car');
  wrap.insertBefore(saldo, car || cred.nextSibling);

  /* ---- receitas x despesas, planejado, balanço ---- */
  var fr = el('div', 'card');
  var frG = el('div', 'fr7');
  var cR = el('div'), cD = el('div');
  var rV = el('b', '', 'R$ 0,00');
  var dV = el('b', '', 'R$ 0,00');
  var dP = el('small', '');
  var tR = el('div', 't'); tR.innerHTML = '<i class="ti ti-trending-up in"></i>Receitas';
  var tD = el('div', 't'); tD.innerHTML = '<i class="ti ti-trending-down out"></i>Despesas';
  cR.appendChild(tR); cR.appendChild(rV);
  cD.appendChild(tD); cD.appendChild(dV); cD.appendChild(dP);
  frG.appendChild(cR); frG.appendChild(cD);
  fr.appendChild(frG);

  var pl = el('div', 'card pl7');
  var plL = el('div', 'l');
  var plA = el('span'), plB = el('span', 'r');
  plL.appendChild(plA); plL.appendChild(plB);
  var plBar = el('div', 'bar'), plI = el('i');
  plBar.appendChild(plI);
  pl.appendChild(plL); pl.appendChild(plBar);
  pl.onclick = function () { if (typeof editarLimite === 'function') editarLimite(); };

  var bal = el('div', 'card bal7');
  bal.appendChild(el('strong', '', 'Balanço mensal'));
  var lg = el('div', 'lg');
  lg.innerHTML = '<span><i style="background:var(--ok)"></i>Receitas</span><span><i style="background:var(--err)"></i>Despesas</span>';
  var bl = el('div', 'bl');
  bal.appendChild(lg); bal.appendChild(bl);

  var stats = wrap.querySelector('.stats');
  var ancora = stats ? stats.nextSibling : (cred.nextSibling);
  [fr, pl, bal].forEach(function (c) {
    c.style.marginTop = '12px';
    wrap.insertBefore(c, ancora);
  });

  /* ---- dados do balanço (entradas dos 6 meses) ---- */
  var cache = {mes: '', rows: []};
  async function carregarEntradas6() {
    var m = mes;
    var r = await db.from('entradas').select('data,valor')
      .gte('data', addMeses(m, -5)).lt('data', addMeses(m, 1));
    if (m !== mes) return;
    cache = {mes: m, rows: r.error ? [] : r.data};
    desenharBalanco();
  }
  function desenharBalanco() {
    bl.innerHTML = '';
    var meses = [];
    for (var k = -5; k <= 0; k++) meses.push(addMeses(mes, k).slice(0, 7));
    var rec = meses.map(function (m) { return soma(cache.rows.filter(function (x) { return x.data.slice(0, 7) === m; })); });
    var des = meses.map(function (m) { return soma(janela.filter(function (x) { return x.data.slice(0, 7) === m; })); });
    var max = Math.max.apply(null, rec.concat(des).concat([1]));
    meses.forEach(function (m, i) {
      var g = el('div', 'g' + (i === 5 ? ' sel' : ''));
      var pr = el('div', 'pair');
      var a = el('i'); a.style.background = 'var(--ok)'; a.style.height = Math.max(3, rec[i] / max * 110) + 'px';
      var b = el('i'); b.style.background = 'var(--err)'; b.style.height = Math.max(3, des[i] / max * 110) + 'px';
      pr.appendChild(a); pr.appendChild(b);
      g.appendChild(pr);
      g.appendChild(el('span', '', nomeMes(m + '-01', 'short')));
      bl.appendChild(g);
    });
  }

  function atualizar() {
    var hj = hoje();
    var tot = soma(dados), ent = soma(entradas);
    rV.textContent = brl(ent);
    dV.textContent = brl(tot);
    var pend = soma(dados.filter(function (x) { return x.data > hj; }));
    dP.textContent = pend > 0 ? 'Pendente: ' + brl(pend) : '';

    var res = ent - tot;
    sS.className = 'ss ' + (ent > 0 ? (res >= 0 ? 'pos' : 'neg') : '');
    sS.textContent = ent > 0
      ? 'Resultado do mês: ' + (res >= 0 ? '+ ' : '- ') + brl(Math.abs(res))
      : 'Nenhuma entrada neste mês';

    plA.innerHTML = '';
    plA.appendChild(document.createTextNode('Planejado'));
    if (limite > 0) {
      plA.appendChild(el('b', '', brl(limite)));
      var p = tot / limite * 100;
      plB.textContent = tot <= limite ? 'Sobra ' + brl(limite - tot) : 'Passou ' + brl(tot - limite);
      plB.style.color = tot <= limite ? 'var(--ok)' : 'var(--err)';
      plI.style.width = Math.min(p, 100) + '%';
      plI.style.background = p > 100 ? 'var(--err)' : p >= 80 ? 'var(--warn)' : 'var(--ok)';
    } else {
      plA.appendChild(el('b', '', 'defina um limite'));
      plB.textContent = '';
      plI.style.width = '0';
    }
    if (cache.mes !== mes) carregarEntradas6(); else desenharBalanco();
  }

  /* ---- saldo total vem da carteira de contas ---- */
  function lerSaldo() {
    var b = document.querySelector('#caTot b');
    sV.textContent = b ? b.textContent : '—';
  }

  /* ---- mostra uma aba por vez ---- */
  function aplicar() {
    bConta.className = tab === 'conta' ? 'on' : '';
    bCred.className = tab === 'credito' ? 'on' : '';
    [].slice.call(wrap.children).forEach(function (c) {
      if (c === hdr || c === barra) return;
      if (c === cred) c.hidden = tab !== 'credito';
      else c.hidden = tab !== 'conta';
    });
  }
  bConta.onclick = function () { tab = 'conta'; aplicar(); window.scrollTo(0, 0); };
  bCred.onclick = function () { tab = 'credito'; aplicar(); window.scrollTo(0, 0); };
  new MutationObserver(aplicar).observe(wrap, {childList: true});

  /* ---- espera a carteira existir e separa contas e cartões ---- */
  var tentativas = 0;
  var espera = setInterval(function () {
    tentativas++;
    var c = document.getElementById('ccar');
    var box = document.getElementById('carteira');
    var sl = c ? c.querySelectorAll('.cslide') : [];
    if (c && box && sl.length >= 2) {
      clearInterval(espera);
      var cCartoes = sl[0].querySelector('.card');
      var cContas = sl[1].querySelector('.card');
      cred.appendChild(cCartoes);
      cContas.style.marginTop = '12px';
      box.parentNode.insertBefore(cContas, box);
      box.style.display = 'none';
      var tot = document.getElementById('caTot');
      if (tot) new MutationObserver(lerSaldo).observe(tot, {childList: true, subtree: true});
      lerSaldo();
      aplicar();
    } else if (tentativas > 100) {
      clearInterval(espera);
    }
  }, 100);

  var renderOriginal = window.render;
  if (typeof renderOriginal === 'function') {
    window.render = function () {
      var r = renderOriginal.apply(this, arguments);
      try { atualizar(); } catch (e) {}
      return r;
    };
  }
  try { atualizar(); } catch (e) {}
  aplicar();
})();
