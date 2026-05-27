-- Digital Veiculos - Seed demo
-- Cole no Supabase SQL Editor e execute.

insert into categories (name, slug, type, is_active)
values
  ('Sedans', 'sedans', 'suplemento', true),
  ('Hatches', 'hatches', 'suplemento', true),
  ('SUVs', 'suvs', 'suplemento', true),
  ('Picapes', 'picapes', 'suplemento', true),
  ('Motos', 'motos', 'vestuario', true),
  ('Acessorios automotivos', 'acessorios-automotivos', 'acessorio', true)
on conflict (slug) do update
  set name = excluded.name,
      type = excluded.type,
      is_active = true;

insert into store_settings (
  store_name,
  whatsapp_number,
  logo_url,
  default_message,
  promo_title,
  promo_text,
  updated_at
)
values (
  'Digital Veiculos',
  '5511918334855',
  '/novalogo.svg',
  'Ola! Quero saber mais sobre os veiculos disponiveis.',
  'Veiculos em destaque',
  'Fale no WhatsApp e confira as oportunidades disponiveis hoje.',
  now()
);

insert into products (
  name, slug, type, category_id, subcategory,
  description, brand, price, promo_price, stock,
  image_url, gallery_urls, objective_tags,
  is_active, is_featured, created_at, updated_at
)
values
(
  'Honda Civic EXL 2020',
  'honda-civic-exl-2020',
  'suplemento', (select id from categories where slug = 'sedans'), 'Sedan',
  'Sedan automatico com acabamento premium, bom historico de manutencao, interior confortavel e pacote completo de seguranca. Consulte quilometragem, documentacao e disponibilidade pelo WhatsApp.',
  'Honda', 112900, 109900, 1,
  '/vehicle-car.svg', '[]'::jsonb, array['ganho_massa','saude_geral'],
  true, true, now(), now()
),
(
  'Toyota Corolla XEi 2021',
  'toyota-corolla-xei-2021',
  'suplemento', (select id from categories where slug = 'sedans'), 'Sedan',
  'Corolla automatico reconhecido por conforto, confiabilidade e liquidez. Ideal para familia e uso diario.',
  'Toyota', 128900, null, 1,
  '/vehicle-car.svg', '[]'::jsonb, array['ganho_massa','saude_geral'],
  true, true, now(), now()
),
(
  'Chevrolet Onix LTZ Turbo 2023',
  'chevrolet-onix-ltz-turbo-2023',
  'suplemento', (select id from categories where slug = 'hatches'), 'Hatch',
  'Hatch turbo economico, conectado e pratico para cidade. Consulte condicao, opcionais e formas de negociacao com a equipe.',
  'Chevrolet', 82900, 79900, 1,
  '/vehicle-car.svg', '[]'::jsonb, array['emagrecimento'],
  true, true, now(), now()
),
(
  'Jeep Compass Longitude 2022',
  'jeep-compass-longitude-2022',
  'suplemento', (select id from categories where slug = 'suvs'), 'SUV',
  'SUV com posicao elevada de dirigir, acabamento sofisticado e otimo espaco interno. Ideal para quem busca conforto e presenca.',
  'Jeep', 149900, 145900, 1,
  '/vehicle-stock.svg', '[]'::jsonb, array['ganho_massa','saude_geral'],
  true, true, now(), now()
),
(
  'Fiat Toro Volcano 2022',
  'fiat-toro-volcano-2022',
  'suplemento', (select id from categories where slug = 'picapes'), 'Picape',
  'Picape versatil para trabalho e lazer, com bom pacote de equipamentos e visual robusto. Atendimento direto para proposta e avaliacao de troca.',
  'Fiat', 139900, null, 1,
  '/vehicle-stock.svg', '[]'::jsonb, array['recuperacao'],
  true, false, now(), now()
),
(
  'Honda CG 160 Fan 2023',
  'honda-cg-160-fan-2023',
  'vestuario', (select id from categories where slug = 'motos'), 'Moto urbana',
  'Moto economica e confiavel para rotina urbana, trabalho e deslocamentos diarios. Consulte documentacao e disponibilidade.',
  'Honda', 16900, 15900, 1,
  '/vehicle-moto.svg', '[]'::jsonb, array['emagrecimento','recuperacao'],
  true, false, now(), now()
)
on conflict (slug) do update
set
  name = excluded.name,
  type = excluded.type,
  category_id = excluded.category_id,
  subcategory = excluded.subcategory,
  description = excluded.description,
  brand = excluded.brand,
  price = excluded.price,
  promo_price = excluded.promo_price,
  stock = excluded.stock,
  image_url = excluded.image_url,
  gallery_urls = excluded.gallery_urls,
  objective_tags = excluded.objective_tags,
  is_active = excluded.is_active,
  is_featured = excluded.is_featured,
  updated_at = now();

insert into blog_posts (title, slug, excerpt, content, cover_url, is_published, published_at)
values
(
  'Como escolher um seminovo com seguranca',
  'como-escolher-seminovo-com-seguranca',
  'Veja pontos essenciais para avaliar procedencia, estado geral e documentacao antes de negociar.',
  '<p>Antes de fechar negocio, avalie historico de manutencao, documentacao, estado de pneus, pintura, motor e cambio.</p><p>Na duvida, fale com a equipe e solicite mais detalhes do veiculo.</p>',
  '', true, now()
),
(
  'Documentacao necessaria para comprar um veiculo',
  'documentacao-necessaria-para-comprar-veiculo',
  'Confira os principais documentos e cuidados antes de fechar negocio.',
  '<p>Antes da compra, confira documento do veiculo, debitos, multas, licenciamento, comunicacao de venda e dados do vendedor.</p><p>Uma conferencia cuidadosa evita atrasos e torna a transferencia mais tranquila.</p>',
  '', true, now()
),
(
  'Financiamento ou pagamento a vista',
  'financiamento-ou-pagamento-a-vista',
  'Entenda vantagens de cada caminho e escolha a melhor forma de negociar seu proximo veiculo.',
  '<p>Pagamento a vista pode abrir margem de negociacao. Financiamento ajuda a preservar capital e organizar parcelas.</p><p>Compare taxas, entrada, prazo e custo total antes de decidir.</p>',
  '', true, now()
),
(
  'O que observar no test-drive',
  'o-que-observar-no-test-drive',
  'Veja sinais importantes durante a avaliacao pratica do veiculo.',
  '<p>No test-drive, observe partida, ruidos, freios, alinhamento, cambio, suspensao, ar-condicionado e funcionamento dos comandos.</p><p>Tambem vale testar em baixa velocidade e em vias com diferentes pisos.</p>',
  '', true, now()
)
on conflict (slug) do update
set title = excluded.title,
    excerpt = excluded.excerpt,
    content = excluded.content,
    cover_url = excluded.cover_url,
    is_published = excluded.is_published,
    published_at = excluded.published_at;
