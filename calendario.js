(function () {
  var st = document.createElement('style');
  st.textContent =
    '.cstats{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px}' +
    '.cstats div{background:var(--bg);border-radius:12px;padding:8px 10px}' +
    '.cstats small{display:block;font-size:11px;color:var(--mut)}' +
    '.cstats b{font-size:14px}' +
    '.cal2{display:grid;grid-template-columns:repeat(7,1fr);gap:5px}' +
    '.cal2 .dw{text-align:center;font-size:11px;font-weight:600;color:var(--mut);padding:2px 0}' +
    '.cal2 .c2{height:60px;border:0;border-radius:12px;padding:6px 2px 5px;display:flex;flex-direction:column;align-items:center;justify-content:space-between;cursor:pointer;color:var(--txt);background:var(--bg);position:relative;font-family:inherit}' +
    '.cal2 .c2.we{background:color-mix(in srgb,var(--mut) 9%,var(--card))}' +
    '.cal2 .c2.vz{visibility:hidden;cursor:default}' +
    '.cal2 .c2 .n{font-size:12px;font-weight:600;min-width:20px;height:20px;line-height:20px;border-radius:50%;padding:0 2px}' +
    '.cal2 .c2 .n.hj{background:var(--txt);color:var(--card)}' +
    '.cal2 .c2 .v{font-size:12px;font-weight:700;white-space:nowrap;min-height:14px}' +
    '.cal2 .c2 .fl{position:absolute;top:4px;right:4px;font-size:12px;color:#f59e0b}' +
    '.cal2 .c2.sel{box-shadow:0 0 0 2px var(--card),0 0 0 4px var(--txt)}' +
    '.leg{display:flex;align-items:center;justify-content:center;gap:4px;margin-top:10px;font-size:11px;color:var(--mut)}' +
    '.leg i{display:block;width:18px;height:10px;border-radius:3px}' +
    '.sem{margin-top:16px}' +
    '.sem .sh{font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--mut);margin-bottom:4px}' +
    '.sem .sr{display:flex;align-items:center;gap:10px;padding:6px 0;font-size:14px}' +
    '.sem .sl{width:92px;color:var(--mut);font-size:12px;flex:none}' +
    '.sem .sb{flex:1;height:8px;border-radius:4px;background:var(--bd);overflow:hidden}' +
    '.sem .sb i{display:block;height:100%;border-radius:4px;background:var(--pri)}' +
    '.sem .sv{width:86px;text-align:right;font-weight:600;flex:none}';
  document.head.appendChild(st);

  var PCT = [0, 14, 28, 44, 62, 80];

  function compacto(v) {
    if (v >= 1000) return (v / 1000).toFixed(1).replace('.', ',') + 'k';
    return String(Math.round(v));
  }
  function nivel(v, max) {
    if (v <= 0) return 0;
    return Math.min(5, Math.max(1, Math.ceil(5 * Math.sqrt(v / max))));
  }
  function corNivel(n) {
    return 'color-mix(in srgb, var(--pri) ' + PCT[n] + '%, var(--card))';
  }
  function ddmm(dt) {
    return ('0' + dt.getDate()).slice(-2) + '/' + ('0' + (dt.getMonth() + 1)).slice(-2);
  }

  window.renderCalendario = function (el) {
    el.innerHTML = '';
    var base = filtrar(false);
    var porDia = {};
    base.forEach(function (x) { porDia[x.data] = (porDia[x.data] || 0) + Number(x.valor); });

    var inicio, fimD;
    if (visao === 'compra') {
      inicio = paraData(mes);
      fimD = new Date(+mes.slice(0, 4), +mes.slice(5, 7), 0);
    } else {
      var datas = dados.map(function (x) { return x.data; }).sort();
      if (!datas.length) { el.textContent = 'Sem gastos nesta fatura.'; return; }
      inicio = paraData(datas[0]);
      fimD = paraData(datas[datas.length - 1]);
    }

    var valores = Object.keys(porDia).map(function (k) { return porDia[k]; });
    var max = Math.max.apply(null, valores.concat([1]));
    var total = soma(base);
    var diaMax = '';
    Object.keys(porDia).forEach(function (k) { if (!diaMax || porDia[k] > porDia[diaMax]) diaMax = k; });

    var agora = paraData(hoje());
    var ate = agora < fimD ? agora : fimD;
    var nDias = Math.max(1, Math.round((ate - inicio) / 86400000) + 1);

    var stats = document.createElement('div');
    stats.className = 'cstats';
    function tile(rotulo, valor) {
      var d = document.createElement('div');
      var s = document.createElement('small');
      s.textContent = rotulo;
      var b = document.createElement('b');
      b.textContent = valor;
      d.appendChild(s);
      d.appendChild(b);
      stats.appendChild(d);
    }
    tile('Total', brl(total));
    tile('Maior dia' + (diaMax ? ' · ' + fmtDia(diaMax) : ''), brl(diaMax ? porDia[diaMax] : 0));
    tile('Média por dia', brl(total / nDias));
    el.appendChild(stats);

    var comeco = new Date(inicio);
    comeco.setDate(comeco.getDate() - ((comeco.getDay() + 6) % 7));
    var final = new Date(fimD);
    final.setDate(final.getDate() + (6 - ((final.getDay() + 6) % 7)));

    var grid = document.createElement('div');
    grid.className = 'cal2';
    ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].forEach(function (n) {
      var h = document.createElement('div');
      h.className = 'dw';
      h.textContent = n;
      grid.appendChild(h);
    });

    var hj = hoje();
    var isoInicio = fmtISO(inicio);
    var semanas = [];
    var semAtual = null;
    var col = 0;
    for (var dt = new Date(comeco); dt <= final; dt.setDate(dt.getDate() + 1), col++) {
      var iso = fmtISO(dt);
      var dentro = !(dt < inicio || dt > fimD);
      if (col % 7 === 0) { semAtual = {total: 0, primeiro: null, ultimo: null}; semanas.push(semAtual); }
      var b = document.createElement('button');
      b.type = 'button';
      if (!dentro) {
        b.className = 'c2 vz';
        b.disabled = true;
        grid.appendChild(b);
        continue;
      }
      var tot = porDia[iso] || 0;
      semAtual.total += tot;
      if (!semAtual.primeiro) semAtual.primeiro = new Date(dt);
      semAtual.ultimo = new Date(dt);

      var n = nivel(tot, max);
      b.className = 'c2' + ((col % 7) >= 5 ? ' we' : '') + (iso === diaSel ? ' sel' : '');
      if (n > 0) {
        b.style.background = corNivel(n);
        if (n >= 4) b.style.color = '#fff';
      }
      var num = document.createElement('span');
      num.className = 'n' + (iso === hj ? ' hj' : '');
      var dia = dt.getDate();
      num.textContent = (visao === 'fatura' && (dia === 1 || iso === isoInicio)) ? dia + '/' + (dt.getMonth() + 1) : String(dia);
      var v = document.createElement('span');
      v.className = 'v';
      v.textContent = tot > 0 ? compacto(tot) : '';
      b.appendChild(num);
      b.appendChild(v);
      if (iso === diaMax && tot > 0) {
        var fl = document.createElement('i');
        fl.className = 'ti ti-flame fl';
        b.appendChild(fl);
      }
      (function (isoDia) {
        b.onclick = function () { diaSel = (diaSel === isoDia ? '' : isoDia); render(); };
      })(iso);
      grid.appendChild(b);
    }
    el.appendChild(grid);

    var leg = document.createElement('div');
    leg.className = 'leg';
    var menos = document.createElement('span');
    menos.textContent = 'Menos';
    leg.appendChild(menos);
    for (var k = 0; k <= 5; k++) {
      var sw = document.createElement('i');
      sw.style.background = k === 0 ? 'var(--bg)' : corNivel(k);
      sw.style.border = k === 0 ? '1px solid var(--bd)' : '0';
      leg.appendChild(sw);
    }
    var mais = document.createElement('span');
    mais.textContent = 'Mais';
    leg.appendChild(mais);
    el.appendChild(leg);

    var det = document.createElement('div');
    det.style.marginTop = '14px';
    if (diaSel) {
      var itens = base.filter(function (x) { return x.data === diaSel; });
      var cab = document.createElement('div');
      cab.style.cssText = 'display:flex;justify-content:space-between;font-weight:600;margin-bottom:4px';
      var a1 = document.createElement('span');
      a1.textContent = rotuloDia(diaSel);
      var t1 = document.createElement('span');
      t1.textContent = brl(soma(itens));
      cab.appendChild(a1);
      cab.appendChild(t1);
      det.appendChild(cab);
      if (!itens.length) {
        var vz = document.createElement('div');
        vz.className = 'mut';
        vz.textContent = 'Nenhum gasto neste dia.';
        det.appendChild(vz);
      }
      itens.forEach(function (g) { det.appendChild(itemLanc(g)); });
    } else {
      var dica = document.createElement('div');
      dica.className = 'mut';
      dica.textContent = 'Toque em um dia para ver os gastos dele.';
      det.appendChild(dica);
    }
    el.appendChild(det);

    var maxSem = Math.max.apply(null, semanas.map(function (s) { return s.total; }).concat([1]));
    var sem = document.createElement('div');
    sem.className = 'sem';
    var sh = document.createElement('div');
    sh.className = 'sh';
    sh.textContent = 'Por semana';
    sem.appendChild(sh);
    semanas.forEach(function (s) {
      if (!s.primeiro) return;
      var r = document.createElement('div');
      r.className = 'sr';
      var l = document.createElement('span');
      l.className = 'sl';
      l.textContent = ddmm(s.primeiro) + ' a ' + ddmm(s.ultimo);
      var bb = document.createElement('div');
      bb.className = 'sb';
      var bi = document.createElement('i');
      bi.style.width = (s.total / maxSem * 100) + '%';
      bb.appendChild(bi);
      var vv = document.createElement('span');
      vv.className = 'sv';
      vv.textContent = brl(s.total);
      r.appendChild(l);
      r.appendChild(bb);
      r.appendChild(vv);
      sem.appendChild(r);
    });
    el.appendChild(sem);
  };

  try { if (typeof render === 'function' && typeof dados !== 'undefined' && dados.length) render(); } catch (e) {}
})();
