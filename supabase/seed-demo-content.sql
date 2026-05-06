-- Conteudo demo para testar o dashboard e a loja.
-- Rode no SQL Editor do Supabase depois do fix-current-database.sql.

insert into public.categories (name, slug, type, is_active)
values
  ('Combos', 'combos', 'suplemento', true),
  ('Proteinas', 'proteinas', 'suplemento', true),
  ('Creatinas', 'creatinas', 'suplemento', true),
  ('Pre-treinos', 'pre-treinos', 'suplemento', true),
  ('Snacks', 'snacks', 'suplemento', true),
  ('Acessorios', 'acessorios', 'acessorio', true),
  ('Vestuario', 'vestuario', 'vestuario', true)
on conflict (slug) do update set
  name = excluded.name,
  type = excluded.type,
  is_active = excluded.is_active;

update public.categories
set is_active = false
where slug in ('garrafas', 'xicaras');

with existing_banner as (
  select id
  from public.home_banners
  where title = 'Demo Horse Combo'
  limit 1
),
updated_banner as (
  update public.home_banners
  set
    desktop_image_url = '/banners/horse-combo-desktop.jpeg',
    mobile_image_url = '/banners/horse-combo-mobile.jpeg',
    desktop_position = 'center center',
    mobile_position = 'center center',
    display_order = 1,
    is_active = true,
    updated_at = now()
  where id in (select id from existing_banner)
  returning id
)
insert into public.home_banners (
  title,
  desktop_image_url,
  mobile_image_url,
  desktop_position,
  mobile_position,
  display_order,
  is_active
)
select
  'Demo Horse Combo',
  '/banners/horse-combo-desktop.jpeg',
  '/banners/horse-combo-mobile.jpeg',
  'center center',
  'center center',
  1,
  true
where not exists (select 1 from existing_banner);

with existing_banner as (
  select id
  from public.home_banners
  where title = 'Demo Horse Combo 2'
  limit 1
),
updated_banner as (
  update public.home_banners
  set
    desktop_image_url = '/banners/horse-combo-desktop.jpeg',
    mobile_image_url = '/banners/horse-combo-mobile.jpeg',
    desktop_position = 'center center',
    mobile_position = 'center center',
    display_order = 2,
    is_active = true,
    updated_at = now()
  where id in (select id from existing_banner)
  returning id
)
insert into public.home_banners (
  title,
  desktop_image_url,
  mobile_image_url,
  desktop_position,
  mobile_position,
  display_order,
  is_active
)
select
  'Demo Horse Combo 2',
  '/banners/horse-combo-desktop.jpeg',
  '/banners/horse-combo-mobile.jpeg',
  'center center',
  'center center',
  2,
  true
where not exists (select 1 from existing_banner);

insert into public.products (
  name,
  slug,
  type,
  category_id,
  subcategory,
  description,
  brand,
  price,
  promo_price,
  stock,
  image_url,
  gallery_urls,
  is_active,
  is_featured,
  objective_tags
) values (
  'Combo Horse Forca Maxima',
  'combo-horse-forca-maxima',
  'suplemento',
  (select id from public.categories where slug = 'combos'),
  'Combo demo com whey, creatina e pre-treino para testar vitrine, produto e compra via WhatsApp.',
  'Horse',
  249.90,
  199.99,
  20,
  '/banners/horse-combo-mobile.jpeg',
  '["/banners/horse-combo-desktop.jpeg"]'::jsonb,
  true,
  true,
  array['energia', 'ganho_massa']
)
on conflict (slug) do update set
  name = excluded.name,
  type = excluded.type,
  category_id = excluded.category_id,
  description = excluded.description,
  brand = excluded.brand,
  price = excluded.price,
  promo_price = excluded.promo_price,
  stock = excluded.stock,
  image_url = excluded.image_url,
  gallery_urls = excluded.gallery_urls,
  is_active = excluded.is_active,
  is_featured = excluded.is_featured,
  objective_tags = excluded.objective_tags,
  updated_at = now();

insert into public.products (
  name,
  slug,
  type,
  category_id,
  description,
  brand,
  price,
  promo_price,
  stock,
  image_url,
  gallery_urls,
  is_active,
  is_featured,
  objective_tags
) values
  (
    'Whey Protein Baunilha 900g',
    'whey-protein-baunilha-900g',
    'suplemento',
    (select id from public.categories where slug = 'proteinas'),
    'Whey',
    'Produto demo para testar a vitrine com proteina sabor baunilha.',
    'Pitbull',
    159.90,
    139.90,
    18,
    '/banners/horse-combo-mobile.jpeg',
    '[]'::jsonb,
    true,
    true,
    array['ganho_massa', 'recuperacao']
  ),
  (
    'Creatina Monohidratada Power 300g',
    'creatina-monohidratada-power-300g',
    'suplemento',
    (select id from public.categories where slug = 'creatinas'),
    'Creatina',
    'Creatina demo para testar produtos de performance.',
    'Pitbull',
    99.90,
    89.90,
    24,
    null,
    '[]'::jsonb,
    true,
    true,
    array['energia', 'ganho_massa']
  ),
  (
    'Pre Treino Nitro Laranja 300g',
    'pre-treino-nitro-laranja-300g',
    'suplemento',
    (select id from public.categories where slug = 'pre-treinos'),
    'Pre-treino',
    'Pre treino demo para validar promocao e categorias.',
    'Horse',
    119.90,
    104.90,
    15,
    null,
    '[]'::jsonb,
    true,
    true,
    array['energia']
  ),
  (
    'Barra Proteica Chocolate 12un',
    'barra-proteica-chocolate-12un',
    'suplemento',
    (select id from public.categories where slug = 'snacks'),
    'Snacks',
    'Caixa demo com barras proteicas para testar itens menores.',
    'Pitbull',
    79.90,
    null,
    30,
    null,
    '[]'::jsonb,
    true,
    true,
    array['saude_geral']
  ),
  (
    'Garrafa Shaker Pitbull 700ml',
    'garrafa-shaker-pitbull-700ml',
    'acessorio',
    (select id from public.categories where slug = 'acessorios'),
    'Garrafas',
    'Garrafa demo para treino, academia e rotina diaria.',
    'Pitbull',
    39.90,
    34.90,
    35,
    null,
    '[]'::jsonb,
    true,
    true,
    array['saude_geral']
  ),
  (
    'Coqueteleira Inox Pitbull 800ml',
    'coqueteleira-inox-pitbull-800ml',
    'acessorio',
    (select id from public.categories where slug = 'acessorios'),
    'Garrafas',
    'Coqueteleira demo de inox para testar acessorios premium.',
    'Pitbull',
    69.90,
    59.90,
    20,
    null,
    '[]'::jsonb,
    true,
    true,
    array['saude_geral']
  ),
  (
    'Xicara Pitbull Cafe Forte',
    'xicara-pitbull-cafe-forte',
    'acessorio',
    (select id from public.categories where slug = 'acessorios'),
    'Xicaras',
    'Xicara demo para produtos de loja e presentes.',
    'Pitbull',
    29.90,
    null,
    40,
    null,
    '[]'::jsonb,
    true,
    true,
    array['saude_geral']
  ),
  (
    'Camiseta Dry Fit Pitbull Preta',
    'camiseta-dry-fit-pitbull-preta',
    'vestuario',
    (select id from public.categories where slug = 'vestuario'),
    'Camisetas',
    'Camiseta demo dry fit para treino pesado.',
    'Pitbull',
    89.90,
    79.90,
    16,
    null,
    '[]'::jsonb,
    true,
    true,
    array['energia']
  ),
  (
    'Short Treino Pitbull Flex',
    'short-treino-pitbull-flex',
    'vestuario',
    (select id from public.categories where slug = 'vestuario'),
    'Shorts',
    'Short demo confortavel para musculacao e corrida.',
    'Pitbull',
    74.90,
    null,
    22,
    null,
    '[]'::jsonb,
    true,
    true,
    array['energia']
  ),
  (
    'Mochila Pitbull Training',
    'mochila-pitbull-training',
    'acessorio',
    (select id from public.categories where slug = 'acessorios'),
    'Mochilas',
    'Mochila demo para completar o visual da marca.',
    'Pitbull',
    49.90,
    44.90,
    28,
    null,
    '[]'::jsonb,
    true,
    true,
    array['saude_geral']
  )
on conflict (slug) do update set
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
  is_active = excluded.is_active,
  is_featured = excluded.is_featured,
  objective_tags = excluded.objective_tags,
  updated_at = now();

insert into public.product_variants (
  product_id,
  variant_type,
  name,
  stock,
  price_adjustment
)
select
  p.id,
  variant.variant_type,
  variant.name,
  variant.stock,
  0
from public.products p
cross join (
  values
    ('combo', 'Chocolate + Creatina + Pre-treino', 10),
    ('combo', 'Baunilha + Creatina + Pre-treino', 10)
) as variant(variant_type, name, stock)
where p.slug = 'combo-horse-forca-maxima'
  and not exists (
    select 1
    from public.product_variants pv
    where pv.product_id = p.id
      and pv.variant_type = variant.variant_type
      and pv.name = variant.name
  );

insert into public.blog_posts (
  title,
  slug,
  excerpt,
  content,
  cover_url,
  published,
  published_at
) values (
  'Como montar um combo de suplementos para treinar forte',
  'como-montar-combo-suplementos-treino-forte',
  'Um artigo demo para testar o blog, capa e publicacao no site.',
  '<p>Este e um artigo demo para validar o blog da loja.</p><p>Um combo de treino costuma combinar proteina, creatina e um pre-treino conforme rotina, objetivo e orientacao profissional.</p><p>Use este post para testar listagem, pagina interna e capa do blog.</p>',
  '/banners/horse-combo-desktop.jpeg',
  true,
  now()
)
on conflict (slug) do update set
  title = excluded.title,
  excerpt = excluded.excerpt,
  content = excluded.content,
  cover_url = excluded.cover_url,
  published = excluded.published,
  published_at = excluded.published_at,
  updated_at = now();

notify pgrst, 'reload schema';
