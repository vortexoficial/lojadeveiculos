import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Loading from '../../components/Loading.jsx'
import { getDashboardSummary } from '../../services/dashboardService.js'

function AdminDashboard() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getDashboardSummary()
      .then(setSummary)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loading />

  return (
    <section className="admin-page">
      <div className="admin-page-heading">
        <div>
          <span className="eyebrow">Dashboard</span>
          <h1>Visão geral</h1>
        </div>
      </div>

      {error ? <div className="form-status error">{error}</div> : null}

      {summary ? (
        <div className="dashboard-grid">
          <article className="summary-card">
            <span>Produtos</span>
            <strong>{summary.products}</strong>
            <Link to="/admin/produtos">Gerenciar →</Link>
          </article>
          <article className="summary-card">
            <span>Categorias</span>
            <strong>{summary.categories}</strong>
            <Link to="/admin/categorias">Gerenciar →</Link>
          </article>
          <article className="summary-card">
            <span>Banners</span>
            <strong>{summary.banners}</strong>
            <Link to="/admin/banners">Gerenciar →</Link>
          </article>
          <article className="summary-card">
            <span>Artigos do blog</span>
            <strong>{summary.posts}</strong>
            <Link to="/admin/blog">Gerenciar →</Link>
          </article>
        </div>
      ) : null}
    </section>
  )
}

export default AdminDashboard
