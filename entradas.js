(function () {
  if (window.EntradasLoaded) return;
  window.EntradasLoaded = true;

  var CATS = ['Salário', 'Renda extra', 'Rendimentos', 'Reembolso', 'Presente', 'Outros'];
  var ICO = {'Salário': 'wallet', 'Renda extra': 'briefcase', 'Rendimentos': 'trending-up', 'Reembolso': 'receipt-refund', 'Presente': 'gift', 'Outros': 'dots'};
  window.CATEGORIAS_ENTRADA = CATS;

  var st = document.createElement('style');
  st.textContent =
    '#enOv{position:fixed;top:0;right:0;bottom:0;left:0;z-index:100;background:rgba(10,12,22,.5);display:flex;align-items:flex-end;justify-content:center}' +
    '#enSh{background:var(--card);color:var(--txt);width:100%;max-width:480px;max-height:92vh;overflow:auto;border-radius:24px 24px 0 0;padding:20px 18px calc(24px + env(safe-area-inset-bottom));border:1px solid var(--bd)}' +
    '#enSh .cab{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px}' +
    '#enSh .cab strong{font-size:18px}' +
    '#enSh .cab button{background:none;border:0;color:var(--mut);font-size:24px;padding:4px}' +
    '#enSh .info{font-size:13px;color:var(--mut);margin:4px 0 0}' +
    '#enSh label{display:block;font-size:13px;color:var(--mut);margin:14px 0 6px}' +
    '#enSh input,#enSh select{width:100%;padding:12px;font-size:16px;border:1px solid var(--bd);border-radius:12px;background:var(--bg);color:var(--txt)}' +
    '#enSh .big{font-size:34px;font-weight:700;border:0;border-bottom:2px solid var(--bd);border-radius:0;background:transparent;padding:6px 0}' +
    '#enSh .enchk{display:flex;align-items:center;gap:10px;color:var(--txt);font-size:15px}' +
    '#enSh .enchk input{width:20px;height:20px}' +
    '#enSh .btn{width:100%;padding:16px;margin-top:14px;border:0;border-radius:14px;background:var(--pri);color:#fff;font-size:17px;font-weight:600}' +
    '#enSh .btn.sec{background:none;border:1px solid var(--err);color:var(--err)}' +
    '#enSh .btn:disabled{opacity:.6}' +
    '.tx .v.pos{color:#16a34a}';
  document.head.appendChild(st);

  function g(id) { return document.getElementById(id); }
  function numero(s) {
    s = (s || '').trim();
    s = s.indexOf(',') >= 0 ? s.replace(/\./g, '').replace(',', '.') : s;
    var n = parseFloat(s);
    return isNaN(n) ? 0 : n;
  }
  function moeda(v) { return Number(v).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}); }
  function hojeISO() {
    var d = new Date();
    return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
  }
  function aviso(m, erro) {
    if (typeof toast === 'function') toast(m, erro);
    else alert(m);
  }
  function atualizar() {
    if (typeof carregar === 'function') carregar();
    else if (typeof resumo === 'function') resumo();
  }
  function folha() {
    var ov = document.createElement('div');
    ov.id = 'enOv';
    var sh = document.createElement('div');
    sh.id = 'enSh';
    ov.appendChild(sh);
    ov.addEventListener('click', function (e) { if (e.target === ov) ov.remove(); });
    document.body.appendChild(ov);
    return {ov: ov, sh: sh};
  }
  function opcoes(sel, lista, atual) {
    sel.innerHTML = '';
    lista.forEach(function (n) {
      var o = document.createElement('option');
      o.value = n;
      o.textContent = n;
      sel.appendChild(o);
    });
    sel.value = atual;
  }

  window.abrirNovaEntrada = function (aoSalvar, repetir) {
    if (g('enOv')) return;
    var f = folha();
    f.sh.innerHTML =
      '<div class="cab"><strong>Nova entrada</strong><button type="button" id="enX" aria-label="Fechar"><i class="ti ti-x"></i></button></div>' +
      '<label for="enValor">Valor (R$)</label><input id="enValor" class="big" inputmode="decimal" placeholder="0,00" autocomplete="off">' +
      '<label for="enData">Data</label><input id="enData" type="date">' +
      '<label for="enCat">Categoria</label><select id="enCat"></select>' +
      '<label for="enDesc">Descrição (opcional)</label><input id="enDesc" autocomplete="off">' +
      '<label class="enchk"><input type="checkbox" id="enRep"> Repetir todo mês (ex.: salário)</label>' +
      '<button type="button" class="btn" id="enSalvar">Salvar entrada</button>';
    g('enData').value = hojeISO();
    opcoes(g('enCat'), CATS, 'Salário');
    g('enRep').checked = !!repetir;
    g('enX').onclick = function () { f.ov.remove(); };
    g('enSalvar').onclick = async function () {
      var v = numero(g('enValor').value);
      if (!(v > 0)) return aviso('Informe o valor', true);
      var data = g('enData').value;
      if (!data) return aviso('Informe a data', true);
      var cat = g('enCat').value;
      var desc = g('enDesc').value.trim();
      var reg = {data: data, valor: v, categoria: cat, descricao: desc || null};
      var btn = g('enSalvar');
      btn.disabled = true;
      if (g('enRep').checked) {
        var fx = await db.from('entradas_fixas')
          .insert({descricao: desc || cat, valor: v, categoria: cat, dia: +data.slice(8, 10)})
          .select('id').single();
        if (fx.error) { btn.disabled = false; return aviso('Erro: ' + fx.error.message, true); }
        reg.recorrente_id = fx.data.id;
        reg.mes_ref = data.slice(0, 8) + '01';
      }
      var r = await db.from('entradas').insert(reg);
      btn.disabled = false;
      if (r.error) return aviso('Erro: ' + r.error.message, true);
      f.ov.remove();
      aviso('Entrada salva ✓');
      (aoSalvar || atualizar)();
    };
  };

  window.abrirEdicaoEntrada = async function (id, aoSalvar) {
    if (g('enOv')) return;
    var r = await db.from('entradas').select('*').eq('id', id).maybeSingle();
    if (r.error || !r.data) return aviso('Não consegui abrir esta entrada', true);
    var e = r.data;
    var f = folha();
    f.sh.innerHTML =
      '<div class="cab"><strong>Editar entrada</strong><button type="button" id="enX" aria-label="Fechar"><i class="ti ti-x"></i></button></div>' +
      '<div class="info" id="enInfo"></div>' +
      '<label for="enValor">Valor (R$)</label><input id="enValor" class="big" inputmode="decimal" autocomplete="off">' +
      '<label for="enData">Data</label><input id="enData" type="date">' +
      '<label for="enCat">Categoria</label><select id="enCat"></select>' +
      '<label for="enDesc">Descrição</label><input id="enDesc" autocomplete="off">' +
      '<button type="button" class="btn" id="enSalvar">Salvar alterações</button>' +
      '<button type="button" class="btn sec" id="enApagar">Apagar entrada</button>';
    if (e.recorrente_id) g('enInfo').textContent = 'Entrada fixa: a alteração vale só para este mês.';
    g('enValor').value = String(e.valor).replace('.', ',');
    g('enData').value = e.data;
    var cats = CATS.slice();
    if (cats.indexOf(e.categoria) < 0) cats.push(e.categoria);
    opcoes(g('enCat'), cats, e.categoria);
    g('enDesc').value = e.descricao || '';
    g('enX').onclick = function () { f.ov.remove(); };
    g('enSalvar').onclick = async function () {
      var v = numero(g('enValor').value);
      if (!(v > 0)) return aviso('Informe o valor', true);
      if (!g('enData').value) return aviso('Informe a data', true);
      var btn = g('enSalvar');
      btn.disabled = true;
      var res = await db.from('entradas').update({
        valor: v, data: g('enData').value, categoria: g('enCat').value,
        descricao: g('enDesc').value.trim() || null
      }).eq('id', id);
      btn.disabled = false;
      if (res.error) return aviso('Erro: ' + res.error.message, true);
      f.ov.remove();
      aviso('Alterações salvas ✓');
      (aoSalvar || atualizar)();
    };
    g('enApagar').onclick = async function () {
      if (!confirm('Apagar esta entrada?')) return;
      var res = await db.from('entradas').delete().eq('id', id);
      if (res.error) return aviso('Erro: ' + res.error.message, true);
      f.ov.remove();
      aviso('Apagada');
      (aoSalvar || atualizar)();
    };
  };

  window.criarTxEntrada = function (e, aoSalvar) {
    var row = document.createElement('div');
    row.className = 'tx';
    row.onclick = function () { window.abrirEdicaoEntrada(e.id, aoSalvar); };
    var ic = document.createElement('div');
    ic.className = 'ic';
    ic.style.background = 'color-mix(in srgb, #16a34a 16%, transparent)';
    ic.style.color = '#16a34a';
    var i = document.createElement('i');
    i.className = 'ti ti-' + (ICO[e.categoria] || 'cash');
    ic.appendChild(i);
    var mid = document.createElement('div');
    mid.className = 'mid';
    var t = document.createElement('div');
    t.className = 't';
    t.textContent = e.descricao || e.categoria;
    var s = document.createElement('div');
    s.className = 's';
    s.textContent = 'Entrada' + (e.descricao ? ' · ' + e.categoria : '') + (e.recorrente_id ? ' · fixa' : '');
    mid.appendChild(t);
    mid.appendChild(s);
    var vl = document.createElement('div');
    vl.className = 'vl';
    var v = document.createElement('div');
    v.className = 'v pos';
    v.textContent = '+ ' + moeda(e.valor);
    vl.appendChild(v);
    row.appendChild(ic);
    row.appendChild(mid);
    row.appendChild(vl);
    return row;
  };

  window.agruparMisto = function (items, aoSalvar, el) {
    el.innerHTML = '';
    var ultima = '';
    items.forEach(function (x) {
      if (x.data !== ultima) {
        ultima = x.data;
        var h = document.createElement('div');
        h.className = 'dh';
        h.textContent = rotuloData(x.data);
        el.appendChild(h);
      }
      el.appendChild(x._e ? window.criarTxEntrada(x, aoSalvar) : criarTx(x, aoSalvar));
    });
  };

  function montarFixas() {
    var alvo = null;
    [].slice.call(document.querySelectorAll('.wrap h2')).forEach(function (h) {
      if (h.textContent.indexOf('Despesas fixas') >= 0) alvo = h;
    });
    if (!alvo || g('enFixCard')) return;
    var card0 = alvo.nextElementSibling;
    var ref = card0 ? card0.nextSibling : null;
    var h2 = document.createElement('h2');
    h2.textContent = 'Entradas fixas (todo mês)';
    var card = document.createElement('div');
    card.className = 'card';
    card.id = 'enFixCard';
    alvo.parentNode.insertBefore(h2, ref);
    alvo.parentNode.insertBefore(card, ref);
    var info = document.createElement('div');
    info.className = 'mut';
    info.textContent = 'Entram sozinhas todo mês, na data que você escolher (por exemplo, o salário).';
    var lista = document.createElement('div');
    lista.style.marginTop = '8px';
    var bt = document.createElement('button');
    bt.type = 'button';
    bt.className = 'btn';
    bt.textContent = 'Adicionar entrada fixa';
    card.appendChild(info);
    card.appendChild(lista);
    card.appendChild(bt);

    async function desenhar() {
      var r = await db.from('entradas_fixas').select('*').order('dia').order('descricao');
      lista.innerHTML = '';
      if (r.error) { lista.textContent = 'Erro: ' + r.error.message; return; }
      if (!r.data.length) { lista.textContent = 'Nenhuma entrada fixa cadastrada.'; return; }
      r.data.forEach(function (x) {
        var item = document.createElement('div');
        item.className = 'item';
        var esq = document.createElement('div');
        var l1 = document.createElement('div');
        l1.textContent = x.descricao;
        var l2 = document.createElement('small');
        l2.textContent = 'Dia ' + x.dia + ' · ' + x.categoria;
        esq.appendChild(l1);
        esq.appendChild(l2);
        var dir = document.createElement('div');
        dir.className = 'dir';
        var v = document.createElement('span');
        v.textContent = moeda(x.valor);
        var b = document.createElement('button');
        var ic = document.createElement('i');
        ic.className = 'ti ti-trash';
        b.appendChild(ic);
        b.setAttribute('aria-label', 'Remover');
        b.onclick = async function () {
          if (!confirm('Remover "' + x.descricao + '"? As entradas já lançadas continuam.')) return;
          var d = await db.from('entradas_fixas').delete().eq('id', x.id);
          if (d.error) return aviso('Erro: ' + d.error.message, true);
          aviso('Removida');
          desenhar();
        };
        dir.appendChild(v);
        dir.appendChild(b);
        item.appendChild(esq);
        item.appendChild(dir);
        lista.appendChild(item);
      });
    }
    bt.onclick = function () { window.abrirNovaEntrada(desenhar, true); };
    desenhar();
  }

  if (/ferramentas\.html$/i.test(location.pathname)) montarFixas();
})();
