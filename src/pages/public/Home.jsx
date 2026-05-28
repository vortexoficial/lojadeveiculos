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
    <main>
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
            <span className="eyebrow">Diferenciais</span>
            <h2>Compra simples, vitrine clara e atendimento direto</h2>
          </div>
        </div>
        <BenefitGrid />
      </section>

      <section className="final-cta">
        <span className="eyebrow">Digital Veiculos</span>
        <h2>Seu proximo veiculo com atendimento direto.</h2>
        <p>Chame no WhatsApp e encontre o veiculo certo para sua rotina.</p>
        <a
          className="button whatsapp-button"
          href={`https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(settings.default_message || 'Ola! Quero saber mais sobre os veiculos da Digital Veiculos.')}`}
          target="_blank"
          rel="noreferrer"
        >
          Chamar no WhatsApp
        </a>
      </section>
    </main>
  )
}

export default Home
