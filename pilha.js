/* Início no formato "carteira": atalhos no topo e contas e cartões empilhados.
   Só organiza o que credito.js e carteira.js já calculam; não grava nada além das cores. */
(function () {
  if (!/inicio\.html$/i.test(location.pathname) || window.PilhaLoaded) return;
  window.PilhaLoaded = true;
  var wrap = document.querySelector('.wrap');
  if (!wrap) return;

  var st = document.createElement('style');
  st.textContent =
    '.at8{display:flex;justify-content:space-between;margin:4px 0 18px}' +
    '.at8 a{flex:1;display:flex;flex-direction:column;align-items:center;gap:6px;color:var(--txt);text-decoration:none;font-size:12px;font-weight:600;text-align:center;line-height:1.2;cursor:pointer}' +
    '.at8 span{width:54px;height:54px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:24px;background:var(--card);border:1px solid var(--bd);backdrop-filter:var(--vidro);-webkit-backdrop-filter:var(--vidro)}' +
    '.ph8{display:flex;justify-content:space-between;align-items:baseline;margin:0 4px 10px}' +
    '.ph8 small{display:block;color:var(--mut);font-size:12px}' +
    '.ph8 b{font-size:22px;letter-spacing:-.02em}' +
    '.ph8 button{background:var(--card);border:1px solid var(--bd);color:var(--txt);border-radius:999px;padding:7px 12px;font:inherit;font-size:13px;font-weight:600;display:inline-flex;align-items:center;gap:6px;cursor:pointer}' +
    '.pi8{position:relative;margin-bottom:16px}' +
    '.cd8{position:relative;display:flex;flex-direction:column;justify-content:space-between;height:168px;border-radius:22px;padding:16px 18px;margin-top:-112px;cursor:pointer;overflow:hidden;border:1px solid rgba(255,255,255,.28);box-shadow:0 -10px 24px -14px rgba(0,0,0,.6);transition:transform .15s}' +
    '.cd8:first-child{margin-top:0}' +
    '.pi8 .dica8{font-size:12px;color:var(--mut);text-align:center;margin-top:8px}' +
    '.cd8:active{transform:scale(.985)}' +
    '.cd8::after{content:"";position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.22),rgba(255,255,255,0) 55%);pointer-events:none}' +
    '.cd8 .t8{position:relative;display:flex;justify-content:space-between;align-items:center;gap:8px;font-size:15px;font-weight:700}' +
    '.cd8 .t8 small{font-size:12px;font-weight:600;opacity:.8;white-space:nowrap}' +
    '.cd8 .b8{position:relative;display:flex;gap:16px}' +
    '.cd8 .co8{flex:1;min-width:0;border-radius:12px;padding:4px 6px;margin:-4px -6px}' +
    '.cd8 .co8+.co8{border-left:1px solid currentColor;border-left-color:color-mix(in srgb,currentColor 30%,transparent);padding-left:14px;margin-left:0;border-radius:0}' +
    '.cd8 .b8 small{display:block;font-size:12px;opacity:.8}' +
    '.cd8 .b8 b{font-size:22px;letter-spacing:-.02em;white-space:nowrap}' +
    '.cd8 .b8 .x8{font-size:12px;opacity:.85;margin-top:2px}' +
    '.pi8 .vz8{color:var(--mut);font-size:14px;padding:12px 4px}';
  document.head.appendChild(st);

  function el(tag, cls, txt) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt !== undefined) e.textContent = txt;
    return e;
  }
  function moeda(v) { return Number(v).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}); }
  function curto(n) { return n.replace(/^cart[aã]o\s+/i, ''); }

  /* ---- atalhos ---- */
  var at = el('div', 'at8');
  [
    ['arrow-up-right', 'Novo gasto', function () { location.href = 'index.html'; }],
    ['arrow-down-left', 'Entrada', function () { if (window.abrirNovaEntrada) window.abrirNovaEntrada(typeof carregar === 'function' ? carregar : null); }],
    ['file-import', 'Importar fatura', function () { location.href = 'importar.html'; }],
    ['target', 'Planejar', function () { location.href = 'planejamento.html'; }]
  ].forEach(function (a) {
    var b = el('a');
    b.setAttribute('role', 'button');
    b.tabIndex = 0;
    var s = el('span');
    s.appendChild(el('i', 'ti ti-' + a[0]));
    b.appendChild(s);
    b.appendChild(document.createTextNode(a[1]));
    b.onclick = a[2];
    b.onkeydown = function (e) { if (e.key === 'Enter') a[2](); };
    at.appendChild(b);
  });

  /* ---- cabeçalho e pilha ---- */
  var cab = el('div', 'ph8');
  var cabT = el('div');
  cabT.appendChild(el('small', '', 'Total nas contas'));
  var tot = el('b', '', '—');
  cabT.appendChild(tot);
  var bCor = el('button');
  bCor.type = 'button';
  bCor.innerHTML = '<i class="ti ti-palette"></i>Cores';
  cab.appendChild(cabT);
  cab.appendChild(bCor);
  var pilha = el('div', 'pi8');

  var bloco = el('div');
  bloco.appendChild(at);
  bloco.appendChild(cab);
  bloco.appendChild(pilha);

  function chaveB(n) { return n.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, ''); }

  /* junta conta e cartão de crédito do mesmo banco */
  function bancos() {
    var mapa = {}, ordem = [];
    function pegar(nome) {
      var k = chaveB(nome);
      if (!mapa[k]) { mapa[k] = {nome: nome, conta: null, cartao: null}; ordem.push(k); }
      return mapa[k];
    }
    (window.ContasInfo || []).forEach(function (c) { pegar(c.nome).conta = c; });
    (window.CartoesInfo || []).forEach(function (m) { pegar(curto(m.nome)).cartao = m; });
    return ordem.map(function (k) { return mapa[k]; });
  }

  function coluna(lbl, val, extra, abrir) {
    var d = el('div', 'co8');
    d.appendChild(el('small', '', lbl));
    d.appendChild(el('b', '', val));
    if (extra) d.appendChild(el('div', 'x8', extra));
    if (abrir) {
      d.setAttribute('role', 'button');
      d.tabIndex = 0;
      d.onclick = function (e) { e.stopPropagation(); abrir(); };
      d.onkeydown = function (e) { if (e.key === 'Enter') { e.stopPropagation(); abrir(); } };
    }
    return d;
  }

  /* cartão em destaque (fica na frente da pilha), lembrado neste aparelho */
  var destaque = '';
  try { destaque = localStorage.getItem('pilhaDestaque') || ''; } catch (e) {}
  var reduzir = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function trazerParaFrente(bk) {
    var antes = {};
    [].forEach.call(pilha.children, function (c) { if (c.dataset.k) antes[c.dataset.k] = c.getBoundingClientRect().top; });
    destaque = chaveB(bk.nome);
    try { localStorage.setItem('pilhaDestaque', destaque); } catch (e) {}
    desenhar();
    if (reduzir) return;
    /* anima cada cartão da posição antiga para a nova */
    [].forEach.call(pilha.children, function (c) {
      var t0 = antes[c.dataset.k];
      if (t0 === undefined) return;
      var dy = t0 - c.getBoundingClientRect().top;
      if (!dy) return;
      c.style.transition = 'none';
      c.style.transform = 'translateY(' + dy + 'px)';
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          c.style.transition = 'transform .38s cubic-bezier(.2,.8,.2,1)';
          c.style.transform = '';
        });
      });
    });
  }

  function cartaoBanco(bk, naFrente) {
    var CC = window.CorCartao;
    var cor = CC ? CC.cor('banco', bk.nome) : {fundo: '#475569', texto: '#fff'};
    var c = el('div', 'cd8');
    c.style.background = 'linear-gradient(135deg,' + cor.fundo + ',color-mix(in srgb,' + cor.fundo + ' 70%,#000))';
    c.style.color = cor.texto;
    var temConta = bk.conta && !bk.conta.semSaldo;
    var tipo = bk.cartao && temConta ? 'Conta e crédito' : bk.cartao ? 'Crédito' : (bk.conta ? bk.conta.tipo : '');
    var t = el('div', 't8');
    t.appendChild(el('span', '', bk.nome));
    t.appendChild(el('small', '', tipo));
    c.appendChild(t);
    c.dataset.k = chaveB(bk.nome);
    var abrirConta = naFrente && bk.conta ? bk.conta.abrir : null;
    var abrirCartao = naFrente && bk.cartao ? function () { if (window.abrirCartao7) window.abrirCartao7(bk.cartao.nome); } : null;
    var linha = el('div', 'b8');
    if (bk.conta && (temConta || !bk.cartao)) {
      linha.appendChild(coluna('Saldo da conta', moeda(bk.conta.saldo), '', abrirConta));
    }
    if (bk.cartao) {
      var m = bk.cartao;
      linha.appendChild(coluna('Fatura do crédito', moeda(m.fatura),
        m.status + ' · vence dia ' + m.vence, abrirCartao));
    }
    c.appendChild(linha);
    var abrir = naFrente ? (abrirCartao || abrirConta) : function () { trazerParaFrente(bk); };
    c.setAttribute('aria-label', naFrente ? bk.nome + ', em destaque' : 'Trazer ' + bk.nome + ' para a frente');
    if (abrir) {
      c.setAttribute('role', 'button');
      c.tabIndex = 0;
      c.onclick = abrir;
      c.onkeydown = function (e) { if (e.key === 'Enter') abrir(); };
    }
    return c;
  }

  function desenhar() {
    var contas = window.ContasInfo || [];
    if (window.ContasInfo) tot.textContent = moeda(contas.reduce(function (s, c) { return s + c.saldo; }, 0));
    pilha.innerHTML = '';
    var lista = bancos();
    if (!lista.length) {
      pilha.appendChild(el('div', 'vz8', 'Carregando contas e cartões…'));
      return;
    }
    /* o escolhido fica na frente; sem escolha, os bancos com crédito vão para a frente */
    lista.sort(function (a, b) {
      var da = chaveB(a.nome) === destaque ? 2 : 0, db2 = chaveB(b.nome) === destaque ? 2 : 0;
      return (da + (a.cartao ? 1 : 0)) - (db2 + (b.cartao ? 1 : 0));
    });
    lista.forEach(function (bk, i) { pilha.appendChild(cartaoBanco(bk, i === lista.length - 1)); });
    if (lista.length > 1) pilha.appendChild(el('div', 'dica8', 'Toque num cartão de trás para trazê-lo para a frente'));
  }

  bCor.onclick = function () {
    if (!window.CorCartao) return;
    var itens = bancos().filter(function (bk) { return bk.nome !== 'Dinheiro'; })
      .map(function (bk) { return {tabela: 'banco', nome: bk.nome, rotulo: bk.nome}; });
    window.CorCartao.abrirSeletor(db, itens);
  };

  document.addEventListener('cartoes7', desenhar);
  document.addEventListener('contas7', desenhar);
  if (window.CorCartao) {
    window.CorCartao.aoMudar(desenhar);
    window.CorCartao.carregar(db);
  }

  /* entra no topo da aba Resumo, no lugar do cartão "Saldo total" */
  var tentativas = 0;
  var espera = setInterval(function () {
    tentativas++;
    var saldo = wrap.querySelector('.saldo7');
    if (saldo) {
      clearInterval(espera);
      wrap.insertBefore(bloco, saldo);
      saldo.style.display = 'none';
      desenhar();
    } else if (tentativas > 100) {
      clearInterval(espera);
    }
  }, 100);
})();
