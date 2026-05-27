# Assets legados

Arquivos antigos encontrados em `public/product-images/`:

- `barra-proteica.webp`
- `bcaa.webp`
- `camiseta-fit.webp`
- `creatina.webp`
- `garrafa-shaker.webp`
- `omega3.webp`
- `pre-treino.webp`
- `short-treino.webp`
- `vitamina-d.webp`
- `whey-protein.webp`

## Decisao

Nao foram removidos nesta etapa. Eles nao aparecem mais nos dados demo atuais, mas podem estar referenciados por registros antigos do Supabase. A remocao deve ser feita depois de confirmar que nenhum veiculo ativo usa essas URLs.

## Banco legado

Tambem existem estruturas antigas de banco (`meal_templates` e `nutrition_suggestions`) nos SQLs de suporte. Elas nao sao usadas pelo frontend atual. Foi criado `supabase/archive-nutrition-legacy.sql` para arquivar essas tabelas com seguranca, renomeando em vez de apagar dados.
