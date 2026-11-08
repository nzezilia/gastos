(function () {
  var wrap = document.querySelector('.wrap');
  if (!wrap || window.MaisLoaded) return;
  window.MaisLoaded = true;

  var st = document.createElement('style');
  st.textContent =
    '.mgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:8px}' +
    '.mt{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;min-height:108px;padding:14px 6px;background:var(--card);border:1px solid var(--bd);border-radius:20px;box-shadow:var(--sombra);color:var(--txt);text-decoration:none;font-family:inherit;font-size:13px;font-weight:600;line-height:1.25;text-align:center;cursor:pointer;transition:transform .08s}' +
    '.mt:active{transform:scale(.97)}' +
    '.mt .mi{width:46px;height:46px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:var(--tint);color:var(--pri);font-size:24px}' +
    '.mback{display:flex;align-items:center;gap:4px;background:none;border:0;color:var(--pri);font-family:inherit;font-size:17px;font-weight:700;padding:6px 0;cursor:pointer}' +
    '.mgrid[hidden],.mback[hidden],.mpanel[hidden]{display:none!important}';
  document.head.appendChild(st);

  var TILES = [
    ['adic', 'users', 'Cartões adicionais', 'adicionais.html'],
    ['meios', 'credit-card', 'Cartões e meios'],
    ['imp', 'file-import', 'Importar fatura', 'importar.html'],
    ['fix', 'repeat', 'Lançamentos fixos'],
    ['res', 'chart-bar', 'Análises e dicas', 'resumo.html'],
    ['bkp', 'database-export', 'Backup e exportação'],
    ['cor', 'palette', 'Cor do sistema']
  ];
  var MAPA = [
    ['Cor do sistema', 'cor'], ['Importar fatura', 'imp'], ['Despesas fixas', 'fix'],
    ['Entradas fixas', 'fix'], ['Cartões e meios', 'meios'], ['Backup', 'bkp']
  ];
  var P = {};

  var top = wrap.querySelector('.top strong');
  if (top) top.textContent = 'Mais';

  function painel(k) {
    if (!P[k]) {
      var d = document.createElement('div');
      d.className = 'mpanel';
      d.hidden = true;
      P[k] = d;
      wrap.appendChild(d);
    }
    return P[k];
  }
  function organizar() {
    [].slice.call(wrap.children).forEach(function (h) {
      if (h.tagName !== 'H2') return;
      var m = null;
      MAPA.forEach(function (x) { if (!m && h.textContent.indexOf(x[0]) >= 0) m = x; });
      if (!m) return;
      var card = h.nextElementSibling;
      var p = painel(m[1]);
      p.appendChild(h);
      if (card && card.classList.contains('card')) p.appendChild(card);
      if (m[1] !== 'fix') h.style.display = 'none';
    });
  }

  var grid = document.createElement('div');
  grid.className = 'mgrid';
  var back = document.createElement('button');
  back.type = 'button';
  back.className = 'mback';
  back.hidden = true;
  back.innerHTML = '<i class="ti ti-chevron-left"></i><span></span>';

  function abrir(k, titulo) {
    organizar();
    grid.hidden = true;
    back.hidden = false;
    back.lastChild.textContent = titulo;
    Object.keys(P).forEach(function (x) { P[x].hidden = x !== k; });
    window.scrollTo(0, 0);
  }
  function voltar() {
    grid.hidden = false;
    back.hidden = true;
    Object.keys(P).forEach(function (x) { P[x].hidden = true; });
    window.scrollTo(0, 0);
  }
  back.onclick = voltar;

  TILES.forEach(function (t) {
    var a = document.createElement(t[3] ? 'a' : 'button');
    a.className = 'mt';
    if (t[3]) a.href = t[3]; else a.type = 'button';
    a.innerHTML = '<span class="mi"><i class="ti ti-' + t[1] + '"></i></span><span>' + t[2] + '</span>';
    if (!t[3]) a.onclick = function () { abrir(t[0], t[2]); };
    grid.appendChild(a);
  });

  var tp = wrap.querySelector('.top');
  wrap.insertBefore(back, tp ? tp.nextSibling : wrap.firstChild);
  wrap.insertBefore(grid, back.nextSibling);

  organizar();
  new MutationObserver(organizar).observe(wrap, {childList: true});

  var h = location.hash.slice(1);
  TILES.forEach(function (t) { if (!t[3] && t[0] === h) abrir(t[0], t[2]); });
})();
