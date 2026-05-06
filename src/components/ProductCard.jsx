import { Link } from 'react-router-dom'
import { env } from '../config/env.js'
import { formatCurrency, getProductTypeLabel } from '../utils/formatters.js'
import {
  buildProductWhatsappMessage,
  createWhatsappLink,
} from '../utils/whatsapp.js'

function getPlaceholderLabel(type) {
  const labels = {
    acessorio: 'ACC',
    outro: 'ITEM',
    suplemento: 'WHEY',
    vestuario: 'PB',
  }

  return labels[type] || 'ITEM'
}

function ProductCard({ product, whatsappNumber = '', showActions = true }) {
  const price = product.promo_price || product.price
  const categoryName = product.category?.name || product.categories?.name || getProductTypeLabel(product.type)
  const metaLabel = product.subcategory
    ? `${categoryName} / ${product.subcategory}`
    : categoryName
  const productUrl = `${env.appUrl}/produto/${product.slug}`
  const whatsappLink = createWhatsappLink(
    whatsappNumber,
    buildProductWhatsappMessage(product, productUrl),
  )

  return (
    <article className="product-card">
      <Link className="product-card-media" to={`/produto/${product.slug}`}>
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} loading="lazy" />
        ) : (
          <div className="product-placeholder">
            <span>{getPlaceholderLabel(product.type)}</span>
          </div>
        )}
        {product.promo_price ? <span className="product-card-badge">Promo</span> : null}
      </Link>

      <div className="product-card-body">
        <span className="product-card-meta">{metaLabel}</span>
        <h3>
          <Link to={`/produto/${product.slug}`}>{product.name}</Link>
        </h3>
        <p className="product-card-brand">{product.brand || getProductTypeLabel(product.type)}</p>
        <div className="price-row">
          {product.promo_price ? (
            <span className="old-price">{formatCurrency(product.price)}</span>
          ) : null}
          <strong>{formatCurrency(price)}</strong>
        </div>
        {showActions ? (
          <div className={whatsappLink ? 'product-card-actions' : 'product-card-actions single'}>
            <Link className="button mini secondary" to={`/produto/${product.slug}`}>
              Ver produto
            </Link>
            {whatsappLink ? (
              <a className="button mini" href={whatsappLink} target="_blank" rel="noreferrer">
                Comprar
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  )
}

export default ProductCard
