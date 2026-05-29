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
  'Um guia pratico para avaliar procedencia, estado geral, historico e sinais de cuidado antes de negociar.',
  $$<p>Comprar um seminovo fica muito mais simples quando a avaliacao segue uma ordem clara. Antes de olhar apenas preco ou quilometragem, observe se o veiculo combina com sua rotina, se tem historico coerente e se passa confianca no conjunto.</p>
<figure><img src="/demo-vehicles/honda-civic-exl-2020-03.jpg" alt="Honda Civic seminovo visto de lado" /><figcaption>Comece pela visao geral: alinhamento de pecas, pintura, pneus e conservacao interna contam muito.</figcaption></figure>
<h2>Comece pela procedencia</h2>
<p>Peca informacoes sobre numero de proprietarios, historico de revisoes, manual, chave reserva e origem do veiculo. Um carro bem documentado costuma reduzir riscos e facilitar a transferencia.</p>
<h2>Analise o estado do conjunto</h2>
<p>Observe pintura, frestas entre portas e para-choques, desgaste de volante e bancos, funcionamento dos comandos, pneus, estepe, luzes, vidros, ar-condicionado e painel. Sinais isolados nao condenam o veiculo, mas ajudam a negociar melhor.</p>
<h2>Checklist rapido antes de chamar no WhatsApp</h2>
<ul><li>Confira se a quilometragem faz sentido com o ano e o desgaste interno.</li><li>Peca fotos de documento, painel, pneus e detalhes da lataria.</li><li>Verifique se ha debitos, multas ou restricoes.</li><li>Agende uma avaliacao presencial ou test-drive antes de decidir.</li></ul>
<p>Com esse cuidado, a conversa deixa de ser apenas sobre desconto e passa a ser sobre valor real, estado de conservacao e seguranca na compra.</p>$$,
  '/demo-vehicles/honda-civic-exl-2020-01.jpg', true, now()
),
(
  'Documentacao necessaria para comprar um veiculo',
  'documentacao-necessaria-para-comprar-veiculo',
  'Veja quais documentos e conferencias evitam atrasos, custos inesperados e problemas na transferencia.',
  $$<p>A parte documental e uma das etapas mais importantes da compra. Mesmo quando o veiculo parece perfeito, pendencias de licenciamento, multas ou comunicacao de venda podem atrasar a transferencia e gerar custos extras.</p>
<figure><img src="/demo-vehicles/jeep-compass-longitude-2022-02.jpg" alt="SUV branco estacionado" /><figcaption>Um veiculo bem escolhido tambem precisa estar com a documentacao em ordem.</figcaption></figure>
<h2>O que conferir antes de fechar</h2>
<p>Verifique CRLV, dados do proprietario, placa, Renavam, chassi, exercicio de licenciamento, multas, IPVA, restricoes financeiras e eventuais bloqueios administrativos. Se houver financiamento, confirme como sera feita a quitacao ou transferencia.</p>
<h2>Dados do comprador e do vendedor</h2>
<p>Tenha documentos pessoais atualizados e confira se os dados informados batem com os documentos do veiculo. Em compras com loja ou intermediacao, peca orientacao sobre prazos, recibo, assinatura e reconhecimento de firma quando aplicavel.</p>
<h2>Cuidados que evitam dor de cabeca</h2>
<ul><li>Confirme debitos antes de sinalizar qualquer valor.</li><li>Guarde comprovantes de pagamento e conversas importantes.</li><li>Confira se o veiculo passou por leilao, sinistro ou restricao relevante.</li><li>Combine por escrito o que esta incluso na negociacao.</li></ul>
<p>Uma compra tranquila depende tanto do estado do veiculo quanto da clareza documental. Na duvida, peca apoio antes de assinar.</p>$$,
  '/demo-vehicles/jeep-compass-longitude-2022-01.jpg', true, now()
),
(
  'Financiamento ou pagamento a vista: como decidir',
  'financiamento-ou-pagamento-a-vista',
  'Compare entrada, parcela, custo total e margem de negociacao para escolher a forma de compra mais inteligente.',
  $$<p>Nem sempre a melhor escolha e simplesmente pagar a vista. Em alguns casos, preservar parte do capital para documentacao, seguro, manutencao inicial ou reserva de emergencia pode fazer mais sentido. O ponto principal e comparar custo total e conforto financeiro.</p>
<figure><img src="/demo-vehicles/toyota-corolla-xei-2021-04.jpg" alt="Toyota Corolla em area externa" /><figcaption>Planejamento financeiro ajuda a comprar melhor e manter o veiculo sem aperto depois.</figcaption></figure>
<h2>Quando o pagamento a vista ajuda</h2>
<p>O pagamento a vista pode aumentar o poder de negociacao, simplificar a compra e evitar juros. Ele costuma ser interessante quando o comprador ja reservou dinheiro para transferencia, seguro e revisao preventiva.</p>
<h2>Quando financiar pode ser melhor</h2>
<p>O financiamento pode ser util para quem quer preservar caixa ou antecipar a troca do veiculo. Compare taxa, prazo, valor de entrada, CET e valor final pago. Uma parcela confortavel deve caber no orcamento sem comprometer despesas fixas.</p>
<h2>Antes de decidir, simule estes pontos</h2>
<ul><li>Valor total pago ao fim do contrato.</li><li>Entrada minima e entrada ideal.</li><li>Custo de seguro, documentacao e manutencao inicial.</li><li>Possibilidade de quitar antecipadamente.</li></ul>
<p>A melhor decisao e a que equilibra preco, seguranca e tranquilidade depois da compra.</p>$$,
  '/demo-vehicles/toyota-corolla-xei-2021-01.jpg', true, now()
),
(
  'O que observar no test-drive antes de fechar negocio',
  'o-que-observar-no-test-drive',
  'Saiba como avaliar motor, cambio, freios, suspensao e conforto durante uma volta curta, mas bem planejada.',
  $$<p>O test-drive nao serve apenas para sentir se o veiculo e agradavel. Ele ajuda a perceber sinais que foto nenhuma mostra: ruidos, vibracoes, resposta do motor, funcionamento do cambio e comportamento da suspensao.</p>
<figure><img src="/demo-vehicles/chevrolet-cruze-ltz-2020-02.jpg" alt="Chevrolet Cruze vermelho em estacionamento" /><figcaption>Uma volta bem feita revela conforto, dirigibilidade e possiveis pontos de atencao.</figcaption></figure>
<h2>Antes de sair</h2>
<p>Observe a partida a frio, luzes do painel, marcha lenta, ar-condicionado, vidros, travas, multimidia e comandos eletricos. Se possivel, teste com o radio desligado para ouvir melhor o veiculo.</p>
<h2>Durante o percurso</h2>
<p>Use trechos com baixa velocidade, pequenas irregularidades e uma reta segura. Perceba se o carro puxa para algum lado, se ha trepidacao ao frear, se o cambio troca suavemente e se a suspensao trabalha sem batidas secas.</p>
<h2>Sinais que merecem atencao</h2>
<ul><li>Barulhos metalicos ou estalos em curvas.</li><li>Fumaca excessiva ou cheiro forte.</li><li>Volante desalinhado ou vibrando.</li><li>Freio baixo, duro demais ou com ruido persistente.</li></ul>
<p>Se algo parecer estranho, pergunte. Uma boa negociacao tambem depende de transparencia.</p>$$,
  '/demo-vehicles/chevrolet-cruze-ltz-2020-01.jpg', true, now()
),
(
  'Carro, SUV ou picape: qual combina com sua rotina?',
  'carro-suv-ou-picape-qual-combina-com-sua-rotina',
  'Entenda como uso diario, espaco, consumo e tipo de trajeto influenciam na escolha do veiculo ideal.',
  $$<p>A escolha do tipo de veiculo deve partir da rotina. Um sedan pode ser excelente para conforto e porta-malas, um SUV entrega posicao elevada e versatilidade, enquanto uma picape pode resolver melhor trabalho, carga e viagens com equipamentos.</p>
<figure><img src="/demo-vehicles/fiat-toro-volcano-2022-04.jpg" alt="Fiat Toro em ambiente externo" /><figcaption>Picapes e SUVs costumam atender bem quem alterna trabalho, familia e lazer.</figcaption></figure>
<h2>Para cidade e economia</h2>
<p>Hatches e sedans compactos tendem a ser mais faceis de estacionar e manter. Para quem roda muito em transito urbano, consumo, seguro e facilidade de manutencao pesam bastante.</p>
<h2>Para familia e estrada</h2>
<p>Sedans medios e SUVs oferecem mais conforto, porta-malas e presenca. Verifique espaco para cadeirinhas, posicao de dirigir, capacidade de bagagem e desempenho com o carro carregado.</p>
<h2>Para trabalho e uso misto</h2>
<p>Picapes entram bem quando a rotina envolve carga, estrada de terra, ferramentas ou equipamentos. Nesse caso, avalie capacidade de carga, pneus, suspensao e custo de manutencao.</p>
<ul><li>Liste como voce usa o veiculo em uma semana comum.</li><li>Compare seguro, consumo e revisoes.</li><li>Pense no tamanho da garagem e vagas que voce costuma usar.</li><li>Escolha pelo uso real, nao apenas pela aparencia.</li></ul>$$,
  '/demo-vehicles/fiat-toro-volcano-2022-01.png', true, now()
),
(
  'Motos seminovas: cuidados antes da compra',
  'motos-seminovas-cuidados-antes-da-compra',
  'Veja pontos essenciais para avaliar mecanica, documentacao, desgaste e seguranca antes de comprar uma moto usada.',
  $$<p>Motos seminovas podem entregar excelente custo-beneficio, mas pedem uma avaliacao cuidadosa. Pequenos detalhes em pneus, relacao, bengalas, freios e documentacao ajudam a entender se a moto foi bem cuidada.</p>
<figure><img src="/demo-vehicles/yamaha-mt-03-abs-2024-03.jpg" alt="Yamaha MT-03 em area externa" /><figcaption>Em motos, desgaste de pneus, freios e relacao aparece rapido e ajuda a estimar manutencao inicial.</figcaption></figure>
<h2>Olhe os itens de seguranca primeiro</h2>
<p>Confira pneus, discos e pastilhas de freio, vazamentos, suspensao, luzes, setas e estado da relacao. Se houver ABS, verifique luzes de aviso no painel e comportamento durante a partida.</p>
<h2>Procure sinais de queda ou uso severo</h2>
<p>Manetes ralados, pedaleiras tortas, riscos profundos, guidon desalinhado e carenagens mal encaixadas merecem atencao. Nem toda marca inviabiliza a compra, mas deve entrar na negociacao.</p>
<h2>Documentacao e test-ride</h2>
<p>Confirme licenciamento, debitos, procedencia e se os numeros de chassi e motor estao regulares. No teste, perceba embreagem, engates, freios, estabilidade e ruidos fora do normal.</p>
<ul><li>Evite decidir sem ver a moto fria.</li><li>Peca historico de revisoes e trocas recentes.</li><li>Reserve verba para revisao inicial e equipamentos.</li><li>Priorize motos com documentacao limpa e manutencao clara.</li></ul>$$,
  '/demo-vehicles/yamaha-mt-03-abs-2024-01.jpg', true, now()
)
on conflict (slug) do update
set title = excluded.title,
    excerpt = excluded.excerpt,
    content = excluded.content,
    cover_url = excluded.cover_url,
    published = excluded.published,
    published_at = excluded.published_at;
