# Digital Veiculos - Vitrine Automotiva com Dashboard

Projeto React + Vite para vitrine de veiculos com painel administrativo, Supabase Auth, banco PostgreSQL, Storage para imagens e atendimento via WhatsApp. Nao ha checkout online: o fluxo principal e consultar/negociar o veiculo diretamente pelo WhatsApp.

## Principais recursos

- Site publico com home, categorias, listagem, detalhe de veiculo e blog.
- Rotas publicas principais: `/`, `/veiculos`, `/carros`, `/motos`, `/veiculo/:slug`, `/categoria/:slug`, `/blog`.
- Dashboard administrativo protegido por login.
- CRUD de veiculos, categorias, banners, banners de categoria, blog e configuracoes da loja.
- Configuracao de logo, WhatsApp, Instagram e textos promocionais.
- Seed demo automotivo para categorias, veiculos e posts.

## Ambiente

Crie ou atualize `.env.local` com:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sua-chave-publica
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
```

A `SUPABASE_SERVICE_ROLE_KEY` so e necessaria para rodar os scripts de seed pelo terminal.

## Comandos

```bash
npm install
npm run dev
npm run build
node scripts/seed.js
```

## Supabase

- Use `supabase/schema.sql` para preparar o banco completo.
- Use `supabase/seed-demo-content.sql` ou `scripts/seed.sql` para inserir conteudo demo automotivo.
- O app ainda mantem valores tecnicos legados de tipo (`suplemento`, `vestuario`, `acessorio`, `outro`) para compatibilidade com bases existentes. Na interface, eles aparecem como Carro, Moto, Acessorio automotivo e Outro.

## WhatsApp

Cadastre o numero no formato `55DDDNUMERO`, sem espacos. Cada veiculo gera uma mensagem com nome, valor anunciado e link da pagina.

## Plano de migracao

O acompanhamento da migracao esta em `PLANO_MIGRACAO_DIGITAL_VEICULOS.md`.

