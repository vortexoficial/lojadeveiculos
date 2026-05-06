import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Loading from '../../components/Loading.jsx'
import ProductFilters from '../../components/ProductFilters.jsx'
import { listCategories } from '../../services/categoriesService.js'
import {
  createDemoProductBase,
  deleteProduct,
  listProducts,
  toggleProductField,
} from '../../services/productsService.js'
import { formatCurrency, getProductTypeLabel } from '../../utils/formatters.js'

function AdminProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [filters, setFilters] = useState({ search: '', categoryId: '', type: '' })
  const [loading, setLoading] = useState(true)
  const [seeding, setSeeding] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function loadProducts() {
    setLoading(true)
    try {
      const [nextProducts, nextCategories] = await Promise.all([
        listProducts(),
        listCategories(),
      ])
      setProducts(nextProducts)
      setCategories(nextCategories)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const filteredProducts = useMemo(() => {
    const search = filters.search.trim().toLowerCase()

    return products.filter((product) => {
      const matchesSearch =
        !search ||
        product.name?.toLowerCase().includes(search) ||
        product.brand?.toLowerCase().includes(search)
      const matchesCategory =
        !filters.categoryId || product.category_id === filters.categoryId
      const matchesType = !filters.type || product.type === filters.type

      return matchesSearch && matchesCategory && matchesType
    })
  }, [products, filters])

  async function handleToggle(product, field) {
    try {
      setSuccess('')
      await toggleProductField(product.id, field, !product[field])
      await loadProducts()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm('Excluir este produto?')
    if (!confirmed) return

    try {
      setSuccess('')
      await deleteProduct(id)
      await loadProducts()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleCreateDemoProducts() {
    const confirmed = window.confirm('Criar 10 produtos demo e categorias de teste?')
    if (!confirmed) return

    setSeeding(true)
    setError('')
    setSuccess('')

    try {
      const savedProducts = await createDemoProductBase()
      setSuccess(`${savedProducts.length} produtos demo criados/atualizados com sucesso.`)
      await loadProducts()
    } catch (err) {
      setError(err.message)
    } finally {
      setSeeding(false)
    }
  }

  return (
    <section className="admin-page">
      <div className="admin-page-heading">
        <div>
          <span className="eyebrow">CRUD</span>
          <h1>Produtos</h1>
        </div>
        <div className="admin-page-heading-actions">
          <button
            className="button secondary"
            type="button"
            onClick={handleCreateDemoProducts}
            disabled={seeding}
          >
            {seeding ? 'Criando...' : 'Criar produtos demo'}
          </button>
          <Link className="button" to="/admin/produtos/novo">
            Novo produto
          </Link>
        </div>
      </div>

      <ProductFilters categories={categories} filters={filters} onChange={setFilters} />

      {error ? <div className="form-status error">{error}</div> : null}
      {success ? <div className="form-status success">{success}</div> : null}
      {loading ? <Loading /> : null}

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Produto</th>
              <th>Imagem</th>
              <th>Tipo</th>
              <th>Categoria</th>
              <th>Preço</th>
              <th>Estoque</th>
              <th>Status</th>
              <th>Destaque</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td>
                  <strong>{product.name}</strong>
                  <br />
                  <small>{product.brand}</small>
                </td>
                <td>
                  {product.image_url ? (
                    <img className="table-product-image" src={product.image_url} alt={product.name} />
                  ) : (
                    <span className="table-product-empty">Sem imagem</span>
                  )}
                </td>
                <td>{getProductTypeLabel(product.type)}</td>
                <td>{product.category?.name || '-'}</td>
                <td>{formatCurrency(product.promo_price || product.price)}</td>
                <td>{product.stock}</td>
                <td>
                  <button type="button" onClick={() => handleToggle(product, 'is_active')}>
                    {product.is_active ? 'Ativo' : 'Inativo'}
                  </button>
                </td>
                <td>
                  <button type="button" onClick={() => handleToggle(product, 'is_featured')}>
                    {product.is_featured ? 'Sim' : 'Não'}
                  </button>
                </td>
                <td className="table-actions">
                  <Link to={`/admin/produtos/editar/${product.id}`}>Editar</Link>
                  <button type="button" onClick={() => handleDelete(product.id)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
            {!filteredProducts.length && !loading ? (
              <tr>
                <td colSpan="9">Nenhum produto encontrado.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default AdminProducts
