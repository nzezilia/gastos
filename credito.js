(function () {
  if (!/inicio\.html$/i.test(location.pathname) || window.Credito7Loaded) return;
  window.Credito7Loaded = true;

  var CORES = ['#2563eb', '#7c3aed', '#db2777', '#ea580c', '#16a34a', '#0891b2', '#ca8a04', '#475569'];
  var meios = [], gastos = [], pagas = {}, selCartao = '', selM = '', timer = null;

  var st = document.createElement('style');
  st.textContent =
    '.lim7 small{display:block;color:var(--mut);font-size:13px}' +
    '.lim7 .v{font-size:36px;font-weight:700;letter-spacing:-.02em;margin:2px 0}' +
    '.lim7 .s{font-size:13px;color:var(--mut)}' +
    '.fat7 .cab{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:10px}' +
    '.fat7 .cab strong{font-size:12px;letter-spacing:.09em;text-transform:uppercase;color:var(--mut)}' +
    '.fat7 .cab span{font-size:12px;color:var(--mut)}' +
    '.fat7 .chips{margin-bottom:14px}' +
    '.fat7 .chip{padding:7px 12px;font-size:13px}' +
    '.fat7 .bars{display:flex;align-items:flex-end;gap:8px;height:170px}' +
    '.fat7 .b{flex:1;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:6px;background:none;border:0;padding:0;color:var(--txt);cursor:pointer;font-family:inherit}' +
    '.fat7 .b .n{font-size:11px;font-weight:700}' +
    '.fat7 .b .c{width:100%;max-width:38px;border-radius:8px 8px 4px 4px;opacity:.38}' +
    '.fat7 .b.on .c{opacity:1}' +
    '.fat7 .b .m{font-size:12px;color:var(--mut);text-transform:lowercase}' +
    '.fat7 .b.on .m{color:var(--txt);font-weight:700}' +
    '.fat7 .det{display:flex;justify-content:space-between;align-items:center;margin-top:14px;padding-top:14px;border-top:1px solid var(--bd)}' +
    '.fat7 .det b{font-size:16px;text-transform:capitalize}' +
    '.fat7 .det small{display:block;color:var(--mut);font-size:12px;margin-top:2px}' +
    '.fat7 .det .tv{font-size:18px;font-weight:700;text-align:right}' +
    '.fat7 .tag{display:inline-block;margin-top:4px;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:600;background:var(--tint);color:var(--pri)}' +
    '.fat7 .tag.ok{background:color-mix(in srgb,#16a34a 18%,transparent);color:#16a34a}' +
    '.fat7 .tag.am{background:color-mix(in srgb,#d97706 18%,transparent);color:#d97706}' +
    '.fat7 .tag.rd{background:color-mix(in srgb,#dc2626 18%,transparent);color:#ef4444}';
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
  function totalFat(m, M) {
    var t = 0;
    gastos.forEach(function (x) {
      if (x.meio_pagamento === m.nome && mesFat(x.data, m) === M) t += Number(x.valor);
    });
    return t;
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
      var ini = isoD(new Date(hh.getFullYear(), hh.getMonth(), hh.getDate() - 150));
      var fim = isoD(new Date(hh.getFullYear(), hh.getMonth(), hh.getDate() + 1500));
      var de = 0;
      while (true) {
        var g = await db.from('gastos').select('data,valor,meio_pagamento')
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

  /* ---------- telas ---------- */
  var cred = null, limCard = el('div', 'card lim7'), fatCard = el('div', 'card fat7');

  function desenharLimite() {
    limCard.innerHTML = '';
    limCard.appendChild(el('small', '', 'Limite disponível nos cartões'));
    var corte = isoD(new Date(Date.now() - 20 * 864e5));
    var totLim = 0, usado = 0, comLimite = 0;
    meios.forEach(function (m) {
      var lim = Number(m.limite) || 0;
      if (!(lim > 0)) return;
      comLimite++;
      totLim += lim;
      gastos.forEach(function (x) {
        if (x.meio_pagamento !== m.nome) return;
        var M = mesFat(x.data, m);
        if (pagas[m.nome + '|' + M]) return;
        if (datasFat(m, M).vence < corte) return;
        usado += Number(x.valor);
      });
    });
    if (!comLimite) {
      limCard.appendChild(el('div', 'v', '—'));
      limCard.appendChild(el('div', 's', 'Toque no + em "Meus cartões" e informe o limite de cada cartão.'));
      return;
    }
    var disp = totLim - usado;
    var v = el('div', 'v', moeda(disp));
    if (disp < 0) v.style.color = 'var(--err)';
    limCard.appendChild(v);
    limCard.appendChild(el('div', 's', 'de ' + moeda(totLim) + ' · usado ' + moeda(usado)));
  }

  function desenharFaturas() {
    fatCard.innerHTML = '';
    if (!meios.length) { fatCard.style.display = 'none'; return; }
    fatCard.style.display = '';
    var m = meios.filter(function (x) { return x.nome === selCartao; })[0] || meios[0];
    var cor = corDe(m.nome);
    var baseM = mesFat(isoD(new Date()), m);
    if (!selM) selM = baseM;

    var cab = el('div', 'cab');
    cab.appendChild(el('strong', '', 'Faturas · ' + m.nome));
    cab.appendChild(el('span', '', 'toque na barra'));
    fatCard.appendChild(cab);

    if (meios.length > 1) {
      var chips = el('div', 'chips');
      meios.forEach(function (x) {
        var b = el('button', 'chip' + (x.nome === m.nome ? ' on' : ''), x.nome.replace(/^cart[aã]o\s+/i, ''));
        b.type = 'button';
        b.onclick = function () { selCartao = x.nome; selM = ''; desenhar(); };
        chips.appendChild(b);
      });
      fatCard.appendChild(chips);
    }

    var lista = [];
    for (var k = -3; k <= 2; k++) lista.push(somaMes(baseM, k));
    var tots = lista.map(function (M) { return totalFat(m, M); });
    var max = Math.max.apply(null, tots.concat([1]));
    var bars = el('div', 'bars');
    lista.forEach(function (M, i) {
      var b = el('button', 'b' + (M === selM ? ' on' : ''));
      b.type = 'button';
      b.appendChild(el('span', 'n', tots[i] > 0 ? Math.round(tots[i]).toLocaleString('pt-BR') : ''));
      var c = el('span', 'c');
      c.style.height = Math.max(4, tots[i] / max * 110) + 'px';
      c.style.background = cor;
      b.appendChild(c);
      b.appendChild(el('span', 'm', nomeMes(M + '-01', 'short')));
      b.onclick = function () { selM = M; desenharFaturas(); };
      bars.appendChild(b);
    });
    fatCard.appendChild(bars);

    var tot = totalFat(m, selM), s = statusFat(m, selM, tot), d = datasFat(m, selM);
    var det = el('div', 'det');
    var esq = el('div');
    var ano = selM.slice(0, 4) !== String(new Date().getFullYear()) ? ' ' + selM.slice(0, 4) : '';
    esq.appendChild(el('b', '', nomeMes(selM + '-01', 'long') + ano));
    esq.appendChild(el('small', '', 'Vence ' + ('0' + d.venceD.getDate()).slice(-2) + '/' + ('0' + (d.venceD.getMonth() + 1)).slice(-2)));
    esq.appendChild(el('span', 'tag ' + s.c, s.t));
    det.appendChild(esq);
    det.appendChild(el('div', 'tv', moeda(tot)));
    fatCard.appendChild(det);
  }

  function desenhar() {
    try { desenharLimite(); } catch (e) { if (window.console) console.error(e); }
    try { desenharFaturas(); } catch (e2) { if (window.console) console.error(e2); }
  }

  /* ---------- posição: Limite, Meus cartões, Faturas ---------- */
  var tent = 0;
  var espera = setInterval(function () {
    tent++;
    cred = document.getElementById('credito7');
    var lc = document.getElementById('ccList');
    if (cred && lc && cred.contains(lc)) {
      clearInterval(espera);
      cred.insertBefore(limCard, cred.firstChild);
      cred.appendChild(fatCard);
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
      timer = setTimeout(function () { if (cred && cred.contains(limCard)) carregar(); }, 600);
      return r;
    };
  }
})();
