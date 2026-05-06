-- Correcoes seguras para bancos criados com uma versao antiga do projeto.
-- Rode no SQL Editor do Supabase. Nao apaga dados existentes.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade
);

alter table public.profiles
  add column if not exists name text,
  add column if not exists role text default 'admin',
  add column if not exists created_at timestamp with time zone default now();

create table if not exists public.store_settings (
  id uuid primary key default gen_random_uuid()
);

alter table public.store_settings
  add column if not exists store_name text default 'Loja Online',
  add column if not exists whatsapp_number text default '5500000000000',
  add column if not exists logo_url text,
  add column if not exists instagram_url text,
  add column if not exists default_message text default 'Ola! Quero saber mais sobre os produtos da loja.',
  add column if not exists promo_title text default 'Ofertas para treinar forte',
  add column if not exists promo_text text default 'Fale no WhatsApp e confira suplementos, combos e vestuario disponiveis hoje.',
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
  name text not null
);

alter table public.categories
  add column if not exists slug text,
  add column if not exists type text,
  add column if not exists is_active boolean default true,
  add column if not exists created_at timestamp with time zone default now();

update public.categories
set is_active = coalesce(is_active, true);

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

create unique index if not exists categories_slug_unique on public.categories (slug);

create table if not exists public.home_banners (
  id uuid primary key default gen_random_uuid()
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

create table if not exists public.products (
  id uuid primary key default gen_random_uuid()
);

alter table public.products
  add column if not exists name text,
  add column if not exists slug text,
  add column if not exists type text,
  add column if not exists category_id uuid references public.categories(id) on delete set null,
  add column if not exists subcategory text,
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

create unique index if not exists products_slug_unique on public.products (slug);

create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade
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
  name text
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
set is_active = coalesce(is_active, true);

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
  id uuid primary key default gen_random_uuid()
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
  id uuid primary key default gen_random_uuid()
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

notify pgrst, 'reload schema';
