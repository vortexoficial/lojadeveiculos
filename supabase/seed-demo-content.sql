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

update categories
set is_active = false
where slug in ('garrafas', 'xicaras', 'combos');

update products
set is_active = false,
    updated_at = now()
where slug in ('chevrolet-onix-ltz-turbo-2023', 'honda-cg-160-fan-2023');

insert into home_category_banners (slot, name, image_url, link_to)
values
  (1, 'Carros', '/vehicle-car.svg', '/carros'),
  (2, 'Motos', '/vehicle-moto.svg', '/motos'),
  (3, 'Veiculos', '/vehicle-stock.svg', '/veiculos'),
  (4, 'Ofertas', '/vehicle-offers.svg', '/ofertas?sort=promocoes')
on conflict (slot) do update
set
  name = excluded.name,
  image_url = excluded.image_url,
  link_to = excluded.link_to,
  updated_at = now();

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
  'Sedan automatico com bom pacote de conforto, motor eficiente, porta-malas amplo e acabamento refinado. Catalogo demo com imagens reais de referencia do modelo.',
  'Honda', 114700, 109900, 1,
  '/demo-vehicles/honda-civic-exl-2020-01.jpg', '["/demo-vehicles/honda-civic-exl-2020-02.png","/demo-vehicles/honda-civic-exl-2020-03.jpg","/demo-vehicles/honda-civic-exl-2020-04.jpg"]'::jsonb, array['ganho_massa','saude_geral'],
  true, true, now(), now()
),
(
  'Toyota Corolla XEi 2021',
  'toyota-corolla-xei-2021',
  'suplemento', (select id from categories where slug = 'sedans'), 'Sedan',
  'Sedan reconhecido por conforto, confiabilidade e liquidez. Boa escolha para familia, rotina urbana e viagens com baixo custo de manutencao.',
  'Toyota', 128900, null, 1,
  '/demo-vehicles/toyota-corolla-xei-2021-01.jpg', '["/demo-vehicles/toyota-corolla-xei-2021-02.jpg","/demo-vehicles/toyota-corolla-xei-2021-03.jpg","/demo-vehicles/toyota-corolla-xei-2021-04.jpg"]'::jsonb, array['ganho_massa','saude_geral'],
  true, true, now(), now()
),
(
  'Chevrolet Cruze LTZ 2020',
  'chevrolet-cruze-ltz-2020',
  'suplemento', (select id from categories where slug = 'sedans'), 'Sedan',
  'Sedan medio com proposta moderna, bom desempenho, equipamentos de conforto e visual elegante. Ideal para quem busca dirigibilidade e tecnologia.',
  'Chevrolet', 94900, 91900, 1,
  '/demo-vehicles/chevrolet-cruze-ltz-2020-01.jpg', '["/demo-vehicles/chevrolet-cruze-ltz-2020-02.jpg","/demo-vehicles/chevrolet-cruze-ltz-2020-03.jpg","/demo-vehicles/chevrolet-cruze-ltz-2020-04.jpg"]'::jsonb, array['emagrecimento'],
  true, true, now(), now()
),
(
  'Jeep Compass Longitude 2022',
  'jeep-compass-longitude-2022',
  'suplemento', (select id from categories where slug = 'suvs'), 'SUV',
  'SUV com posicao elevada de dirigir, acabamento sofisticado e otimo espaco interno. Ideal para quem busca conforto, presenca e versatilidade.',
  'Jeep', 149900, 145900, 1,
  '/demo-vehicles/jeep-compass-longitude-2022-01.jpg', '["/demo-vehicles/jeep-compass-longitude-2022-02.jpg","/demo-vehicles/jeep-compass-longitude-2022-03.jpg","/demo-vehicles/jeep-compass-longitude-2022-04.jpg"]'::jsonb, array['ganho_massa','saude_geral'],
  true, true, now(), now()
),
(
  'Fiat Toro Volcano 2022',
  'fiat-toro-volcano-2022',
  'suplemento', (select id from categories where slug = 'picapes'), 'Picape',
  'Picape versatil para trabalho e lazer, com bom pacote de equipamentos, visual robusto e cacamba pratica para a rotina.',
  'Fiat', 139900, null, 1,
  '/demo-vehicles/fiat-toro-volcano-2022-01.png', '["/demo-vehicles/fiat-toro-volcano-2022-02.png","/demo-vehicles/fiat-toro-volcano-2022-03.png","/demo-vehicles/fiat-toro-volcano-2022-04.jpg"]'::jsonb, array['recuperacao'],
  true, true, now(), now()
),
(
  'Ford Ranger Stormtrak 2023',
  'ford-ranger-stormtrak-2023',
  'suplemento', (select id from categories where slug = 'picapes'), 'Picape',
  'Picape robusta com perfil premium, cabine ampla, boa capacidade de carga e conjunto indicado para estrada, campo e uso profissional.',
  'Ford', 239900, 229900, 1,
  '/demo-vehicles/ford-ranger-stormtrak-2023-01.jpg', '["/demo-vehicles/ford-ranger-stormtrak-2023-02.jpg","/demo-vehicles/ford-ranger-stormtrak-2023-03.jpg","/demo-vehicles/ford-ranger-stormtrak-2023-04.jpg"]'::jsonb, array['recuperacao','saude_geral'],
  true, true, now(), now()
),
(
  'Yamaha MT-03 ABS 2024',
  'yamaha-mt-03-abs-2024',
  'vestuario', (select id from categories where slug = 'motos'), 'Naked',
  'Naked de media cilindrada com pilotagem agil, visual agressivo e boa resposta para uso urbano e passeios de fim de semana.',
  'Yamaha', 31900, 29900, 1,
  '/demo-vehicles/yamaha-mt-03-abs-2024-01.jpg', '["/demo-vehicles/yamaha-mt-03-abs-2024-02.jpg","/demo-vehicles/yamaha-mt-03-abs-2024-03.jpg","/demo-vehicles/yamaha-mt-03-abs-2024-04.jpg"]'::jsonb, array['emagrecimento'],
  true, true, now(), now()
),
(
  'BMW R 1200 GS 2018',
  'bmw-r-1200-gs-2018',
  'vestuario', (select id from categories where slug = 'motos'), 'Trail',
  'Maxtrail consagrada para longas viagens, com ergonomia confortavel, porte imponente e conjunto pronto para asfalto e aventura.',
  'BMW', 64900, null, 1,
  '/demo-vehicles/bmw-r-1200-gs-2018-01.jpg', '["/demo-vehicles/bmw-r-1200-gs-2018-02.jpg","/demo-vehicles/bmw-r-1200-gs-2018-03.jpg","/demo-vehicles/bmw-r-1200-gs-2018-04.jpg"]'::jsonb, array['recuperacao','saude_geral'],
  true, true, now(), now()
),
(
  'Ducati Monster 696 2012',
  'ducati-monster-696-2012',
  'vestuario', (select id from categories where slug = 'motos'), 'Naked',
  'Naked italiana com estilo marcante, proposta esportiva e ciclistica envolvente. Boa opcao para quem busca personalidade.',
  'Ducati', 32900, 31500, 1,
  '/demo-vehicles/ducati-monster-696-2012-01.jpg', '["/demo-vehicles/ducati-monster-696-2012-02.jpg","/demo-vehicles/ducati-monster-696-2012-03.jpg","/demo-vehicles/ducati-monster-696-2012-04.jpg"]'::jsonb, array['ganho_massa'],
  true, false, now(), now()
),
(
  'Triumph Tiger 800 XC 2015',
  'triumph-tiger-800-xc-2015',
  'vestuario', (select id from categories where slug = 'motos'), 'Trail',
  'Trail de media-alta cilindrada com pegada aventureira, motor forte e conforto para viagens mais longas.',
  'Triumph', 49900, 47900, 1,
  '/demo-vehicles/triumph-tiger-800-xc-2015-01.jpg', '["/demo-vehicles/triumph-tiger-800-xc-2015-02.jpg","/demo-vehicles/triumph-tiger-800-xc-2015-03.jpg","/demo-vehicles/triumph-tiger-800-xc-2015-04.jpg"]'::jsonb, array['recuperacao'],
  true, false, now(), now()
),
(
  'Honda CBR 500R 2018',
  'honda-cbr-500r-2018',
  'vestuario', (select id from categories where slug = 'motos'), 'Sport',
  'Esportiva bicilindrica equilibrada, indicada para quem quer visual carenado, confiabilidade e pilotagem acessivel.',
  'Honda', 33900, null, 1,
  '/demo-vehicles/honda-cbr-500r-2018-01.jpg', '["/demo-vehicles/honda-cbr-500r-2018-02.jpg","/demo-vehicles/honda-cbr-500r-2018-03.jpg","/demo-vehicles/honda-cbr-500r-2018-04.jpg"]'::jsonb, array['ganho_massa','emagrecimento'],
  true, false, now(), now()
),
(
  'Kawasaki Z650 ABS 2020',
  'kawasaki-z650-abs-2020',
  'vestuario', (select id from categories where slug = 'motos'), 'Naked',
  'Naked de visual esportivo, motor bicilindrico e boa ergonomia para uso misto entre cidade e estrada.',
  'Kawasaki', 39900, 37900, 1,
  '/demo-vehicles/kawasaki-z650-abs-2020-01.jpg', '["/demo-vehicles/kawasaki-z650-abs-2020-02.jpg","/demo-vehicles/kawasaki-z650-abs-2020-03.jpg","/demo-vehicles/kawasaki-z650-abs-2020-04.jpg"]'::jsonb, array['saude_geral'],
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

insert into blog_posts (title, slug, excerpt, content, cover_url, published, published_at)
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
    published = excluded.published,
    published_at = excluded.published_at;
