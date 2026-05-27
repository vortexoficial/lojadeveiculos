-- Digital Veiculos - migracao opcional para tipos automotivos definitivos.
--
-- Use somente depois de confirmar que o app e o banco devem parar de usar
-- os tipos tecnicos legados:
--   suplemento -> carro
--   vestuario  -> moto
--
-- Antes de executar em producao, faca backup ou teste em uma copia do banco.

begin;

alter table public.products
  drop constraint if exists products_type_check;

alter table public.products
  add constraint products_type_check
  check (type in ('carro', 'moto', 'suv', 'picape', 'acessorio', 'outro'));

update public.products
set type = case type
  when 'suplemento' then 'carro'
  when 'vestuario' then 'moto'
  else type
end
where type in ('suplemento', 'vestuario');

update public.categories
set type = case type
  when 'suplemento' then 'carro'
  when 'vestuario' then 'moto'
  else type
end
where type in ('suplemento', 'vestuario');

notify pgrst, 'reload schema';

commit;
