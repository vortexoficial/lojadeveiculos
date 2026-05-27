import { useEffect, useMemo, useState } from 'react'
import { useOutletContext, useSearchParams } from 'react-router-dom'
import EmptyState from '../../components/EmptyState.jsx'
import Loading from '../../components/Loading.jsx'
import ProductCard from '../../components/ProductCard.jsx'
import ProductFilters from '../../components/ProductFilters.jsx'
import { isSupabaseConfigured } from '../../config/env.js'
import { listCategories } from '../../services/categoriesService.js'
import { listProducts } from '../../services/productsService.js'

function ProductsPage({ lockedType = '' }) {
  const { settings } = useOutletContext()
  const [searchParams] = useSearchParams()
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({
    search: searchParams.get('q') || '',
    categoryId: searchParams.get('categoria') || '',
    type: lockedType || searchParams.get('tipo') || '',
    sort: searchParams.get('sort') || 'recentes',
  })

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }

    async function loadData() {
      try {
        const [activeCategories, activeProducts] = await Promise.all([
          listCategories({ onlyActive: true }),
          listProducts({ onlyActive: true }),
        ])
        setCategories(activeCategories)
        setProducts(activeProducts)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const filteredProducts = useMemo(() => {
    const search = filters.search.trim().toLowerCase()

    const filtered = products.filter((product) => {
      const matchesSearch =
        !search ||
        product.name?.toLowerCase().includes(search) ||
        product.brand?.toLowerCase().includes(search)
      const matchesCategory =
        !filters.categoryId || product.category_id === filters.categoryId
      const matchesType = !filters.type || product.type === filters.type

      return matchesSearch && matchesCategory && matchesType
    })

    return filtered.sort((a, b) => {
      const priceA = Number(a.promo_price || a.price || 0)
      const priceB = Number(b.promo_price || b.price || 0)

      if (filters.sort === 'menor_preco') return priceA - priceB
      if (filters.sort === 'maior_preco') return priceB - priceA
      if (filters.sort === 'promocoes') {
        return Number(Boolean(b.promo_price)) - Number(Boolean(a.promo_price))
      }

      return new Date(b.created_at) - new Date(a.created_at)
    })
  }, [products, filters])

  const heading =
    lockedType === 'suplemento'
      ? { title: 'Carros', subtitle: 'Sedans, hatches, SUVs e outras oportunidades selecionadas para voce comparar pelo WhatsApp.' }
      : lockedType === 'vestuario'
      ? { title: 'Motos', subtitle: 'Modelos revisados para quem busca agilidade, economia e bom atendimento.' }
      : { title: 'Veiculos', subtitle: 'Filtre, compare e fale direto pelo WhatsApp para tirar duvidas ou negociar.' }

  return (
    <main className="page">
      <section className="page-heading">
        <span className="eyebrow">Digital Veiculos</span>
        <h1>{heading.title}</h1>
        <p>{heading.subtitle}</p>
      </section>

      <ProductFilters
        categories={categories}
        filters={filters}
        onChange={setFilters}
        showType={!lockedType}
        lockedType={lockedType}
        showSort
      />

      {loading ? <Loading /> : null}
      {error ? <div className="form-status error">{error}</div> : null}
      {!loading && !filteredProducts.length ? (
        <EmptyState
          title="Nenhum veiculo encontrado"
          message="Ajuste os filtros ou cadastre novos veiculos no painel."
        />
      ) : null}

      <div className="product-grid">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            whatsappNumber={settings.whatsapp_number}
          />
        ))}
      </div>
    </main>
  )
}

export default ProductsPage
