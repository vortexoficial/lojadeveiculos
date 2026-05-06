import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dir = dirname(fileURLToPath(import.meta.url))
const envPath = resolve(__dir, '../.env.local')
const env = Object.fromEntries(
  readFileSync(envPath, 'utf8')
    .split('\n')
    .filter(l => l.includes('='))
    .map(l => l.split('=').map(s => s.trim()))
)

const SUPABASE_URL = env.VITE_SUPABASE_URL
const SUPABASE_KEY = env.VITE_SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Variáveis de ambiente não encontradas no .env.local')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const CATEGORIES = [
  { name: 'Proteínas',    slug: 'proteinas',    type: 'suplemento' },
  { name: 'Creatinas',    slug: 'creatinas',    type: 'suplemento' },
  { name: 'Pré-treinos',  slug: 'pre-treinos',  type: 'suplemento' },
  { name: 'Aminoácidos',  slug: 'proteinas',    type: 'suplemento' },
  { name: 'Vitaminas',    slug: 'snacks',       type: 'suplemento' },
  { name: 'Snacks',       slug: 'snacks',       type: 'suplemento' },
  { name: 'Acessórios',   slug: 'acessorios',   type: 'acessorio'  },
  { name: 'Vestuário',    slug: 'vestuario',    type: 'vestuario'  },
]

const PRODUCTS = [
  {
    name: 'Whey Protein Concentrado 900g — Baunilha',
    slug: 'whey-protein-concentrado-900g-baunilha',
    type: 'suplemento',
    categorySlug: 'proteinas',
    subcategory: 'Whey',
    brand: 'Pitbull Nutrition',
    description: 'Whey Protein Concentrado com 24g de proteína por dose. Sabor baunilha cremosa, mistura fácil e digestão rápida. Ideal para ganho muscular e recuperação pós-treino.',
    price: 159.90,
    promo_price: 139.90,
    stock: 25,
    image_url: '/product-images/whey-protein.webp',
    objective_tags: ['ganho_massa', 'recuperacao'],
    is_active: true,
    is_featured: true,
  },
  {
    name: 'Creatina Monohidratada 300g',
    slug: 'creatina-monohidratada-300g',
    type: 'suplemento',
    categorySlug: 'creatinas',
    subcategory: 'Creatina',
    brand: 'Pitbull Nutrition',
    description: 'Creatina Monohidratada pura, sem aditivos. Aumenta a força e potência muscular. 60 doses por pote. A creatina mais estudada da ciência esportiva.',
    price: 89.90,
    promo_price: null,
    stock: 40,
    image_url: '/product-images/creatina.webp',
    objective_tags: ['energia', 'ganho_massa'],
    is_active: true,
    is_featured: true,
  },
  {
    name: 'Pré-Treino Explosive Energy 300g',
    slug: 'pre-treino-explosive-energy-300g',
    type: 'suplemento',
    categorySlug: 'pre-treinos',
    subcategory: 'Pré-treino',
    brand: 'Horse Power',
    description: 'Pré-treino com cafeína, beta-alanina e citrulina malato. Máximo foco, energia e pump. 30 doses por pote. Sabor Frutas Vermelhas.',
    price: 129.90,
    promo_price: 109.90,
    stock: 18,
    image_url: '/product-images/pre-treino.webp',
    objective_tags: ['energia'],
    is_active: true,
    is_featured: true,
  },
  {
    name: 'BCAA 2:1:1 Aminoácidos 200 cápsulas',
    slug: 'bcaa-211-aminoacidos-200-capsulas',
    type: 'suplemento',
    categorySlug: 'proteinas',
    subcategory: 'BCAA',
    brand: 'Pitbull Nutrition',
    description: 'BCAA na proporção 2:1:1 (leucina, isoleucina e valina). Reduz catabolismo muscular e acelera a recuperação. 200 cápsulas de 1000mg.',
    price: 79.90,
    promo_price: null,
    stock: 30,
    image_url: '/product-images/bcaa.webp',
    objective_tags: ['recuperacao', 'ganho_massa'],
    is_active: true,
    is_featured: true,
  },
  {
    name: 'Vitamina D3 + K2 60 cápsulas',
    slug: 'vitamina-d3-k2-60-capsulas',
    type: 'suplemento',
    categorySlug: 'snacks',
    subcategory: 'Vitaminas',
    brand: 'Pitbull Nutrition',
    description: 'Vitamina D3 2000 UI com Vitamina K2 MK-7. Suporte imunológico, saúde óssea e desempenho físico. Formulação de alta absorção. 60 cápsulas.',
    price: 49.90,
    promo_price: 39.90,
    stock: 50,
    image_url: '/product-images/vitamina-d.webp',
    objective_tags: ['saude_geral'],
    is_active: true,
    is_featured: true,
  },
  {
    name: 'Ômega 3 TG Fish Oil 90 cápsulas',
    slug: 'omega-3-tg-fish-oil-90-capsulas',
    type: 'suplemento',
    categorySlug: 'snacks',
    subcategory: 'Ômega',
    brand: 'Pitbull Nutrition',
    description: 'Ômega 3 em forma de triglicerídeos (TG) com EPA e DHA. Superior absorção. Reduz inflamação, apoia saúde cardiovascular e cognitiva. 90 cápsulas.',
    price: 69.90,
    promo_price: null,
    stock: 35,
    image_url: '/product-images/omega3.webp',
    objective_tags: ['saude_geral'],
    is_active: true,
    is_featured: true,
  },
  {
    name: 'Barra Proteica Dark Chocolate 12 unidades',
    slug: 'barra-proteica-dark-chocolate-12un',
    type: 'suplemento',
    categorySlug: 'snacks',
    subcategory: 'Snacks',
    brand: 'Pitbull Snacks',
    description: 'Barra proteica com 20g de proteína, baixo açúcar e sabor chocolate amargo. Lanche prático para qualquer hora. Caixa com 12 unidades de 60g.',
    price: 99.90,
    promo_price: 84.90,
    stock: 22,
    image_url: '/product-images/barra-proteica.webp',
    objective_tags: ['saude_geral', 'recuperacao'],
    is_active: true,
    is_featured: true,
  },
  {
    name: 'Camiseta Dry Fit Pitbull — Preta',
    slug: 'camiseta-dry-fit-pitbull-preta',
    type: 'vestuario',
    categorySlug: 'vestuario',
    subcategory: 'Camisetas',
    brand: 'Pitbull Wear',
    description: 'Camiseta com tecnologia Dry Fit de secagem rápida. Tecido leve e respirável para máxima performance. Logo Pitbull bordado no peito. Disponível em P, M, G e GG.',
    price: 89.90,
    promo_price: 74.90,
    stock: 40,
    image_url: '/product-images/camiseta-fit.webp',
    objective_tags: ['energia'],
    is_active: true,
    is_featured: true,
  },
  {
    name: 'Short de Treino Pitbull Flex — Cinza',
    slug: 'short-treino-pitbull-flex-cinza',
    type: 'vestuario',
    categorySlug: 'vestuario',
    subcategory: 'Shorts',
    brand: 'Pitbull Wear',
    description: 'Short de treino com tecido compressivo, cintura ajustável e bolso lateral. Perfeito para musculação, corrida e treinos funcionais. Disponível em P, M, G e GG.',
    price: 74.90,
    promo_price: null,
    stock: 28,
    image_url: '/product-images/short-treino.webp',
    objective_tags: ['energia'],
    is_active: true,
    is_featured: true,
  },
  {
    name: 'Garrafa Shaker Pro 700ml',
    slug: 'garrafa-shaker-pro-700ml',
    type: 'acessorio',
    categorySlug: 'acessorios',
    subcategory: 'Garrafas',
    brand: 'Pitbull Gear',
    description: 'Shaker profissional com mola misturadora interna, tampa com rosca dupla e bico dosador. Capacidade 700ml. Material livre de BPA. Ideal para whey e pré-treino.',
    price: 44.90,
    promo_price: 34.90,
    stock: 60,
    image_url: '/product-images/garrafa-shaker.webp',
    objective_tags: ['saude_geral'],
    is_active: true,
    is_featured: true,
  },
]

async function run() {
  console.log('🗑️  Excluindo todos os produtos...')

  const { data: existingProducts } = await supabase.from('products').select('id')
  if (existingProducts?.length) {
    const ids = existingProducts.map(p => p.id)
    await supabase.from('product_variants').delete().in('product_id', ids)
    const { error: delErr } = await supabase.from('products').delete().in('id', ids)
    if (delErr) { console.error('Erro ao excluir:', delErr.message); process.exit(1) }
    console.log(`   ${ids.length} produto(s) excluído(s).`)
  } else {
    console.log('   Nenhum produto existente.')
  }

  console.log('\n📦 Lendo categorias existentes...')
  const { data: cats, error: catErr } = await supabase
    .from('categories')
    .select('id, slug')

  if (catErr) { console.error('Erro categorias:', catErr.message); process.exit(1) }
  const catMap = new Map((cats || []).map(c => [c.slug, c.id]))
  console.log(`   ${catMap.size} categorias encontradas: ${[...catMap.keys()].join(', ')}`)

  // Se categorias necessárias não existirem, tenta criar (requer admin)
  const needed = [...new Set(PRODUCTS.map(p => p.categorySlug))]
  const missing = needed.filter(slug => !catMap.has(slug))
  if (missing.length) {
    console.log(`   Criando categorias faltantes: ${missing.join(', ')}`)
    const toCreate = CATEGORIES.filter(c => missing.includes(c.slug)).map(c => ({ ...c, is_active: true }))
    const { data: newCats, error: createErr } = await supabase
      .from('categories').insert(toCreate).select('id, slug')
    if (createErr) {
      console.warn(`   ⚠️  Não foi possível criar categorias (RLS): ${createErr.message}`)
      console.warn('   Produtos serão criados sem categoria.')
    } else {
      newCats.forEach(c => catMap.set(c.slug, c.id))
    }
  }

  console.log('\n🏋️  Criando 10 produtos...')
  const now = new Date().toISOString()
  const rows = PRODUCTS.map(({ categorySlug, subcategory, ...p }) => ({
    ...p,
    category_id: catMap.get(categorySlug) || null,
    gallery_urls: [],
    objective_tags: p.objective_tags || [],
    created_at: now,
    updated_at: now,
  }))

  const { data: saved, error: saveErr } = await supabase
    .from('products')
    .insert(rows)
    .select('id, name')

  if (saveErr) { console.error('Erro ao criar produtos:', saveErr.message); process.exit(1) }

  saved.forEach(p => console.log(`   ✓ ${p.name}`))
  console.log('\n✅ Pronto! 10 produtos criados com sucesso.')
}

run()
