-- Loja Online com Dashboard + Sugestão Alimentar
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
  store_name text not null default 'Loja Online',
  whatsapp_number text not null default '5500000000000',
  logo_url text,
  instagram_url text,
  default_message text default 'Olá! Quero saber mais sobre os produtos da loja.',
  promo_title text default 'Ofertas para treinar forte',
  promo_text text default 'Fale no WhatsApp e confira suplementos, combos e vestuário disponíveis hoje.',
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

alter table public.store_settings
  add column if not exists promo_title text default 'Ofertas para treinar forte',
  add column if not exists promo_text text default 'Fale no WhatsApp e confira suplementos, combos e vestuário disponíveis hoje.';

alter table public.store_settings
  add column if not exists store_name text default 'Loja Online',
  add column if not exists whatsapp_number text default '5500000000000',
  add column if not exists logo_url text,
  add column if not exists instagram_url text,
  add column if not exists default_message text default 'Ola! Quero saber mais sobre os produtos da loja.',
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
  type text not null check (type in ('suplemento', 'vestuario', 'acessorio', 'outro')),
  category_id uuid references public.categories(id) on delete set null,
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

create table if not exists public.foods (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text,
  calories_per_100g numeric(10,2),
  protein_per_100g numeric(10,2),
  carbs_per_100g numeric(10,2),
  fat_per_100g numeric(10,2),
  is_active boolean default true
);

alter table public.foods
  add column if not exists name text,
  add column if not exists category text,
  add column if not exists calories_per_100g numeric(10,2),
  add column if not exists protein_per_100g numeric(10,2),
  add column if not exists carbs_per_100g numeric(10,2),
  add column if not exists fat_per_100g numeric(10,2),
  add column if not exists is_active boolean default true;

update public.foods
set is_active = true
where is_active is null;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'foods'
      and column_name = 'active'
  ) then
    execute 'update public.foods set is_active = coalesce(is_active, active, true)';
  end if;
end $$;

create table if not exists public.meal_templates (
  id uuid primary key default gen_random_uuid(),
  title text,
  meal_type text check (meal_type in ('cafe_manha', 'almoco', 'lanche', 'jantar', 'ceia')),
  goal text check (goal in ('emagrecer', 'manter', 'ganhar_massa')),
  preference text check (preference in ('simples', 'economica', 'fitness', 'alta_proteina')),
  description text,
  items jsonb default '[]'::jsonb,
  calories_estimate numeric(10,2),
  protein_estimate numeric(10,2),
  is_active boolean default true
);

alter table public.meal_templates
  add column if not exists title text,
  add column if not exists meal_type text,
  add column if not exists goal text,
  add column if not exists preference text,
  add column if not exists description text,
  add column if not exists items jsonb default '[]'::jsonb,
  add column if not exists calories_estimate numeric(10,2),
  add column if not exists protein_estimate numeric(10,2),
  add column if not exists is_active boolean default true;

update public.meal_templates
set
  items = coalesce(items, '[]'::jsonb),
  is_active = coalesce(is_active, true);

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'meal_templates'
      and column_name = 'active'
  ) then
    execute 'update public.meal_templates set is_active = coalesce(is_active, active, true)';
  end if;
end $$;

create table if not exists public.nutrition_suggestions (
  id uuid primary key default gen_random_uuid(),
  user_name text,
  weight numeric(10,2),
  height numeric(10,2),
  age integer,
  sex text,
  goal text,
  activity_level text,
  meals_per_day integer,
  restrictions text,
  calculated_bmi numeric(10,2),
  calculated_bmr numeric(10,2),
  calculated_tdee numeric(10,2),
  target_calories numeric(10,2),
  suggestion jsonb,
  created_at timestamp with time zone default now()
);

alter table public.nutrition_suggestions
  add column if not exists user_name text,
  add column if not exists weight numeric(10,2),
  add column if not exists height numeric(10,2),
  add column if not exists age integer,
  add column if not exists sex text,
  add column if not exists goal text,
  add column if not exists activity_level text,
  add column if not exists meals_per_day integer,
  add column if not exists restrictions text,
  add column if not exists calculated_bmi numeric(10,2),
  add column if not exists calculated_bmr numeric(10,2),
  add column if not exists calculated_tdee numeric(10,2),
  add column if not exists target_calories numeric(10,2),
  add column if not exists suggestion jsonb,
  add column if not exists created_at timestamp with time zone default now();

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
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.foods enable row level security;
alter table public.meal_templates enable row level security;
alter table public.nutrition_suggestions enable row level security;
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

drop policy if exists "Public can read active foods" on public.foods;
create policy "Public can read active foods"
on public.foods for select
to public
using (is_active = true or public.is_admin());

drop policy if exists "Admins manage foods" on public.foods;
create policy "Admins manage foods"
on public.foods for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read active meal templates" on public.meal_templates;
create policy "Public can read active meal templates"
on public.meal_templates for select
to public
using (is_active = true or public.is_admin());

drop policy if exists "Admins manage meal templates" on public.meal_templates;
create policy "Admins manage meal templates"
on public.meal_templates for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Anyone can create nutrition suggestions" on public.nutrition_suggestions;
create policy "Anyone can create nutrition suggestions"
on public.nutrition_suggestions for insert
to anon, authenticated
with check (true);

drop policy if exists "Admins manage nutrition suggestions" on public.nutrition_suggestions;
create policy "Admins manage nutrition suggestions"
on public.nutrition_suggestions for all
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

insert into public.store_settings (
  store_name,
  whatsapp_number,
  default_message,
  promo_title,
  promo_text
)
select
  'Pitbull Suplementos',
  '5500000000000',
  'Ola! Quero saber mais sobre os produtos da Pitbull Suplementos.',
  'Ofertas para treinar forte',
  'Fale no WhatsApp e confira suplementos, combos e vestuario disponiveis hoje.'
where not exists (select 1 from public.store_settings);

/*
insert into public.store_settings (
  id,
  store_name,
  whatsapp_number,
  default_message,
  promo_title,
  promo_text
) values (
  '00000000-0000-0000-0000-000000000001',
  'Pitbull Suplementos',
  '5500000000000',
  'Olá! Quero saber mais sobre os produtos da Pitbull Suplementos.',
  'Ofertas para treinar forte',
  'Fale no WhatsApp e confira suplementos, combos e vestuário disponíveis hoje.'
)
on conflict (id) do update set
  store_name = excluded.store_name,
  whatsapp_number = excluded.whatsapp_number,
  default_message = excluded.default_message,
  promo_title = excluded.promo_title,
  promo_text = excluded.promo_text;
*/

insert into public.categories (name, slug, type, is_active) values
  ('Proteínas', 'proteinas', 'suplemento', true),
  ('Energia e treino', 'energia-e-treino', 'suplemento', true),
  ('Camisetas personalizadas', 'camisetas-personalizadas', 'vestuario', true),
  ('Acessórios', 'acessorios', 'acessorio', true)
on conflict (slug) do update set
  name = excluded.name,
  type = excluded.type,
  is_active = excluded.is_active;

insert into public.foods (
  name,
  category,
  calories_per_100g,
  protein_per_100g,
  carbs_per_100g,
  fat_per_100g,
  is_active
) values
  ('Frango grelhado', 'proteína', 165, 31, 0, 3.6, true),
  ('Ovos', 'proteína', 143, 13, 1.1, 9.5, true),
  ('Arroz cozido', 'carboidrato', 128, 2.5, 28, 0.2, true),
  ('Feijão cozido', 'carboidrato', 76, 4.8, 13.6, 0.5, true),
  ('Aveia', 'carboidrato', 389, 16.9, 66.3, 6.9, true),
  ('Banana', 'fruta', 89, 1.1, 22.8, 0.3, true),
  ('Batata doce', 'carboidrato', 86, 1.6, 20, 0.1, true),
  ('Iogurte natural', 'proteína', 61, 3.5, 4.7, 3.3, true),
  ('Pasta de amendoim', 'gordura', 588, 25, 20, 50, true),
  ('Legumes cozidos', 'vegetais', 45, 2, 9, 0.2, true)
on conflict do nothing;

insert into public.meal_templates (
  title,
  meal_type,
  goal,
  preference,
  description,
  items,
  calories_estimate,
  protein_estimate,
  is_active
) values
  (
    'Café da manhã simples',
    'cafe_manha',
    'manter',
    'simples',
    'Ovos com banana e aveia em porções moderadas.',
    '[{"food":"Ovos","portion":"2 unidades"},{"food":"Banana","portion":"1 unidade"},{"food":"Aveia","portion":"30 g"}]'::jsonb,
    360,
    20,
    true
  ),
  (
    'Almoço equilibrado',
    'almoco',
    'manter',
    'simples',
    'Arroz, feijão, frango grelhado e legumes.',
    '[{"food":"Arroz cozido","portion":"100 g"},{"food":"Feijão cozido","portion":"80 g"},{"food":"Frango grelhado","portion":"120 g"},{"food":"Legumes cozidos","portion":"150 g"}]'::jsonb,
    560,
    42,
    true
  ),
  (
    'Lanche alta proteína',
    'lanche',
    'ganhar_massa',
    'alta_proteina',
    'Iogurte natural com aveia e pasta de amendoim.',
    '[{"food":"Iogurte natural","portion":"170 g"},{"food":"Aveia","portion":"30 g"},{"food":"Pasta de amendoim","portion":"15 g"}]'::jsonb,
    330,
    20,
    true
  ),
  (
    'Jantar fitness',
    'jantar',
    'emagrecer',
    'fitness',
    'Frango grelhado com batata doce e legumes.',
    '[{"food":"Frango grelhado","portion":"120 g"},{"food":"Batata doce","portion":"90 g"},{"food":"Legumes cozidos","portion":"150 g"}]'::jsonb,
    390,
    38,
    true
  ),
  (
    'Ceia prática',
    'ceia',
    'manter',
    'simples',
    'Iogurte natural com fruta.',
    '[{"food":"Iogurte natural","portion":"170 g"},{"food":"Banana","portion":"1 unidade"}]'::jsonb,
    210,
    9,
    true
  )
on conflict do nothing;

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
  is_active,
  is_featured,
  objective_tags
) values
  (
    'Whey Protein Exemplo',
    'whey-protein-exemplo',
    'suplemento',
    (select id from public.categories where slug = 'proteinas'),
    'Suplemento proteico para complementar a ingestão diária de proteínas. Uso informativo no rótulo do fabricante.',
    'Marca Exemplo',
    149.90,
    129.90,
    20,
    true,
    true,
    array['ganho_massa', 'recuperacao']
  ),
  (
    'Pré-treino Exemplo',
    'pre-treino-exemplo',
    'suplemento',
    (select id from public.categories where slug = 'energia-e-treino'),
    'Produto voltado para energia e foco no treino. Consulte o rótulo e evite uso sem orientação em caso de restrições.',
    'Marca Exemplo',
    99.90,
    null,
    15,
    true,
    true,
    array['energia']
  ),
  (
    'Camiseta Treino Personalizada',
    'camiseta-treino-personalizada',
    'vestuario',
    (select id from public.categories where slug = 'camisetas-personalizadas'),
    'Camiseta leve para treino com personalização sob consulta pelo WhatsApp.',
    'Coleção Loja',
    79.90,
    null,
    30,
    true,
    true,
    array[]::text[]
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
  is_active = excluded.is_active,
  is_featured = excluded.is_featured,
  objective_tags = excluded.objective_tags;

insert into public.product_variants (product_id, variant_type, name, stock, price_adjustment)
select p.id, 'sabor', variant.name, variant.stock, 0
from public.products p
cross join (values ('Baunilha', 8), ('Chocolate', 12)) as variant(name, stock)
where p.slug = 'whey-protein-exemplo'
on conflict do nothing;

insert into public.product_variants (product_id, variant_type, name, stock, price_adjustment)
select p.id, 'tamanho', variant.name, variant.stock, 0
from public.products p
cross join (values ('P', 8), ('M', 10), ('G', 12)) as variant(name, stock)
where p.slug = 'camiseta-treino-personalizada'
on conflict do nothing;
