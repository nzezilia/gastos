const CATEGORIAS = ['Mercado','Alimentação','Transporte','Moradia','Saúde','Lazer','Educação','Assinaturas','Compras','Outros'];
const ICONES = {'Mercado':'shopping-cart','Alimentação':'tools-kitchen-2','Transporte':'bus','Moradia':'home','Saúde':'heartbeat','Lazer':'device-gamepad-2','Educação':'school','Assinaturas':'repeat','Compras':'shopping-bag','Outros':'dots'};
const CORES = {'Mercado':'#639922','Alimentação':'#EF9F27','Transporte':'#7F77DD','Moradia':'#378ADD','Saúde':'#E24B4A','Lazer':'#1D9E75','Educação':'#D4537E','Assinaturas':'#BA7517','Compras':'#D85A30','Outros':'#888780'};
const $ = id => document.getElementById(id);

function fmtISO(dt){
  return dt.getFullYear() + '-' + String(dt.getMonth() + 1).padStart(2, '0') + '-' + String(dt.getDate()).padStart(2, '0');
}
function paraData(s){ const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); }
const hoje = () => fmtISO(new Date());
function addMeses(s, n){
  const [y, m, d] = s.split('-').map(Number);
  const t = new Date(y, m - 1 + n, 1);
  const ult = new Date(t.getFullYear(), t.getMonth() + 1, 0).getDate();
  return t.getFullYear() + '-' + String(t.getMonth() + 1).padStart(2, '0') + '-' + String(Math.min(d, ult)).padStart(2, '0');
}
const brl = v => Number(v).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
function num(s){
  s = (s || '').trim();
  s = s.includes(',') ? s.replace(/\./g, '').replace(',', '.') : s;
  const n = parseFloat(s);
  return isNaN(n) ? 0 : n;
}
function nomeMes(s, formato){
  return new Date(+s.slice(0, 4), +s.slice(5, 7) - 1, 1).toLocaleDateString('pt-BR', {month: formato}).replace('.', '');
}
const sem = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const soma = a => a.reduce((s, x) => s + Number(x.valor), 0);
const corCat = c => CORES[c] || '#888780';
const iconeCat = c => ICONES[c] || 'dots';

function toast(m, erro){
  const t = $('toast');
  t.textContent = m;
  t.className = erro ? 'show erro' : 'show';
  clearTimeout(toast.t);
  toast.t = setTimeout(() => t.className = '', 2500);
}

let cartoes = {};
async function carregarCartoes(){
  let m = await db.from('meios_pagamento').select('nome,dia_fechamento,dia_vencimento').order('nome');
  if(m.error) m = await db.from('meios_pagamento').select('nome').order('nome');
  const nomes = [];
  if(!m.error){
    m.data.forEach(x => {
      nomes.push(x.nome);
      cartoes[x.nome] = {fech: x.dia_fechamento || 0, venc: x.dia_vencimento || 0};
    });
  }
  return nomes;
}

function mesFatura(data, meio){
  const c = cartoes[meio];
  if(!c || !c.fech || !c.venc) return data.slice(0, 7);
  const y = +data.slice(0, 4), m = +data.slice(5, 7), d = +data.slice(8, 10);
  const corte = Math.min(c.fech, new Date(y, m, 0).getDate());
  let cy = y, cm = m;
  if(d > corte){ cm++; if(cm > 12){ cm = 1; cy++; } }
  if(c.venc <= c.fech){ cm++; if(cm > 12){ cm = 1; cy++; } }
  return cy + '-' + String(cm).padStart(2, '0');
}

function rotuloData(s){
  const h = new Date();
  if(s === fmtISO(h)) return 'Hoje';
  if(s === fmtISO(new Date(h.getFullYear(), h.getMonth(), h.getDate() - 1))) return 'Ontem';
  return s.slice(8, 10) + ' ' + nomeMes(s, 'short').toUpperCase();
}

function criarTx(g, aoSalvar){
  const row = document.createElement('div');
  row.className = 'tx';
  row.onclick = () => abrirEdicao(g.id, aoSalvar);
  const ic = document.createElement('div');
  ic.className = 'ic';
  ic.style.background = 'color-mix(in srgb, ' + corCat(g.categoria) + ' 16%, transparent)';
  ic.style.color = corCat(g.categoria);
  const i = document.createElement('i');
  i.className = 'ti ti-' + iconeCat(g.categoria);
  ic.appendChild(i);
  const mid = document.createElement('div');
  mid.className = 'mid';
  const t = document.createElement('div');
  t.className = 't';
  t.textContent = g.descricao || g.categoria;
  const s = document.createElement('div');
  s.className = 's';
  let sub = g.meio_pagamento;
  if(g.descricao) sub += ' · ' + g.categoria;
  if(g.parcelas > 1) sub += ' · ' + g.parcela_numero + '/' + g.parcelas;
  if(g.titular) sub += ' · ' + g.titular;
  s.textContent = sub;
  mid.appendChild(t); mid.appendChild(s);
  const vl = document.createElement('div');
  vl.className = 'vl';
  const v = document.createElement('div');
  v.className = 'v';
  v.textContent = '- ' + brl(g.valor);
  vl.appendChild(v);
  const c = cartoes[g.meio_pagamento];
  if(c && c.fech && c.venc){
    const n = document.createElement('div');
    n.className = 'n';
    n.textContent = 'fatura de ' + nomeMes(mesFatura(g.data, g.meio_pagamento) + '-01', 'short');
    vl.appendChild(n);
  }
  row.appendChild(ic); row.appendChild(mid); row.appendChild(vl);
  return row;
}

function agruparPorData(rows, aoSalvar, el){
  el.innerHTML = '';
  let ultima = '';
  rows.forEach(g => {
    if(g.data !== ultima){
      ultima = g.data;
      const h = document.createElement('div');
      h.className = 'dh';
      h.textContent = rotuloData(g.data);
      el.appendChild(h);
    }
    el.appendChild(criarTx(g, aoSalvar));
  });
}
