/**
 * Digital Veiculos seed script.
 * Prerequisite: add SUPABASE_SERVICE_ROLE_KEY to .env.local.
 * Run: node scripts/seed.js
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

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

const CATEGORIES = [
  { name: 'Sedans', slug: 'sedans', type: 'suplemento', is_active: true },
  { name: 'Hatches', slug: 'hatches', type: 'suplemento', is_active: true },
  { name: 'SUVs', slug: 'suvs', type: 'suplemento', is_active: true },
  { name: 'Picapes', slug: 'picapes', type: 'suplemento', is_active: true },
  { name: 'Motos', slug: 'motos', type: 'vestuario', is_active: true },
  { name: 'Acessorios automotivos', slug: 'acessorios-automotivos', type: 'acessorio', is_active: true },
]

const PRODUCTS = [
  {
    name: 'Honda Civic EXL 2020',
    slug: 'honda-civic-exl-2020',
    type: 'suplemento',
    catSlug: 'sedans',
    subcategory: 'Sedan',
    brand: 'Honda',
    description: 'Sedan automatico com acabamento premium, bom historico de manutencao, interior confortavel e pacote completo de seguranca.',
    price: 112900,
    promo_price: 109900,
    stock: 1,
    image_url: '/vehicle-car.svg',
    gallery_urls: [],
    objective_tags: ['ganho_massa', 'saude_geral'],
    is_featured: true,
    is_active: true,
  },
  {
    name: 'Toyota Corolla XEi 2021',
    slug: 'toyota-corolla-xei-2021',
    type: 'suplemento',
    catSlug: 'sedans',
    subcategory: 'Sedan',
    brand: 'Toyota',
    description: 'Corolla automatico reconhecido por conforto, confiabilidade e liquidez. Ideal para familia e uso diario.',
    price: 128900,
    promo_price: null,
    stock: 1,
    image_url: '/vehicle-car.svg',
    gallery_urls: [],
    objective_tags: ['ganho_massa', 'saude_geral'],
    is_featured: true,
    is_active: true,
  },
  {
    name: 'Chevrolet Onix LTZ Turbo 2023',
    slug: 'chevrolet-onix-ltz-turbo-2023',
    type: 'suplemento',
    catSlug: 'hatches',
    subcategory: 'Hatch',
    brand: 'Chevrolet',
    description: 'Hatch turbo economico, conectado e pratico para cidade.',
    price: 82900,
    promo_price: 79900,
    stock: 1,
    image_url: '/vehicle-car.svg',
    gallery_urls: [],
    objective_tags: ['emagrecimento'],
    is_featured: true,
    is_active: true,
  },
  {
    name: 'Jeep Compass Longitude 2022',
    slug: 'jeep-compass-longitude-2022',
    type: 'suplemento',
    catSlug: 'suvs',
    subcategory: 'SUV',
    brand: 'Jeep',
    description: 'SUV com posicao elevada de dirigir, acabamento sofisticado e otimo espaco interno.',
    price: 149900,
    promo_price: 145900,
    stock: 1,
    image_url: '/vehicle-stock.svg',
    gallery_urls: [],
    objective_tags: ['ganho_massa', 'saude_geral'],
    is_featured: true,
    is_active: true,
  },
  {
    name: 'Fiat Toro Volcano 2022',
    slug: 'fiat-toro-volcano-2022',
    type: 'suplemento',
    catSlug: 'picapes',
    subcategory: 'Picape',
    brand: 'Fiat',
    description: 'Picape versatil para trabalho e lazer, com bom pacote de equipamentos e visual robusto.',
    price: 139900,
    promo_price: null,
    stock: 1,
    image_url: '/vehicle-stock.svg',
    gallery_urls: [],
    objective_tags: ['recuperacao'],
    is_featured: false,
    is_active: true,
  },
  {
    name: 'Honda CG 160 Fan 2023',
    slug: 'honda-cg-160-fan-2023',
    type: 'vestuario',
    catSlug: 'motos',
    subcategory: 'Moto urbana',
    brand: 'Honda',
    description: 'Moto economica e confiavel para rotina urbana, trabalho e deslocamentos diarios.',
    price: 16900,
    promo_price: 15900,
    stock: 1,
    image_url: '/vehicle-moto.svg',
    gallery_urls: [],
    objective_tags: ['emagrecimento', 'recuperacao'],
    is_featured: false,
    is_active: true,
  },
]

const POSTS = [
  {
    title: 'Como escolher um seminovo com seguranca',
    slug: 'como-escolher-seminovo-com-seguranca',
    excerpt: 'Veja pontos essenciais para avaliar procedencia, estado geral e documentacao antes de negociar.',
    content: '<p>Antes de fechar negocio, avalie historico de manutencao, documentacao, estado de pneus, pintura, motor e cambio.</p>',
    cover_url: '',
    is_published: true,
    published_at: new Date().toISOString(),
  },
  {
    title: 'Documentacao necessaria para comprar um veiculo',
    slug: 'documentacao-necessaria-para-comprar-veiculo',
    excerpt: 'Confira os principais documentos e cuidados antes de fechar negocio.',
    content: '<p>Antes da compra, confira documento do veiculo, debitos, multas, licenciamento, comunicacao de venda e dados do vendedor.</p>',
    cover_url: '',
    is_published: true,
    published_at: new Date().toISOString(),
  },
  {
    title: 'O que observar no test-drive',
    slug: 'o-que-observar-no-test-drive',
    excerpt: 'Veja sinais importantes durante a avaliacao pratica do veiculo.',
    content: '<p>No test-drive, observe partida, ruidos, freios, alinhamento, cambio, suspensao, ar-condicionado e funcionamento dos comandos.</p>',
    cover_url: '',
    is_published: true,
    published_at: new Date().toISOString(),
  },  {
    title: 'Financiamento ou pagamento a vista',
    slug: 'financiamento-ou-pagamento-a-vista',
    excerpt: 'Entenda vantagens de cada caminho e escolha a melhor forma de negociar seu proximo veiculo.',
    content: '<p>Compare taxas, entrada, prazo e custo total antes de decidir.</p>',
    cover_url: '',
    is_published: true,
    published_at: new Date().toISOString(),
  },
]

async function main() {
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
  const products = PRODUCTS.map(({ catSlug, ...product }) => ({
    ...product,
    category_id: categoryBySlug[catSlug] || null,
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
