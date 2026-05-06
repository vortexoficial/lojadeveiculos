/**
 * Seed script — popula o banco Supabase com produtos e posts de blog.
 *
 * Pré-requisito: adicione ao .env.local
 *   SUPABASE_SERVICE_ROLE_KEY=<sua service role key>
 *   (Supabase → Project Settings → API → service_role secret)
 *
 * Como rodar:
 *   node scripts/seed.js
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// ── Env ───────────────────────────────────────────────
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const raw = readFileSync(join(ROOT, '.env.local'), 'utf8')
const env = Object.fromEntries(
  raw.split('\n')
    .filter(l => l.includes('=') && !l.startsWith('#'))
    .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)

const SUPABASE_URL = env.VITE_SUPABASE_URL
const SERVICE_KEY  = env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('\n❌  Adicione SUPABASE_SERVICE_ROLE_KEY ao .env.local\n')
  console.error('   Supabase → Project Settings → API → service_role (secret)\n')
  process.exit(1)
}

const db = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
})

// ── Helpers ───────────────────────────────────────────
const now = () => new Date().toISOString()
const slugify = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

function log(msg)   { console.log('  ✓', msg) }
function warn(msg)  { console.warn('  ⚠', msg) }
function fatal(msg) { console.error('  ✗', msg); process.exit(1) }

function usp(id, w = 900, h = 600) {
  return `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format&q=80`
}

// ── Imagens Unsplash (fitness, suplementos, vestuário) ─
const IMG = {
  // Suplementos
  whey1:    usp('1579722821273-0f6c7d44362f'),
  whey2:    usp('1544367567-0f2fcb009e0b'),
  whey3:    usp('1526506118085-60ce8714f8c5'),
  creatina1: usp('1571019613454-1cb2f99b2d8b'),
  creatina2: usp('1532550907401-a500c9a57435'),
  pre1:     usp('1558618666-fcd25c85cd64'),
  pre2:     usp('1517836357463-d25dfeac3438'),
  bcaa1:    usp('1579722821273-0f6c7d44362f'),
  massa1:   usp('1534438327276-14e5300c3a48'),
  massa2:   usp('1526506118085-60ce8714f8c5'),
  gluta1:   usp('1571019613454-1cb2f99b2d8b'),
  termo1:   usp('1558618666-fcd25c85cd64'),
  termo2:   usp('1517836357463-d25dfeac3438'),
  albu1:    usp('1532550907401-a500c9a57435'),
  // Vestuário
  cam1:     usp('1571902943202-507ec2618e8f'),
  cam2:     usp('1506629082955-511b1aa562c8'),
  cam3:     usp('1595341595379-87b41be92013'),
  short1:   usp('1571902943202-507ec2618e8f'),
  short2:   usp('1595341595379-87b41be92013'),
  regata1:  usp('1517836357463-d25dfeac3438'),
  legging1: usp('1506629082955-511b1aa562c8'),
  legging2: usp('1595341595379-87b41be92013'),
  bone1:    usp('1517836357463-d25dfeac3438'),
  luva1:    usp('1534438327276-14e5300c3a48'),
  // Blog covers
  blog1:    usp('1581009137042-c552e485697a', 1200, 700),
  blog2:    usp('1534438327276-14e5300c3a48', 1200, 700),
  blog3:    usp('1558618666-fcd25c85cd64', 1200, 700),
  blog4:    usp('1526506118085-60ce8714f8c5', 1200, 700),
  blog5:    usp('1571902943202-507ec2618e8f', 1200, 700),
  blog6:    usp('1579722821273-0f6c7d44362f', 1200, 700),
}

// ── Categorias ────────────────────────────────────────
const CATEGORIES = [
  { name: 'Proteínas',    slug: 'proteinas',   type: 'suplemento', is_active: true },
  { name: 'Creatinas',    slug: 'creatinas',   type: 'suplemento', is_active: true },
  { name: 'Pré-treinos',  slug: 'pre-treinos', type: 'suplemento', is_active: true },
  { name: 'Vitaminas',    slug: 'vitaminas',   type: 'suplemento', is_active: true },
  { name: 'Snacks',       slug: 'snacks',      type: 'suplemento', is_active: true },
  { name: 'Queimadores',  slug: 'queimadores', type: 'suplemento', is_active: true },
  { name: 'Vestuário',    slug: 'vestuario',   type: 'vestuario',  is_active: true },
  { name: 'Acessórios',   slug: 'acessorios',  type: 'acessorio',  is_active: true },
]

// ── Produtos ──────────────────────────────────────────
// catSlug é resolvido para category_id no runtime
const PRODUCTS = [
  // ── PROTEÍNAS ──────────────────────────────────────
  {
    name: 'Whey Protein Concentrado 900g — Baunilha',
    slug: 'whey-protein-concentrado-900g-baunilha',
    type: 'suplemento', catSlug: 'proteinas', subcategory: 'Whey',
    brand: 'Pitbull Nutrition',
    description: 'Whey Protein Concentrado com 24g de proteína por dose, 5,4g de BCAA e 4g de Glutamina naturais. Sabor baunilha cremosa, mistura fácil em água ou leite. Ideal para ganho muscular e recuperação pós-treino. 30 doses por pote.',
    price: 159.90, promo_price: 139.90, stock: 25,
    image_url: '/product-images/whey-protein.webp',
    gallery_urls: [IMG.whey1, IMG.whey2, IMG.whey3],
    objective_tags: ['ganho_massa', 'recuperacao'],
    is_featured: true, is_active: true,
  },
  {
    name: 'Whey Protein Concentrado 900g — Chocolate',
    slug: 'whey-protein-concentrado-900g-chocolate',
    type: 'suplemento', catSlug: 'proteinas', subcategory: 'Whey',
    brand: 'Pitbull Nutrition',
    description: 'Whey Protein Concentrado com 24g de proteína por dose. Sabor chocolate intenso, sem açúcar adicionado. Mistura instantânea. Perfeito para o pós-treino ou como lanche proteico ao longo do dia.',
    price: 159.90, promo_price: null, stock: 20,
    image_url: '/product-images/whey-protein.webp',
    gallery_urls: [IMG.whey2, IMG.whey3],
    objective_tags: ['ganho_massa', 'recuperacao'],
    is_featured: false, is_active: true,
  },
  {
    name: 'BCAA 2:1:1 — 200 Cápsulas',
    slug: 'bcaa-211-200-capsulas',
    type: 'suplemento', catSlug: 'proteinas', subcategory: 'BCAA',
    brand: 'Pitbull Nutrition',
    description: 'BCAA na proporção científica 2:1:1 (Leucina, Isoleucina e Valina). Reduz catabolismo muscular, acelera a recuperação e melhora a síntese proteica. 200 cápsulas de 1000mg. Livre de corantes e conservantes.',
    price: 79.90, promo_price: null, stock: 30,
    image_url: '/product-images/bcaa.webp',
    gallery_urls: [IMG.bcaa1, IMG.creatina2],
    objective_tags: ['recuperacao', 'ganho_massa'],
    is_featured: true, is_active: true,
  },
  {
    name: 'Hipercalórico Mass Power 3kg — Chocolate',
    slug: 'hipercalorico-mass-power-3kg-chocolate',
    type: 'suplemento', catSlug: 'proteinas', subcategory: 'Hipercalórico',
    brand: 'Pitbull Nutrition',
    description: 'Hipercalórico com 1200 kcal por dose, 40g de proteína e 220g de carboidratos complexos. Fórmula enriquecida com vitaminas e minerais. Ideal para quem tem dificuldade em ganhar peso. Sabor Chocolate. 40 doses.',
    price: 219.90, promo_price: 189.90, stock: 15,
    image_url: IMG.massa1,
    gallery_urls: [IMG.massa2, IMG.whey2],
    objective_tags: ['ganho_massa'],
    is_featured: true, is_active: true,
  },
  {
    name: 'Albumina Pura 500g — Sem Sabor',
    slug: 'albumina-pura-500g-sem-sabor',
    type: 'suplemento', catSlug: 'proteinas', subcategory: 'Albumina',
    brand: 'Pitbull Nutrition',
    description: 'Albumina 100% pura, proteína de alta qualidade derivada da clara do ovo. Rica em aminoácidos essenciais, absorção progressiva que garante abastecimento proteico por horas. 30g de proteína por 40g de produto.',
    price: 59.90, promo_price: null, stock: 35,
    image_url: IMG.albu1,
    gallery_urls: [IMG.creatina2],
    objective_tags: ['ganho_massa', 'recuperacao'],
    is_featured: false, is_active: true,
  },

  // ── CREATINAS ──────────────────────────────────────
  {
    name: 'Creatina Monohidratada 300g',
    slug: 'creatina-monohidratada-300g',
    type: 'suplemento', catSlug: 'creatinas', subcategory: 'Creatina',
    brand: 'Pitbull Nutrition',
    description: 'Creatina Monohidratada micronizada, 100% pura, sem aditivos. O suplemento mais estudado da ciência esportiva. Aumenta força, potência e volume muscular. 60 doses de 5g por pote. Mistura instantânea.',
    price: 89.90, promo_price: null, stock: 40,
    image_url: '/product-images/creatina.webp',
    gallery_urls: [IMG.creatina1, IMG.creatina2],
    objective_tags: ['energia', 'ganho_massa'],
    is_featured: true, is_active: true,
  },
  {
    name: 'Creatina HCL 120 Cápsulas',
    slug: 'creatina-hcl-120-capsulas',
    type: 'suplemento', catSlug: 'creatinas', subcategory: 'Creatina',
    brand: 'Pitbull Nutrition',
    description: 'Creatina HCL (Cloridrato de Creatina) com maior solubilidade e absorção que a monohidratada convencional. Sem retenção hídrica, sem fase de carga. 120 cápsulas de 750mg. Ideal para quem busca praticidade.',
    price: 99.90, promo_price: 84.90, stock: 22,
    image_url: IMG.creatina1,
    gallery_urls: [IMG.creatina2, IMG.albu1],
    objective_tags: ['energia', 'ganho_massa'],
    is_featured: false, is_active: true,
  },

  // ── PRÉ-TREINOS ────────────────────────────────────
  {
    name: 'Pré-Treino Explosive Energy 300g — Frutas Vermelhas',
    slug: 'pre-treino-explosive-energy-300g-frutas-vermelhas',
    type: 'suplemento', catSlug: 'pre-treinos', subcategory: 'Pré-treino',
    brand: 'Pitbull Nutrition',
    description: 'Pré-treino com 300mg de cafeína, 6g de Citrulina Malato, 3,2g de Beta-alanina e 2g de Arginina. Fórmula completa para máximo foco, energia explosiva e pump intenso. 30 doses por pote. Sabor Frutas Vermelhas.',
    price: 129.90, promo_price: 109.90, stock: 18,
    image_url: '/product-images/pre-treino.webp',
    gallery_urls: [IMG.pre1, IMG.pre2, IMG.termo2],
    objective_tags: ['energia'],
    is_featured: true, is_active: true,
  },
  {
    name: 'Pré-Treino Dark Storm 300g — Limão',
    slug: 'pre-treino-dark-storm-300g-limao',
    type: 'suplemento', catSlug: 'pre-treinos', subcategory: 'Pré-treino',
    brand: 'Horse Power',
    description: 'Pré-treino com fórmula avançada: 400mg de cafeína, 8g de Citrulina Malato, 4g de Beta-alanina, Nootrópicos e Vitaminas do complexo B. Para atletas avançados. 30 doses. Sabor Limão Siciliano.',
    price: 149.90, promo_price: null, stock: 12,
    image_url: IMG.pre1,
    gallery_urls: [IMG.pre2, IMG.termo1],
    objective_tags: ['energia'],
    is_featured: false, is_active: true,
  },

  // ── VITAMINAS ──────────────────────────────────────
  {
    name: 'Vitamina D3 + K2 MK-7 — 60 Cápsulas',
    slug: 'vitamina-d3-k2-mk7-60-capsulas',
    type: 'suplemento', catSlug: 'vitaminas', subcategory: 'Vitaminas',
    brand: 'Pitbull Nutrition',
    description: 'Vitamina D3 2000 UI com Vitamina K2 MK-7 100mcg. Suporte imunológico, saúde óssea, hormonal e desempenho físico. Formulação oleosa de alta absorção. 60 cápsulas softgel.',
    price: 49.90, promo_price: 39.90, stock: 50,
    image_url: '/product-images/vitamina-d.webp',
    gallery_urls: [IMG.creatina2],
    objective_tags: ['saude_geral'],
    is_featured: false, is_active: true,
  },
  {
    name: 'Ômega 3 TG Fish Oil 1000mg — 90 Cápsulas',
    slug: 'omega-3-tg-fish-oil-1000mg-90-capsulas',
    type: 'suplemento', catSlug: 'vitaminas', subcategory: 'Ômega',
    brand: 'Pitbull Nutrition',
    description: 'Ômega 3 em forma de triglicerídeos (TG), a forma mais absorvida pelo organismo. 400mg EPA + 300mg DHA por cápsula. Reduz inflamação, apoia saúde cardiovascular e função cognitiva. 90 cápsulas.',
    price: 69.90, promo_price: null, stock: 35,
    image_url: '/product-images/omega3.webp',
    gallery_urls: [IMG.albu1],
    objective_tags: ['saude_geral'],
    is_featured: false, is_active: true,
  },

  // ── SNACKS ─────────────────────────────────────────
  {
    name: 'Barra Proteica Dark Chocolate — Caixa 12un',
    slug: 'barra-proteica-dark-chocolate-cx12',
    type: 'suplemento', catSlug: 'snacks', subcategory: 'Barras',
    brand: 'Pitbull Snacks',
    description: 'Barra proteica com 20g de proteína, 5g de gordura e apenas 8g de açúcar. Cobertura de chocolate amargo 70% cacau. Textura macia e sabor irresistível. Caixa com 12 unidades de 60g. Perfeita para qualquer hora.',
    price: 99.90, promo_price: 84.90, stock: 22,
    image_url: '/product-images/barra-proteica.webp',
    gallery_urls: [IMG.gluta1, IMG.creatina2],
    objective_tags: ['saude_geral', 'recuperacao'],
    is_featured: false, is_active: true,
  },

  // ── QUEIMADORES ────────────────────────────────────
  {
    name: 'Termogênico Black Fire 120 Cápsulas',
    slug: 'termogenico-black-fire-120-capsulas',
    type: 'suplemento', catSlug: 'queimadores', subcategory: 'Termogênico',
    brand: 'Pitbull Nutrition',
    description: 'Termogênico com 300mg de cafeína, Chá Verde, Pimenta Caiena, Gengibre e L-Carnitina. Acelera o metabolismo, aumenta a queima de gordura e melhora o foco. 120 cápsulas. Tomar 1 dose 30min antes do treino.',
    price: 89.90, promo_price: 74.90, stock: 28,
    image_url: IMG.termo1,
    gallery_urls: [IMG.termo2, IMG.pre1],
    objective_tags: ['energia'],
    is_featured: true, is_active: true,
  },
  {
    name: 'Glutamina Pura 300g',
    slug: 'glutamina-pura-300g',
    type: 'suplemento', catSlug: 'queimadores', subcategory: 'Aminoácido',
    brand: 'Pitbull Nutrition',
    description: 'L-Glutamina pura micronizada, o aminoácido mais abundante no músculo esquelético. Reduz catabolismo, fortalece o sistema imune e acelera a recuperação. 5g por dose, 60 doses. Sem sabor, mistura fácil.',
    price: 64.90, promo_price: null, stock: 30,
    image_url: IMG.gluta1,
    gallery_urls: [IMG.creatina2],
    objective_tags: ['recuperacao'],
    is_featured: false, is_active: true,
  },

  // ── VESTUÁRIO ──────────────────────────────────────
  {
    name: 'Camiseta Dry Fit Pitbull — Preta',
    slug: 'camiseta-dry-fit-pitbull-preta',
    type: 'vestuario', catSlug: 'vestuario', subcategory: 'Camisetas',
    brand: 'Pitbull Wear',
    description: 'Camiseta com tecnologia Dry Fit de secagem ultra-rápida. Tecido 100% poliéster de alta performance, leve e respirável. Logo Pitbull bordado no peito. Costuras reforçadas. Disponível em P, M, G e GG.',
    price: 89.90, promo_price: 74.90, stock: 40,
    image_url: '/product-images/camiseta-fit.webp',
    gallery_urls: [IMG.cam1, IMG.cam2, IMG.cam3],
    objective_tags: ['energia'],
    is_featured: true, is_active: true,
  },
  {
    name: 'Camiseta Dry Fit Pitbull — Branca',
    slug: 'camiseta-dry-fit-pitbull-branca',
    type: 'vestuario', catSlug: 'vestuario', subcategory: 'Camisetas',
    brand: 'Pitbull Wear',
    description: 'Camiseta Dry Fit na versão branca com logo Pitbull preto. Tecido de alta performance com proteção UV 50+. Ideal para treinos ao ar livre. Disponível em P, M, G e GG.',
    price: 89.90, promo_price: null, stock: 25,
    image_url: IMG.cam1,
    gallery_urls: [IMG.cam2, IMG.cam3],
    objective_tags: ['energia'],
    is_featured: false, is_active: true,
  },
  {
    name: 'Short de Treino Pitbull Flex — Cinza',
    slug: 'short-treino-pitbull-flex-cinza',
    type: 'vestuario', catSlug: 'vestuario', subcategory: 'Shorts',
    brand: 'Pitbull Wear',
    description: 'Short de treino com tecido compressivo de 4 vias, cintura elástica ajustável e bolso lateral com zíper. Corte ergonômico para máxima mobilidade. Perfeito para musculação, corrida e funcional. P, M, G, GG.',
    price: 74.90, promo_price: null, stock: 28,
    image_url: '/product-images/short-treino.webp',
    gallery_urls: [IMG.short1, IMG.short2],
    objective_tags: ['energia'],
    is_featured: true, is_active: true,
  },
  {
    name: 'Regata Compressão Pitbull — Preta',
    slug: 'regata-compressao-pitbull-preta',
    type: 'vestuario', catSlug: 'vestuario', subcategory: 'Regatas',
    brand: 'Pitbull Wear',
    description: 'Regata com compressão leve que melhora a circulação e reduz a fadiga muscular. Tecido respirável com tecnologia anti-odor. Recortes laterais para ventilação extra. Disponível em P, M, G e GG.',
    price: 69.90, promo_price: 59.90, stock: 20,
    image_url: IMG.regata1,
    gallery_urls: [IMG.cam1, IMG.cam2],
    objective_tags: ['energia'],
    is_featured: false, is_active: true,
  },
  {
    name: 'Legging Performance Feminina — Preta',
    slug: 'legging-performance-feminina-preta',
    type: 'vestuario', catSlug: 'vestuario', subcategory: 'Leggings',
    brand: 'Pitbull Wear',
    description: 'Legging feminina com compressão média, cintura alta e tecido com fio de cobre que reduz odores. Modelagem anatômica que valoriza as curvas. Bolso embutido na cintura. Disponível em P, M, G e GG.',
    price: 119.90, promo_price: 99.90, stock: 18,
    image_url: IMG.legging1,
    gallery_urls: [IMG.legging2, IMG.cam3],
    objective_tags: ['energia'],
    is_featured: true, is_active: true,
  },
  {
    name: 'Boné Pitbull Snapback — Preto',
    slug: 'bone-pitbull-snapback-preto',
    type: 'vestuario', catSlug: 'vestuario', subcategory: 'Bonés',
    brand: 'Pitbull Wear',
    description: 'Boné Snapback com aba reta e estrutura premium. Logo Pitbull bordado na frente e na lateral. Fecho ajustável traseiro para tamanho único. Material resistente à água. Ideal para treinos e uso casual.',
    price: 59.90, promo_price: null, stock: 35,
    image_url: IMG.bone1,
    gallery_urls: [IMG.cam1],
    objective_tags: [],
    is_featured: false, is_active: true,
  },
  {
    name: 'Luva de Treino Premium — Par',
    slug: 'luva-treino-premium-par',
    type: 'vestuario', catSlug: 'vestuario', subcategory: 'Acessórios',
    brand: 'Pitbull Gear',
    description: 'Luva de treino com palma em couro sintético reforçado, dorsol em neoprene respirável e velcro de ajuste. Proteção para a mão e aderência superior. Disponível em P, M, G.',
    price: 79.90, promo_price: 64.90, stock: 22,
    image_url: IMG.luva1,
    gallery_urls: [IMG.short1],
    objective_tags: [],
    is_featured: false, is_active: true,
  },

  // ── ACESSÓRIOS ─────────────────────────────────────
  {
    name: 'Garrafa Shaker Pro 700ml',
    slug: 'garrafa-shaker-pro-700ml',
    type: 'acessorio', catSlug: 'acessorios', subcategory: 'Garrafas',
    brand: 'Pitbull Gear',
    description: 'Shaker profissional com mola misturadora interna de aço inox, tampa com rosca dupla, alça e bico dosador. Capacidade 700ml. Material Tritan livre de BPA. Escala de medição interna. Ideal para whey e pré-treino.',
    price: 44.90, promo_price: 34.90, stock: 60,
    image_url: '/product-images/garrafa-shaker.webp',
    gallery_urls: [IMG.albu1, IMG.creatina2],
    objective_tags: ['saude_geral'],
    is_featured: false, is_active: true,
  },
]

// ── Blog Posts ────────────────────────────────────────
const POSTS = [
  {
    title: 'Como escolher o Whey Protein ideal para seus objetivos',
    slug: 'como-escolher-whey-protein-ideal',
    excerpt: 'Concentrado, isolado ou hidrolisado? Descubra qual Whey Protein se encaixa no seu treino, metabolismo e objetivo — e economize na hora de comprar.',
    cover_url: IMG.blog1,
    published: true,
    content: `<h2>O que é o Whey Protein?</h2>
<p>O Whey Protein é a proteína extraída do soro do leite durante a fabricação do queijo. É um dos suplementos mais estudados do mundo, com décadas de pesquisas comprovando sua eficácia para ganho muscular, recuperação e emagrecimento.</p>

<h2>Os 3 tipos de Whey</h2>
<h3>1. Whey Concentrado</h3>
<p>Contém entre 70% e 80% de proteína por dose, com pequenas quantidades de gordura e lactose. É o mais acessível e indicado para a maioria das pessoas que não têm intolerância à lactose. Ótima escolha para o pós-treino do dia a dia.</p>

<h3>2. Whey Isolado</h3>
<p>Passa por um processo adicional de filtragem que eleva o teor proteico para 90% ou mais, removendo praticamente toda a lactose e a gordura. Ideal para quem tem intolerância à lactose ou está em fase de definição muscular.</p>

<h3>3. Whey Hidrolisado</h3>
<p>As proteínas já foram pré-digeridas (hidrolisadas) em peptídeos menores, o que acelera ainda mais a absorção. É o mais caro dos três e indicado para atletas de alto rendimento ou pessoas com sensibilidades digestivas graves.</p>

<h2>Qual escolher?</h2>
<ul>
<li><strong>Ganho de massa:</strong> Whey Concentrado — melhor custo-benefício</li>
<li><strong>Definição muscular:</strong> Whey Isolado — menos calorias e lactose</li>
<li><strong>Alta performance:</strong> Whey Hidrolisado — absorção máxima</li>
<li><strong>Intolerante à lactose:</strong> Whey Isolado ou Hidrolisado</li>
</ul>

<h2>Quando tomar?</h2>
<p>O momento mais eficiente é nos <strong>30 a 60 minutos após o treino</strong>, quando os músculos estão mais receptivos à síntese proteica. Também pode ser usado ao longo do dia para complementar a ingestão proteica diária — o ideal é consumir entre 1,6g e 2,2g de proteína por kg de peso corporal.</p>

<h2>Conclusão</h2>
<p>Para a maioria das pessoas que treinam regularmente, o <strong>Whey Concentrado</strong> é a melhor escolha pela relação qualidade/preço. Seja qual for o tipo escolhido, consistência nos treinos e na alimentação são os fatores que realmente fazem a diferença.</p>`,
  },
  {
    title: 'Creatina: o guia completo para iniciantes e avançados',
    slug: 'creatina-guia-completo',
    excerpt: 'Tudo que você precisa saber sobre creatina: como funciona, como tomar, fase de carga, mitos e o que a ciência realmente diz.',
    cover_url: IMG.blog2,
    published: true,
    content: `<h2>O suplemento mais estudado da história</h2>
<p>A creatina é produzida naturalmente pelo organismo a partir de aminoácidos, e armazenada principalmente nos músculos. Suplementar com creatina aumenta os estoques musculares, o que melhora diretamente a força e a potência em exercícios de alta intensidade.</p>

<h2>Como a creatina funciona?</h2>
<p>Durante exercícios explosivos (levantamento de peso, sprints, HIIT), o músculo usa o sistema ATP-CP como principal fonte de energia. A creatina é convertida em fosfocreatina, que regenera o ATP mais rapidamente — isso significa mais repetições, mais carga e melhor desempenho.</p>

<h2>Benefícios comprovados</h2>
<ul>
<li>Aumento de força e potência muscular (5–15%)</li>
<li>Maior volume muscular (retenção hídrica intramuscular)</li>
<li>Recuperação acelerada entre séries</li>
<li>Melhora na cognição e memória de curto prazo</li>
<li>Benefícios para saúde óssea em longo prazo</li>
</ul>

<h2>Precisa fazer fase de carga?</h2>
<p>A fase de carga (20g/dia por 5–7 dias) acelera a saturação dos estoques, mas não é obrigatória. Tomando <strong>3 a 5g por dia de forma contínua</strong>, os estoques ficam saturados em 3–4 semanas. O resultado final é o mesmo — só demora um pouco mais.</p>

<h2>Quando e como tomar?</h2>
<p>Diferente do que muitos acreditam, o horário importa pouco. O mais importante é a <strong>consistência diária</strong>. Uma estratégia eficaz é tomar no pós-treino junto com o Whey Protein e uma fonte de carboidrato, que favorece a absorção. Nos dias de descanso, tome em qualquer hora do dia.</p>

<h2>Creatina engorda?</h2>
<p>A creatina causa retenção de água <em>dentro das células musculares</em> (intramuscular), não subcutânea. Isso deixa o músculo mais "cheio" e volumoso — é algo positivo. Não causa inchaço visível nem "barriga d'água".</p>

<h2>É segura para usar sempre?</h2>
<p>Sim. Estudos de até 5 anos contínuos não encontraram efeitos adversos em pessoas saudáveis. A creatina é metabolizada normalmente pelos rins e excretada pela urina. Manter boa hidratação é suficiente para uso seguro a longo prazo.</p>`,
  },
  {
    title: 'Pré-Treino: como usar corretamente e potencializar seus resultados',
    slug: 'pre-treino-como-usar-corretamente',
    excerpt: 'Pré-treino não é só cafeína. Entenda os ingredientes, as doses corretas e como evitar os erros mais comuns que prejudicam seus resultados.',
    cover_url: IMG.blog3,
    published: true,
    content: `<h2>O que é um pré-treino?</h2>
<p>Pré-treinos são suplementos formulados para aumentar energia, foco, força e resistência antes da atividade física. A maioria combina estimulantes (como cafeína), vasodilatadores e nootrópicos em doses otimizadas para potencializar o desempenho.</p>

<h2>Ingredientes que fazem a diferença</h2>
<h3>Cafeína</h3>
<p>O estimulante mais estudado do mundo. Reduz a percepção de esforço, aumenta o foco e melhora a resistência. Doses eficazes: 3–6mg/kg de peso corporal. Para uma pessoa de 80kg, isso significa 240–480mg por dose.</p>

<h3>Citrulina Malato</h3>
<p>Aumenta a produção de óxido nítrico, melhorando o fluxo sanguíneo muscular. Resulta em mais pump, maior resistência à fadiga e melhor recuperação entre séries. Dose mínima eficaz: 6g por treino.</p>

<h3>Beta-Alanina</h3>
<p>Aumenta os níveis de carnosina muscular, reduzindo o acúmulo de ácido lático. Melhora resistência em esforços de 1–4 minutos. Causa formigamento (parestesia) — normal e inofensivo. Dose: 3,2–6,4g.</p>

<h3>Creatina</h3>
<p>Muitos pré-treinos já incluem creatina. Sinergia perfeita com os outros ingredientes para força e potência.</p>

<h2>Como usar corretamente?</h2>
<ul>
<li>Tome <strong>20 a 30 minutos antes do treino</strong></li>
<li>Comece com meia dose para avaliar a tolerância</li>
<li>Não tome após as 17h se for sensível à cafeína</li>
<li>Não use diariamente — 4 a 5x por semana máximo</li>
<li>Faça pausas de 1–2 semanas por mês para evitar tolerância</li>
</ul>

<h2>Erros comuns</h2>
<ul>
<li><strong>Depender do pré-treino para se motivar:</strong> Ele potencializa, não substitui disciplina</li>
<li><strong>Tomar em jejum absoluto:</strong> Pode causar enjoo em algumas pessoas</li>
<li><strong>Usar com outras fontes de cafeína:</strong> Evite café, energéticos e chá-preto no mesmo dia</li>
<li><strong>Usar todo dia:</strong> Gera tolerância rápida e dependência</li>
</ul>`,
  },
  {
    title: '5 suplementos essenciais para quem treina musculação',
    slug: '5-suplementos-essenciais-musculacao',
    excerpt: 'Se você pudesse escolher apenas 5 suplementos para maximizar seus resultados na musculação, quais seriam? A ciência responde.',
    cover_url: IMG.blog4,
    published: true,
    content: `<h2>Introdução</h2>
<p>Com tantas opções no mercado, saber quais suplementos realmente valem o investimento pode parecer difícil. Mas a ciência é clara: a maioria dos resultados vem de um grupo pequeno de compostos com evidências sólidas.</p>

<h2>1. Whey Protein</h2>
<p>A proteína é o macronutriente mais importante para ganho muscular. O Whey é a fonte proteica mais completa disponível, com alto teor de leucina (o aminoácido que mais estimula a síntese proteica) e absorção rápida. Se você não consegue atingir sua meta proteica só com a alimentação, o Whey resolve com praticidade e custo acessível.</p>

<h2>2. Creatina Monohidratada</h2>
<p>O suplemento com o maior volume de pesquisas positivas na história da nutrição esportiva. Melhora força, potência e composição corporal em praticamente todos os estudos. Barata, segura e eficaz — não há argumento contra usá-la.</p>

<h2>3. Cafeína (pré-treino)</h2>
<p>A cafeína melhora força, resistência, foco e reduz a percepção de esforço. Você pode obtê-la do café ou de pré-treinos formulados. O importante é a dose certa: 3–6mg/kg, tomada 30min antes do treino.</p>

<h2>4. Vitamina D3 + K2</h2>
<p>A deficiência de Vitamina D é extremamente comum e afeta produção de testosterona, saúde óssea, imunidade e desempenho físico. A K2 garante que o cálcio vá para os ossos (e não para as artérias). Um dos investimentos mais inteligentes em saúde a longo prazo.</p>

<h2>5. Ômega 3</h2>
<p>Os ácidos graxos EPA e DHA reduzem a inflamação sistêmica, melhoram a recuperação muscular, protegem as articulações e apoiam a saúde cardiovascular e cerebral. Atletas têm necessidades maiores de anti-inflamatórios naturais — o ômega 3 de alta qualidade preenche esse papel.</p>

<h2>O que fica fora da lista?</h2>
<p>Queimadores, HMB, ZMA, testosterona natural — todos têm evidências fracas ou mistas. Invista primeiro nos 5 acima, que têm décadas de pesquisa por trás, antes de considerar os demais.</p>`,
  },
  {
    title: 'Como montar o look perfeito para academia: guia completo',
    slug: 'como-montar-look-perfeito-academia',
    excerpt: 'Conforto, performance e estilo não precisam ser excludentes. Veja como escolher cada peça do seu outfit de treino com critérios que realmente importam.',
    cover_url: IMG.blog5,
    published: true,
    content: `<h2>Por que o vestuário importa no treino?</h2>
<p>O vestuário de treino adequado vai além do estilo. A roupa certa influencia diretamente a amplitude de movimento, a termorregulação, a absorção de suor e até a confiança durante o exercício — fator psicológico que impacta o desempenho.</p>

<h2>A camiseta: base de tudo</h2>
<p>Para a maioria dos treinos, uma boa camiseta Dry Fit resolve. Procure:</p>
<ul>
<li><strong>Tecido de poliéster ou nylon</strong> — afasta o suor da pele</li>
<li><strong>Corte não restritivo</strong> — liberdade de movimento nos ombros</li>
<li><strong>Costura plana</strong> — evita irritação com o atrito</li>
<li><strong>Tecnologia antimicrobiana</strong> — controla odores</li>
</ul>
<p>Evite algodão para treinos intensos — absorve e retém suor, causando desconforto.</p>

<h2>Short ou legging?</h2>
<p>Depende do tipo de treino e preferência pessoal:</p>
<ul>
<li><strong>Short</strong> — ideal para treinos de membros inferiores e cardio. Maior ventilação.</li>
<li><strong>Legging com compressão</strong> — melhora circulação, reduz vibração muscular e dá suporte nas articulações. Ótimo para corrida e treinos longos.</li>
</ul>

<h2>Calçado</h2>
<p>O calçado é a peça mais crítica e mais negligenciada. Para musculação, prefira tênis com sola plana e base firme (como All Star ou tênis específicos de treino) — eles transmitem melhor a força para o chão nos agachamentos e levantamentos. Para corrida, invista num tênis com amortecimento adequado ao seu tipo de pisada.</p>

<h2>Acessórios que fazem diferença</h2>
<ul>
<li><strong>Luva de treino:</strong> protege a palma da mão em exercícios com barra e halteres, melhora a aderência</li>
<li><strong>Cinto lombar:</strong> suporte extra na coluna para cargas pesadas</li>
<li><strong>Boné:</strong> controle do suor no rosto, especialmente em treinos ao ar livre</li>
<li><strong>Shaker de qualidade:</strong> facilita a hidratação e a suplementação durante e após o treino</li>
</ul>

<h2>Dica final</h2>
<p>Priorize sempre funcionalidade sobre moda. Mas quando você encontra peças que entregam os dois — como as da linha Pitbull Wear — não há razão para abrir mão do estilo.</p>`,
  },
  {
    title: 'Nutrição pós-treino: o que comer para maximizar a recuperação',
    slug: 'nutricao-pos-treino-maximizar-recuperacao',
    excerpt: 'A janela anabólica existe? O que comer depois do treino? Proteína, carboidrato ou os dois? A ciência moderna responde de forma definitiva.',
    cover_url: IMG.blog6,
    published: true,
    content: `<h2>Por que a nutrição pós-treino importa?</h2>
<p>Durante o treino de força, as fibras musculares sofrem microlesões. O processo de recuperação e adaptação (hipertrofia) acontece nas horas e dias seguintes. A nutrição pós-treino fornece os "tijolos" (aminoácidos) e o "combustível" (glicogênio) para que essa reconstrução aconteça de forma ótima.</p>

<h2>A tal da janela anabólica</h2>
<p>Por muito tempo, acreditou-se que havia uma "janela anabólica" de 30 minutos após o treino — e que perdê-la causaria catabolismo. A pesquisa moderna é mais tranquilizadora: a janela existe, mas ela dura <strong>várias horas</strong> após o exercício, não apenas 30 minutos. O mais importante é o total de proteína ao longo do dia, não o timing preciso.</p>

<h2>O que priorizar depois do treino?</h2>
<h3>Proteína — obrigatório</h3>
<p>Consuma entre 20 e 40g de proteína de alta qualidade após o treino. O Whey Protein é ideal pela absorção rápida, mas frango, ovos, atum ou qualquer fonte proteica de qualidade funcionam igualmente bem se ingeridos em até 2 horas após o treino.</p>

<h3>Carboidrato — importante para repor glicogênio</h3>
<p>Após treinos intensos, os estoques de glicogênio muscular estão parcialmente depletados. Consumir carboidratos junto com a proteína melhora a recuperação e potencializa a síntese proteica. Ótimas opções: arroz, batata-doce, frutas, aveia ou maltodextrina no shake.</p>

<h3>Hidratação</h3>
<p>Repor os líquidos perdidos pelo suor é fundamental. Para cada hora de treino intenso, perdem-se entre 500ml e 1L de suor. Água com eletrólitos (sódio e potássio) é a opção mais eficiente.</p>

<h2>Exemplo de refeição pós-treino</h2>
<ul>
<li>1 dose de Whey Protein (30g) + 1 banana</li>
<li>Ou: 150g de frango grelhado + 200g de arroz branco + salada</li>
<li>Ou: 4 ovos mexidos + 2 fatias de pão integral + 1 fruta</li>
</ul>

<h2>Conclusão</h2>
<p>Simplifique: coma uma refeição equilibrada com proteína de qualidade e carboidratos nas 2 horas após o treino, mantenha-se hidratado e garanta proteína suficiente ao longo de todo o dia. Isso é o suficiente para a grande maioria das pessoas maximizar a recuperação e o crescimento muscular.</p>`,
  },
]

// ── Seed ──────────────────────────────────────────────
async function seed() {
  console.log('\n🚀  Iniciando seed...\n')

  // 1. Categorias
  console.log('📂  Categorias...')
  const { data: cats, error: catErr } = await db
    .from('categories')
    .upsert(CATEGORIES, { onConflict: 'slug' })
    .select()
  if (catErr) fatal('Categorias: ' + catErr.message)
  const catMap = new Map(cats.map(c => [c.slug, c.id]))
  log(`${cats.length} categorias upsertadas`)

  // 2. Produtos
  console.log('\n📦  Produtos...')
  const ts = now()
  const productRows = PRODUCTS.map(({ catSlug, ...p }) => ({
    ...p,
    slug: p.slug || slugify(p.name),
    category_id: catMap.get(catSlug) || null,
    gallery_urls: p.gallery_urls || [],
    objective_tags: p.objective_tags || [],
    created_at: ts,
    updated_at: ts,
  }))

  let { data: inserted, error: prodErr } = await db
    .from('products')
    .upsert(productRows, { onConflict: 'slug' })
    .select('id, name')

  if (prodErr?.message?.includes('subcategory')) {
    warn('Coluna subcategory ausente — tentando sem ela')
    const rows = productRows.map(r => { const c = { ...r }; delete c.subcategory; return c })
    const r2 = await db.from('products').upsert(rows, { onConflict: 'slug' }).select('id, name')
    if (r2.error) fatal('Produtos: ' + r2.error.message)
    inserted = r2.data
  } else if (prodErr) {
    fatal('Produtos: ' + prodErr.message)
  }

  log(`${inserted.length} produtos upsertados`)
  inserted.forEach(p => console.log('    ·', p.name))

  // 3. Blog
  console.log('\n📝  Blog posts...')
  const blogRows = POSTS.map(p => ({
    ...p,
    slug: p.slug || slugify(p.title),
    published_at: p.published ? now() : null,
    created_at: now(),
    updated_at: now(),
  }))

  const { data: posts, error: blogErr } = await db
    .from('blog_posts')
    .upsert(blogRows, { onConflict: 'slug' })
    .select('id, title')

  if (blogErr) fatal('Blog: ' + blogErr.message)
  log(`${posts.length} posts upsertados`)
  posts.forEach(p => console.log('    ·', p.title))

  console.log('\n✅  Seed concluído!\n')
}

seed().catch(err => { console.error('\n❌', err.message); process.exit(1) })
