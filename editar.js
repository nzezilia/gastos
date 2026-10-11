(function () {
  var st = document.createElement('style');
  st.textContent =
    '#edOv{position:fixed;top:0;right:0;bottom:0;left:0;z-index:100;background:rgba(10,12,22,.5);display:flex;align-items:flex-end;justify-content:center}' +
    '#edSh{background:var(--card);color:var(--txt);width:100%;max-width:480px;max-height:92vh;overflow:auto;border-radius:24px 24px 0 0;padding:20px 18px calc(24px + env(safe-area-inset-bottom));border:1px solid var(--bd)}' +
    '#edSh .cab{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px}' +
    '#edSh .cab strong{font-size:18px}' +
    '#edSh .cab button{background:none;border:0;color:var(--mut);font-size:24px;padding:4px}' +
    '#edSh .info{font-size:13px;color:var(--mut);margin:4px 0 0}' +
    '#edSh label{display:block;font-size:13px;color:var(--mut);margin:14px 0 6px}' +
    '#edSh input,#edSh select{width:100%;padding:12px;font-size:16px;border:1px solid var(--bd);border-radius:12px;background:var(--bg);color:var(--txt)}' +
    '#edSh .big{font-size:34px;font-weight:700;border:0;border-bottom:2px solid var(--bd);border-radius:0;background:transparent;padding:6px 0}' +
    '#edSh .btn{width:100%;padding:16px;margin-top:12px;border:0;border-radius:14px;background:var(--pri);color:#fff;font-size:17px;font-weight:600}' +
    '#edSh .btn.sec{background:none;border:1px solid var(--pri);color:var(--pri)}' +
    '#edSh .btn.sec.perigo{border-color:var(--err);color:var(--err)}' +
    '#edSh .btn:disabled{opacity:.6}';
  document.head.appendChild(st);

  function numero(s) {
    s = (s || '').trim();
    s = s.indexOf(',') >= 0 ? s.replace(/\./g, '').replace(',', '.') : s;
    var n = parseFloat(s);
    return isNaN(n) ? 0 : n;
  }
  function aviso(m, erro) {
    if (typeof toast === 'function') toast(m, erro);
    else alert(m);
  }
  function preencher(sel, itens, atual) {
    sel.innerHTML = '';
    itens.forEach(function (n) {
      var o = document.createElement('option');
      o.value = n;
      o.textContent = n;
      sel.appendChild(o);
    });
    sel.value = atual;
  }

  window.abrirEdicao = async function (id, aoSalvar) {
    if (document.getElementById('edOv')) return;
    var r = await db.from('gastos').select('*').eq('id', id).maybeSingle();
    if (r.error || !r.data) return aviso('Não consegui abrir este lançamento', true);
    var g = r.data;

    var m = await db.from('meios_pagamento').select('nome').order('nome');
    var meios = m.error ? [] : m.data.map(function (x) { return x.nome; });
    if (meios.indexOf(g.meio_pagamento) < 0) meios.push(g.meio_pagamento);
    var cats = typeof CATEGORIAS !== 'undefined' ? CATEGORIAS.slice() : [];
    if (cats.indexOf(g.categoria) < 0) cats.push(g.categoria);

    var ov = document.createElement('div');
    ov.id = 'edOv';
    var sh = document.createElement('div');
    sh.id = 'edSh';
    ov.appendChild(sh);
    sh.innerHTML =
      '<div class="cab"><strong>Editar lançamento</strong><button type="button" id="edX" aria-label="Fechar"><i class="ti ti-x"></i></button></div>' +
      '<div class="info" id="edInfo"></div>' +
      '<label for="edValor">Valor (R$)</label><input id="edValor" class="big" inputmode="decimal" autocomplete="off">' +
      '<label for="edData">Data</label><input id="edData" type="date">' +
      '<label for="edCat">Categoria</label><select id="edCat"></select>' +
      '<label for="edMeio">Onde</label><select id="edMeio"></select>' +
      '<label for="edDesc">Descrição</label><input id="edDesc" autocomplete="off">' +
      '<label for="edTipo">Tipo</label><select id="edTipo"><option value="variavel">Variável</option><option value="fixo">Fixo</option></select>' +
      '<button type="button" class="btn" id="edSalvar">Salvar alterações</button>' +
      '<button type="button" class="btn sec perigo" id="edApagar">Apagar lançamento</button>';
    document.body.appendChild(ov);

    function $(i) { return document.getElementById(i); }
    function fechar() { ov.remove(); }

    if (g.parcelas > 1) {
      $('edInfo').textContent = 'Parcela ' + g.parcela_numero + ' de ' + g.parcelas + '. A alteração vale só para esta parcela.';
    }
    $('edValor').value = String(g.valor).replace('.', ',');
    $('edData').value = g.data;
    preencher($('edCat'), cats, g.categoria);
    preencher($('edMeio'), meios, g.meio_pagamento);
    $('edDesc').value = g.descricao || '';
    $('edTipo').value = g.tipo || 'variavel';

    ov.addEventListener('click', function (e) { if (e.target === ov) fechar(); });
    $('edX').onclick = fechar;

    $('edSalvar').onclick = async function () {
      var v = numero($('edValor').value);
      if (!(v > 0)) return aviso('Informe o valor', true);
      if (!$('edData').value) return aviso('Informe a data', true);
      $('edSalvar').disabled = true;
      var res = await db.from('gastos').update({
        valor: v,
        data: $('edData').value,
        categoria: $('edCat').value,
        meio_pagamento: $('edMeio').value,
        descricao: $('edDesc').value.trim() || null,
        tipo: $('edTipo').value
      }).eq('id', id);
      $('edSalvar').disabled = false;
      if (res.error) return aviso('Erro: ' + res.error.message, true);
      fechar();
      aviso('Alterações salvas ✓');
      if (aoSalvar) aoSalvar();
    };

    $('edApagar').onclick = async function () {
      if (!confirm('Apagar este lançamento?')) return;
      var res = await db.from('gastos').delete().eq('id', id);
      if (res.error) return aviso('Erro: ' + res.error.message, true);
      fechar();
      aviso('Apagado');
      if (aoSalvar) aoSalvar();
    };
  };
})();
