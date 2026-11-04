(function () {
  var PALETA = [
    {id: 'marinho', nome: 'Azul-marinho', claro: '#1e3a8a', escuro: '#5b7cfa'},
    {id: 'indigo', nome: 'Índigo', claro: '#4f46e5', escuro: '#6366f1'},
    {id: 'roxo', nome: 'Roxo', claro: '#7c3aed', escuro: '#a78bfa'},
    {id: 'azul', nome: 'Azul', claro: '#1d4ed8', escuro: '#3b82f6'},
    {id: 'turquesa', nome: 'Turquesa', claro: '#0f766e', escuro: '#14b8a6'},
    {id: 'verde', nome: 'Verde', claro: '#15803d', escuro: '#22a05b'},
    {id: 'ambar', nome: 'Âmbar', claro: '#b45309', escuro: '#d97706'},
    {id: 'vermelho', nome: 'Vermelho', claro: '#b91c1c', escuro: '#ef4444'},
    {id: 'rosa', nome: 'Rosa', claro: '#be185d', escuro: '#ec4899'},
    {id: 'grafite', nome: 'Grafite', claro: '#334155', escuro: '#64748b'}
  ];
  window.PALETA = PALETA;

  var mq = window.matchMedia('(prefers-color-scheme: dark)');
  function corSalva() {
    try { return localStorage.getItem('cor') || 'marinho'; } catch (e) { return 'marinho'; }
  }
  function aplicarCor() {
    var id = corSalva();
    var c = PALETA.filter(function (x) { return x.id === id; })[0] || PALETA[0];
    var v = mq.matches ? c.escuro : c.claro;
    document.documentElement.style.setProperty('--pri', v);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', v);
  }
  window.aplicarCor = aplicarCor;
  if (mq.addEventListener) mq.addEventListener('change', aplicarCor);
  aplicarCor();

  var ICONES = {
    'Mercado': 'shopping-cart', 'Alimentação': 'tools-kitchen-2', 'Transporte': 'bus',
    'Moradia': 'home', 'Saúde': 'heartbeat', 'Lazer': 'device-gamepad-2',
    'Educação': 'school', 'Assinaturas': 'repeat', 'Compras': 'shopping-bag',
    'Outros': 'dots', 'Pix': 'bolt', 'Dinheiro': 'cash'
  };
  var pag = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  var ativa = pag === 'importar.html' ? 'ferramentas.html' : pag;
  var itens = [
    ['inicio.html', 'home', 'Início', ''],
    ['transacoes.html', 'list-details', 'Transações', ''],
    ['index.html', 'plus', 'Lançar', 'fab'],
    ['resumo.html', 'chart-bar', 'Análises', ''],
    ['ferramentas.html', 'menu-2', 'Mais', '']
  ];
  if (!itens.some(function (x) { return x[0] === ativa; })) ativa = 'index.html';

  var nav = document.createElement('nav');
  nav.id = 'nav';
  itens.forEach(function (x) {
    var a = document.createElement('a');
    a.href = x[0];
    var cls = [];
    if (x[3]) cls.push(x[3]);
    if (x[0] === ativa) cls.push('on');
    a.className = cls.join(' ');
    var i = document.createElement('i');
    i.className = 'ti ti-' + x[1];
    a.appendChild(i);
    if (x[3] === 'fab') {
      a.setAttribute('aria-label', 'Lançar gasto');
    } else {
      var s = document.createElement('span');
      s.textContent = x[2];
      a.appendChild(s);
    }
    nav.appendChild(a);
  });
  document.body.appendChild(nav);

  function nomeIcone(t, ehMeio) {
    if (ICONES[t]) return ICONES[t];
    if (/^cart[aã]o/i.test(t)) return 'credit-card';
    return ehMeio ? 'credit-card' : null;
  }
  function marcar(el, nome) {
    if (!nome || el.querySelector('i.ti')) return;
    var i = document.createElement('i');
    i.className = 'ti ti-' + nome;
    el.insertBefore(i, el.firstChild);
  }
  function decorar() {
    document.querySelectorAll('.chip').forEach(function (el) {
      var ehMeio = el.parentElement && el.parentElement.id === 'meios';
      marcar(el, nomeIcone(el.textContent.trim(), ehMeio));
    });
    document.querySelectorAll('.row .l > span:first-child').forEach(function (el) {
      marcar(el, nomeIcone(el.textContent.trim(), false));
    });
    document.querySelectorAll('.item > div:first-child > div:first-child').forEach(function (el) {
      if (el.textContent.indexOf(' · ') > 0) {
        marcar(el, ICONES[el.textContent.split(' · ')[0].trim()] || null);
      }
    });
  }
  decorar();
  new MutationObserver(decorar).observe(document.body, {childList: true, subtree: true});

  function montarSeletorCor() {
    var wrap = document.querySelector('.wrap');
    if (!wrap || document.getElementById('corCard')) return;
    var top = wrap.querySelector('.top');
    var h = document.createElement('h2');
    h.textContent = 'Cor do sistema';
    var card = document.createElement('div');
    card.className = 'card';
    card.id = 'corCard';
    var txt = document.createElement('div');
    txt.className = 'mut';
    var box = document.createElement('div');
    box.className = 'cores';
    card.appendChild(txt);
    card.appendChild(box);
    if (top && top.nextSibling) {
      wrap.insertBefore(h, top.nextSibling);
      wrap.insertBefore(card, h.nextSibling);
    } else {
      wrap.appendChild(h);
      wrap.appendChild(card);
    }
    function desenhar() {
      var atual = corSalva();
      var nomeAtual = '';
      box.innerHTML = '';
      PALETA.forEach(function (c) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'sw' + (c.id === atual ? ' on' : '');
        b.style.background = c.claro;
        b.setAttribute('aria-label', c.nome);
        if (c.id === atual) {
          nomeAtual = c.nome;
          var ic = document.createElement('i');
          ic.className = 'ti ti-check';
          b.appendChild(ic);
        }
        b.onclick = function () {
          try { localStorage.setItem('cor', c.id); } catch (e) {}
          aplicarCor();
          desenhar();
        };
        box.appendChild(b);
      });
      txt.textContent = nomeAtual + ' · muda botões, menu e destaques neste aparelho.';
    }
    desenhar();
  }

  if (pag === 'ferramentas.html') montarSeletorCor();

  if (pag === 'resumo.html') {
    var sc = document.createElement('script');
    sc.src = 'dicas.js';
    document.body.appendChild(sc);
  }
})();
