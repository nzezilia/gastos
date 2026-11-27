-- Agrupa as parcelas de uma mesma compra (rodar uma vez no SQL Editor do Supabase).
-- Seguro rodar de novo: só mexe em linhas que ainda não têm compra_id.

alter table public.gastos add column if not exists compra_id uuid;
create index if not exists gastos_compra_id_idx on public.gastos (compra_id);

-- Agrupa parcelas antigas: mesmo usuário, cartão, descrição, nº de parcelas
-- e mês da 1ª parcela. Duas compras idênticas no mesmo mês seriam unidas (raro).
-- Se der erro dizendo que user_id não existe, apague as duas linhas com user_id.
with grupos as (
  select user_id, meio_pagamento, coalesce(descricao, '') as d, parcelas,
         (date_trunc('month', data) - make_interval(months => parcela_numero - 1))::date as inicio,
         gen_random_uuid() as cid
  from public.gastos
  where parcelas > 1 and compra_id is null
  group by 1, 2, 3, 4, 5
)
update public.gastos g
set compra_id = gr.cid
from grupos gr
where g.parcelas > 1 and g.compra_id is null
  and g.user_id is not distinct from gr.user_id
  and g.meio_pagamento = gr.meio_pagamento
  and coalesce(g.descricao, '') = gr.d
  and g.parcelas = gr.parcelas
  and (date_trunc('month', g.data) - make_interval(months => g.parcela_numero - 1))::date = gr.inicio;
