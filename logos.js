(function () {
  if (window.LogosLoaded) return;
  window.LogosLoaded = true;

  var st = document.createElement('style');
  st.textContent = '.logo-ok{background-color:#fff!important;background-repeat:no-repeat!important;background-position:center!important;background-size:72%!important;border:1px solid var(--bd);color:transparent!important;font-size:0!important}';
  document.head.appendChild(st);

  function sem(s) { return s.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }
  function slug(nome) {
    return sem(nome).toLowerCase().replace(/^(cartao|conta)\s+/, '').replace(/[^a-z0-9]/g, '');
  }

  var cache = {};
  function testar(s, cb) {
    var c = cache[s];
    if (c === 'ok') return cb(true);
    if (c === 'no') return cb(false);
    if (c) { c.push(cb); return; }
    cache[s] = [cb];
    var img = new Image();
    img.onload = function () {
      var l = cache[s];
      cache[s] = 'ok';
      l.forEach(function (f) { f(true); });
    };
    img.onerror = function () {
      var l = cache[s];
      cache[s] = 'no';
      l.forEach(function (f) { f(false); });
    };
    img.src = 'logo-' + s + '.png';
  }

  function aplicar(el, nome) {
    if (!nome) return;
    var s = slug(nome);
    if (!s || el.getAttribute('data-lg') === s) return;
    testar(s, function (ok) {
      if (!ok) return;
      el.setAttribute('data-lg', s);
      el.classList.add('logo-ok');
      el.style.backgroundImage = 'url(logo-' + s + '.png)';
    });
  }

  function varrer() {
    document.querySelectorAll('.bdg').forEach(function (el) {
      var p = el.parentElement;
      var n = p && p.querySelector('.nn');
      if (n) aplicar(el, n.textContent);
    });
    document.querySelectorAll('[data-logo]').forEach(function (el) {
      aplicar(el, el.getAttribute('data-logo'));
    });
  }

  window.aplicarLogos = varrer;
  varrer();
  new MutationObserver(varrer).observe(document.body, {childList: true, subtree: true});
})();
