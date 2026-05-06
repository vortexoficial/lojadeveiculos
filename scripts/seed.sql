-- =============================================================
-- PITBULL SUPLEMENTOS — Seed completo
-- Cole no Supabase → SQL Editor → Run
-- =============================================================

-- ── 1. CATEGORIAS ────────────────────────────────────────────
INSERT INTO categories (name, slug, type, is_active)
VALUES
  ('Proteínas',   'proteinas',   'suplemento', true),
  ('Creatinas',   'creatinas',   'suplemento', true),
  ('Pré-treinos', 'pre-treinos', 'suplemento', true),
  ('Vitaminas',   'vitaminas',   'suplemento', true),
  ('Snacks',      'snacks',      'suplemento', true),
  ('Queimadores', 'queimadores', 'suplemento', true),
  ('Vestuário',   'vestuario',   'vestuario',  true),
  ('Acessórios',  'acessorios',  'acessorio',  true)
ON CONFLICT (slug) DO UPDATE
  SET name = EXCLUDED.name, is_active = true;

-- ── 2. PRODUTOS ──────────────────────────────────────────────
-- Macro para pegar o id de uma categoria pelo slug
-- (usamos subquery inline abaixo)

INSERT INTO products (
  name, slug, type, category_id, subcategory,
  description, brand,
  price, promo_price, stock,
  image_url, gallery_urls, objective_tags,
  is_active, is_featured,
  created_at, updated_at
)
VALUES

-- ── PROTEÍNAS ─────────────────────────────────────────────────

(
  'Whey Protein Concentrado 900g — Baunilha',
  'whey-protein-concentrado-900g-baunilha',
  'suplemento',
  (SELECT id FROM categories WHERE slug = 'proteinas'),
  'Whey',
  'Whey Protein Concentrado com 24g de proteína por dose, 5,4g de BCAA e 4g de Glutamina naturais. Sabor baunilha cremosa, mistura fácil em água ou leite. Ideal para ganho muscular e recuperação pós-treino. 30 doses por pote.',
  'Pitbull Nutrition',
  159.90, 139.90, 25,
  '/product-images/whey-protein.webp',
  ARRAY[
    'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=900&h=900&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=900&h=900&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=900&h=900&fit=crop&auto=format'
  ],
  ARRAY['ganho_massa','recuperacao'],
  true, true, now(), now()
),

(
  'Whey Protein Concentrado 900g — Chocolate',
  'whey-protein-concentrado-900g-chocolate',
  'suplemento',
  (SELECT id FROM categories WHERE slug = 'proteinas'),
  'Whey',
  'Whey Protein Concentrado com 24g de proteína por dose. Sabor chocolate intenso, sem açúcar adicionado. Mistura instantânea. Perfeito para o pós-treino ou como lanche proteico ao longo do dia.',
  'Pitbull Nutrition',
  159.90, null, 20,
  '/product-images/whey-protein.webp',
  ARRAY[
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=900&h=900&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=900&h=900&fit=crop&auto=format'
  ],
  ARRAY['ganho_massa','recuperacao'],
  true, false, now(), now()
),

(
  'BCAA 2:1:1 — 200 Cápsulas',
  'bcaa-211-200-capsulas',
  'suplemento',
  (SELECT id FROM categories WHERE slug = 'proteinas'),
  'BCAA',
  'BCAA na proporção científica 2:1:1 (Leucina, Isoleucina e Valina). Reduz catabolismo muscular, acelera a recuperação e melhora a síntese proteica. 200 cápsulas de 1000mg. Livre de corantes e conservantes.',
  'Pitbull Nutrition',
  79.90, null, 30,
  '/product-images/bcaa.webp',
  ARRAY[
    'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=900&h=900&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=900&h=900&fit=crop&auto=format'
  ],
  ARRAY['recuperacao','ganho_massa'],
  true, true, now(), now()
),

(
  'Hipercalórico Mass Power 3kg — Chocolate',
  'hipercalorico-mass-power-3kg-chocolate',
  'suplemento',
  (SELECT id FROM categories WHERE slug = 'proteinas'),
  'Hipercalórico',
  'Hipercalórico com 1200 kcal por dose, 40g de proteína e 220g de carboidratos complexos. Fórmula enriquecida com vitaminas e minerais. Ideal para quem tem dificuldade em ganhar peso. Sabor Chocolate. 40 doses.',
  'Pitbull Nutrition',
  219.90, 189.90, 15,
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&h=900&fit=crop&auto=format',
  ARRAY[
    'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=900&h=900&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=900&h=900&fit=crop&auto=format'
  ],
  ARRAY['ganho_massa'],
  true, true, now(), now()
),

(
  'Albumina Pura 500g — Sem Sabor',
  'albumina-pura-500g-sem-sabor',
  'suplemento',
  (SELECT id FROM categories WHERE slug = 'proteinas'),
  'Albumina',
  'Albumina 100% pura, proteína de alta qualidade derivada da clara do ovo. Rica em aminoácidos essenciais e absorção progressiva. 30g de proteína por 40g de produto. Sem adicionados.',
  'Pitbull Nutrition',
  59.90, null, 35,
  'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=900&h=900&fit=crop&auto=format',
  ARRAY[
    'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=900&h=900&fit=crop&auto=format'
  ],
  ARRAY['ganho_massa','recuperacao'],
  true, false, now(), now()
),

-- ── CREATINAS ─────────────────────────────────────────────────

(
  'Creatina Monohidratada 300g',
  'creatina-monohidratada-300g',
  'suplemento',
  (SELECT id FROM categories WHERE slug = 'creatinas'),
  'Creatina',
  'Creatina Monohidratada micronizada, 100% pura, sem aditivos. O suplemento mais estudado da ciência esportiva. Aumenta força, potência e volume muscular. 60 doses de 5g. Mistura instantânea.',
  'Pitbull Nutrition',
  89.90, null, 40,
  '/product-images/creatina.webp',
  ARRAY[
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&h=900&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=900&h=900&fit=crop&auto=format'
  ],
  ARRAY['energia','ganho_massa'],
  true, true, now(), now()
),

(
  'Creatina HCL 120 Cápsulas',
  'creatina-hcl-120-capsulas',
  'suplemento',
  (SELECT id FROM categories WHERE slug = 'creatinas'),
  'Creatina',
  'Creatina Cloridrato (HCL) com maior solubilidade e absorção. Sem retenção hídrica excessiva, sem fase de carga. 120 cápsulas de 750mg. Praticidade para quem prefere cápsula ao pó.',
  'Pitbull Nutrition',
  99.90, 84.90, 22,
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&h=900&fit=crop&auto=format',
  ARRAY[
    'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=900&h=900&fit=crop&auto=format'
  ],
  ARRAY['energia','ganho_massa'],
  true, false, now(), now()
),

-- ── PRÉ-TREINOS ───────────────────────────────────────────────

(
  'Pré-Treino Explosive Energy 300g — Frutas Vermelhas',
  'pre-treino-explosive-energy-300g-frutas-vermelhas',
  'suplemento',
  (SELECT id FROM categories WHERE slug = 'pre-treinos'),
  'Pré-treino',
  'Pré-treino com 300mg de cafeína, 6g de Citrulina Malato, 3,2g de Beta-alanina e 2g de Arginina. Fórmula completa para máximo foco, energia explosiva e pump intenso. 30 doses. Sabor Frutas Vermelhas.',
  'Pitbull Nutrition',
  129.90, 109.90, 18,
  '/product-images/pre-treino.webp',
  ARRAY[
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&h=900&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&h=900&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=900&h=900&fit=crop&auto=format'
  ],
  ARRAY['energia'],
  true, true, now(), now()
),

(
  'Pré-Treino Dark Storm 300g — Limão Siciliano',
  'pre-treino-dark-storm-300g-limao',
  'suplemento',
  (SELECT id FROM categories WHERE slug = 'pre-treinos'),
  'Pré-treino',
  'Fórmula avançada com 400mg de cafeína, 8g de Citrulina Malato, 4g de Beta-alanina e Nootrópicos. Para atletas experientes. 30 doses. Sabor Limão Siciliano.',
  'Horse Power',
  149.90, null, 12,
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&h=900&fit=crop&auto=format',
  ARRAY[
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&h=900&fit=crop&auto=format'
  ],
  ARRAY['energia'],
  true, false, now(), now()
),

-- ── VITAMINAS ─────────────────────────────────────────────────

(
  'Vitamina D3 + K2 MK-7 — 60 Cápsulas',
  'vitamina-d3-k2-mk7-60-capsulas',
  'suplemento',
  (SELECT id FROM categories WHERE slug = 'vitaminas'),
  'Vitaminas',
  'Vitamina D3 2000 UI com K2 MK-7 100mcg. Suporte imunológico, saúde óssea, hormonal e desempenho físico. Formulação oleosa de alta absorção. 60 cápsulas softgel.',
  'Pitbull Nutrition',
  49.90, 39.90, 50,
  '/product-images/vitamina-d.webp',
  ARRAY[
    'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=900&h=900&fit=crop&auto=format'
  ],
  ARRAY['saude_geral'],
  true, false, now(), now()
),

(
  'Ômega 3 TG Fish Oil 1000mg — 90 Cápsulas',
  'omega-3-tg-fish-oil-1000mg-90-capsulas',
  'suplemento',
  (SELECT id FROM categories WHERE slug = 'vitaminas'),
  'Ômega',
  'Ômega 3 em triglicerídeos (TG): 400mg EPA + 300mg DHA. Reduz inflamação, apoia saúde cardiovascular e função cognitiva. 90 cápsulas.',
  'Pitbull Nutrition',
  69.90, null, 35,
  '/product-images/omega3.webp',
  ARRAY[
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&h=900&fit=crop&auto=format'
  ],
  ARRAY['saude_geral'],
  true, false, now(), now()
),

-- ── SNACKS ────────────────────────────────────────────────────

(
  'Barra Proteica Dark Chocolate — Caixa 12 unidades',
  'barra-proteica-dark-chocolate-cx12',
  'suplemento',
  (SELECT id FROM categories WHERE slug = 'snacks'),
  'Barras',
  'Barra proteica com 20g de proteína, cobertura de chocolate amargo 70% cacau e apenas 8g de açúcar. Textura macia. Caixa com 12 unidades de 60g.',
  'Pitbull Snacks',
  99.90, 84.90, 22,
  '/product-images/barra-proteica.webp',
  ARRAY[
    'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=900&h=900&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=900&h=900&fit=crop&auto=format'
  ],
  ARRAY['saude_geral','recuperacao'],
  true, false, now(), now()
),

-- ── QUEIMADORES ───────────────────────────────────────────────

(
  'Termogênico Black Fire 120 Cápsulas',
  'termogenico-black-fire-120-capsulas',
  'suplemento',
  (SELECT id FROM categories WHERE slug = 'queimadores'),
  'Termogênico',
  'Termogênico com 300mg de cafeína, Chá Verde, Pimenta Caiena, Gengibre e L-Carnitina. Acelera o metabolismo e aumenta a queima de gordura. 120 cápsulas.',
  'Pitbull Nutrition',
  89.90, 74.90, 28,
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&h=900&fit=crop&auto=format',
  ARRAY[
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&h=900&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=900&h=900&fit=crop&auto=format'
  ],
  ARRAY['energia'],
  true, true, now(), now()
),

(
  'Glutamina Pura 300g',
  'glutamina-pura-300g',
  'suplemento',
  (SELECT id FROM categories WHERE slug = 'queimadores'),
  'Aminoácido',
  'L-Glutamina pura micronizada. Reduz catabolismo, fortalece o sistema imune e acelera a recuperação. 5g por dose, 60 doses. Sem sabor.',
  'Pitbull Nutrition',
  64.90, null, 30,
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&h=900&fit=crop&auto=format',
  ARRAY[
    'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=900&h=900&fit=crop&auto=format'
  ],
  ARRAY['recuperacao'],
  true, false, now(), now()
),

-- ── VESTUÁRIO ─────────────────────────────────────────────────

(
  'Camiseta Dry Fit Pitbull — Preta',
  'camiseta-dry-fit-pitbull-preta',
  'vestuario',
  (SELECT id FROM categories WHERE slug = 'vestuario'),
  'Camisetas',
  'Camiseta com tecnologia Dry Fit de secagem ultra-rápida. Tecido 100% poliéster leve e respirável. Logo Pitbull bordado no peito. Costuras reforçadas. Disponível em P, M, G e GG.',
  'Pitbull Wear',
  89.90, 74.90, 40,
  '/product-images/camiseta-fit.webp',
  ARRAY[
    'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=900&h=900&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=900&h=900&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1595341595379-87b41be92013?w=900&h=900&fit=crop&auto=format'
  ],
  ARRAY['energia'],
  true, true, now(), now()
),

(
  'Camiseta Dry Fit Pitbull — Branca',
  'camiseta-dry-fit-pitbull-branca',
  'vestuario',
  (SELECT id FROM categories WHERE slug = 'vestuario'),
  'Camisetas',
  'Camiseta Dry Fit na versão branca com logo Pitbull preto. Tecido com proteção UV 50+. Ideal para treinos ao ar livre. Disponível em P, M, G e GG.',
  'Pitbull Wear',
  89.90, null, 25,
  'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=900&h=900&fit=crop&auto=format',
  ARRAY[
    'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=900&h=900&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1595341595379-87b41be92013?w=900&h=900&fit=crop&auto=format'
  ],
  ARRAY['energia'],
  true, false, now(), now()
),

(
  'Short de Treino Pitbull Flex — Cinza',
  'short-treino-pitbull-flex-cinza',
  'vestuario',
  (SELECT id FROM categories WHERE slug = 'vestuario'),
  'Shorts',
  'Short de treino com tecido compressivo 4 vias, cintura elástica ajustável e bolso lateral com zíper. Corte ergonômico. Perfeito para musculação, corrida e funcional. P, M, G, GG.',
  'Pitbull Wear',
  74.90, null, 28,
  '/product-images/short-treino.webp',
  ARRAY[
    'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=900&h=900&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1595341595379-87b41be92013?w=900&h=900&fit=crop&auto=format'
  ],
  ARRAY['energia'],
  true, true, now(), now()
),

(
  'Regata Compressão Pitbull — Preta',
  'regata-compressao-pitbull-preta',
  'vestuario',
  (SELECT id FROM categories WHERE slug = 'vestuario'),
  'Regatas',
  'Regata com compressão leve que melhora a circulação e reduz a fadiga muscular. Tecido respirável com tecnologia anti-odor. Recortes laterais para ventilação. Disponível em P, M, G e GG.',
  'Pitbull Wear',
  69.90, 59.90, 20,
  'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&h=900&fit=crop&auto=format',
  ARRAY[
    'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=900&h=900&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=900&h=900&fit=crop&auto=format'
  ],
  ARRAY['energia'],
  true, false, now(), now()
),

(
  'Legging Performance Feminina — Preta',
  'legging-performance-feminina-preta',
  'vestuario',
  (SELECT id FROM categories WHERE slug = 'vestuario'),
  'Leggings',
  'Legging feminina de cintura alta com compressão média e tecido com fio de cobre anti-odor. Modelagem anatômica. Bolso embutido na cintura. Disponível em P, M, G e GG.',
  'Pitbull Wear',
  119.90, 99.90, 18,
  'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=900&h=900&fit=crop&auto=format',
  ARRAY[
    'https://images.unsplash.com/photo-1595341595379-87b41be92013?w=900&h=900&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=900&h=900&fit=crop&auto=format'
  ],
  ARRAY['energia'],
  true, true, now(), now()
),

(
  'Boné Pitbull Snapback — Preto',
  'bone-pitbull-snapback-preto',
  'vestuario',
  (SELECT id FROM categories WHERE slug = 'vestuario'),
  'Bonés',
  'Boné Snapback com aba reta e estrutura premium. Logo Pitbull bordado na frente. Fecho ajustável. Material resistente. Tamanho único.',
  'Pitbull Wear',
  59.90, null, 35,
  'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&h=900&fit=crop&auto=format',
  ARRAY[
    'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=900&h=900&fit=crop&auto=format'
  ],
  ARRAY[]::text[],
  true, false, now(), now()
),

(
  'Luva de Treino Premium — Par',
  'luva-treino-premium-par',
  'vestuario',
  (SELECT id FROM categories WHERE slug = 'vestuario'),
  'Acessórios',
  'Luva de treino com palma em couro sintético reforçado, dorso em neoprene respirável e velcro de ajuste. Proteção e aderência superiores. Tamanhos P, M, G.',
  'Pitbull Gear',
  79.90, 64.90, 22,
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&h=900&fit=crop&auto=format',
  ARRAY[
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&h=900&fit=crop&auto=format'
  ],
  ARRAY[]::text[],
  true, false, now(), now()
),

-- ── ACESSÓRIOS ────────────────────────────────────────────────

(
  'Garrafa Shaker Pro 700ml',
  'garrafa-shaker-pro-700ml',
  'acessorio',
  (SELECT id FROM categories WHERE slug = 'acessorios'),
  'Garrafas',
  'Shaker profissional com mola misturadora em aço inox, tampa rosca dupla e bico dosador. 700ml. Material Tritan livre de BPA. Escala de medição interna.',
  'Pitbull Gear',
  44.90, 34.90, 60,
  '/product-images/garrafa-shaker.webp',
  ARRAY[
    'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=900&h=900&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&h=900&fit=crop&auto=format'
  ],
  ARRAY['saude_geral'],
  true, false, now(), now()
)

ON CONFLICT (slug) DO UPDATE
  SET
    name         = EXCLUDED.name,
    description  = EXCLUDED.description,
    price        = EXCLUDED.price,
    promo_price  = EXCLUDED.promo_price,
    stock        = EXCLUDED.stock,
    image_url    = EXCLUDED.image_url,
    gallery_urls = EXCLUDED.gallery_urls,
    is_active    = EXCLUDED.is_active,
    is_featured  = EXCLUDED.is_featured,
    updated_at   = now();

-- ── 3. BLOG POSTS ────────────────────────────────────────────

INSERT INTO blog_posts (title, slug, excerpt, cover_url, published, published_at, content, created_at, updated_at)
VALUES

(
  'Como escolher o Whey Protein ideal para seus objetivos',
  'como-escolher-whey-protein-ideal',
  'Concentrado, isolado ou hidrolisado? Descubra qual Whey Protein se encaixa no seu treino e objetivo — e economize na hora de comprar.',
  'https://images.unsplash.com/photo-1581009137042-c552e485697a?w=1200&h=630&fit=crop&auto=format',
  true, now(),
  '<h2>O que é o Whey Protein?</h2>
<p>O Whey Protein é a proteína extraída do soro do leite durante a fabricação do queijo. É um dos suplementos mais estudados do mundo, com décadas de pesquisas comprovando sua eficácia para ganho muscular, recuperação e emagrecimento.</p>

<h2>Os 3 tipos de Whey</h2>
<h3>1. Whey Concentrado</h3>
<p>Contém entre 70% e 80% de proteína por dose, com pequenas quantidades de gordura e lactose. É o mais acessível e indicado para a maioria das pessoas que não têm intolerância à lactose. Ótima escolha para o pós-treino do dia a dia.</p>

<h3>2. Whey Isolado</h3>
<p>Passa por filtragem adicional que eleva o teor proteico para 90% ou mais, removendo praticamente toda a lactose e gordura. Ideal para intolerantes à lactose ou quem está em fase de definição muscular.</p>

<h3>3. Whey Hidrolisado</h3>
<p>As proteínas já foram pré-digeridas em peptídeos menores, acelerando ainda mais a absorção. É o mais caro dos três e indicado para atletas de alto rendimento.</p>

<h2>Qual escolher?</h2>
<ul>
<li><strong>Ganho de massa:</strong> Whey Concentrado — melhor custo-benefício</li>
<li><strong>Definição muscular:</strong> Whey Isolado — menos calorias e lactose</li>
<li><strong>Alta performance:</strong> Whey Hidrolisado — absorção máxima</li>
<li><strong>Intolerante à lactose:</strong> Whey Isolado ou Hidrolisado</li>
</ul>

<h2>Quando tomar?</h2>
<p>O momento mais eficiente é nos <strong>30 a 60 minutos após o treino</strong>. Também pode ser usado ao longo do dia para complementar a ingestão proteica diária — o ideal é consumir entre 1,6g e 2,2g de proteína por kg de peso corporal.</p>',
  now(), now()
),

(
  'Creatina: o guia completo para iniciantes e avançados',
  'creatina-guia-completo',
  'Tudo que você precisa saber sobre creatina: como funciona, como tomar, fase de carga, mitos e o que a ciência realmente diz.',
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=630&fit=crop&auto=format',
  true, now(),
  '<h2>O suplemento mais estudado da história</h2>
<p>A creatina é produzida naturalmente pelo organismo e armazenada nos músculos. Suplementar aumenta esses estoques, melhorando diretamente a força e a potência em exercícios de alta intensidade.</p>

<h2>Como funciona?</h2>
<p>Durante exercícios explosivos, o músculo usa o sistema ATP-CP. A creatina é convertida em fosfocreatina, que regenera o ATP mais rapidamente — mais repetições, mais carga, melhor desempenho.</p>

<h2>Benefícios comprovados</h2>
<ul>
<li>Aumento de força e potência muscular (5–15%)</li>
<li>Maior volume muscular</li>
<li>Recuperação acelerada entre séries</li>
<li>Melhora na cognição e memória de curto prazo</li>
</ul>

<h2>Precisa fazer fase de carga?</h2>
<p>A fase de carga (20g/dia por 5–7 dias) acelera a saturação, mas não é obrigatória. Tomando <strong>3 a 5g por dia continuamente</strong>, os estoques saturam em 3–4 semanas com o mesmo resultado final.</p>

<h2>Creatina engorda?</h2>
<p>A creatina causa retenção de água <em>dentro das células musculares</em> — o músculo fica mais cheio e volumoso. Não causa inchaço subcutâneo nem "barriga d''água".</p>

<h2>É segura a longo prazo?</h2>
<p>Sim. Estudos de até 5 anos não encontraram efeitos adversos em pessoas saudáveis. Mantenha boa hidratação para uso seguro contínuo.</p>',
  now(), now()
),

(
  'Pré-Treino: como usar corretamente e potencializar seus resultados',
  'pre-treino-como-usar-corretamente',
  'Pré-treino não é só cafeína. Entenda os ingredientes, doses corretas e como evitar os erros mais comuns.',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=630&fit=crop&auto=format',
  true, now(),
  '<h2>O que é um pré-treino?</h2>
<p>Pré-treinos combinam estimulantes, vasodilatadores e nootrópicos em doses otimizadas para aumentar energia, foco, força e resistência antes da atividade física.</p>

<h2>Ingredientes que fazem a diferença</h2>
<h3>Cafeína</h3>
<p>Reduz a percepção de esforço, aumenta foco e melhora resistência. Doses eficazes: 3–6mg/kg de peso corporal.</p>

<h3>Citrulina Malato</h3>
<p>Aumenta a produção de óxido nítrico, melhorando o fluxo sanguíneo. Resulta em mais pump e maior resistência à fadiga. Dose mínima eficaz: 6g.</p>

<h3>Beta-Alanina</h3>
<p>Aumenta carnosina muscular, reduzindo o acúmulo de ácido lático. Causa formigamento (parestesia) — normal e inofensivo. Dose: 3,2–6,4g.</p>

<h2>Como usar corretamente</h2>
<ul>
<li>Tome <strong>20 a 30 minutos antes do treino</strong></li>
<li>Comece com meia dose para avaliar tolerância</li>
<li>Não use após as 17h se for sensível à cafeína</li>
<li>Use no máximo 4–5x por semana para evitar tolerância</li>
</ul>

<h2>Erros comuns</h2>
<ul>
<li>Depender do pré-treino para se motivar</li>
<li>Tomar em jejum absoluto (pode causar enjoo)</li>
<li>Usar com outras fontes de cafeína no mesmo dia</li>
<li>Usar todos os dias — gera tolerância rápida</li>
</ul>',
  now(), now()
),

(
  '5 suplementos essenciais para quem treina musculação',
  '5-suplementos-essenciais-musculacao',
  'Se você pudesse escolher apenas 5 suplementos para maximizar seus resultados, quais seriam? A ciência responde.',
  'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=1200&h=630&fit=crop&auto=format',
  true, now(),
  '<h2>Introdução</h2>
<p>Com tantas opções no mercado, saber quais suplementos realmente valem o investimento pode parecer difícil. A ciência é clara: a maioria dos resultados vem de um grupo pequeno de compostos com evidências sólidas.</p>

<h2>1. Whey Protein</h2>
<p>A fonte proteica mais completa disponível, com alto teor de leucina e absorção rápida. Se você não consegue atingir sua meta proteica só com alimentação, o Whey resolve com praticidade e custo acessível.</p>

<h2>2. Creatina Monohidratada</h2>
<p>O suplemento com maior volume de pesquisas positivas da história. Melhora força, potência e composição corporal em praticamente todos os estudos. Barata, segura e eficaz.</p>

<h2>3. Cafeína</h2>
<p>Melhora força, resistência, foco e reduz a percepção de esforço. Obtenha do café ou de pré-treinos formulados. Dose certa: 3–6mg/kg, 30min antes do treino.</p>

<h2>4. Vitamina D3 + K2</h2>
<p>Deficiência de D3 é extremamente comum e afeta testosterona, saúde óssea, imunidade e desempenho físico. A K2 garante que o cálcio vá para os ossos. Investimento inteligente em saúde a longo prazo.</p>

<h2>5. Ômega 3</h2>
<p>EPA e DHA reduzem inflamação sistêmica, melhoram recuperação muscular, protegem articulações e apoiam saúde cardiovascular. Atletas têm necessidades maiores — o ômega 3 de alta qualidade preenche esse papel.</p>',
  now(), now()
),

(
  'Como montar o look perfeito para academia',
  'como-montar-look-perfeito-academia',
  'Conforto, performance e estilo não precisam ser excludentes. Como escolher cada peça do seu outfit de treino.',
  'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1200&h=630&fit=crop&auto=format',
  true, now(),
  '<h2>Por que o vestuário importa no treino?</h2>
<p>A roupa certa influencia amplitude de movimento, termorregulação, absorção de suor e até a confiança durante o exercício — fator psicológico que impacta diretamente o desempenho.</p>

<h2>A camiseta: base de tudo</h2>
<p>Para a maioria dos treinos, uma boa camiseta Dry Fit resolve. Procure:</p>
<ul>
<li><strong>Tecido de poliéster ou nylon</strong> — afasta o suor da pele</li>
<li><strong>Corte não restritivo</strong> — liberdade nos ombros</li>
<li><strong>Costura plana</strong> — evita irritação pelo atrito</li>
</ul>
<p>Evite algodão para treinos intensos — absorve e retém suor.</p>

<h2>Short ou legging?</h2>
<ul>
<li><strong>Short</strong> — ventilação superior, ideal para membros inferiores e cardio</li>
<li><strong>Legging com compressão</strong> — melhora circulação, reduz vibração muscular, ótimo para corrida</li>
</ul>

<h2>Acessórios que fazem diferença</h2>
<ul>
<li><strong>Luva de treino:</strong> protege a palma e melhora aderência em exercícios com barra</li>
<li><strong>Boné:</strong> controle do suor no rosto em treinos ao ar livre</li>
<li><strong>Shaker de qualidade:</strong> facilita hidratação e suplementação durante o treino</li>
</ul>',
  now(), now()
),

(
  'Nutrição pós-treino: o que comer para maximizar a recuperação',
  'nutricao-pos-treino-maximizar-recuperacao',
  'A janela anabólica existe? O que comer depois do treino? A ciência moderna responde de forma definitiva.',
  'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=1200&h=630&fit=crop&auto=format',
  true, now(),
  '<h2>Por que a nutrição pós-treino importa?</h2>
<p>Durante o treino de força, as fibras musculares sofrem microlesões. A recuperação e a hipertrofia acontecem nas horas seguintes. A nutrição pós-treino fornece os aminoácidos e o glicogênio necessários para essa reconstrução.</p>

<h2>A "janela anabólica"</h2>
<p>A janela existe, mas ela dura <strong>várias horas</strong> após o exercício — não apenas 30 minutos como se acreditava. O mais importante é o total de proteína ao longo do dia, não o timing exato.</p>

<h2>O que priorizar?</h2>
<h3>Proteína — obrigatório</h3>
<p>20 a 40g de proteína de alta qualidade. O Whey Protein é ideal pela absorção rápida, mas frango, ovos ou atum funcionam igualmente bem se ingeridos em até 2 horas após o treino.</p>

<h3>Carboidrato — repõe glicogênio</h3>
<p>Após treinos intensos os estoques de glicogênio estão parcialmente depletados. Carboidratos junto com proteína potencializam a síntese proteica. Ótimas opções: arroz, batata-doce, frutas ou aveia.</p>

<h3>Hidratação</h3>
<p>Repor líquidos é fundamental. Para cada hora de treino intenso, perdem-se entre 500ml e 1L de suor.</p>

<h2>Exemplos práticos</h2>
<ul>
<li>1 dose de Whey Protein + 1 banana</li>
<li>150g de frango grelhado + 200g de arroz + salada</li>
<li>4 ovos mexidos + 2 fatias de pão integral + 1 fruta</li>
</ul>',
  now(), now()
)

ON CONFLICT (slug) DO UPDATE
  SET
    title        = EXCLUDED.title,
    excerpt      = EXCLUDED.excerpt,
    cover_url    = EXCLUDED.cover_url,
    content      = EXCLUDED.content,
    published    = EXCLUDED.published,
    published_at = EXCLUDED.published_at,
    updated_at   = now();

-- ── Resultado ────────────────────────────────────────────────
SELECT 'Categorias' as tabela, count(*)::text as total FROM categories
UNION ALL
SELECT 'Produtos',  count(*)::text FROM products
UNION ALL
SELECT 'Blog posts', count(*)::text FROM blog_posts;
