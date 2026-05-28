/**
 * Digital Veiculos seed script.
 * Prerequisite: add SUPABASE_SERVICE_ROLE_KEY to .env.local.
 * Run: node scripts/seed.js
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import {
  DEMO_CATEGORIES,
  DEMO_POSTS,
  DEMO_PRODUCTS,
  LEGACY_DEMO_CATEGORY_SLUGS,
  LEGACY_DEMO_PRODUCT_SLUGS,
} from '../src/data/demoVehicles.js'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const raw = readFileSync(join(ROOT, '.env.local'), 'utf8')
const env = Object.fromEntries(
  raw
    .split('\n')
    .filter((line) => line.includes('=') && !line.trim().startsWith('#'))
    .map((line) => {
      const index = line.indexOf('=')
      return [line.slice(0, index).trim(), line.slice(index + 1).trim()]
    }),
)

const SUPABASE_URL = env.VITE_SUPABASE_URL
const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Adicione SUPABASE_SERVICE_ROLE_KEY ao .env.local antes de rodar o seed.')
  process.exit(1)
}

const db = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
})

const CATEGORIES = DEMO_CATEGORIES.map((category) => ({ ...category, is_active: true }))
const POSTS = DEMO_POSTS.map((post) => ({
  ...post,
  published_at: new Date().toISOString(),
}))

async function deactivateLegacyRows() {
  const { error: categoryError } = await db
    .from('categories')
    .update({ is_active: false })
    .in('slug', LEGACY_DEMO_CATEGORY_SLUGS)
  if (categoryError) console.warn('Categorias antigas:', categoryError.message)

  const { error: productError } = await db
    .from('products')
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .in('slug', LEGACY_DEMO_PRODUCT_SLUGS)
  if (productError) console.warn('Produtos antigos:', productError.message)
}

async function main() {
  await deactivateLegacyRows()

  const { error: settingsError } = await db.from('store_settings').insert({
    store_name: 'Digital Veiculos',
    whatsapp_number: '5511918334855',
    logo_url: '/novalogo.svg',
    default_message: 'Ola! Quero saber mais sobre os veiculos disponiveis.',
    promo_title: 'Veiculos em destaque',
    promo_text: 'Fale no WhatsApp e confira as oportunidades disponiveis hoje.',
  })
  if (settingsError) console.warn('Configuracoes:', settingsError.message)

  const { data: cats, error: catError } = await db
    .from('categories')
    .upsert(CATEGORIES, { onConflict: 'slug' })
    .select('id, slug')
  if (catError) throw catError

  const categoryBySlug = Object.fromEntries(cats.map((cat) => [cat.slug, cat.id]))
  const products = DEMO_PRODUCTS.map(({ categorySlug, ...product }) => ({
    ...product,
    category_id: categoryBySlug[categorySlug] || null,
  }))

  const { error: productError } = await db.from('products').upsert(products, { onConflict: 'slug' })
  if (productError) throw productError

  const { error: postError } = await db.from('blog_posts').upsert(POSTS, { onConflict: 'slug' })
  if (postError) throw postError

  console.log('Seed automotivo concluido com sucesso.')
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
