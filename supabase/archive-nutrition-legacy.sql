-- Arquivamento opcional de tabelas legadas da versao anterior.
-- Execute somente depois de confirmar que nenhum recurso ativo depende delas.
-- Este script renomeia as tabelas em vez de apagar dados.

do $$
begin
  if to_regclass('public.meal_templates') is not null
     and to_regclass('public.legacy_meal_templates') is null then
    alter table public.meal_templates rename to legacy_meal_templates;
  end if;

  if to_regclass('public.nutrition_suggestions') is not null
     and to_regclass('public.legacy_nutrition_suggestions') is null then
    alter table public.nutrition_suggestions rename to legacy_nutrition_suggestions;
  end if;
end $$;
