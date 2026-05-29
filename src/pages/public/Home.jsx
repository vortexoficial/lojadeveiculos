import { useEffect, useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import BenefitGrid from '../../components/BenefitGrid.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import HeroBannerCarousel from '../../components/HeroBannerCarousel.jsx'
import Loading from '../../components/Loading.jsx'
import ProductCarousel from '../../components/ProductCarousel.jsx'
import ProductCard from '../../components/ProductCard.jsx'
import { isSupabaseConfigured } from '../../config/env.js'
import { listBanners } from '../../services/bannersService.js'
import { listPosts } from '../../services/blogService.js'
import { listHomeCategoryBanners } from '../../services/homeCategoryBannersService.js'
import { listProducts } from '../../services/productsService.js'

const CATEGORY_BANNER_COPY = {
  carros: { title: 'Carros', subtitle: 'Sedans, hatches, SUVs e mais' },
  motos: { title: 'Motos', subtitle: 'Modelos selecionados para sua rotina' },
  veiculos: { title: 'Veiculos', subtitle: 'Toda a frota disponivel' },
  ofertas: { title: 'Ofertas', subtitle: 'Oportunidades em destaque' },
}

function getCategoryBannerCopy(slot) {
  const key = (slot.link_to || slot.name || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

  const match = Object.keys(CATEGORY_BANNER_COPY).find((item) => key.includes(item))
  const fallback = match ? CATEGORY_BANNER_COPY[match] : CATEGORY_BANNER_COPY.veiculos

  return {
    title: slot.name || fallback.title,
    subtitle: fallback.subtitle,
  }
}

function IconWhatsapp() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a8.5 8.5 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413" />
    </svg>
  )
}

function Home() {
  const { settings } = useOutletContext()
  const [products, setProducts] = useState([])
  const [supplements, setSupplements] = useState([])
  const [clothing, setClothing] = useState([])
  const [promos, setPromos] = useState([])
  const [banners, setBanners] = useState([])
  const [categoryBanners, setCategoryBanners] = useState([])
  const [recentPosts, setRecentPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }

    async function loadHome() {
      try {
        const [featuredProducts, activeBanners, latestPosts, catBanners] = await Promise.all([
          listProducts({ onlyActive: true, featured: true, limit: 12 }),
          listBanners({ onlyActive: true }),
          listPosts({ onlyPublished: true, limit: 3 }),
          listHomeCategoryBanners().catch(() => []),
        ])
        const [supplementProducts, clothingProducts, promoProducts] = await Promise.all([
          listProducts({ onlyActive: true, type: 'suplemento', limit: 4 }),
          listProducts({ onlyActive: true, type: 'vestuario', limit: 4 }),
          listProducts({ onlyActive: true, limit: 8 }),
        ])
        setProducts(featuredProducts)
        setSupplements(supplementProducts)
        setClothing(clothingProducts)
        setPromos(promoProducts.filter((product) => product.promo_price).slice(0, 4))
        setBanners(activeBanners)
        setCategoryBanners(catBanners)
        setRecentPosts(latestPosts)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadHome()
  }, [])

  return (
    <main className="home-page">
      <HeroBannerCarousel banners={banners} />

      <section className="content-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Categorias</span>
            <h2>Escolha seu veiculo</h2>
          </div>
        </div>
        {categoryBanners.length > 0 ? (
          <div className="cat-home-grid">
            {categoryBanners.map((slot) => {
              const copy = getCategoryBannerCopy(slot)

              return (
                <Link
                  key={slot.id}
                  className="cat-home-item"
                  to={slot.link_to || '/veiculos'}
                  aria-label={`${copy.title}: ${copy.subtitle}`}
                >
                  {slot.image_url ? (
                    <img src={slot.image_url} alt="" loading="lazy" />
                  ) : (
                    <span className="cat-home-placeholder">{copy.title}</span>
                  )}
                  <span className="cat-home-copy">
                    <strong>{copy.title}</strong>
                    <span>{copy.subtitle}</span>
                  </span>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="category-grid premium-categories">
            <Link className="category-link category-featured" to="/carros" style={{ '--cat-img': 'url(/vehicle-car.svg)' }}>
              <strong>Carros</strong>
              <span>Sedans, hatches, SUVs e mais</span>
            </Link>
            <Link className="category-link category-featured" to="/motos" style={{ '--cat-img': 'url(/vehicle-moto.svg)' }}>
              <strong>Motos</strong>
              <span>Modelos selecionados para sua rotina</span>
            </Link>
            <Link className="category-link category-featured" to="/veiculos" style={{ '--cat-img': 'url(/vehicle-stock.svg)' }}>
              <strong>Veiculos</strong>
              <span>Toda a frota disponivel</span>
            </Link>
            <Link className="category-link category-featured" to="/ofertas?sort=promocoes" style={{ '--cat-img': 'url(/vehicle-offers.svg)' }}>
              <strong>Ofertas</strong>
              <span>Oportunidades em destaque</span>
            </Link>
          </div>
        )}
      </section>

      <section className="content-section compact-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Vitrine</span>
            <h2>Veiculos em destaque</h2>
          </div>
          <Link to="/veiculos">Ver todos</Link>
        </div>

        {loading ? <Loading /> : null}
        {error ? <div className="form-status error">{error}</div> : null}
        {!loading && !products.length ? (
          <EmptyState
            title="Nenhum destaque cadastrado"
            message="Ative veiculos como destaque no painel administrativo."
          />
        ) : null}
        <ProductCarousel products={products} whatsappNumber={settings.whatsapp_number} />
      </section>

      {promos.length ? (
        <section className="promo-band">
          <div>
            <span className="eyebrow">Ofertas</span>
            <h2>{settings.promo_title}</h2>
            <p>{settings.promo_text}</p>
          </div>
          <Link className="button" to="/ofertas?sort=promocoes">
            Ver ofertas
          </Link>
        </section>
      ) : null}

      <section className="content-section compact-section split-products">
        <div>
          <div className="section-heading">
            <div>
              <span className="eyebrow">Carros</span>
              <h2>Carros para todos os estilos</h2>
            </div>
          </div>
          <div className="product-grid small-grid">
            {supplements.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                whatsappNumber={settings.whatsapp_number}
              />
            ))}
          </div>
        </div>
        <div>
          <div className="section-heading">
            <div>
              <span className="eyebrow">Motos</span>
              <h2>Motos em destaque</h2>
            </div>
          </div>
          <div className="product-grid small-grid">
            {clothing.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                whatsappNumber={settings.whatsapp_number}
              />
            ))}
          </div>
        </div>
      </section>

      {recentPosts.length ? (
        <section className="content-section compact-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Blog</span>
              <h2>Ultimos artigos</h2>
            </div>
            <Link to="/blog">Ver todos</Link>
          </div>
          <div className="blog-grid blog-grid-home">
            {recentPosts.map((post) => (
              <Link key={post.id} to={`/blog/${post.slug}`} className="blog-card">
                {post.cover_url ? (
                  <div className="blog-card-cover">
                    <img src={post.cover_url} alt={post.title} loading="lazy" />
                  </div>
                ) : (
                  <div className="blog-card-cover blog-card-cover-placeholder" aria-hidden="true" />
                )}
                <div className="blog-card-body">
                  <h2 className="blog-card-title">{post.title}</h2>
                  {post.excerpt ? <p className="blog-card-excerpt">{post.excerpt}</p> : null}
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className="content-section muted-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Como funciona</span>
            <h2>Da escolha do veiculo a negociacao, com orientacao clara</h2>
          </div>
        </div>
        <BenefitGrid />
      </section>

      <section className="final-cta" aria-labelledby="final-cta-title">
        <div className="final-cta-inner">
          <div className="final-cta-copy">
            <span className="eyebrow">Digital Veiculos</span>
            <h2 id="final-cta-title">Encontre seu proximo veiculo sem perder tempo.</h2>
            <p>
              Conte o que voce procura e receba uma orientacao objetiva para comparar
              modelos, condicoes e proximos passos com seguranca.
            </p>
            <div className="final-cta-points" aria-label="Vantagens do atendimento">
              <span>Curadoria da frota</span>
              <span>Duvidas respondidas</span>
              <span>Negociacao guiada</span>
            </div>
          </div>

          <div className="final-cta-contact">
            <span>Atendimento direto</span>
            <strong>Fale com a equipe e avance com clareza.</strong>
            <p>Sem formulario longo. A conversa ja comeca pelo veiculo e pela sua necessidade.</p>
            <div className="final-cta-actions">
              <a
                className="button whatsapp-button final-cta-whatsapp"
                href={`https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(settings.default_message || 'Ola! Quero saber mais sobre os veiculos da Digital Veiculos.')}`}
                target="_blank"
                rel="noreferrer"
              >
                <IconWhatsapp />
                Chamar no WhatsApp
              </a>
              <Link className="button secondary final-cta-secondary" to="/veiculos">
                Ver frota
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Home
