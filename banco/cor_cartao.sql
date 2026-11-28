-- Cor escolhida para cada cartão e conta (rodar uma vez no SQL Editor do Supabase).
-- Sem esta coluna o app continua funcionando e guarda a cor só no aparelho.
alter table public.meios_pagamento add column if not exists cor text;
alter table public.contas add column if not exists cor text;
