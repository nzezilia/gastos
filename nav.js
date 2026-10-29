(function () {
  var ICONES = {
    'Mercado': 'shopping-cart', 'Alimentação': 'tools-kitchen-2', 'Transporte': 'bus',
    'Moradia': 'home', 'Saúde': 'heartbeat', 'Lazer': 'device-gamepad-2',
    'Educação': 'school', 'Assinaturas': 'repeat', 'Compras': 'shopping-bag',
    'Outros': 'dots', 'Pix': 'bolt', 'Dinheiro': 'cash'
  };
  var pag = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  var ativa = pag === 'importar.html' ? 'ferramentas.html' : pag;
  var itens = [
    ['index.html', 'plus', 'Lançar'],
    ['resumo.html', 'chart-bar', 'Resumo'],
    ['ferramentas.html', 'settings', 'Ferramentas']
  ];
  if (!itens.some(function (x) { return x[0] === ativa; })) ativa = 'index.html';

  var meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', '#4f46e5');

  var nav = document.createElement('nav');
  nav.id = 'nav';
  itens.forEach(function (x) {
    var a = document.createElement('a');
    a.href = x[0];
    if (x[0] === ativa) a.className = 'on';
    var i = document.createElement('i');
    i.className = 'ti ti-' + x[1];
    var s = document.createElement('span');
    s.textContent = x[2];
    a.appendChild(i);
    a.appendChild(s);
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

  if (pag === 'resumo.html') {
    var sc = document.createElement('script');
    sc.src = 'dicas.js';
    document.body.appendChild(sc);
  }
})();
