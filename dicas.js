(function () {
  var st = document.createElement('style');
  st.textContent =
    '.dica{display:flex;gap:10px;padding:10px 0;border-bottom:1px solid var(--bd)}' +
    '.dica:last-child{border-bottom:0}' +
    '.dica>i{font-size:22px;flex:none;color:var(--pri);margin-top:1px}' +
    '.dica.ok>i{color:#16a34a}.dica.alerta>i{color:#d97706}.dica.perigo>i{color:var(--err)}' +
    '.dica b{display:block;font-size:14px;margin-bottom:2px}' +
    '.dica span{display:block;font-size:13px;color:var(--mut);line-height:1.4}' +
    '.dsec{font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--mut);margin:18px 0 2px}' +
    '.dsec:first-of-type{margin-top:12px}' +
    '.dbtn{width:100%;padding:14px;margin-top:10px;border-radius:14px;border:1px solid var(--pri);background:none;color:var(--pri);font-size:15px;font-weight:600}' +
    '.dbtn.p{background:var(--pri);color:#fff}';
  document.head.appendChild(st);

  var fut = {t: 0, rows: [], busy: false};

  function atualizarFuturas() {
    if (fut.busy || Date.now() - fut.t < 60000) return;
    fut.busy = true;
    (async function () {
      try {
        var ini = addMeses(hoje().slice(0, 8) + '01', 1);
        var fim = addMeses(ini, 3);
        var tudo = [], de = 0;
        while (true) {
          var r = await db.from('gastos').select('data,valor')
            .gt('parcelas', 1).gte('data', ini).lt('data', fim)
            .order('data').order('id').range(de, de + 999);
          if (r.error) break;
          tudo = tudo.concat(r.data);
          if (r.data.length < 1000) break;
          de += 1000;
        }
        fut.rows = tudo;
      } catch (e) {}
      fut.t = Date.now();
      fut.busy = false;
      atualizarDicas();
    })();
  }

  function totaisFuturos() {
    var base = hoje().slice(0, 8) + '01';
    var meses3 = [1, 2, 3].map(function (k) { return addMeses(base, k).slice(0, 7); });
    var tots = meses3.map(function (m) {
      return soma(fut.rows.filter(function (x) { return x.data.slice(0, 7) === m; }));
    });
    return {meses: meses3, tots: tots};
  }

  function dicasPessoais() {
    var out = [];
    var hj = hoje();
    var mm = mes.slice(0, 7);
    var ehAtual = visao === 'compra' && mm === hj.slice(0, 7);
    var futuro = mm > hj.slice(0, 7);
    var totMes = soma(dados);

    if (limite > 0 && totMes > 0 && !futuro) {
      if (totMes > limite) {
        out.push({
          icone: 'gauge', tom: 'perigo', titulo: 'Orçamento acima do limite',
          texto: ehAtual
            ? 'Com as parcelas e despesas que ainda vão cair, o mês já passa do limite em ' + brl(totMes - limite) + '.'
            : 'O mês passou do limite em ' + brl(totMes - limite) + ' (' + Math.round(totMes / limite * 100) + '% do limite).'
        });
      } else if (ehAtual) {
        var dia = +hj.slice(8, 10);
        var diasMes = new Date(+hj.slice(0, 4), +hj.slice(5, 7), 0).getDate();
        var decorrido = dia / diasMes * 100;
        var ate = soma(dados.filter(function (x) { return x.data <= hj; }));
        var pctAte = ate / limite * 100;
        if (pctAte > decorrido + 10) {
          out.push({
            icone: 'gauge', tom: 'alerta', titulo: 'Ritmo acima do esperado',
            texto: 'Você já gastou ' + Math.round(pctAte) + '% do limite e só ' + Math.round(decorrido) + '% do mês passou.'
          });
        } else {
          out.push({
            icone: 'gauge', tom: 'ok', titulo: 'Dentro do ritmo',
            texto: 'Você gastou ' + Math.round(pctAte) + '% do limite e ' + Math.round(decorrido) + '% do mês já passou.'
          });
        }
      } else {
        out.push({
          icone: 'gauge', tom: 'ok', titulo: 'Mês dentro do limite',
          texto: 'Você usou ' + Math.round(totMes / limite * 100) + '% do limite.'
        });
      }
    }

    var mmPrev = addMeses(mes, -1).slice(0, 7);
    var corte = +hj.slice(8, 10);
    var cur = {}, prev = {};
    janela.forEach(function (x) {
      var v = Number(x.valor);
      if (x.mm === mm) {
        if (!ehAtual || x.data <= hj) cur[x.categoria] = (cur[x.categoria] || 0) + v;
      } else if (x.mm === mmPrev) {
        if (!ehAtual || +x.data.slice(8, 10) <= corte) prev[x.categoria] = (prev[x.categoria] || 0) + v;
      }
    });
    if (Object.keys(prev).length) {
      var melhor = null;
      Object.keys(cur).forEach(function (c) {
        var p = prev[c] || 0, d = cur[c] - p;
        if (d >= 30 && (p === 0 || d / p >= 0.2) && (!melhor || d > melhor.d)) melhor = {c: c, cur: cur[c], p: p, d: d};
      });
      if (melhor) {
        out.push({
          icone: 'trending-up', tom: 'alerta', titulo: melhor.c + ' subiu mais',
          texto: brl(melhor.cur) + ' contra ' + brl(melhor.p) + ' em ' + nomeMes(mmPrev + '-01', 'long') + (ehAtual ? ', no mesmo período.' : '.')
        });
      }
    }

    var porCat = {};
    dados.forEach(function (x) { porCat[x.categoria] = (porCat[x.categoria] || 0) + Number(x.valor); });
    var top = null;
    Object.keys(porCat).forEach(function (c) { if (!top || porCat[c] > top[1]) top = [c, porCat[c]]; });
    if (top && totMes > 0) {
      var pct = top[1] / totMes * 100;
      out.push({
        icone: 'chart-pie', tom: pct >= 40 ? 'alerta' : '', titulo: top[0] + ' é a maior categoria',
        texto: brl(top[1]) + ', ' + Math.round(pct) + '% do total' + (pct >= 40 ? '. Se quiser economizar, é um bom lugar para começar.' : '.')
      });
    }

    var peq = dados.filter(function (x) { return Number(x.valor) < 20 && x.parcelas === 1; });
    if (peq.length >= 8 && totMes > 0) {
      out.push({
        icone: 'coins', titulo: 'Compras pequenas',
        texto: peq.length + ' compras abaixo de R$ 20 somam ' + brl(soma(peq)) + ' (' + Math.round(soma(peq) / totMes * 100) + '% do total). Passam despercebidas, mas pesam no fim do mês.'
      });
    }

    var ass = soma(dados.filter(function (x) { return x.categoria === 'Assinaturas'; }));
    if (ass > 0) {
      out.push({
        icone: 'repeat', titulo: 'Assinaturas',
        texto: brl(ass) + ' neste mês, cerca de ' + brl(ass * 12) + ' por ano. Vale revisar as que você quase não usa.'
      });
    }

    var tf = totaisFuturos();
    if (tf.tots.some(function (t) { return t > 0; })) {
      out.push({
        icone: 'calendar-event',
        tom: limite > 0 && tf.tots[0] > limite * 0.3 ? 'alerta' : '',
        titulo: 'Parcelas já comprometidas',
        texto: tf.meses.map(function (m, i) { return nomeMes(m + '-01', 'short') + ' ' + brl(tf.tots[i]); }).join(' · ') + '. Confira isso antes de parcelar mais.'
      });
    }

    var d90 = new Date();
    d90.setDate(d90.getDate() - 90);
    var iso90 = fmtISO(d90);
    var sem = [0, 0, 0, 0, 0, 0, 0], n = 0, tot = 0;
    janela.forEach(function (x) {
      if (x.parcela_numero === 1 && x.data <= hj && x.data >= iso90) {
        var dt = new Date(+x.data.slice(0, 4), +x.data.slice(5, 7) - 1, +x.data.slice(8, 10));
        sem[dt.getDay()] += Number(x.valor);
        tot += Number(x.valor);
        n++;
      }
    });
    if (n >= 20 && tot > 0) {
      var nomes = ['domingos', 'segundas', 'terças', 'quartas', 'quintas', 'sextas', 'sábados'];
      var im = 0;
      sem.forEach(function (v, i) { if (v > sem[im]) im = i; });
      var p = sem[im] / tot * 100;
      if (p >= 22) {
        out.push({
          icone: 'calendar-week', titulo: 'Dia da semana que mais pesa',
          texto: Math.round(p) + '% dos seus gastos dos últimos 90 dias foram em ' + nomes[im] + '.'
        });
      }
    }
    return out;
  }

  var GERAIS = [
    {icone: 'shield-check', titulo: 'Reserva de emergência', texto: 'Uma referência comum é guardar o equivalente a 3 a 6 meses de despesas em uma aplicação de liquidez diária e baixo risco.'},
    {icone: 'credit-card', titulo: 'Fatura sempre integral', texto: 'O rotativo do cartão está entre as dívidas mais caras. Pagar a fatura inteira evita juros.'},
    {icone: 'chart-pie', titulo: 'Regra 50/30/20', texto: 'Referência popular: 50% da renda para necessidades, 30% para desejos e 20% para poupar ou quitar dívidas. Ajuste à sua realidade.'},
    {icone: 'calendar-event', titulo: 'Antes de parcelar', texto: 'Parcelas ocupam o orçamento dos meses seguintes. Veja o que já está comprometido antes de assumir mais uma.'},
    {icone: 'list-check', titulo: 'Revisão trimestral', texto: 'A cada 3 meses, reveja assinaturas e despesas fixas: cancelar o que não usa libera orçamento sem esforço.'}
  ];

  function montarPrompt() {
    var hj = hoje();
    var mm = mes.slice(0, 7);
    var ehAtual = visao === 'compra' && mm === hj.slice(0, 7);
    var total = soma(dados);
    var L = [];
    L.push('Você é um consultor de finanças pessoais. Analise os meus gastos abaixo e responda em português, em tópicos curtos e sem jargão.');
    L.push('');
    L.push('Período: ' + nomeMes(mes, 'long') + ' de ' + mes.slice(0, 4) +
      (visao === 'fatura' ? ' (visão por fatura: cartões de crédito agrupados pelo mês de vencimento)' : ' (visão por data da compra)'));
    if (ehAtual) L.push('O mês ainda está em andamento (hoje é dia ' + (+hj.slice(8, 10)) + '). O total inclui parcelas e despesas fixas já lançadas para os próximos dias.');
    L.push('Total do mês: ' + brl(total) + (limite > 0
      ? ' | Limite mensal definido: ' + brl(limite) + ' (' + Math.round(total / limite * 100) + '% usado)'
      : ' | Sem limite mensal definido'));
    var mmPrev = addMeses(mes, -1).slice(0, 7);
    L.push('Total do mês anterior: ' + brl(soma(janela.filter(function (x) { return x.mm === mmPrev; }))));

    function grupo(campo) {
      var m = {};
      dados.forEach(function (x) { m[x[campo]] = (m[x[campo]] || 0) + Number(x.valor); });
      return Object.keys(m).sort(function (a, b) { return m[b] - m[a]; }).map(function (k) {
        return '- ' + k + ': ' + brl(m[k]) + (total > 0 ? ' (' + Math.round(m[k] / total * 100) + '%)' : '');
      });
    }
    L.push('');
    L.push('Gastos por categoria:');
    grupo('categoria').forEach(function (l) { L.push(l); });
    L.push('');
    L.push('Gastos por cartão ou meio de pagamento:');
    grupo('meio_pagamento').forEach(function (l) { L.push(l); });

    var maiores = dados.slice().sort(function (a, b) { return Number(b.valor) - Number(a.valor); }).slice(0, 8);
    if (maiores.length) {
      L.push('');
      L.push('Maiores gastos:');
      maiores.forEach(function (x) {
        L.push('- ' + x.data.slice(8, 10) + '/' + x.data.slice(5, 7) + ' ' + (x.descricao || x.categoria) +
          ' (' + x.categoria + ', ' + x.meio_pagamento + '): ' + brl(x.valor) +
          (x.parcelas > 1 ? ' [parcela ' + x.parcela_numero + '/' + x.parcelas + ']' : ''));
      });
    }

    var tf = totaisFuturos();
    if (tf.tots.some(function (t) { return t > 0; })) {
      L.push('');
      L.push('Parcelas já comprometidas nos próximos meses: ' +
        tf.meses.map(function (m, i) { return nomeMes(m + '-01', 'short') + ' ' + brl(tf.tots[i]); }).join(', '));
    }

    L.push('');
    L.push('O que quero saber:');
    L.push('1) O que mais chama atenção nos meus gastos?');
    L.push('2) Onde há espaço realista para economizar?');
    L.push('3) Como distribuir o que resta para respeitar o limite (se houver)?');
    L.push('Não informei a minha renda; se precisar dela para ajudar, pergunte. Não recomende produtos de investimento específicos.');
    return L.join('\n');
  }

  async function copiar(txt) {
    try {
      await navigator.clipboard.writeText(txt);
      return true;
    } catch (e) {
      var ta = document.createElement('textarea');
      ta.value = txt;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e2) {}
      ta.remove();
      return ok;
    }
  }

  function linha(d) {
    var div = document.createElement('div');
    div.className = 'dica ' + (d.tom || '');
    var i = document.createElement('i');
    i.className = 'ti ti-' + d.icone;
    var box = document.createElement('div');
    var b = document.createElement('b');
    b.textContent = d.titulo;
    var s = document.createElement('span');
    s.textContent = d.texto;
    box.appendChild(b);
    box.appendChild(s);
    div.appendChild(i);
    div.appendChild(box);
    return div;
  }
  function secao(el, texto) {
    var d = document.createElement('div');
    d.className = 'dsec';
    d.textContent = texto;
    el.appendChild(d);
  }

  function atualizarDicas() {
    var el = document.getElementById('dicasCard');
    if (!el) return;
    atualizarFuturas();
    el.innerHTML = '';

    var info = document.createElement('div');
    info.className = 'mut';
    info.textContent = 'Baseado nos seus lançamentos de ' + nomeMes(mes, 'long') +
      (visao === 'fatura' ? ' (visão por fatura)' : '') + '. Não muda com os filtros.';
    el.appendChild(info);

    secao(el, 'Sobre os seus gastos');
    var pessoais = dados.length ? dicasPessoais() : [];
    if (!pessoais.length) {
      var vz = document.createElement('div');
      vz.className = 'mut';
      vz.style.padding = '8px 0';
      vz.textContent = dados.length ? 'Nada de relevante para destacar por enquanto.' : 'Ainda não há gastos neste mês para analisar.';
      el.appendChild(vz);
    }
    pessoais.forEach(function (d) { el.appendChild(linha(d)); });

    secao(el, 'Dicas gerais');
    GERAIS.forEach(function (d) { el.appendChild(linha(d)); });
    var aviso = document.createElement('div');
    aviso.className = 'mut';
    aviso.style.marginTop = '8px';
    aviso.textContent = 'São orientações gerais de educação financeira e não substituem a opinião de um profissional.';
    el.appendChild(aviso);

    secao(el, 'Análise com IA');
    var ia = document.createElement('div');
    ia.className = 'mut';
    ia.style.marginTop = '6px';
    ia.textContent = 'Quer uma análise conversada? Gere um resumo deste mês e cole em uma IA de sua preferência, como o Claude. O app não envia nada sozinho: os dados só saem daqui quando você colar ou compartilhar. Vale ler o texto antes de enviar.';
    el.appendChild(ia);

    var bc = document.createElement('button');
    bc.type = 'button';
    bc.className = 'dbtn p';
    bc.textContent = 'Copiar resumo para a IA';
    bc.onclick = async function () {
      var ok = await copiar(montarPrompt());
      toast(ok ? 'Resumo copiado. Agora cole na IA.' : 'Não consegui copiar neste aparelho.', !ok);
    };
    el.appendChild(bc);

    if (navigator.share) {
      var bs = document.createElement('button');
      bs.type = 'button';
      bs.className = 'dbtn';
      bs.textContent = 'Compartilhar resumo';
      bs.onclick = async function () {
        try { await navigator.share({title: 'Resumo dos meus gastos', text: montarPrompt()}); }
        catch (e) {}
      };
      el.appendChild(bs);
    }
  }

  var wrap = document.querySelector('.wrap');
  if (wrap && !document.getElementById('dicasCard')) {
    var h = document.createElement('h2');
    h.textContent = 'Dicas';
    var card = document.createElement('div');
    card.className = 'card';
    card.id = 'dicasCard';
    wrap.appendChild(h);
    wrap.appendChild(card);
  }

  var origRender = window.render;
  if (typeof origRender === 'function') {
    window.render = function () {
      var r = origRender.apply(this, arguments);
      try { atualizarDicas(); } catch (e) {}
      return r;
    };
  }
  try { atualizarDicas(); } catch (e) {}
})();
