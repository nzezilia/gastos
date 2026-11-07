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
    '.cca{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:10px;padding:8px 10px;border-radius:12px;background:color-mix(in srgb,#d97706 14%,transparent);color:#b45309;font-size:12px;font-weight:600}' +
    '.cca.rd{background:color-mix(in srgb,#dc2626 14%,transparent);color:#dc2626}' +
    '.cca button{border:1px solid currentColor;border-radius:999px;padding:6px 12px;background:var(--card);color:inherit;font-size:12px;font-weight:600;flex:none;cursor:pointer}' +
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
    '#ctSh .nota{font-size:12px;color:var(--mut);margin-top:6px}' +
    /* tela de detalhe do cartão */
    '#cdOv{position:fixed;top:0;right:0;bottom:0;left:0;z-index:55;background:var(--bg);overflow:auto;-webkit-overflow-scrolling:touch;padding-top:env(safe-area-inset-top)}' +
    '.cdPg{max-width:480px;margin:0 auto;padding:12px 16px calc(40px + env(safe-area-inset-bottom))}' +
    '.cdTop{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}' +
    '.cdTop strong{font-size:17px}' +
    '.cdTop button{width:40px;height:40px;border-radius:50%;border:1px solid var(--bd);background:var(--card);color:var(--txt);font-size:20px;display:flex;align-items:center;justify-content:center;cursor:pointer;padding:0}' +
    '.cdHero{background:linear-gradient(135deg,#1f2430,#06080d);color:#fff;border-radius:24px;padding:18px;box-shadow:0 14px 30px -14px rgba(0,0,0,.6)}' +
    '.cdh1{display:flex;align-items:center;gap:12px}' +
    '.cdh1 .bdg{width:44px;height:44px}' +
    '.cdh1 .nn{flex:1;min-width:0;font-size:15px;font-weight:700;letter-spacing:.02em;text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '.cdChip{padding:5px 12px;border-radius:999px;font-size:12px;font-weight:600;background:rgba(255,255,255,.14);flex:none}' +
    '.cdChip.ok{background:rgba(74,222,128,.18);color:#4ade80}' +
    '.cdChip.am{background:rgba(251,191,36,.2);color:#fbbf24}' +
    '.cdChip.rd{background:rgba(248,113,113,.2);color:#f87171}' +
    '.cdChip.ab{background:rgba(96,165,250,.2);color:#93c5fd}' +
    '.cdh2{display:flex;justify-content:space-between;margin-top:18px;font-size:14px;color:rgba(255,255,255,.75)}' +
    '.cdh2 b{color:#fff;font-size:16px;margin-left:4px}' +
    '.cdh3{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:16px;padding:12px;border-radius:16px;background:rgba(255,255,255,.07)}' +
    '.cdh3 small{display:block;font-size:12px;color:rgba(255,255,255,.65);margin-bottom:2px}' +
    '.cdh3 b{font-size:14px;white-space:nowrap}' +
    '.cdh3 b.v{color:#f87171}.cdh3 b.p{color:#4ade80}' +
    '.cdMes{display:flex;align-items:center;justify-content:space-between;background:var(--card);border:1px solid var(--bd);border-radius:999px;padding:6px;margin-top:14px}' +
    '.cdMes button{width:36px;height:36px;border-radius:50%;border:1px solid var(--bd);background:var(--bg);color:var(--txt);font-size:18px;display:flex;align-items:center;justify-content:center;flex:none;padding:0;cursor:pointer}' +
    '.cdMes span,.cdMes b{flex:1;text-align:center;text-transform:capitalize;font-size:13px;color:var(--mut);cursor:pointer;background:none;border:0}' +
    '.cdMes b{font-size:16px;color:var(--txt);cursor:default}' +
    '.cdBox{background:var(--card);border:1px solid var(--bd);border-radius:20px;padding:16px;margin-top:12px;box-shadow:var(--sombra)}' +
    '.cdBox small{display:block;color:var(--mut);font-size:12px}' +
    '.cdBox .big2{font-size:26px;font-weight:700;margin:4px 0 2px;letter-spacing:-.02em}' +
    '.cdBox .big2.neg{color:var(--err)}' +
    '.cdBox b{display:block;font-size:16px;margin-top:4px}' +
    '.cdDois{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px}' +
    '.cdDois .cdBox{margin-top:0}' +
    '.cdBtn{width:100%;padding:16px;margin-top:14px;border:0;border-radius:16px;background:var(--pri);color:#fff;font-size:16px;font-weight:600;cursor:pointer;box-shadow:0 8px 18px -8px var(--pri)}' +
    '.cdBtn.sec{background:none;border:1px solid var(--pri);color:var(--pri);box-shadow:none}' +
    '.cdBtn:disabled{opacity:.6}' +
    '.cdPago{margin-top:14px;display:flex;align-items:center;gap:8px;color:#16a34a;font-weight:600;font-size:15px}' +
    '.cdPago i{font-size:22px}' +
    '.cdH{font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.09em;color:var(--mut);margin:24px 4px 10px}';
  document.head.appendChild(st);

  var CORES_B = ['#2563eb', '#7c3aed', '#db2777', '#ea580c', '#16a34a', '#0891b2', '#ca8a04', '#475569'];
  var TIPOS = {corrente: 'Conta corrente', poupanca: 'Poupança', investimento: 'Investimentos', dinheiro: 'Dinheiro em mãos', outra: 'Outra conta'};

  var meios = [], contas = [], gastosCartao = [], pagas = {};
  var semLimite = false, semContas = false, semFaturas = false, timer = null;

  function g(id) { return document.getElementById(id); }
  function h(tag, cls, txt) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt !== undefined) e.textContent = txt;
    return e;
  }
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
    var hh = 0;
    for (var i = 0; i < nome.length; i++) hh = (hh * 31 + nome.charCodeAt(i)) >>> 0;
    return CORES_B[hh % CORES_B.length];
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

  /* ---------- Faturas: datas, totais e situação ---------- */
  function diasMes(y, m0) { return new Date(y, m0 + 1, 0).getDate(); }
  function somaMes(M, n) {
    var dt = new Date(+M.slice(0, 4), +M.slice(5, 7) - 1 + n, 1);
    return dt.getFullYear() + '-' + ('0' + (dt.getMonth() + 1)).slice(-2);
  }
  function datasFatura(m, M) {
    var y = +M.slice(0, 4), mo = +M.slice(5, 7) - 1;
    var fech = m.dia_fechamento, venc = m.dia_vencimento;
    var cm = venc <= fech ? mo - 1 : mo;
    function fechaEm(off) {
      var dt = new Date(y, cm + off, 1);
      return new Date(dt.getFullYear(), dt.getMonth(), Math.min(fech, diasMes(dt.getFullYear(), dt.getMonth())));
    }
    var fecha = fechaEm(0), ant = fechaEm(-1);
    var ini = new Date(ant.getFullYear(), ant.getMonth(), ant.getDate() + 1);
    var vence = new Date(y, mo, Math.min(venc, diasMes(y, mo)));
    return {ini: isoL(ini), fecha: isoL(fecha), vence: isoL(vence), iniD: ini, fechaD: fecha, venceD: vence};
  }
  function chaveP(m, M) { return m.nome + '|' + M; }
  function doMes(rows, m, M) {
    return rows.filter(function (x) {
      return x.meio_pagamento === m.nome && mesFaturaL(x.data, m.dia_fechamento, m.dia_vencimento) === M;
    });
  }
  function totalDe(rows, m, M) {
    return doMes(rows, m, M).reduce(function (s, x) { return s + Number(x.valor); }, 0);
  }
  function statusDe(m, M, total, d) {
    var hj = isoL(new Date());
    if (pagas[chaveP(m, M)]) return {txt: 'Paga', cls: 'ok'};
    if (total <= 0 && hj > d.fecha) return {txt: 'Sem fatura', cls: ''};
    if (hj < d.ini) return {txt: 'Futura', cls: ''};
    if (hj <= d.fecha) return {txt: 'Aberta', cls: 'ab'};
    if (hj <= d.vence) return {txt: 'Fechada', cls: 'am'};
    return {txt: 'Vencida', cls: 'rd'};
  }
  /* Fatura já fechada, não paga e com vencimento recente (até 20 dias atrás): é a que precisa de lembrete */
  function pendente(m, rows) {
    var hj = isoL(new Date());
    var lim = isoL(new Date(Date.now() - 20 * 864e5));
    var hM = mesFaturaL(hj, m.dia_fechamento, m.dia_vencimento);
    for (var k = -3; k <= 0; k++) {
      var M = somaMes(hM, k);
      var d = datasFatura(m, M);
      if (hj <= d.fecha || d.vence < lim || pagas[chaveP(m, M)]) continue;
      var t = totalDe(rows, m, M);
      if (t > 0) return {M: M, total: t, d: d};
    }
    return null;
  }

  async function lerPagas() {
    var r = await db.from('faturas_pagas').select('meio_pagamento,mes_fatura,valor,pago_em');
    semFaturas = !!r.error;
    pagas = {};
    if (!r.error) r.data.forEach(function (x) { pagas[x.meio_pagamento + '|' + x.mes_fatura] = x; });
  }
  async function marcarPaga(m, M, total) {
    if (semFaturas) { aviso('Rode primeiro o script do banco (faturas pagas)', true); return false; }
    var r = await db.from('faturas_pagas').insert({
      meio_pagamento: m.nome, mes_fatura: M, valor: total, pago_em: isoL(new Date())
    });
    if (r.error && r.error.code !== '23505') { aviso('Erro: ' + r.error.message, true); return false; }
    await lerPagas();
    aviso('Fatura marcada como paga ✓');
    return true;
  }
  async function desfazerPaga(m, M) {
    var r = await db.from('faturas_pagas').delete().eq('meio_pagamento', m.nome).eq('mes_fatura', M);
    if (r.error) { aviso('Erro: ' + r.error.message, true); return false; }
    await lerPagas();
    aviso('Pagamento desfeito');
    return true;
  }

  function infoCartao(m) {
    var hh = new Date(), y = hh.getFullYear(), mo = hh.getMonth(), d = hh.getDate();
    var fech = m.dia_fechamento, venc = m.dia_vencimento;
    var corte = Math.min(fech, new Date(y, mo + 1, 0).getDate());
    var fecha = d <= corte
      ? new Date(y, mo, corte)
      : new Date(y, mo + 1, Math.min(fech, new Date(y, mo + 2, 0).getDate()));
    var vm = fecha.getMonth() + (venc <= fech ? 1 : 0);
    var vy = fecha.getFullYear();
    var vence = new Date(vy, vm, Math.min(venc, new Date(vy, vm + 1, 0).getDate()));
    var chave = mesFaturaL(isoL(hh), fech, venc);
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
      var pend = pendente(m, gastosCartao);
      var el = document.createElement('div');
      el.className = 'cc';
      el.onclick = function () { abrirDetalhe(m.nome, pend ? pend.M : null); };
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

      if (pend) {
        var vencida = isoL(new Date()) > pend.d.vence;
        var ca = h('div', 'cca' + (vencida ? ' rd' : ''));
        ca.appendChild(h('span', '', 'Fatura de ' + nomeMes(pend.M + '-01', 'long') + ' ' + moeda(pend.total) + ' · ' + (vencida ? 'venceu ' : 'vence ') + ddmm(pend.d.venceD)));
        if (!semFaturas) {
          var bp = h('button', '', 'Paguei');
          bp.type = 'button';
          bp.onclick = async function (e) {
            e.stopPropagation();
            bp.disabled = true;
            if (await marcarPaga(m, pend.M, pend.total)) desenhar();
            else bp.disabled = false;
          };
          ca.appendChild(bp);
        }
        el.appendChild(ca);
      }
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
    var hh = new Date();
    var ini = isoL(new Date(hh.getFullYear(), hh.getMonth(), hh.getDate() - 75));
    var fim = isoL(new Date(hh.getFullYear(), hh.getMonth(), hh.getDate() + 45));
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
    await lerPagas();
    gastosCartao = await buscarGastos(meios.filter(configurado).map(function (m) { return m.nome; }));
    var c = await db.from('contas').select('*').order('nome');
    semContas = !!c.error;
    contas = c.error ? [] : c.data;
    desenhar();
    if (window.__cdRefresh) window.__cdRefresh();
  }

  /* ---------- Tela de detalhe do cartão ---------- */
  async function buscarDetalhe(nome) {
    var hh = new Date();
    var ini = isoL(new Date(hh.getFullYear(), hh.getMonth(), hh.getDate() - 430));
    var fim = isoL(new Date(hh.getFullYear(), hh.getMonth(), hh.getDate() + 1500));
    var tudo = [], de = 0;
    while (true) {
      var r = await db.from('gastos')
        .select('id,data,valor,categoria,meio_pagamento,descricao,parcelas,parcela_numero')
        .eq('meio_pagamento', nome).gte('data', ini).lte('data', fim)
        .order('data', {ascending: false}).order('criado_em', {ascending: false}).order('id')
        .range(de, de + 999);
      if (r.error) { aviso('Erro: ' + r.error.message, true); break; }
      tudo = tudo.concat(r.data);
      if (r.data.length < 1000) break;
      de += 1000;
    }
    return tudo;
  }

  function abrirDetalhe(nome, mIni) {
    if (g('cdOv')) return;
    var m = meios.filter(function (x) { return x.nome === nome; })[0];
    if (!m) return;
    var ov = h('div');
    ov.id = 'cdOv';
    var pg = h('div', 'cdPg');
    ov.appendChild(pg);
    document.body.appendChild(ov);
    document.body.style.overflow = 'hidden';

    var rows = [];
    var sel = mIni || '';

    function fechar() {
      window.__cdRefresh = null;
      document.body.style.overflow = '';
      ov.remove();
    }

    async function recarregar() {
      rows = await buscarDetalhe(nome);
      await lerPagas();
      if (!sel) {
        var p = pendente(m, rows);
        sel = p ? p.M : mesFaturaL(isoL(new Date()), m.dia_fechamento, m.dia_vencimento);
      }
      desenharDet();
      desenhar();
    }

    window.__cdRefresh = function () {
      var novo = meios.filter(function (x) { return x.nome === nome; })[0];
      if (novo) m = novo;
      if (sel) desenharDet();
    };

    function desenharDet() {
      pg.innerHTML = '';
      var d = datasFatura(m, sel);
      var tot = totalDe(rows, m, sel);
      var stt = statusDe(m, sel, tot, d);
      var pago = pagas[chaveP(m, sel)];

      /* topo */
      var top = h('div', 'cdTop');
      var bv = h('button');
      bv.type = 'button';
      bv.setAttribute('aria-label', 'Voltar');
      bv.innerHTML = '<i class="ti ti-arrow-left"></i>';
      bv.onclick = fechar;
      var be = h('button');
      be.type = 'button';
      be.setAttribute('aria-label', 'Editar cartão');
      be.innerHTML = '<i class="ti ti-pencil"></i>';
      be.onclick = function () { abrirCartao(nome); };
      top.appendChild(bv);
      top.appendChild(h('strong', '', 'Cartão de crédito'));
      top.appendChild(be);
      pg.appendChild(top);

      /* cartão escuro */
      var hero = h('div', 'cdHero');
      var h1 = h('div', 'cdh1');
      var wrapNome = h('div');
      wrapNome.style.cssText = 'display:flex;align-items:center;gap:12px;flex:1;min-width:0';
      wrapNome.appendChild(badge(nome));
      wrapNome.appendChild(h('span', 'nn', nome));
      h1.appendChild(wrapNome);
      h1.appendChild(h('span', 'cdChip ' + stt.cls, stt.txt));
      hero.appendChild(h1);

      var h2 = h('div', 'cdh2');
      var f1 = h('div', '', 'Fecha em');
      f1.appendChild(h('b', '', ddmm(d.fechaD)));
      var f2 = h('div', '', 'Vence em');
      f2.appendChild(h('b', '', ddmm(d.venceD)));
      h2.appendChild(f1);
      h2.appendChild(f2);
      hero.appendChild(h2);

      var h3 = h('div', 'cdh3');
      function col(rot, val, cls) {
        var c = h('div');
        c.appendChild(h('small', '', rot));
        c.appendChild(h('b', cls || '', val));
        h3.appendChild(c);
      }
      col('Fatura', moeda(tot));
      col('Gastos', moeda(tot), 'v');
      col('Pago', moeda(pago ? pago.valor : 0), 'p');
      hero.appendChild(h3);
      pg.appendChild(hero);

      /* seletor de mês */
      var mes = h('div', 'cdMes');
      var bp = h('button');
      bp.type = 'button';
      bp.setAttribute('aria-label', 'Fatura anterior');
      bp.innerHTML = '<i class="ti ti-arrow-left"></i>';
      var bn = h('button');
      bn.type = 'button';
      bn.setAttribute('aria-label', 'Próxima fatura');
      bn.innerHTML = '<i class="ti ti-arrow-right"></i>';
      function ir(n) { sel = somaMes(sel, n); desenharDet(); }
      bp.onclick = function () { ir(-1); };
      bn.onclick = function () { ir(1); };
      var sp = h('span', '', nomeMes(somaMes(sel, -1) + '-01', 'long'));
      sp.onclick = function () { ir(-1); };
      var sn = h('span', '', nomeMes(somaMes(sel, 1) + '-01', 'long'));
      sn.onclick = function () { ir(1); };
      var anoSel = sel.slice(0, 4) !== String(new Date().getFullYear()) ? ' ' + sel.slice(0, 4) : '';
      mes.appendChild(bp);
      mes.appendChild(sp);
      mes.appendChild(h('b', '', nomeMes(sel + '-01', 'long') + anoSel));
      mes.appendChild(sn);
      mes.appendChild(bn);
      pg.appendChild(mes);

      /* marcar como paga */
      if (semFaturas) {
        pg.appendChild(h('div', 'mut', 'Para marcar faturas como pagas, rode o script do banco (faturas pagas).')).style.marginTop = '14px';
      } else if (pago) {
        var pc = h('div', 'cdPago');
        pc.innerHTML = '<i class="ti ti-circle-check"></i>';
        pc.appendChild(h('span', '', 'Fatura paga em ' + paraDataBr(pago.pago_em) + ' · ' + moeda(pago.valor)));
        pg.appendChild(pc);
        var bd = h('button', 'cdBtn sec', 'Desfazer pagamento');
        bd.type = 'button';
        bd.onclick = async function () {
          bd.disabled = true;
          if (await desfazerPaga(m, sel)) { desenharDet(); desenhar(); }
          else bd.disabled = false;
        };
        pg.appendChild(bd);
      } else if (tot > 0) {
        var bm = h('button', 'cdBtn', 'Marcar fatura como paga');
        bm.type = 'button';
        bm.onclick = async function () {
          bm.disabled = true;
          if (await marcarPaga(m, sel, tot)) { desenharDet(); desenhar(); }
          else bm.disabled = false;
        };
        pg.appendChild(bm);
      }

      /* limite disponível: soma das faturas ainda não pagas (vencidas há mais de 20 dias e sem marcação são ignoradas) */
      var lim = Number(m.limite) || 0;
      var box = h('div', 'cdBox');
      box.appendChild(h('small', '', 'Limite disponível'));
      if (lim > 0) {
        var corte = isoL(new Date(Date.now() - 20 * 864e5));
        var cacheD = {}, usado = 0;
        rows.forEach(function (x) {
          var Mx = mesFaturaL(x.data, m.dia_fechamento, m.dia_vencimento);
          if (pagas[chaveP(m, Mx)]) return;
          if (!cacheD[Mx]) cacheD[Mx] = datasFatura(m, Mx);
          if (cacheD[Mx].vence < corte) return;
          usado += Number(x.valor);
        });
        var disp = lim - usado;
        box.appendChild(h('div', 'big2' + (disp < 0 ? ' neg' : ''), moeda(disp)));
        box.appendChild(h('small', '', 'de ' + moeda(lim)));
      } else {
        box.appendChild(h('div', 'big2', '—'));
        var bl = h('button', 'cdBtn sec', 'Definir limite do cartão');
        bl.type = 'button';
        bl.onclick = function () { abrirCartao(nome); };
        box.appendChild(bl);
      }
      pg.appendChild(box);

      /* próxima fatura */
      var dn = datasFatura(m, somaMes(sel, 1));
      var dois = h('div', 'cdDois');
      var b1 = h('div', 'cdBox');
      b1.appendChild(h('small', '', 'Próxima fatura'));
      b1.appendChild(h('b', '', dn.fechaD.toLocaleDateString('pt-BR', {day: '2-digit', month: 'long'})));
      var b2 = h('div', 'cdBox');
      b2.appendChild(h('small', '', 'Melhor dia de compra'));
      b2.appendChild(h('b', '', dn.iniD.toLocaleDateString('pt-BR', {day: '2-digit', month: 'long'})));
      dois.appendChild(b1);
      dois.appendChild(b2);
      pg.appendChild(dois);

      /* compras da fatura */
      var lista = doMes(rows, m, sel).sort(function (a, b) { return a.data < b.data ? 1 : a.data > b.data ? -1 : 0; });
      pg.appendChild(h('div', 'cdH', 'Compras desta fatura · ' + ddmm(d.iniD) + ' a ' + ddmm(d.fechaD)));
      var card = h('div', 'card');
      if (!lista.length) {
        card.appendChild(h('div', 'mut', 'Sem compras nesta fatura.'));
      } else if (typeof agruparPorData === 'function') {
        agruparPorData(lista, function () { recarregar(); carregarDados(); }, card);
      }
      pg.appendChild(card);
    }

    recarregar();
  }

  /* ---------- Configurar cartão e contas ---------- */
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
        if (window.__cdRefresh && g('cdOv')) g('cdOv').remove();
        window.__cdRefresh = null;
        document.body.style.overflow = '';
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
