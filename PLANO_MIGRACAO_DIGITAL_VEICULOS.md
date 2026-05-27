# Plano de Migracao - Digital Veiculos

Este arquivo sera usado para acompanhar a migracao do projeto para uma loja de veiculos.  
Marque cada item com `[x]` somente depois de validar a etapa.

## 1. Preparacao

- [x] Confirmar que as alteracoes serao feitas somente em `C:\Users\Micro\Desktop\TEST VEICULOS`.
- [x] Confirmar que `novalogo.svg` e a logo definitiva da Digital Veiculos.
- [x] Rodar `npm run build` antes das proximas mudancas.
- [x] Separar mudancas de conteudo/visual das mudancas que exigem banco de dados.
- [x] Revisar status do Git antes de iniciar a migracao principal.

## 2. Logo e Marca

- [x] Copiar ou mover `novalogo.svg` para `public/novalogo.svg`.
- [x] Atualizar `logo_url` padrao para `/novalogo.svg`.
- [x] Atualizar logo no header publico.
- [x] Atualizar logo no footer.
- [x] Atualizar logo no login admin.
- [x] Atualizar logo no sidebar/topbar do dashboard.
- [x] Atualizar favicon, se aprovado.
- [ ] Validar a logo no desktop.
- [ ] Validar a logo no mobile.

## 3. Conteudo Publico

- [x] Trocar textos de `produto/produtos` para `veiculo/veiculos` onde fizer sentido.
- [x] Remover referencias a suplementos.
- [x] Remover referencias a treino, whey, creatina, fitness e vestuario.
- [x] Atualizar textos da home.
- [x] Atualizar menu publico.
- [x] Atualizar footer.
- [x] Atualizar chamadas de WhatsApp.
- [x] Atualizar pagina de listagem.
- [x] Atualizar pagina de detalhe.
- [x] Atualizar empty states e mensagens de erro publicas.

## 4. Rotas e Navegacao Publica

- [x] Definir se `/produtos` sera mantida temporariamente ou redirecionada para `/veiculos`.
- [x] Criar rota `/veiculos`.
- [x] Avaliar criacao de `/carros`.
- [x] Avaliar criacao de `/motos`.
- [x] Avaliar criacao de `/ofertas`.
- [x] Remover ou redirecionar `/suplementos`.
- [x] Remover ou redirecionar `/vestuario`.
- [x] Redirecionar rotas antigas de produto para rotas de veiculo.
- [x] Conferir links internos da home.
- [x] Conferir links internos do footer.
- [x] Conferir links dos cards de categoria.

## 5. Dashboard/Admin

- [x] Trocar `Produtos` por `Veiculos` no menu admin.
- [x] Atualizar cards do dashboard.
- [x] Atualizar titulos das paginas admin.
- [x] Atualizar descricoes das paginas admin.
- [x] Atualizar botao `Novo produto` para `Novo veiculo`.
- [x] Atualizar mensagens de exclusao.
- [x] Atualizar mensagens de sucesso.
- [x] Atualizar mensagens de erro.
- [x] Atualizar textos do login admin.

## 6. Formulario de Veiculo

- [x] Alterar tipo padrao de cadastro.
- [x] Trocar label `Nome` para linguagem automotiva.
- [x] Atualizar campo `Marca`.
- [x] Atualizar campo `Subcategoria` para versao/categoria.
- [x] Atualizar `Preco normal` para `Preco`.
- [x] Atualizar `Preco promocional` para `Preco de oferta`.
- [x] Atualizar `Estoque geral` para disponibilidade/quantidade.
- [x] Atualizar placeholder de descricao.
- [x] Decidir se `Variacoes` sera mantido como opcionais/versoes.
- [x] Planejar campos novos: ano, km, cambio, combustivel, cor, final da placa e condicao.
- [x] Definir se os campos novos entram agora ou em uma etapa separada com banco.

## 7. Tipos e Categorias

- [x] Trocar opcoes atuais `suplemento`, `vestuario`, `acessorio`, `outro`.
- [x] Definir tipos automotivos finais.
- [x] Adicionar tipo `carro`.
- [x] Adicionar tipo `moto`.
- [x] Adicionar tipo `suv`.
- [x] Adicionar tipo `picape`.
- [x] Manter ou ajustar tipo `outro`.
- [x] Atualizar filtros publicos.
- [x] Atualizar filtros admin.
- [x] Atualizar formatadores.
- [x] Verificar constraint do Supabase antes de salvar novos tipos.

## 8. Banco/Supabase

- [x] Revisar `supabase/schema.sql`.
- [x] Atualizar check constraint de `products.type`.
- [x] Atualizar defaults de configuracoes da loja.
- [x] Atualizar categorias iniciais.
- [x] Criar ou ajustar script de migracao.
- [x] Garantir que nenhum dado existente sera apagado sem confirmacao.
- [x] Documentar tabelas legadas de nutricao antes de qualquer remocao.
- [x] Remover tabelas antigas de nutricao/alimentos dos SQLs principais.
- [ ] Testar cadastro de veiculo depois da alteracao.
- [ ] Testar edicao de veiculo depois da alteracao.

## 9. Dados Demo e Seeds

- [x] Atualizar `src/services/productsService.js`.
- [x] Atualizar `scripts/seed.js`.
- [x] Atualizar `scripts/seed.sql`.
- [x] Atualizar `supabase/seed-demo-content.sql`.
- [x] Substituir produtos demo por veiculos.
- [x] Substituir categorias demo por categorias automotivas.
- [x] Substituir blog demo por artigos automotivos.
- [x] Validar se os seeds rodam sem erro.

## 10. Assets e Imagens

- [x] Substituir banners antigos de suplementos.
- [x] Substituir imagens de categorias.
- [x] Substituir imagens demo de produtos.
- [ ] Remover assets antigos que nao serao usados.
- [x] Confirmar que imagens novas carregam corretamente.
- [x] Criar placeholders temporarios se ainda nao houver fotos reais.
- [x] Documentar assets antigos antes de qualquer remocao.

## 11. WhatsApp e Atendimento

- [x] Atualizar mensagem padrao.
- [x] Atualizar mensagem de interesse no veiculo.
- [x] Atualizar texto do botao de WhatsApp.
- [x] Atualizar modal/checkout para linguagem de proposta/consulta.
- [x] Conferir link gerado com nome do veiculo.
- [x] Conferir link gerado com URL do veiculo.

## 12. Blog

- [x] Atualizar titulo e descricao do blog.
- [x] Trocar posts demo de treino/nutricao.
- [x] Criar artigo sobre escolha de seminovo.
- [x] Criar artigo sobre documentacao de compra.
- [x] Criar artigo sobre financiamento.
- [x] Criar artigo sobre test-drive.
- [x] Conferir listagem do blog.
- [x] Conferir pagina interna do blog.

## 13. Revisao de Conteudo Antigo

- [x] Buscar e revisar `Pitbull`.
- [x] Buscar e revisar `Suplemento`.
- [x] Buscar e revisar `suplemento`.
- [x] Buscar e revisar `Vestuario`.
- [x] Buscar e revisar `vestuario`.
- [x] Buscar e revisar `whey`.
- [x] Buscar e revisar `creatina`.
- [x] Buscar e revisar `treino`.
- [x] Buscar e revisar `fitness`.
- [x] Buscar e revisar `Horse`.

## 14. Validacao Tecnica

- [x] Rodar `npm run build`.
- [x] Corrigir erros de build.
- [x] Testar home.
- [x] Testar listagem de veiculos.
- [x] Testar detalhe do veiculo.
- [x] Testar busca.
- [x] Testar filtros.
- [ ] Testar login admin.
- [ ] Testar cadastro de veiculo.
- [ ] Testar edicao de veiculo.
- [x] Testar categorias.
- [ ] Testar banners.
- [ ] Testar WhatsApp.

## 15. Validacao Visual

- [ ] Conferir desktop.
- [ ] Conferir mobile.
- [x] Verificar contraste da paleta azul.
- [ ] Conferir encaixe da logo nova.
- [x] Verificar textos sem quebras estranhas.
- [x] Conferir cards de veiculos.
- [ ] Conferir dashboard.
- [ ] Conferir formularios admin.

## Ordem Recomendada

1. Logo, textos e navegacao.
2. Dashboard e linguagem admin.
3. Tipos e categorias automotivas.
4. Seeds e dados demo.
5. Banco/Supabase.
6. Campos automotivos extras.
7. Validacao final.

## Registro de Avanco

Use este espaco para registrar decisoes e etapas concluidas.

| Data | Etapa | Status | Observacoes |
| --- | --- | --- | --- |
| 2026-05-20 | Criacao do plano | Concluido | Arquivo criado para acompanhamento da migracao. |
| 2026-05-20 | Preparacao | Concluido | Build inicial passou e trabalho confirmado somente em TEST VEICULOS. |
| 2026-05-20 | Conteudo publico e rotas | Concluido | Criadas rotas /veiculos, /carros e /motos; textos publicos migrados para veiculos. |
| 2026-05-20 | Dashboard/admin | Concluido | Menu, dashboard, listagem e formulario migrados para linguagem de veiculos. |
| 2026-05-20 | Validacao tecnica parcial | Concluido | Build passou apos normalizar codificacao de arquivos editados. |

| 2026-05-20 | Seeds e Supabase | Concluido | Seeds SQL/JS e schema/fix atualizados para conteudo automotivo. |
| 2026-05-20 | Assets, ofertas e blog demo | Concluido | Criados SVGs automotivos, rota /ofertas e posts demo de documentacao/test-drive. |
| 2026-05-20 | Decisao de banco | Concluido | Campos extras e tipos definitivos ficam em migracao separada; criado supabase/migrate-automotive-types.sql. |
| 2026-05-20 | Testes publicos | Concluido | Rotas publicas, detalhe demo, blog e assets SVG responderam HTTP 200. |
| 2026-05-20 | Build final da rodada | Concluido | npm run build passou; pendencias restantes exigem login/admin, validacao visual manual ou decisao antes de remover assets antigos. |
| 2026-05-20 | Rotas admin e encoding | Concluido | Rotas admin principais responderam HTTP 200; textos com mojibake foram normalizados para ASCII. |
| 2026-05-20 | Assets legados | Pendente decisao | Criado ASSETS_LEGADOS.md; arquivos antigos permanecem para evitar quebrar registros existentes do Supabase. |
| 2026-05-20 | Build apos limpeza | Concluido | npm run build passou apos limpar textos quebrados e documentar assets legados. |
| 2026-05-20 | Lint e qualidade tecnica | Concluido | npm run lint passou; corrigido nome do pacote, ref do carrossel e imports/variaveis nao usados. |
| 2026-05-20 | Validacao de contraste e rotas | Concluido | Contrastes principais passaram AA; rotas publicas e admin principais responderam HTTP 200. |
| 2026-05-20 | Banco legado | Pendente decisao | Criado supabase/archive-nutrition-legacy.sql para arquivar tabelas antigas sem apagar dados. |
| 2026-05-20 | Rotas legadas e SQL limpo | Concluido | /produtos e /produto/:slug agora redirecionam; schema/fix nao criam mais tabelas antigas de nutricao/alimentos. |
| 2026-05-20 | Validacao apos redirecionamentos | Concluido | npm run lint e npm run build passaram; rotas antigas e admin antigas responderam HTTP 200 no servidor local. |
