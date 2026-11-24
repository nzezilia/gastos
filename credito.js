(function () {
  if (!/inicio\.html$/i.test(location.pathname) || window.Credito7Loaded) return;
  window.Credito7Loaded = true;

  var CORES = ['#2563eb', '#7c3aed', '#db2777', '#ea580c', '#16a34a', '#0891b2', '#ca8a04', '#475569'];
  /* cor do cartão e cor do texto, pelo nome do banco */
  var MARCAS = {
    nubank: ['#820ad1', '#ffffff'], itau: ['#ec7000', '#ffffff'], inter: ['#ff7a00', '#ffffff'],
    bancodobrasil: ['#fcd116', '#0b2a6b'], c6: ['#2b2b2b', '#ffffff'], santander: ['#ec0000', '#ffffff'],
    bradesco: ['#cc092f', '#ffffff'], caixa: ['#005ca9', '#ffffff'], mercadopago: ['#009ee3', '#ffffff'],
    picpay: ['#11c76f', '#ffffff'], xp: ['#1a1a1a', '#ffffff']
  };
  var meios = [], gastos = [], pagas = {}, selCartao = '', selM = '', oculto = false, timer = null;
  var cred = null, root = null, hdrEl, limEl, carWrap, fatEl, carEl = null, nomeUser = '';

  var st = document.createElement('style');
  st.textContent =
    '.ocul .vv{filter:blur(9px)}' +
    '.h7{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px}' +
    '.h7 strong{font-size:22px;letter-spacing:-.01em}' +
    '.h7 button{width:40px;height:40px;border-radius:50%;border:1px solid var(--bd);background:var(--card);color:var(--txt);font-size:20px;display:flex;align-items:center;justify-content:center;cursor:pointer;padding:0}' +
    '.l7 small{display:block;color:var(--mut);font-size:14px}' +
    '.l7 .v{font-size:40px;font-weight:700;letter-spacing:-.02em;margin:2px 0 16px}' +
    '.l7 .v span{font-size:22px}' +
    '.car7{display:flex;gap:12px;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;-webkit-overflow-scrolling:touch;margin:0 -16px;padding:0 16px}' +
    '.car7::-webkit-scrollbar{display:none}' +
    '.cd7{position:relative;overflow:hidden;flex:0 0 82%;scroll-snap-align:start;border-radius:26px;padding:18px 18px 16px;min-height:178px;display:flex;flex-direction:column;cursor:pointer}' +
    '.cd7 .d1{position:absolute;top:-70px;right:-50px;width:210px;height:210px;border-radius:50%;background:rgba(255,255,255,.1)}' +
    '.cd7 .d2{position:absolute;top:-30px;right:-10px;width:130px;height:130px;border-radius:50%;background:rgba(255,255,255,.08)}' +
    '.cd7 .tp{position:relative;display:flex;align-items:center;gap:12px}' +
    '.cd7 .lg7{width:42px;height:42px;border-radius:12px;background:rgba(255,255,255,.22);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;flex:none}' +
    '.cd7 .nm7{font-size:17px;font-weight:700;line-height:1.2}' +
    '.cd7 .ds7{font-size:13px;opacity:.85;margin-top:1px}' +
    '.cd7 .fv7{position:relative;font-size:28px;font-weight:700;letter-spacing:-.02em;margin-top:auto;padding-top:22px}' +
    '.cd7 .fs7{position:relative;font-size:13px;opacity:.85;margin-top:2px}' +
    '.cd7 .pb7{position:relative;height:6px;border-radius:3px;background:rgba(0,0,0,.18);margin-top:12px;overflow:hidden}' +
    '.cd7 .pb7 i{display:block;height:100%;border-radius:3px;background:rgba(0,0,0,.45)}' +
    '.cd7.add{flex:0 0 38%;align-items:center;justify-content:center;background:none;border:2px dashed var(--bd);color:var(--mut);font-size:14px;font-weight:600;gap:6px;text-align:center}' +
    '.cd7.add i{font-size:30px}' +
    '.fh7{display:flex;justify-content:space-between;align-items:baseline;margin:26px 0 12px}' +
    '.fh7 strong{font-size:13px;letter-spacing:.09em;text-transform:uppercase}' +
    '.fh7 span{font-size:13px;color:var(--mut)}' +
    '.fs7w{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch;align-items:flex-end;height:190px}' +
    '.fs7w::-webkit-scrollbar{display:none}' +
    '.fb7{flex:0 0 52px;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:6px;background:none;border:0;padding:0;color:var(--txt);cursor:pointer;font-family:inherit}' +
    '.fb7 .n{font-size:12px;font-weight:700}' +
    '.fb7 .c{width:100%;max-width:34px;border-radius:9px 9px 5px 5px;opacity:.4}' +
    '.fb7.on .c{opacity:1}' +
    '.fb7 .m{font-size:13px;color:var(--mut);text-align:center;line-height:1.15;min-height:30px}' +
    '.fb7.on .m{color:var(--txt);font-weight:700}' +
    '.dt7{margin-top:18px;padding-top:16px;border-top:1px solid var(--bd)}' +
    '.dt7 .r1{display:flex;justify-content:space-between;align-items:baseline}' +
    '.dt7 .r1 b{font-size:22px;text-transform:capitalize}' +
    '.dt7 .r1 .tv{font-size:22px;font-weight:700}' +
    '.dt7 .r2{display:flex;align-items:center;gap:10px;margin-top:6px;font-size:13px;color:var(--mut)}' +
    '.dt7 .tag{padding:4px 12px;border-radius:999px;font-size:12px;font-weight:600;border:1px solid var(--pri);color:var(--pri)}' +
    '.dt7 .tag.ok{border-color:#22c55e;color:#22c55e}.dt7 .tag.am{border-color:#d97706;color:#d97706}.dt7 .tag.rd{border-color:#ef4444;color:#ef4444}' +
    '.bt7{width:100%;padding:16px;margin-top:16px;border:0;border-radius:18px;color:#fff;font-size:16px;font-weight:600;cursor:pointer;font-family:inherit}' +
    '.bt7.sec{background:none!important;border:1px solid var(--bd);color:var(--txt);margin-top:10px}' +
    '.ct7{margin-top:10px}' +
    '.ct7 .it{display:flex;gap:12px;align-items:center;padding:10px 0}' +
    '.ct7 .ic2{width:38px;height:38px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:19px;flex:none}' +
    '.ct7 .md{flex:1;min-width:0}' +
    '.ct7 .md .l1{display:flex;justify-content:space-between;font-size:15px;font-weight:600}' +
    '.ct7 .md .br{height:5px;border-radius:3px;background:var(--bd);margin-top:6px;overflow:hidden}' +
    '.ct7 .md .br i{display:block;height:100%;border-radius:3px}' +
    '.ct7 .vz{color:var(--mut);font-size:13px;padding:8px 0}';
  document.head.appendChild(st);

  function el(tag, cls, txt) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt !== undefined) e.textContent = txt;
    return e;
  }
  function moeda(v) { return Number(v).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}); }
  function isoD(dt) {
    return dt.getFullYear() + '-' + ('0' + (dt.getMonth() + 1)).slice(-2) + '-' + ('0' + dt.getDate()).slice(-2);
  }
  function diasMes(y, m0) { return new Date(y, m0 + 1, 0).getDate(); }
  function somaMes(M, n) {
    var dt = new Date(+M.slice(0, 4), +M.slice(5, 7) - 1 + n, 1);
    return dt.getFullYear() + '-' + ('0' + (dt.getMonth() + 1)).slice(-2);
  }
  function corDe(nome) {
    var h = 0;
    for (var i = 0; i < nome.length; i++) h = (h * 31 + nome.charCodeAt(i)) >>> 0;
    return CORES[h % CORES.length];
  }
  function slug(n) {
    return n.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/^(cartao|conta)\s+/, '').replace(/[^a-z0-9]/g, '');
  }
  function marca(nome) { return MARCAS[slug(nome)] || [corDe(nome), '#ffffff']; }
  function curto(nome) { return nome.replace(/^cart[aã]o\s+/i, ''); }
  function inicial(nome) {
    var p = curto(nome).trim().split(/\s+/).filter(Boolean);
    var gr = p.filter(function (w) { return w.length > 2; });
    if (gr.length >= 2) return (gr[0][0] + gr[1][0]).toUpperCase();
    return (gr[0] || p[0] || '?').slice(0, 2).toUpperCase();
  }
  function mesFat(data, m) {
    var y = +data.slice(0, 4), mo = +data.slice(5, 7), d = +data.slice(8, 10);
    var corte = Math.min(m.dia_fechamento, diasMes(y, mo - 1));
    var cy = y, cm = mo;
    if (d > corte) { cm++; if (cm > 12) { cm = 1; cy++; } }
    if (m.dia_vencimento <= m.dia_fechamento) { cm++; if (cm > 12) { cm = 1; cy++; } }
    return cy + '-' + ('0' + cm).slice(-2);
  }
  function datasFat(m, M) {
    var y = +M.slice(0, 4), mo = +M.slice(5, 7) - 1;
    var fech = m.dia_fechamento, venc = m.dia_vencimento;
    var cm = venc <= fech ? mo - 1 : mo;
    var dt = new Date(y, cm, 1);
    var fecha = new Date(dt.getFullYear(), dt.getMonth(), Math.min(fech, diasMes(dt.getFullYear(), dt.getMonth())));
    var dt0 = new Date(y, cm - 1, 1);
    var ant = new Date(dt0.getFullYear(), dt0.getMonth(), Math.min(fech, diasMes(dt0.getFullYear(), dt0.getMonth())));
    var ini = new Date(ant.getFullYear(), ant.getMonth(), ant.getDate() + 1);
    var vence = new Date(y, mo, Math.min(venc, diasMes(y, mo)));
    return {ini: isoD(ini), fecha: isoD(fecha), vence: isoD(vence), venceD: vence};
  }
  function doMes(m, M) {
    return gastos.filter(function (x) { return x.meio_pagamento === m.nome && mesFat(x.data, m) === M; });
  }
  function totalFat(m, M) {
    return doMes(m, M).reduce(function (s, x) { return s + Number(x.valor); }, 0);
  }
  function statusFat(m, M, total) {
    var hj = isoD(new Date()), d = datasFat(m, M);
    if (pagas[m.nome + '|' + M]) return {t: 'Paga', c: 'ok'};
    if (total <= 0 && hj > d.fecha) return {t: 'Sem fatura', c: ''};
    if (hj < d.ini) return {t: 'Futura', c: ''};
    if (hj <= d.fecha) return {t: 'Aberta', c: ''};
    if (hj <= d.vence) return {t: 'Fechada', c: 'am'};
    return {t: 'Vencida', c: 'rd'};
  }
  function usadoCartao(m) {
    var corte = isoD(new Date(Date.now() - 20 * 864e5)), usado = 0;
    gastos.forEach(function (x) {
      if (x.meio_pagamento !== m.nome) return;
      var M = mesFat(x.data, m);
      if (pagas[m.nome + '|' + M]) return;
      if (datasFat(m, M).vence < corte) return;
      usado += Number(x.valor);
    });
    return usado;
  }
  function cartaoSel() {
    return meios.filter(function (x) { return x.nome === selCartao; })[0] || meios[0];
  }

  /* abre a tela de detalhe que já existe (carteira.js) */
  function abrirDetalhe(nome) {
    var lc = document.getElementById('ccList');
    var cs = lc ? lc.querySelectorAll('.cc') : [];
    for (var i = 0; i < cs.length; i++) {
      var nn = cs[i].querySelector('.nn');
      if (nn && nn.textContent === nome) { cs[i].click(); return; }
    }
  }

  /* ---------- dados ---------- */
  async function carregar() {
    var r = await db.from('meios_pagamento').select('nome,dia_fechamento,dia_vencimento,limite').order('nome');
    if (r.error) r = await db.from('meios_pagamento').select('nome,dia_fechamento,dia_vencimento').order('nome');
    meios = (r.error ? [] : r.data).filter(function (m) { return m.dia_fechamento && m.dia_vencimento; });
    var p = await db.from('faturas_pagas').select('meio_pagamento,mes_fatura');
    pagas = {};
    if (!p.error) p.data.forEach(function (x) { pagas[x.meio_pagamento + '|' + x.mes_fatura] = true; });
    gastos = [];
    if (meios.length) {
      var hh = new Date();
      var ini = isoD(new Date(hh.getFullYear(), hh.getMonth(), hh.getDate() - 200));
      var fim = isoD(new Date(hh.getFullYear(), hh.getMonth(), hh.getDate() + 1500));
      var de = 0;
      while (true) {
        var g = await db.from('gastos').select('data,valor,meio_pagamento,categoria')
          .in('meio_pagamento', meios.map(function (m) { return m.nome; }))
          .gte('data', ini).lte('data', fim).order('data').order('id').range(de, de + 999);
        if (g.error) break;
        gastos = gastos.concat(g.data);
        if (g.data.length < 1000) break;
        de += 1000;
      }
    }
    if (!meios.some(function (m) { return m.nome === selCartao; })) { selCartao = meios[0] ? meios[0].nome : ''; selM = ''; }
    desenhar();
  }

  /* ---------- cabeçalho e limite ---------- */
  function desenharCabecalho() {
    hdrEl.innerHTML = '';
    hdrEl.appendChild(el('strong', '', nomeUser ? 'Olá, ' + nomeUser : 'Meus cartões'));
    var b = el('button');
    b.type = 'button';
    b.setAttribute('aria-label', 'Mostrar ou ocultar valores');
    b.appendChild(el('i', 'ti ti-' + (oculto ? 'eye-off' : 'eye')));
    b.onclick = function () {
      oculto = !oculto;
      cred.classList.toggle('ocul', oculto);
      desenharCabecalho();
    };
    hdrEl.appendChild(b);
  }

  function desenharLimite() {
    limEl.innerHTML = '';
    limEl.appendChild(el('small', '', 'Limite disponível nos cartões'));
    var totLim = 0, usado = 0, n = 0;
    meios.forEach(function (m) {
      var lim = Number(m.limite) || 0;
      if (!(lim > 0)) return;
      n++;
      totLim += lim;
      usado += usadoCartao(m);
    });
    var v = el('div', 'v vv');
    if (!n) {
      v.textContent = '—';
    } else {
      var t = moeda(totLim - usado), i = t.lastIndexOf(',');
      v.appendChild(document.createTextNode(t.slice(0, i)));
      v.appendChild(el('span', '', t.slice(i)));
      if (totLim - usado < 0) v.style.color = 'var(--err)';
    }
    limEl.appendChild(v);
  }

  /* ---------- cartões em carrossel ---------- */
  function desenharCartoes() {
    var prev = carEl ? carEl.scrollLeft : 0;
    carWrap.innerHTML = '';
    carEl = null;
    if (!meios.length) {
      var vz = el('div', 'mut', 'Nenhum cartão configurado ainda.');
      carWrap.appendChild(vz);
      var ba = el('button', 'bt7', 'Configurar cartão');
      ba.type = 'button';
      ba.style.background = 'var(--pri)';
      ba.onclick = function () { var a = document.getElementById('ccAdd'); if (a) a.click(); };
      carWrap.appendChild(ba);
      return;
    }
    carEl = el('div', 'car7');
    var hoje0 = isoD(new Date());
    meios.forEach(function (m) {
      var mc = marca(m.nome), baseM = mesFat(hoje0, m);
      var tot = totalFat(m, baseM), d = datasFat(m, baseM), s = statusFat(m, baseM, tot);
      var lim = Number(m.limite) || 0, usado = usadoCartao(m);
      var c = el('div', 'cd7');
      c.style.background = 'linear-gradient(135deg,' + mc[0] + ',color-mix(in srgb,' + mc[0] + ' 72%,#000))';
      c.style.color = mc[1];
      c.appendChild(el('div', 'd1'));
      c.appendChild(el('div', 'd2'));
      var tp = el('div', 'tp');
      var lg = el('div', 'lg7', inicial(m.nome));
      lg.setAttribute('data-logo', m.nome);
      var tx = el('div');
      tx.appendChild(el('div', 'nm7', curto(m.nome)));
      var ds = el('div', 'ds7 vv', lim > 0 ? 'Disponível ' + moeda(lim - usado) + ' de ' + moeda(lim) : 'Limite não informado');
      tx.appendChild(ds);
      tp.appendChild(lg); tp.appendChild(tx);
      c.appendChild(tp);
      c.appendChild(el('div', 'fv7 vv', moeda(tot)));
      c.appendChild(el('div', 'fs7', 'fatura ' + s.t.toLowerCase() + ' · vence dia ' + d.venceD.getDate()));
      if (lim > 0) {
        var pb = el('div', 'pb7'), bi = el('i');
        bi.style.width = Math.min(usado / lim * 100, 100) + '%';
        pb.appendChild(bi);
        c.appendChild(pb);
      }
      c.onclick = function () { abrirDetalhe(m.nome); };
      carEl.appendChild(c);
    });
    var add = el('div', 'cd7 add');
    add.appendChild(el('i', 'ti ti-plus'));
    add.appendChild(el('span', '', 'Configurar cartão'));
    add.onclick = function () { var a = document.getElementById('ccAdd'); if (a) a.click(); };
    carEl.appendChild(add);
    carWrap.appendChild(carEl);
    carEl.scrollLeft = prev;
    carEl.addEventListener('scroll', function () {
      var w = carEl.firstChild ? carEl.firstChild.offsetWidth + 12 : 1;
      var i = Math.max(0, Math.min(meios.length - 1, Math.round(carEl.scrollLeft / w)));
      if (meios[i] && meios[i].nome !== selCartao) {
        selCartao = meios[i].nome;
        selM = '';
        desenharFaturas();
      }
    }, {passive: true});
  }

  /* ---------- faturas do cartão selecionado ---------- */
  async function pagar(m, M, total) {
    var r = await db.from('faturas_pagas').insert({meio_pagamento: m.nome, mes_fatura: M, valor: total, pago_em: isoD(new Date())});
    if (r.error && r.error.code !== '23505') { toast('Erro: ' + r.error.message, true); return; }
    toast('Fatura marcada como paga ✓');
    carregar();
  }
  async function desfazer(m, M) {
    var r = await db.from('faturas_pagas').delete().eq('meio_pagamento', m.nome).eq('mes_fatura', M);
    if (r.error) { toast('Erro: ' + r.error.message, true); return; }
    toast('Pagamento desfeito');
    carregar();
  }

  function desenharFaturas() {
    fatEl.innerHTML = '';
    if (!meios.length) return;
    var m = cartaoSel(), mc = marca(m.nome), cor = mc[0];
    var baseM = mesFat(isoD(new Date()), m);
    if (!selM) selM = baseM;

    var fh = el('div', 'fh7');
    fh.appendChild(el('strong', '', 'Faturas · ' + curto(m.nome)));
    fh.appendChild(el('span', '', 'arraste para ver mais'));
    fatEl.appendChild(fh);

    var lista = [];
    for (var k = -5; k <= 8; k++) lista.push(somaMes(baseM, k));
    var tots = lista.map(function (M) { return totalFat(m, M); });
    var max = Math.max.apply(null, tots.concat([1]));
    var sc = el('div', 'fs7w');
    var selBtn = null;
    lista.forEach(function (M, i) {
      var b = el('button', 'fb7' + (M === selM ? ' on' : ''));
      b.type = 'button';
      b.appendChild(el('span', 'n vv', tots[i] > 0 ? String(Math.round(tots[i])) : ''));
      var c = el('span', 'c');
      c.style.height = Math.max(4, tots[i] / max * 110) + 'px';
      c.style.background = cor;
      b.appendChild(c);
      var lab = el('span', 'm', nomeMes(M + '-01', 'short'));
      if (M.slice(0, 4) !== baseM.slice(0, 4)) {
        lab.appendChild(document.createElement('br'));
        lab.appendChild(document.createTextNode(M.slice(2, 4)));
      }
      b.appendChild(lab);
      b.onclick = function () { selM = M; desenharFaturas(); };
      if (M === selM) selBtn = b;
      sc.appendChild(b);
    });
    fatEl.appendChild(sc);
    if (selBtn) sc.scrollLeft = selBtn.offsetLeft - (sc.clientWidth - selBtn.offsetWidth) / 2;

    var tot = totalFat(m, selM), s = statusFat(m, selM, tot), d = datasFat(m, selM);
    var det = el('div', 'dt7');
    var r1 = el('div', 'r1');
    var ano = selM.slice(0, 4) !== String(new Date().getFullYear()) ? ' ' + selM.slice(0, 4) : '';
    r1.appendChild(el('b', '', nomeMes(selM + '-01', 'long') + ano));
    r1.appendChild(el('span', 'tv vv', moeda(tot)));
    det.appendChild(r1);
    var r2 = el('div', 'r2');
    r2.appendChild(el('span', 'tag ' + s.c, s.t));
    r2.appendChild(el('span', '', 'Vence ' + ('0' + d.venceD.getDate()).slice(-2) + '/' + ('0' + (d.venceD.getMonth() + 1)).slice(-2)));
    det.appendChild(r2);

    if (pagas[m.nome + '|' + selM]) {
      var bd = el('button', 'bt7 sec', 'Desfazer pagamento');
      bd.type = 'button';
      bd.onclick = function () { bd.disabled = true; desfazer(m, selM); };
      det.appendChild(bd);
    } else if (tot > 0) {
      var bp = el('button', 'bt7', 'Marcar fatura como paga');
      bp.type = 'button';
      bp.style.background = cor;
      bp.style.color = mc[1];
      var Mx = selM;
      bp.onclick = function () { bp.disabled = true; pagar(m, Mx, tot); };
      det.appendChild(bp);
    }
    var bv = el('button', 'bt7 sec', 'Ver compras e detalhes do cartão');
    bv.type = 'button';
    bv.onclick = function () { abrirDetalhe(m.nome); };
    det.appendChild(bv);

    var porCat = {};
    doMes(m, selM).forEach(function (x) { porCat[x.categoria] = (porCat[x.categoria] || 0) + Number(x.valor); });
    var cats = Object.keys(porCat).sort(function (a, b) { return porCat[b] - porCat[a]; });
    var ct = el('div', 'ct7');
    if (!cats.length) ct.appendChild(el('div', 'vz', 'Sem compras nesta fatura.'));
    cats.forEach(function (c) {
      var it = el('div', 'it');
      var ic = el('div', 'ic2');
      ic.style.background = 'color-mix(in srgb, ' + corCat(c) + ' 16%, transparent)';
      ic.style.color = corCat(c);
      ic.appendChild(el('i', 'ti ti-' + iconeCat(c)));
      var md = el('div', 'md');
      var l1 = el('div', 'l1');
      l1.appendChild(el('span', '', c));
      l1.appendChild(el('span', 'vv', moeda(porCat[c])));
      var br = el('div', 'br'), bi = el('i');
      bi.style.width = Math.max(porCat[c] / tot * 100, 2) + '%';
      bi.style.background = corCat(c);
      br.appendChild(bi);
      md.appendChild(l1); md.appendChild(br);
      it.appendChild(ic); it.appendChild(md);
      ct.appendChild(it);
    });
    det.appendChild(ct);
    fatEl.appendChild(det);
  }

  function desenhar() {
    try { desenharCabecalho(); } catch (e0) { if (window.console) console.error(e0); }
    try { desenharLimite(); } catch (e) { if (window.console) console.error(e); }
    try { desenharCartoes(); } catch (e1) { if (window.console) console.error(e1); }
    try { desenharFaturas(); } catch (e2) { if (window.console) console.error(e2); }
    if (typeof window.aplicarLogos === 'function') window.aplicarLogos();
  }

  /* ---------- montagem: esconde o card antigo e usa o novo layout ---------- */
  var tent = 0;
  var espera = setInterval(function () {
    tent++;
    cred = document.getElementById('credito7');
    var lc = document.getElementById('ccList');
    if (cred && lc && cred.contains(lc)) {
      clearInterval(espera);
      var antigo = lc.closest ? lc.closest('.card') : null;
      if (antigo) antigo.style.display = 'none';
      root = el('div');
      hdrEl = el('div', 'h7');
      limEl = el('div', 'l7');
      carWrap = el('div');
      fatEl = el('div');
      [hdrEl, limEl, carWrap, fatEl].forEach(function (n) { root.appendChild(n); });
      cred.appendChild(root);
      db.auth.getSession().then(function (r) {
        var u = r.data && r.data.session ? r.data.session.user : null;
        var md = u && u.user_metadata ? u.user_metadata : {};
        nomeUser = (md.nome || md.name || md.full_name || '').split(' ')[0];
        desenharCabecalho();
      });
      carregar();
    } else if (tent > 150) {
      clearInterval(espera);
    }
  }, 100);

  var renderOriginal = window.render;
  if (typeof renderOriginal === 'function') {
    window.render = function () {
      var r = renderOriginal.apply(this, arguments);
      clearTimeout(timer);
      timer = setTimeout(function () { if (root) carregar(); }, 600);
      return r;
    };
  }
})();
