/* Cor escolhida para cada cartão e conta (ex.: Inter Black).
   Guarda na coluna "cor" das tabelas meios_pagamento e contas (banco/cor_cartao.sql).
   Enquanto a coluna não existir, guarda só neste aparelho. */
(function () {
  if (window.CorCartao) return;

  var PALETA = [
    {id: '', nome: 'Automática'},
    {id: '#16161a', nome: 'Black'},
    {id: '#c9ccd3', nome: 'Platinum'},
    {id: '#c8a45c', nome: 'Gold'},
    {id: '#ff7a00', nome: 'Laranja'},
    {id: '#820ad1', nome: 'Roxo'},
    {id: '#1d4ed8', nome: 'Azul'},
    {id: '#0f766e', nome: 'Turquesa'},
    {id: '#15803d', nome: 'Verde'},
    {id: '#be123c', nome: 'Vermelho'},
    {id: '#db2777', nome: 'Rosa'},
    {id: '#475569', nome: 'Grafite'}
  ];
  /* cor de fábrica pelo nome do banco */
  var MARCAS = {
    nubank: '#820ad1', itau: '#ec7000', inter: '#ff7a00', bancodobrasil: '#fcd116', bb: '#fcd116',
    c6: '#2b2b2b', santander: '#ec0000', bradesco: '#cc092f', caixa: '#005ca9', mercadopago: '#009ee3',
    picpay: '#11c76f', xp: '#1a1a1a'
  };
  var CORES = ['#2563eb', '#7c3aed', '#db2777', '#ea580c', '#16a34a', '#0891b2', '#ca8a04', '#475569'];
  var mapa = {};
  var noBanco = {meios_pagamento: false, contas: false};
  var ouvintes = [];

  function local() {
    try { return JSON.parse(localStorage.getItem('corCartao') || '{}') || {}; } catch (e) { return {}; }
  }
  function salvarLocal(m) {
    try { localStorage.setItem('corCartao', JSON.stringify(m)); } catch (e) {}
  }
  function chave(tabela, nome) { return tabela + ':' + nome; }
  function slug(n) {
    return (n || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
      .replace(/^(cartao|conta)\s+/, '').replace(/[^a-z0-9]/g, '');
  }
  function automatica(nome) {
    var s = slug(nome);
    if (MARCAS[s]) return MARCAS[s];
    var h = 0;
    for (var i = 0; i < (nome || '').length; i++) h = (h * 31 + nome.charCodeAt(i)) >>> 0;
    return CORES[h % CORES.length];
  }
  /* texto escuro em cores claras (Platinum, BB amarelo), branco nas demais */
  function texto(hex) {
    var m = /^#?([0-9a-f]{6})$/i.exec(hex || '');
    if (!m) return '#ffffff';
    var n = parseInt(m[1], 16), r = n >> 16 & 255, g = n >> 8 & 255, b = n & 255;
    return (0.299 * r + 0.587 * g + 0.114 * b) > 170 ? '#16161a' : '#ffffff';
  }

  /* tabela: 'meios_pagamento' (cartões) ou 'contas' */
  function escolhida(tabela, nome) { return mapa[chave(tabela, nome)] || ''; }
  function cor(tabela, nome) {
    var c = escolhida(tabela, nome) || automatica(nome);
    return {fundo: c, texto: texto(c)};
  }

  async function carregar(db) {
    var loc = local();
    mapa = {};
    Object.keys(loc).forEach(function (k) { mapa[k] = loc[k]; });
    if (!db) return avisar();
    for (var t in noBanco) {
      var r = await db.from(t).select('nome,cor');
      noBanco[t] = !r.error;
      if (!r.error) r.data.forEach(function (x) { if (x.cor) mapa[chave(t, x.nome)] = x.cor; });
    }
    avisar();
  }

  async function definir(db, tabela, nome, valor) {
    var k = chave(tabela, nome);
    if (valor) mapa[k] = valor; else delete mapa[k];
    var gravou = false;
    if (db && noBanco[tabela]) {
      var r = await db.from(tabela).update({cor: valor || null}).eq('nome', nome);
      gravou = !r.error;
    }
    var loc = local();
    if (gravou) delete loc[k];
    else if (valor) loc[k] = valor;
    else delete loc[k];
    salvarLocal(loc);
    avisar();
    return gravou;
  }

  function aoMudar(fn) { ouvintes.push(fn); }
  function avisar() { ouvintes.forEach(function (fn) { try { fn(); } catch (e) {} }); }

  /* folha para escolher a cor de cada cartão e conta */
  function abrirSeletor(db, itens) {
    var ov = document.createElement('div');
    ov.id = 'corOv';
    ov.style.cssText = 'position:fixed;inset:0;z-index:110;background:rgba(8,4,24,.5);display:flex;align-items:flex-end;justify-content:center;backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px)';
    var sh = document.createElement('div');
    sh.style.cssText = 'width:100%;max-width:480px;max-height:85vh;overflow:auto;background:var(--sheet,#1e1640);border:1px solid var(--bd);border-radius:26px 26px 0 0;padding:16px 16px calc(24px + env(safe-area-inset-bottom));color:var(--txt);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px)';
    var hd = document.createElement('div');
    hd.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:6px';
    var tt = document.createElement('strong');
    tt.style.fontSize = '18px';
    tt.textContent = 'Cores dos cartões e contas';
    var x = document.createElement('button');
    x.type = 'button';
    x.setAttribute('aria-label', 'Fechar');
    x.style.cssText = 'background:none;border:0;color:var(--txt);font-size:24px;cursor:pointer';
    x.innerHTML = '<i class="ti ti-x"></i>';
    x.onclick = function () { ov.remove(); };
    hd.appendChild(tt); hd.appendChild(x);
    sh.appendChild(hd);
    var nota = document.createElement('div');
    nota.className = 'mut';
    nota.style.marginBottom = '8px';
    nota.textContent = noBanco.meios_pagamento
      ? 'A cor fica salva na sua conta e aparece em todos os aparelhos.'
      : 'A cor fica salva neste aparelho.';
    sh.appendChild(nota);
    var leg = document.createElement('div');
    leg.className = 'mut';
    leg.style.cssText = 'font-size:12px;margin-bottom:6px';
    leg.textContent = 'Na ordem: ' + PALETA.map(function (p) { return p.nome; }).join(', ') + '.';
    sh.appendChild(leg);

    itens.forEach(function (it) {
      var bloco = document.createElement('div');
      bloco.style.cssText = 'padding:12px 0;border-top:1px solid var(--bd)';
      var nm = document.createElement('div');
      nm.style.cssText = 'display:flex;align-items:center;gap:10px;font-weight:700;font-size:15px';
      var amostra = document.createElement('span');
      amostra.style.cssText = 'width:38px;height:24px;border-radius:6px;flex:none;border:1px solid rgba(255,255,255,.25)';
      nm.appendChild(amostra);
      nm.appendChild(document.createTextNode(it.rotulo));
      bloco.appendChild(nm);
      var sw = document.createElement('div');
      sw.style.cssText = 'display:flex;flex-wrap:wrap;gap:8px;margin-top:10px';
      function pintar() {
        var c = cor(it.tabela, it.nome), atual = escolhida(it.tabela, it.nome);
        amostra.style.background = c.fundo;
        [].forEach.call(sw.children, function (b) {
          b.style.boxShadow = b.dataset.c === atual ? '0 0 0 2px #fff' : 'none';
        });
      }
      PALETA.forEach(function (p) {
        var b = document.createElement('button');
        b.type = 'button';
        b.dataset.c = p.id;
        b.title = p.nome;
        b.setAttribute('aria-label', p.nome);
        var f = p.id || automatica(it.nome);
        b.style.cssText = 'width:34px;height:34px;border-radius:50%;border:2px solid rgba(255,255,255,.3);cursor:pointer;padding:0;color:' + texto(f) + ';font-size:10px;font-weight:800;background:' + f;
        if (!p.id) b.textContent = 'A';
        b.onclick = async function () {
          await definir(db, it.tabela, it.nome, p.id);
          pintar();
        };
        sw.appendChild(b);
      });
      bloco.appendChild(sw);
      sh.appendChild(bloco);
      pintar();
    });
    ov.appendChild(sh);
    ov.addEventListener('click', function (e) { if (e.target === ov) ov.remove(); });
    document.body.appendChild(ov);
  }

  window.CorCartao = {
    PALETA: PALETA, cor: cor, escolhida: escolhida, automatica: automatica, texto: texto,
    carregar: carregar, definir: definir, aoMudar: aoMudar, abrirSeletor: abrirSeletor
  };
})();
