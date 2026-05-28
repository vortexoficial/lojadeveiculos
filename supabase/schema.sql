-- Digital Veiculos com Dashboard
-- Rode este arquivo no SQL Editor do Supabase.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  role text default 'admin' check (role in ('admin')),
  created_at timestamp with time zone default now()
);

alter table public.profiles
  add column if not exists name text,
  add column if not exists role text default 'admin',
  add column if not exists created_at timestamp with time zone default now();

create table if not exists public.store_settings (
  id uuid primary key default gen_random_uuid(),
  store_name text not null default 'Digital Veiculos',
  whatsapp_number text not null default '5500000000000',
  logo_url text,
  instagram_url text,
  default_message text default 'Ola! Quero saber mais sobre os veiculos disponiveis.',
  promo_title text default 'Veiculos em destaque',
  promo_text text default 'Fale no WhatsApp e confira as oportunidades disponiveis hoje.',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists public.home_banners (
  id uuid primary key default gen_random_uuid(),
  title text not null default 'Banner da home',
  desktop_image_url text not null,
  mobile_image_url text not null,
  desktop_position text default 'center center',
  mobile_position text default 'center center',
  display_order integer default 1,
  is_active boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.home_banners
  add column if not exists title text default 'Banner da home',
  add column if not exists desktop_image_url text,
  add column if not exists mobile_image_url text,
  add column if not exists desktop_position text default 'center center',
  add column if not exists mobile_position text default 'center center',
  add column if not exists display_order integer default 1,
  add column if not exists is_active boolean default true,
  add column if not exists created_at timestamp with time zone default now(),
  add column if not exists updated_at timestamp with time zone default now();

update public.home_banners
set
  title = coalesce(title, 'Banner da home'),
  desktop_position = coalesce(desktop_position, 'center center'),
  mobile_position = coalesce(mobile_position, 'center center'),
  display_order = coalesce(display_order, 1),
  is_active = coalesce(is_active, true);

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'home_banners'
      and column_name = 'image_url'
  ) then
    execute 'update public.home_banners set desktop_image_url = coalesce(desktop_image_url, image_url), mobile_image_url = coalesce(mobile_image_url, image_url)';
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'home_banners'
      and column_name = 'active'
  ) then
    execute 'update public.home_banners set is_active = coalesce(is_active, active, true)';
  end if;
end $$;

create table if not exists public.home_category_banners (
  id uuid primary key default gen_random_uuid(),
  slot integer not null unique check (slot between 1 and 4),
  name text not null default '',
  image_url text default '',
  link_to text default '',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.home_category_banners
  add column if not exists slot integer,
  add column if not exists name text default '',
  add column if not exists image_url text default '',
  add column if not exists link_to text default '',
  add column if not exists created_at timestamp with time zone default now(),
  add column if not exists updated_at timestamp with time zone default now();

update public.home_category_banners
set
  name = coalesce(name, ''),
  image_url = coalesce(image_url, ''),
  link_to = coalesce(link_to, '');

create unique index if not exists home_category_banners_slot_unique
on public.home_category_banners (slot);

alter table public.store_settings
  add column if not exists promo_title text default 'Veiculos em destaque',
  add column if not exists promo_text text default 'Fale no WhatsApp e confira as oportunidades disponiveis hoje.';

alter table public.store_settings
  add column if not exists store_name text default 'Digital Veiculos',
  add column if not exists whatsapp_number text default '5500000000000',
  add column if not exists logo_url text,
  add column if not exists instagram_url text,
  add column if not exists default_message text default 'Ola! Quero saber mais sobre os veiculos disponiveis.',
  add column if not exists created_at timestamp with time zone default now(),
  add column if not exists updated_at timestamp with time zone default now();

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'store_settings'
      and column_name = 'instagram'
  ) then
    execute 'update public.store_settings set instagram_url = coalesce(instagram_url, instagram, '''')';
  end if;
end $$;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique,
  type text,
  is_active boolean default true,
  created_at timestamp with time zone default now()
);

alter table public.categories
  add column if not exists is_active boolean default true;

update public.categories
set is_active = true
where is_active is null;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'categories'
      and column_name = 'active'
  ) then
    execute 'update public.categories set is_active = coalesce(is_active, active, true)';
  end if;
end $$;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique,
  type text not null check (type in ('suplemento', 'vestuario', 'acessorio', 'outro', 'carro', 'moto', 'suv', 'picape')),
  category_id uuid references public.categories(id) on delete set null,
  subcategory text default '',
  description text,
  brand text,
  price numeric(12,2) not null default 0,
  promo_price numeric(12,2),
  stock integer default 0,
  image_url text,
  gallery_urls jsonb default '[]'::jsonb,
  is_active boolean default true,
  is_featured boolean default false,
  objective_tags text[] default '{}'::text[],
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.products
  add column if not exists name text,
  add column if not exists slug text,
  add column if not exists type text,
  add column if not exists category_id uuid references public.categories(id) on delete set null,
  add column if not exists subcategory text default '',
  add column if not exists description text,
  add column if not exists brand text,
  add column if not exists price numeric(12,2) default 0,
  add column if not exists promo_price numeric(12,2),
  add column if not exists stock integer default 0,
  add column if not exists image_url text,
  add column if not exists gallery_urls jsonb default '[]'::jsonb,
  add column if not exists is_active boolean default true,
  add column if not exists is_featured boolean default false,
  add column if not exists objective_tags text[] default '{}'::text[],
  add column if not exists created_at timestamp with time zone default now(),
  add column if not exists updated_at timestamp with time zone default now();

do $$
declare
  gallery_data_type text;
begin
  select data_type
  into gallery_data_type
  from information_schema.columns
  where table_schema = 'public'
    and table_name = 'products'
    and column_name = 'gallery_urls';

  if gallery_data_type is not null and gallery_data_type <> 'jsonb' then
    execute 'alter table public.products alter column gallery_urls drop default';
    execute 'alter table public.products alter column gallery_urls type jsonb using coalesce(to_jsonb(gallery_urls), ''[]''::jsonb)';
    execute 'alter table public.products alter column gallery_urls set default ''[]''::jsonb';
  end if;
end $$;

update public.products
set
  price = coalesce(price, 0),
  stock = coalesce(stock, 0),
  gallery_urls = coalesce(gallery_urls, '[]'::jsonb),
  is_active = coalesce(is_active, true),
  is_featured = coalesce(is_featured, false),
  objective_tags = coalesce(objective_tags, '{}'::text[]);

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'products'
      and column_name = 'active'
  ) then
    execute 'update public.products set is_active = coalesce(is_active, active, true)';
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'products'
      and column_name = 'featured'
  ) then
    execute 'update public.products set is_featured = coalesce(is_featured, featured, false)';
  end if;
end $$;

create unique index if not exists categories_slug_unique on public.categories (slug);
create unique index if not exists products_slug_unique on public.products (slug);

create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  variant_type text,
  name text,
  stock integer default 0,
  price_adjustment numeric(12,2) default 0,
  created_at timestamp with time zone default now(),
  unique (product_id, variant_type, name)
);

alter table public.product_variants
  add column if not exists product_id uuid references public.products(id) on delete cascade,
  add column if not exists variant_type text,
  add column if not exists name text,
  add column if not exists stock integer default 0,
  add column if not exists price_adjustment numeric(12,2) default 0,
  add column if not exists created_at timestamp with time zone default now();

update public.product_variants
set
  stock = coalesce(stock, 0),
  price_adjustment = coalesce(price_adjustment, 0);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text,
  content text default '',
  cover_url text,
  published boolean default false,
  published_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.blog_posts
  add column if not exists title text,
  add column if not exists slug text,
  add column if not exists excerpt text,
  add column if not exists content text default '',
  add column if not exists cover_url text,
  add column if not exists published boolean default false,
  add column if not exists published_at timestamp with time zone,
  add column if not exists created_at timestamp with time zone default now(),
  add column if not exists updated_at timestamp with time zone default now();

update public.blog_posts
set
  content = coalesce(content, ''),
  published = coalesce(published, false);

create unique index if not exists blog_posts_slug_unique on public.blog_posts (slug);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_products_updated_at on public.products;
create trigger set_products_updated_at
before update on public.products
for each row execute function public.set_updated_at();

drop trigger if exists set_store_settings_updated_at on public.store_settings;
create trigger set_store_settings_updated_at
before update on public.store_settings
for each row execute function public.set_updated_at();

drop trigger if exists set_home_banners_updated_at on public.home_banners;
create trigger set_home_banners_updated_at
before update on public.home_banners
for each row execute function public.set_updated_at();

drop trigger if exists set_home_category_banners_updated_at on public.home_category_banners;
create trigger set_home_category_banners_updated_at
before update on public.home_category_banners
for each row execute function public.set_updated_at();

drop trigger if exists set_blog_posts_updated_at on public.blog_posts;
create trigger set_blog_posts_updated_at
before update on public.blog_posts
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', new.email),
    coalesce(new.raw_user_meta_data->>'role', 'admin')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

alter table public.profiles enable row level security;
alter table public.store_settings enable row level security;
alter table public.home_banners enable row level security;
alter table public.home_category_banners enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.blog_posts enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
on public.profiles for select
to authenticated
using (id = auth.uid() or public.is_admin());

drop policy if exists "Admins manage profiles" on public.profiles;
create policy "Admins manage profiles"
on public.profiles for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read store settings" on public.store_settings;
create policy "Public can read store settings"
on public.store_settings for select
to public
using (true);

drop policy if exists "Admins manage store settings" on public.store_settings;
create policy "Admins manage store settings"
on public.store_settings for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read active home banners" on public.home_banners;
create policy "Public can read active home banners"
on public.home_banners for select
to public
using (is_active = true or public.is_admin());

drop policy if exists "Admins manage home banners" on public.home_banners;
create policy "Admins manage home banners"
on public.home_banners for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read home category banners" on public.home_category_banners;
create policy "Public can read home category banners"
on public.home_category_banners for select
to public
using (true);

drop policy if exists "Admins manage home category banners" on public.home_category_banners;
create policy "Admins manage home category banners"
on public.home_category_banners for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read active categories" on public.categories;
create policy "Public can read active categories"
on public.categories for select
to public
using (is_active = true or public.is_admin());

drop policy if exists "Admins manage categories" on public.categories;
create policy "Admins manage categories"
on public.categories for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read active products" on public.products;
create policy "Public can read active products"
on public.products for select
to public
using (is_active = true or public.is_admin());

drop policy if exists "Admins manage products" on public.products;
create policy "Admins manage products"
on public.products for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read active variants" on public.product_variants;
create policy "Public can read active variants"
on public.product_variants for select
to public
using (
  exists (
    select 1
    from public.products
    where products.id = product_variants.product_id
      and (products.is_active = true or public.is_admin())
  )
);

drop policy if exists "Admins manage variants" on public.product_variants;
create policy "Admins manage variants"
on public.product_variants for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read published blog posts" on public.blog_posts;
create policy "Public can read published blog posts"
on public.blog_posts for select
to public
using (published = true or public.is_admin());

drop policy if exists "Admins manage blog posts" on public.blog_posts;
create policy "Admins manage blog posts"
on public.blog_posts for all
to authenticated
using (public.is_admin())
with check (public.is_admin());




insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  5242880,
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read product images" on storage.objects;
create policy "Public can read product images"
on storage.objects for select
to public
using (bucket_id = 'product-images');

drop policy if exists "Admins can upload product images" on storage.objects;
create policy "Admins can upload product images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "Admins can update product images" on storage.objects;
create policy "Admins can update product images"
on storage.objects for update
to authenticated
using (bucket_id = 'product-images' and public.is_admin())
with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "Admins can delete product images" on storage.objects;
create policy "Admins can delete product images"
on storage.objects for delete
to authenticated
using (bucket_id = 'product-images' and public.is_admin());

-- Digital Veiculos demo data
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
