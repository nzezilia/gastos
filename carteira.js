(function () {
  if (!/inicio\.html$/i.test(location.pathname)) return;
  if (window.CarteiraLoaded) return;
  window.CarteiraLoaded = true;

  var st = document.createElement('style');
  st.textContent =
    '.ccar{display:flex;gap:12px;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;-webkit-overflow-scrolling:touch;align-items:stretch}' +
    '.ccar::-webkit-scrollbar{display:none}' +
    '.cslide{flex:0 0 100%;scroll-snap-align:center;display:flex}' +
    '.cslide .card{width:100%}' +
    '.dots2{display:flex;justify-content:center;gap:6px;margin-top:10px}' +
    '.dots2 i{width:6px;height:6px;border-radius:3px;background:var(--bd);transition:width .2s}' +
    '.dots2 i.on{width:18px;background:var(--pri)}' +
    '.ch{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}' +
    '.ct{display:flex;align-items:center;gap:8px;font-size:16px;font-weight:700}' +
    '.ct i{color:var(--pri);font-size:20px}' +
    '.cadd{background:none;border:0;color:var(--pri);font-size:24px;padding:4px;line-height:1;cursor:pointer}' +
    '.cc{background:var(--bg);border-radius:16px;padding:12px;margin-bottom:10px;cursor:pointer}' +
    '.cc:last-child{margin-bottom:0}' +
    '.cc .l1{display:flex;align-items:center;gap:10px}' +
    '.bdg{width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:13px;flex:none}' +
    '.cc .nm{flex:1;min-width:0}' +
    '.cc .tp{font-size:11px;color:var(--mut)}' +
    '.cc .nn{font-size:15px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '.cc .dt{text-align:right;font-size:11px;color:var(--mut);flex:none;line-height:1.5}' +
    '.cc .pb{height:6px;border-radius:3px;background:var(--bd);margin:10px 0 4px;overflow:hidden}' +
    '.cc .pb i{display:block;height:100%;border-radius:3px}' +
    '.cc .l3{display:flex;justify-content:space-between;align-items:baseline;font-size:12px;color:var(--mut);margin-top:8px;gap:8px}' +
    '.cc .l3 b{font-size:15px;color:var(--txt)}' +
    '.cc .l3 b.neg{color:var(--err)}' +
    '.ctot{display:flex;justify-content:space-between;align-items:baseline;margin:-2px 2px 12px}' +
    '.ctot small{color:var(--mut);font-size:12px}' +
    '.ctot b{font-size:18px}' +
    '#ctOv{position:fixed;top:0;right:0;bottom:0;left:0;z-index:100;background:rgba(10,12,22,.5);display:flex;align-items:flex-end;justify-content:center}' +
    '#ctSh{background:var(--card);color:var(--txt);width:100%;max-width:480px;max-height:92vh;overflow:auto;border-radius:24px 24px 0 0;padding:20px 18px calc(24px + env(safe-area-inset-bottom));border:1px solid var(--bd)}' +
    '#ctSh .cab{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px}' +
    '#ctSh .cab strong{font-size:18px}' +
    '#ctSh .cab button{background:none;border:0;color:var(--mut);font-size:24px;padding:4px}' +
    '#ctSh label{display:block;font-size:13px;color:var(--mut);margin:14px 0 6px}' +
    '#ctSh input,#ctSh select{width:100%;padding:12px;font-size:16px;border:1px solid var(--bd);border-radius:12px;background:var(--bg);color:var(--txt)}' +
    '#ctSh .btn{width:100%;padding:16px;margin-top:14px;border:0;border-radius:14px;background:var(--pri);color:#fff;font-size:17px;font-weight:600}' +
    '#ctSh .btn.sec{background:none;border:1px solid var(--err);color:var(--err)}' +
    '#ctSh .btn:disabled{opacity:.6}' +
    '#ctSh .nota{font-size:12px;color:var(--mut);margin-top:6px}';
  document.head.appendChild(st);

  var CORES_B = ['#2563eb', '#7c3aed', '#db2777', '#ea580c', '#16a34a', '#0891b2', '#ca8a04', '#475569'];
  var TIPOS = {corrente: 'Conta corrente', poupanca: 'Poupança', investimento: 'Investimentos', dinheiro: 'Dinheiro em mãos', outra: 'Outra conta'};

  var meios = [], contas = [], gastosCartao = [];
  var semLimite = false, semContas = false, timer = null;

  function g(id) { return document.getElementById(id); }
  function moeda(v) { return Number(v).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}); }
  function numero(s) {
    s = (s || '').trim();
    s = s.indexOf(',') >= 0 ? s.replace(/\./g, '').replace(',', '.') : s;
    var n = parseFloat(s);
    return isNaN(n) ? 0 : n;
  }
  function isoL(dt) {
    return dt.getFullYear() + '-' + ('0' + (dt.getMonth() + 1)).slice(-2) + '-' + ('0' + dt.getDate()).slice(-2);
  }
  function ddmm(dt) { return ('0' + dt.getDate()).slice(-2) + '/' + ('0' + (dt.getMonth() + 1)).slice(-2); }
  function aviso(m, erro) {
    if (typeof toast === 'function') toast(m, erro);
    else alert(m);
  }
  function corDe(nome) {
    var h = 0;
    for (var i = 0; i < nome.length; i++) h = (h * 31 + nome.charCodeAt(i)) >>> 0;
    return CORES_B[h % CORES_B.length];
  }
  function inicial(nome) {
    var p = nome.replace(/^(cart[aã]o|conta)\s+/i, '').trim().split(/\s+/).filter(Boolean);
    var grandes = p.filter(function (w) { return w.length > 2; });
    if (grandes.length >= 2) return (grandes[0][0] + grandes[1][0]).toUpperCase();
    var w = grandes[0] || p[0] || '?';
    return w.slice(0, 2).toUpperCase();
  }
  function badge(nome) {
    var b = document.createElement('div');
    b.className = 'bdg';
    b.style.background = corDe(nome);
    b.textContent = inicial(nome);
    return b;
  }
  function configurado(m) { return !!(m.dia_fechamento && m.dia_vencimento); }

  function mesFaturaL(data, fech, venc) {
    var y = +data.slice(0, 4), m = +data.slice(5, 7), d = +data.slice(8, 10);
    var corte = Math.min(fech, new Date(y, m, 0).getDate());
    var cy = y, cm = m;
    if (d > corte) { cm++; if (cm > 12) { cm = 1; cy++; } }
    if (venc <= fech) { cm++; if (cm > 12) { cm = 1; cy++; } }
    return cy + '-' + ('0' + cm).slice(-2);
  }

  function infoCartao(m) {
    var h = new Date(), y = h.getFullYear(), mo = h.getMonth(), d = h.getDate();
    var fech = m.dia_fechamento, venc = m.dia_vencimento;
    var corte = Math.min(fech, new Date(y, mo + 1, 0).getDate());
    var fecha = d <= corte
      ? new Date(y, mo, corte)
      : new Date(y, mo + 1, Math.min(fech, new Date(y, mo + 2, 0).getDate()));
    var vm = fecha.getMonth() + (venc <= fech ? 1 : 0);
    var vy = fecha.getFullYear();
    var vence = new Date(vy, vm, Math.min(venc, new Date(vy, vm + 1, 0).getDate()));
    var chave = mesFaturaL(isoL(h), fech, venc);
    var total = 0;
    gastosCartao.forEach(function (x) {
      if (x.meio_pagamento === m.nome && mesFaturaL(x.data, fech, venc) === chave) total += Number(x.valor);
    });
    return {fecha: fecha, vence: vence, total: total};
  }

  function desenhar() {
    var lc = g('ccList'), la = g('caList');
    if (!lc || !la) return;

    lc.innerHTML = '';
    var cfg = meios.filter(configurado);
    if (!cfg.length) {
      var v1 = document.createElement('div');
      v1.className = 'mut';
      v1.textContent = 'Nenhum cartão configurado. Toque no + para informar o fechamento e o vencimento de um cartão.';
      lc.appendChild(v1);
    }
    cfg.forEach(function (m) {
      var inf = infoCartao(m);
      var el = document.createElement('div');
      el.className = 'cc';
      el.onclick = function () { abrirCartao(m.nome); };
      var l1 = document.createElement('div');
      l1.className = 'l1';
      var nm = document.createElement('div');
      nm.className = 'nm';
      var tp = document.createElement('div');
      tp.className = 'tp';
      tp.textContent = 'Cartão de crédito';
      var nn = document.createElement('div');
      nn.className = 'nn';
      nn.textContent = m.nome;
      nm.appendChild(tp);
      nm.appendChild(nn);
      var dt = document.createElement('div');
      dt.className = 'dt';
      dt.innerHTML = '';
      dt.appendChild(document.createTextNode('Fecha ' + ddmm(inf.fecha)));
      dt.appendChild(document.createElement('br'));
      dt.appendChild(document.createTextNode('Vence ' + ddmm(inf.vence)));
      l1.appendChild(badge(m.nome));
      l1.appendChild(nm);
      l1.appendChild(dt);
      el.appendChild(l1);
      var lim = Number(m.limite) || 0;
      if (lim > 0) {
        var pct = inf.total / lim;
        var pb = document.createElement('div');
        pb.className = 'pb';
        var bi = document.createElement('i');
        bi.style.width = Math.min(pct * 100, 100) + '%';
        bi.style.background = pct >= 1 ? '#dc2626' : pct >= 0.8 ? '#d97706' : '#16a34a';
        pb.appendChild(bi);
        el.appendChild(pb);
      }
      var l3 = document.createElement('div');
      l3.className = 'l3';
      var esq = document.createElement('span');
      esq.appendChild(document.createTextNode('Fatura atual '));
      var bv = document.createElement('b');
      bv.textContent = moeda(inf.total);
      esq.appendChild(bv);
      l3.appendChild(esq);
      if (lim > 0) {
        var dir = document.createElement('span');
        dir.textContent = 'Limite ' + moeda(lim);
        l3.appendChild(dir);
      }
      el.appendChild(l3);
      lc.appendChild(el);
    });

    la.innerHTML = '';
    var tot = g('caTot');
    tot.innerHTML = '';
    if (semContas) {
      var v2 = document.createElement('div');
      v2.className = 'mut';
      v2.textContent = 'A tabela de contas ainda não existe. Rode o script do banco.';
      la.appendChild(v2);
      return;
    }
    if (!contas.length) {
      var v3 = document.createElement('div');
      v3.className = 'mut';
      v3.textContent = 'Nenhuma conta ainda. Toque no + para adicionar.';
      la.appendChild(v3);
    } else {
      var s1 = document.createElement('small');
      s1.textContent = 'Total nas contas';
      var b1 = document.createElement('b');
      b1.textContent = moeda(contas.reduce(function (s, c) { return s + Number(c.saldo); }, 0));
      tot.appendChild(s1);
      tot.appendChild(b1);
    }
    contas.forEach(function (c) {
      var el = document.createElement('div');
      el.className = 'cc';
      el.onclick = function () { abrirConta(c); };
      var l1 = document.createElement('div');
      l1.className = 'l1';
      var nm = document.createElement('div');
      nm.className = 'nm';
      var tp = document.createElement('div');
      tp.className = 'tp';
      tp.textContent = TIPOS[c.tipo] || 'Conta';
      var nn = document.createElement('div');
      nn.className = 'nn';
      nn.textContent = c.nome;
      nm.appendChild(tp);
      nm.appendChild(nn);
      l1.appendChild(badge(c.nome));
      l1.appendChild(nm);
      el.appendChild(l1);
      var l3 = document.createElement('div');
      l3.className = 'l3';
      var esq = document.createElement('span');
      var dd = c.atualizado_em ? paraDataBr(c.atualizado_em) : '';
      esq.textContent = 'Saldo atual' + (dd ? ' · atualizado em ' + dd : '');
      var bv = document.createElement('b');
      bv.textContent = moeda(c.saldo);
      if (Number(c.saldo) < 0) bv.className = 'neg';
      l3.appendChild(esq);
      l3.appendChild(bv);
      el.appendChild(l3);
      la.appendChild(el);
    });
  }
  function paraDataBr(s) { return s.slice(8, 10) + '/' + s.slice(5, 7); }

  async function buscarGastos(nomes) {
    if (!nomes.length) return [];
    var h = new Date();
    var ini = isoL(new Date(h.getFullYear(), h.getMonth(), h.getDate() - 45));
    var fim = isoL(new Date(h.getFullYear(), h.getMonth(), h.getDate() + 45));
    var tudo = [], de = 0;
    while (true) {
      var r = await db.from('gastos').select('data,valor,meio_pagamento')
        .in('meio_pagamento', nomes).gte('data', ini).lte('data', fim)
        .order('data').order('id').range(de, de + 999);
      if (r.error) break;
      tudo = tudo.concat(r.data);
      if (r.data.length < 1000) break;
      de += 1000;
    }
    return tudo;
  }

  async function carregarDados() {
    var r = await db.from('meios_pagamento').select('nome,dia_fechamento,dia_vencimento,limite').order('nome');
    semLimite = false;
    if (r.error) {
      semLimite = true;
      r = await db.from('meios_pagamento').select('nome,dia_fechamento,dia_vencimento').order('nome');
    }
    meios = r.error ? [] : r.data;
    gastosCartao = await buscarGastos(meios.filter(configurado).map(function (m) { return m.nome; }));
    var c = await db.from('contas').select('*').order('nome');
    semContas = !!c.error;
    contas = c.error ? [] : c.data;
    desenhar();
  }

  function folha(html) {
    var ov = document.createElement('div');
    ov.id = 'ctOv';
    var sh = document.createElement('div');
    sh.id = 'ctSh';
    sh.innerHTML = html;
    ov.appendChild(sh);
    ov.addEventListener('click', function (e) { if (e.target === ov) ov.remove(); });
    document.body.appendChild(ov);
    g('ctX').onclick = function () { ov.remove(); };
    return ov;
  }

  function abrirCartao(nome) {
    if (g('ctOv')) return;
    var ed = !!nome;
    var m = ed ? meios.filter(function (x) { return x.nome === nome; })[0] : null;
    var livres = meios.filter(function (x) { return !configurado(x); });
    if (!ed && !livres.length) return aviso('Todos os seus meios já estão configurados. Adicione um novo cartão em Mais.', true);
    var ov = folha(
      '<div class="cab"><strong>' + (ed ? 'Editar cartão' : 'Configurar cartão') + '</strong><button type="button" id="ctX" aria-label="Fechar"><i class="ti ti-x"></i></button></div>' +
      '<label for="ctMeio">Cartão</label><select id="ctMeio"></select>' +
      '<label for="ctFech">Dia em que a fatura fecha</label><input id="ctFech" type="number" min="1" max="31" inputmode="numeric">' +
      '<label for="ctVenc">Dia do vencimento da fatura</label><input id="ctVenc" type="number" min="1" max="31" inputmode="numeric">' +
      '<label for="ctLim">Limite do cartão (R$, opcional)</label><input id="ctLim" inputmode="decimal" autocomplete="off">' +
      '<div class="nota">Você acha o fechamento e o vencimento na própria fatura.</div>' +
      '<button type="button" class="btn" id="ctSalvar">Salvar</button>' +
      (ed ? '<button type="button" class="btn sec" id="ctRemover">Remover configuração</button>' : '')
    );
    var sel = g('ctMeio');
    (ed ? [m] : livres).forEach(function (x) {
      var o = document.createElement('option');
      o.value = x.nome;
      o.textContent = x.nome;
      sel.appendChild(o);
    });
    if (ed) {
      sel.disabled = true;
      g('ctFech').value = m.dia_fechamento;
      g('ctVenc').value = m.dia_vencimento;
      g('ctLim').value = m.limite ? String(m.limite).replace('.', ',') : '';
    }
    g('ctSalvar').onclick = async function () {
      var fech = parseInt(g('ctFech').value, 10);
      var venc = parseInt(g('ctVenc').value, 10);
      if (!(fech >= 1 && fech <= 31)) return aviso('Informe o dia de fechamento (1 a 31)', true);
      if (!(venc >= 1 && venc <= 31)) return aviso('Informe o dia de vencimento (1 a 31)', true);
      var lim = numero(g('ctLim').value);
      var p = {dia_fechamento: fech, dia_vencimento: venc};
      if (!semLimite) p.limite = lim > 0 ? lim : null;
      g('ctSalvar').disabled = true;
      var res = await db.from('meios_pagamento').update(p).eq('nome', sel.value);
      g('ctSalvar').disabled = false;
      if (res.error) return aviso('Erro: ' + res.error.message, true);
      ov.remove();
      aviso(semLimite && lim > 0 ? 'Salvo, mas o limite precisa do script do banco' : 'Cartão salvo ✓');
      carregarDados();
    };
    if (ed) {
      g('ctRemover').onclick = async function () {
        if (!confirm('Remover a configuração de fatura de "' + nome + '"? Os lançamentos continuam.')) return;
        var p = {dia_fechamento: null, dia_vencimento: null};
        if (!semLimite) p.limite = null;
        var res = await db.from('meios_pagamento').update(p).eq('nome', nome);
        if (res.error) return aviso('Erro: ' + res.error.message, true);
        ov.remove();
        aviso('Configuração removida');
        carregarDados();
      };
    }
  }

  function abrirConta(c) {
    if (g('ctOv')) return;
    if (semContas) return aviso('Rode primeiro o script do banco', true);
    var ed = !!c;
    var ov = folha(
      '<div class="cab"><strong>' + (ed ? 'Editar conta' : 'Nova conta') + '</strong><button type="button" id="ctX" aria-label="Fechar"><i class="ti ti-x"></i></button></div>' +
      '<label for="ctNome">Nome</label><input id="ctNome" placeholder="Ex.: Conta Inter" autocomplete="off">' +
      '<label for="ctTipo">Tipo</label><select id="ctTipo"></select>' +
      '<label for="ctSaldo">Saldo atual (R$)</label><input id="ctSaldo" inputmode="decimal" autocomplete="off">' +
      '<div class="nota">O saldo é informado por você e não muda sozinho. Atualize quando quiser.</div>' +
      '<button type="button" class="btn" id="ctSalvar">Salvar</button>' +
      (ed ? '<button type="button" class="btn sec" id="ctApagar">Apagar conta</button>' : '')
    );
    var tipo = g('ctTipo');
    Object.keys(TIPOS).forEach(function (k) {
      var o = document.createElement('option');
      o.value = k;
      o.textContent = TIPOS[k];
      tipo.appendChild(o);
    });
    if (ed) {
      g('ctNome').value = c.nome;
      tipo.value = c.tipo;
      g('ctSaldo').value = String(c.saldo).replace('.', ',');
    }
    g('ctSalvar').onclick = async function () {
      var nome = g('ctNome').value.trim();
      if (!nome) return aviso('Informe o nome da conta', true);
      var saldo = numero(g('ctSaldo').value);
      var p = {nome: nome, tipo: tipo.value, saldo: saldo};
      if (!ed || Number(c.saldo) !== saldo) p.atualizado_em = isoL(new Date());
      g('ctSalvar').disabled = true;
      var res = ed
        ? await db.from('contas').update(p).eq('id', c.id)
        : await db.from('contas').insert(p);
      g('ctSalvar').disabled = false;
      if (res.error) return aviso('Erro: ' + res.error.message, true);
      ov.remove();
      aviso('Conta salva ✓');
      carregarDados();
    };
    if (ed) {
      g('ctApagar').onclick = async function () {
        if (!confirm('Apagar a conta "' + c.nome + '"?')) return;
        var res = await db.from('contas').delete().eq('id', c.id);
        if (res.error) return aviso('Erro: ' + res.error.message, true);
        ov.remove();
        aviso('Conta apagada');
        carregarDados();
      };
    }
  }

  var ult = g('ult');
  if (!ult) return;
  var h2 = ult.previousElementSibling;
  var box = document.createElement('div');
  box.id = 'carteira';
  box.style.marginTop = '24px';
  box.innerHTML =
    '<div class="ccar" id="ccar">' +
    '<div class="cslide"><div class="card"><div class="ch"><div class="ct"><i class="ti ti-credit-card"></i>Meus cartões</div>' +
    '<button type="button" class="cadd" id="ccAdd" aria-label="Configurar cartão"><i class="ti ti-plus"></i></button></div><div id="ccList"></div></div></div>' +
    '<div class="cslide"><div class="card"><div class="ch"><div class="ct"><i class="ti ti-wallet"></i>Minhas contas</div>' +
    '<button type="button" class="cadd" id="caAdd" aria-label="Adicionar conta"><i class="ti ti-plus"></i></button></div><div class="ctot" id="caTot"></div><div id="caList"></div></div></div>' +
    '</div><div class="dots2" id="dots2"><i class="on"></i><i></i></div>';
  ult.parentNode.insertBefore(box, h2 || ult);
  if (h2) h2.style.display = 'none';
  ult.style.display = 'none';

  g('ccAdd').onclick = function () { abrirCartao(null); };
  g('caAdd').onclick = function () { abrirConta(null); };
  g('ccar').addEventListener('scroll', function () {
    var c = g('ccar');
    var i = Math.round(c.scrollLeft / (c.clientWidth + 12));
    var pontos = g('dots2').querySelectorAll('i');
    for (var k = 0; k < pontos.length; k++) pontos[k].className = k === i ? 'on' : '';
  }, {passive: true});

  var renderOriginal = window.render;
  if (typeof renderOriginal === 'function') {
    window.render = function () {
      var r = renderOriginal.apply(this, arguments);
      clearTimeout(timer);
      timer = setTimeout(carregarDados, 300);
      return r;
    };
  }
  carregarDados();
})();
