import { access, mkdir, readFile, writeFile } from 'node:fs/promises'
import { extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const PUBLIC_DIR = join(ROOT, 'public', 'demo-vehicles')
const DATA_FILE = join(ROOT, 'src', 'data', 'demoVehicles.js')
const ATTRIBUTIONS_FILE = join(ROOT, 'ASSET_ATTRIBUTIONS.md')

const COMMONS_API = 'https://commons.wikimedia.org/w/api.php'

const DEMO_CATEGORIES = [
  { name: 'Sedans', slug: 'sedans', type: 'suplemento' },
  { name: 'Hatches', slug: 'hatches', type: 'suplemento' },
  { name: 'SUVs', slug: 'suvs', type: 'suplemento' },
  { name: 'Picapes', slug: 'picapes', type: 'suplemento' },
  { name: 'Motos', slug: 'motos', type: 'vestuario' },
  { name: 'Acessorios automotivos', slug: 'acessorios-automotivos', type: 'acessorio' },
]

const LEGACY_DEMO_CATEGORY_SLUGS = ['garrafas', 'xicaras', 'combos']
const LEGACY_DEMO_PRODUCT_SLUGS = [
  'chevrolet-onix-ltz-turbo-2023',
  'honda-cg-160-fan-2023',
]

const POSTS = [
  {
    title: 'Como escolher um seminovo com seguranca',
    slug: 'como-escolher-seminovo-com-seguranca',
    excerpt: 'Veja pontos essenciais para avaliar procedencia, estado geral e documentacao antes de negociar.',
    content: '<p>Antes de fechar negocio, avalie historico de manutencao, documentacao, estado de pneus, pintura, motor e cambio.</p><p>Na duvida, fale com a equipe e solicite mais detalhes do veiculo.</p>',
    cover_url: '',
    published: true,
  },
  {
    title: 'Documentacao necessaria para comprar um veiculo',
    slug: 'documentacao-necessaria-para-comprar-veiculo',
    excerpt: 'Confira os principais documentos e cuidados antes de fechar negocio.',
    content: '<p>Antes da compra, confira documento do veiculo, debitos, multas, licenciamento, comunicacao de venda e dados do vendedor.</p><p>Uma conferencia cuidadosa evita atrasos e torna a transferencia mais tranquila.</p>',
    cover_url: '',
    published: true,
  },
  {
    title: 'Financiamento ou pagamento a vista',
    slug: 'financiamento-ou-pagamento-a-vista',
    excerpt: 'Entenda vantagens de cada caminho e escolha a melhor forma de negociar seu proximo veiculo.',
    content: '<p>Pagamento a vista pode abrir margem de negociacao. Financiamento ajuda a preservar capital e organizar parcelas.</p><p>Compare taxas, entrada, prazo e custo total antes de decidir.</p>',
    cover_url: '',
    published: true,
  },
  {
    title: 'O que observar no test-drive',
    slug: 'o-que-observar-no-test-drive',
    excerpt: 'Veja sinais importantes durante a avaliacao pratica do veiculo.',
    content: '<p>No test-drive, observe partida, ruidos, freios, alinhamento, cambio, suspensao, ar-condicionado e funcionamento dos comandos.</p><p>Tambem vale testar em baixa velocidade e em vias com diferentes pisos.</p>',
    cover_url: '',
    published: true,
  },
]

const PRODUCTS = [
  {
    name: 'Honda Civic EXL 2020',
    slug: 'honda-civic-exl-2020',
    type: 'suplemento',
    categorySlug: 'sedans',
    subcategory: 'Sedan',
    brand: 'Honda',
    price: 114700,
    promo_price: 109900,
    stock: 1,
    objective_tags: ['ganho_massa', 'saude_geral'],
    is_featured: true,
    description: 'Sedan automatico com bom pacote de conforto, motor eficiente, porta-malas amplo e acabamento refinado. Catalogo demo com imagens reais de referencia do modelo.',
    files: [
      'Honda Civic (1Y7A1724).jpg',
      '2017 Honda Civic Si Sedan in Lunar Silver.png',
      'Honda Civic, GIMS 2019, Le Grand-Saconnex (GIMS0704).jpg',
      'Honda Civic Sedan VTi.jpg',
    ],
  },
  {
    name: 'Toyota Corolla XEi 2021',
    slug: 'toyota-corolla-xei-2021',
    type: 'suplemento',
    categorySlug: 'sedans',
    subcategory: 'Sedan',
    brand: 'Toyota',
    price: 128900,
    promo_price: null,
    stock: 1,
    objective_tags: ['ganho_massa', 'saude_geral'],
    is_featured: true,
    description: 'Sedan reconhecido por conforto, confiabilidade e liquidez. Boa escolha para familia, rotina urbana e viagens com baixo custo de manutencao.',
    files: [
      'Toyota Corolla E210 sedan variation.jpg',
      '2020 Toyota Corolla LE sedan.jpg',
      '2020 Toyota Corolla LE 12-13-2019.jpg',
      '2020 Toyota Corolla SE 2.0L sedan, 12.28.19.jpg',
    ],
  },
  {
    name: 'Chevrolet Cruze LTZ 2020',
    slug: 'chevrolet-cruze-ltz-2020',
    type: 'suplemento',
    categorySlug: 'sedans',
    subcategory: 'Sedan',
    brand: 'Chevrolet',
    price: 94900,
    promo_price: 91900,
    stock: 1,
    objective_tags: ['emagrecimento'],
    is_featured: true,
    description: 'Sedan medio com proposta moderna, bom desempenho, equipamentos de conforto e visual elegante. Ideal para quem busca dirigibilidade e tecnologia.',
    files: [
      'Chevrolet Cruze Back P4250805.jpg',
      'Chevrolet Cruze (third generation) 1X7A0417.jpg',
      '2010 Chevrolet Cruze Sedan 1.8 LT (Rear).jpg',
      '2010 Chevrolet Cruze Sedan 1.8 LT (Front).jpg',
    ],
  },
  {
    name: 'Jeep Compass Longitude 2022',
    slug: 'jeep-compass-longitude-2022',
    type: 'suplemento',
    categorySlug: 'suvs',
    subcategory: 'SUV',
    brand: 'Jeep',
    price: 149900,
    promo_price: 145900,
    stock: 1,
    objective_tags: ['ganho_massa', 'saude_geral'],
    is_featured: true,
    description: 'SUV com posicao elevada de dirigir, acabamento sofisticado e otimo espaco interno. Ideal para quem busca conforto, presenca e versatilidade.',
    files: [
      'Jeep Compass MK facelift Shishi 01 2022-03-03.jpg',
      'Jeep Compass MK facelift Shishi 02 2022-03-03.jpg',
      'JEEP COMPASS (MP) China.jpg',
      'Jeep Compass MP Shishi 02 2022-05-18.jpg',
    ],
  },
  {
    name: 'Fiat Toro Volcano 2022',
    slug: 'fiat-toro-volcano-2022',
    type: 'suplemento',
    categorySlug: 'picapes',
    subcategory: 'Picape',
    brand: 'Fiat',
    price: 139900,
    promo_price: null,
    stock: 1,
    objective_tags: ['recuperacao'],
    is_featured: true,
    description: 'Picape versatil para trabalho e lazer, com bom pacote de equipamentos, visual robusto e cacamba pratica para a rotina.',
    files: [
      'Fiat Toro (r).png',
      'Fiat Toro Freedom 4x2 (r).png',
      'Fiat Toro Freedom front (r).png',
      'Fiat Toro Volcano front.jpg',
    ],
  },
  {
    name: 'Ford Ranger Stormtrak 2023',
    slug: 'ford-ranger-stormtrak-2023',
    type: 'suplemento',
    categorySlug: 'picapes',
    subcategory: 'Picape',
    brand: 'Ford',
    price: 239900,
    promo_price: 229900,
    stock: 1,
    objective_tags: ['recuperacao', 'saude_geral'],
    is_featured: true,
    description: 'Picape robusta com perfil premium, cabine ampla, boa capacidade de carga e conjunto indicado para estrada, campo e uso profissional.',
    files: [
      'Ford Ranger Stormtrak (T6, P375) 1X7A0369.jpg',
      'Ford Ranger Stormtrak (T6, P375) 1X7A0319.jpg',
      'Ford Ranger Wildtrak (T6, P375) 1X7A6170.jpg',
      'Ford Ranger Wildtrak (T6, P375) 1X7A6173.jpg',
    ],
  },
  {
    name: 'Yamaha MT-03 ABS 2024',
    slug: 'yamaha-mt-03-abs-2024',
    type: 'vestuario',
    categorySlug: 'motos',
    subcategory: 'Naked',
    brand: 'Yamaha',
    price: 31900,
    promo_price: 29900,
    stock: 1,
    objective_tags: ['emagrecimento'],
    is_featured: true,
    description: 'Naked de media cilindrada com pilotagem agil, visual agressivo e boa resposta para uso urbano e passeios de fim de semana.',
    files: [
      'JGSDF Police Motorcycle (YAMAHA MT-03, 11-0476) right side view at Camp Uji September 14, 2024.jpg',
      'JGSDF Police Motorcycle (YAMAHA MT-03, 11-0476) left front view at Camp Uji September 14, 2024.jpg',
      'JGSDF Police Motorcycle (YAMAHA MT-03, 11-0476) behind view at Camp Uji September 14, 2024.jpg',
      'JGSDF Police Motorcycle (YAMAHA MT-03, 11-0476) front view at Camp Uji September 14, 2024.jpg',
    ],
  },
  {
    name: 'BMW R 1200 GS 2018',
    slug: 'bmw-r-1200-gs-2018',
    type: 'vestuario',
    categorySlug: 'motos',
    subcategory: 'Trail',
    brand: 'BMW',
    price: 64900,
    promo_price: null,
    stock: 1,
    objective_tags: ['recuperacao', 'saude_geral'],
    is_featured: true,
    description: 'Maxtrail consagrada para longas viagens, com ergonomia confortavel, porte imponente e conjunto pronto para asfalto e aventura.',
    files: [
      'BMW R 1200 GS 30 Years GS Edition 2010.JPG',
      'BMW R 1200 GS UME.JPG',
      'BMW R 1200 GS K50 2013.jpg',
      'Paris - Salon de la moto 2011 - BMW - R 1200 GS Adventure - 001.jpg',
    ],
  },
  {
    name: 'Ducati Monster 696 2012',
    slug: 'ducati-monster-696-2012',
    type: 'vestuario',
    categorySlug: 'motos',
    subcategory: 'Naked',
    brand: 'Ducati',
    price: 32900,
    promo_price: 31500,
    stock: 1,
    objective_tags: ['ganho_massa'],
    is_featured: false,
    description: 'Naked italiana com estilo marcante, proposta esportiva e ciclistica envolvente. Boa opcao para quem busca personalidade.',
    files: [
      'Monster 696.JPG',
      'Ducati Monster - black.jpg',
      'Ducati Monster - black (2).jpg',
      'Ducati Monster 696, 2012.jpg',
    ],
  },
  {
    name: 'Triumph Tiger 800 XC 2015',
    slug: 'triumph-tiger-800-xc-2015',
    type: 'vestuario',
    categorySlug: 'motos',
    subcategory: 'Trail',
    brand: 'Triumph',
    price: 49900,
    promo_price: 47900,
    stock: 1,
    objective_tags: ['recuperacao'],
    is_featured: false,
    description: 'Trail de media-alta cilindrada com pegada aventureira, motor forte e conforto para viagens mais longas.',
    files: [
      'Triumph Tiger 800 XC black.jpg',
      'Triumph Tiger 800XC.jpg',
      'Triumph Tiger 800 MY 2012.jpg',
      'Triumph Tiger 800 MY 2012 side view.jpg',
    ],
  },
  {
    name: 'Honda CBR 500R 2018',
    slug: 'honda-cbr-500r-2018',
    type: 'vestuario',
    categorySlug: 'motos',
    subcategory: 'Sport',
    brand: 'Honda',
    price: 33900,
    promo_price: null,
    stock: 1,
    objective_tags: ['ganho_massa', 'emagrecimento'],
    is_featured: false,
    description: 'Esportiva bicilindrica equilibrada, indicada para quem quer visual carenado, confiabilidade e pilotagem acessivel.',
    files: [
      'Salon de la Moto et du Scooter de Paris 2013 - Honda - CBR 500R - 001.jpg',
      'Salon de la Moto et du Scooter de Paris 2013 - Honda - CBR 500R - 002.jpg',
      'Salon de la Moto et du Scooter de Paris 2013 - Honda - CBR 500R - 003.jpg',
      'Salon de la Moto et du Scooter de Paris 2013 - Honda - CBR 500R - 004.jpg',
    ],
  },
  {
    name: 'Kawasaki Z650 ABS 2020',
    slug: 'kawasaki-z650-abs-2020',
    type: 'vestuario',
    categorySlug: 'motos',
    subcategory: 'Naked',
    brand: 'Kawasaki',
    price: 39900,
    promo_price: 37900,
    stock: 1,
    objective_tags: ['saude_geral'],
    is_featured: false,
    description: 'Naked de visual esportivo, motor bicilindrico e boa ergonomia para uso misto entre cidade e estrada.',
    files: [
      'Kawasaki Z 650 MY 2017.jpg',
      'Kawasaki Z650.jpg',
      'Kawasaki Z650 (40539440931).jpg',
      'Kawasaki Z650 schwarz 2020.jpg',
    ],
  },
]

function sqlString(value) {
  if (value === null || value === undefined) return 'null'
  return `'${String(value).replaceAll("'", "''")}'`
}

function js(value) {
  return JSON.stringify(value, null, 2)
}

function stripHtml(value = '') {
  return value.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#039;/g, "'").trim()
}

function chunk(list, size) {
  const chunks = []
  for (let index = 0; index < list.length; index += size) chunks.push(list.slice(index, index + size))
  return chunks
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function extensionFromUrl(url, fallback = '.jpg') {
  const clean = decodeURIComponent(url.split('?')[0])
  const ext = extname(clean).toLowerCase()
  return ext && ext.length <= 6 ? ext : fallback
}

async function fetchCommonsInfo(fileTitles) {
  const pages = new Map()

  for (const group of chunk(fileTitles, 12)) {
    const params = new URLSearchParams({
      action: 'query',
      format: 'json',
      origin: '*',
      prop: 'imageinfo',
      iiprop: 'url|mime|extmetadata',
      iiurlwidth: '1200',
      titles: group.map((title) => `File:${title}`).join('|'),
    })
    const response = await fetch(`${COMMONS_API}?${params}`, {
      headers: { 'user-agent': 'DigitalVeiculosDemo/1.0 (asset preparation)' },
    })
    const payload = await response.json()

    for (const page of Object.values(payload.query?.pages || {})) {
      if (page.missing || !page.imageinfo?.[0]?.thumburl) {
        throw new Error(`Imagem nao encontrada no Commons: ${page.title}`)
      }
      pages.set(page.title.replace(/^File:/, ''), page)
    }
  }

  return pages
}

async function download(url, destination) {
  try {
    await access(destination)
    return
  } catch {
    // File is not present yet; continue with download.
  }

  for (let attempt = 1; attempt <= 5; attempt += 1) {
    const response = await fetch(url, {
      headers: { 'user-agent': 'DigitalVeiculosDemo/1.0 (asset preparation)' },
    })
    if (response.ok) {
      const buffer = Buffer.from(await response.arrayBuffer())
      await writeFile(destination, buffer)
      return
    }

    if (response.status !== 429 || attempt === 5) {
      throw new Error(`Falha ao baixar ${url}: ${response.status}`)
    }

    await sleep(attempt * 3500)
  }
}

function buildProductData(products, imagePathsBySlug) {
  return products.map(({ files, ...product }) => {
    const paths = imagePathsBySlug.get(product.slug)
    return {
      ...product,
      image_url: paths[0],
      gallery_urls: paths.slice(1),
      is_active: true,
    }
  })
}

function buildDataModule(products) {
  return `export const DEMO_CATEGORIES = ${js(DEMO_CATEGORIES)}

export const LEGACY_DEMO_CATEGORY_SLUGS = ${js(LEGACY_DEMO_CATEGORY_SLUGS)}

export const LEGACY_DEMO_PRODUCT_SLUGS = ${js(LEGACY_DEMO_PRODUCT_SLUGS)}

export const DEMO_PRODUCTS = ${js(products)}

export const DEMO_POSTS = ${js(POSTS)}
`
}

function buildSeedSql(products) {
  const categoryRows = DEMO_CATEGORIES.map((category) => (
    `  (${sqlString(category.name)}, ${sqlString(category.slug)}, ${sqlString(category.type)}, true)`
  )).join(',\n')

  const productRows = products.map((product) => `(
  ${sqlString(product.name)},
  ${sqlString(product.slug)},
  ${sqlString(product.type)}, (select id from categories where slug = ${sqlString(product.categorySlug)}), ${sqlString(product.subcategory)},
  ${sqlString(product.description)},
  ${sqlString(product.brand)}, ${product.price}, ${product.promo_price ?? 'null'}, ${product.stock},
  ${sqlString(product.image_url)}, ${sqlString(JSON.stringify(product.gallery_urls))}::jsonb, array[${product.objective_tags.map(sqlString).join(',')}],
  true, ${product.is_featured ? 'true' : 'false'}, now(), now()
)`).join(',\n')

  const postRows = POSTS.map((post) => `(
  ${sqlString(post.title)},
  ${sqlString(post.slug)},
  ${sqlString(post.excerpt)},
  ${sqlString(post.content)},
  ${sqlString(post.cover_url)}, ${post.published ? 'true' : 'false'}, now()
)`).join(',\n')

  return `-- Digital Veiculos - Seed demo
-- Cole no Supabase SQL Editor e execute.

insert into categories (name, slug, type, is_active)
values
${categoryRows}
on conflict (slug) do update
  set name = excluded.name,
      type = excluded.type,
      is_active = true;

update categories
set is_active = false
where slug in (${LEGACY_DEMO_CATEGORY_SLUGS.map(sqlString).join(', ')});

update products
set is_active = false,
    updated_at = now()
where slug in (${LEGACY_DEMO_PRODUCT_SLUGS.map(sqlString).join(', ')});

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
${productRows}
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
${postRows}
on conflict (slug) do update
set title = excluded.title,
    excerpt = excluded.excerpt,
    content = excluded.content,
    cover_url = excluded.cover_url,
    published = excluded.published,
    published_at = excluded.published_at;
`
}

function buildAttributions(products, commonsPages) {
  const lines = [
    '# Atribuicoes de imagens demo',
    '',
    'As imagens em `public/demo-vehicles` foram baixadas do Wikimedia Commons em miniatura local para uso no catalogo demonstrativo.',
    '',
  ]

  for (const product of products) {
    lines.push(`## ${product.name}`, '')
    for (const title of product.files) {
      const info = commonsPages.get(title).imageinfo[0]
      const meta = info.extmetadata || {}
      const license = stripHtml(meta.LicenseShortName?.value || meta.License?.value || 'Licenca nao informada')
      const author = stripHtml(meta.Artist?.value || meta.Credit?.value || 'Autor nao informado')
      const source = meta.ObjectName?.value
        ? `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(title).replaceAll('%20', '_')}`
        : info.descriptionurl
      lines.push(`- ${title} - ${license} - ${author} - ${source}`)
    }
    lines.push('')
  }

  return `${lines.join('\n')}\n`
}

async function replaceSchemaSeed(seedSql) {
  const schemaPath = join(ROOT, 'supabase', 'schema.sql')
  const schema = await readFile(schemaPath, 'utf8')
  const marker = '-- Digital Veiculos demo data'
  const index = schema.indexOf(marker)
  if (index === -1) throw new Error('Marcador de seed nao encontrado em supabase/schema.sql')
  const nextSchema = `${schema.slice(0, index)}${marker}\n${seedSql}`
  await writeFile(schemaPath, nextSchema)
}

async function main() {
  await mkdir(PUBLIC_DIR, { recursive: true })

  const fileTitles = [...new Set(PRODUCTS.flatMap((product) => product.files))]
  const commonsPages = await fetchCommonsInfo(fileTitles)
  const imagePathsBySlug = new Map()

  for (const product of PRODUCTS) {
    const paths = []
    for (const [index, title] of product.files.entries()) {
      const info = commonsPages.get(title).imageinfo[0]
      const ext = extensionFromUrl(info.thumburl)
      const publicPath = `/demo-vehicles/${product.slug}-${String(index + 1).padStart(2, '0')}${ext}`
      const destination = join(PUBLIC_DIR, `${product.slug}-${String(index + 1).padStart(2, '0')}${ext}`)
      await download(info.thumburl, destination)
      await sleep(450)
      paths.push(publicPath)
    }
    imagePathsBySlug.set(product.slug, paths)
  }

  const products = buildProductData(PRODUCTS, imagePathsBySlug)
  const seedSql = buildSeedSql(products)

  await writeFile(DATA_FILE, buildDataModule(products))
  await writeFile(join(ROOT, 'scripts', 'seed.sql'), seedSql)
  await writeFile(join(ROOT, 'supabase', 'seed-demo-content.sql'), seedSql)
  await replaceSchemaSeed(seedSql)
  await writeFile(ATTRIBUTIONS_FILE, buildAttributions(PRODUCTS, commonsPages))

  console.log(`Catalogo demo preparado com ${products.length} veiculos e ${fileTitles.length} imagens.`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
