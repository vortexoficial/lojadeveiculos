# Pitbull Suplementos - Loja Online com Dashboard

Projeto React + Vite para venda de suplementos, vestuário personalizado e acessórios, com layout dark premium fitness, painel administrativo, Supabase Auth, banco PostgreSQL, Storage para imagens e compra via WhatsApp. Não há checkout online e não há dependência de APIs pagas.

## Stack

- React com Vite
- Supabase Free: Auth, PostgreSQL e Storage
- Netlify Free para hospedagem
- WhatsApp via link `wa.me`
- Regras locais para sugestão alimentar educativa

## Rodar localmente

1. Instale dependências:

```bash
npm install
```

2. Copie `.env.example` para `.env.local` e preencha:

```bash
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=SUA_CHAVE_ANON_PUBLIC
VITE_SUPABASE_PRODUCT_IMAGE_BUCKET=product-images
VITE_APP_URL=http://localhost:5173
```

3. Configure o Supabase usando `supabase/schema.sql`.

4. Rode o projeto:

```bash
npm run dev
```

## Configurar Supabase

1. Crie um projeto no Supabase.
2. Abra `SQL Editor`.
3. Cole e execute o arquivo `supabase/schema.sql`.
4. Em `Authentication > Users`, crie o usuário administrador.
5. Em `Authentication > Providers`, mantenha e-mail/senha habilitado.
6. Para evitar que qualquer pessoa crie admin, desabilite cadastro público no painel do Supabase ou crie usuários manualmente.
7. Em `Storage`, confirme que o bucket `product-images` existe e está público. O SQL já tenta criar e configurar o bucket.

O trigger `handle_new_user` cria um registro em `profiles` com `role = admin`. As policies RLS permitem leitura pública apenas de dados ativos e escrita apenas para admin autenticado.

## Publicar na Netlify

1. Suba o projeto para um repositório Git.
2. Na Netlify, escolha `Add new site > Import an existing project`.
3. Build command: `npm run build`.
4. Publish directory: `dist`.
5. Em `Site configuration > Environment variables`, cadastre:

```bash
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_SUPABASE_PRODUCT_IMAGE_BUCKET
VITE_APP_URL
```

6. Use a URL final da Netlify em `VITE_APP_URL`, por exemplo `https://sualoja.netlify.app`.

O arquivo `netlify.toml` já inclui redirect para rotas SPA.

## Módulos entregues

- Loja pública: `/`, `/produtos`, `/produto/:slug`, `/categoria/:slug`
- Sugestão alimentar: `/sugestao-alimentar`, `/resultado-sugestao`
- Admin protegido: `/admin/login`, `/admin`
- CRUDs: produtos, categorias, alimentos, refeições base e configurações
- Upload para Supabase Storage
- Banners rotativos da home com imagem desktop e imagem mobile cadastradas no dashboard
- Link de compra e atendimento via WhatsApp
- SQL com tabelas, RLS, policies, bucket e seed inicial

## Observação nutricional

A ferramenta gera apenas sugestões alimentares educativas com base nas informações preenchidas. Ela não substitui consulta com nutricionista, médico ou profissional de saúde.

## WhatsApp

Cadastre o número no formato `55DDDNUMERO`, sem espaços. O produto envia mensagem automática com nome, valor e link da página.
