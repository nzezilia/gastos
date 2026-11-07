(function () {
  var st = document.createElement('style');
  st.textContent = 'html body .ic{border-radius:50%!important;border:3px solid currentColor;width:44px;height:44px;font-size:22px}';
  document.head.appendChild(st);

  var pag = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  var MAPA = {
    'resumo.html': ['dicas.js', 'calendario.js'],
    'inicio.html': ['calendario.js', 'carteira.js']
  };
  ['logos.js'].concat(MAPA[pag] || []).forEach(function (arquivo) {
    var s = document.createElement('script');
    s.src = arquivo + '?v=3';
    document.body.appendChild(s);
  });
})();
