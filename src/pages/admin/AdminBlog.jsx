import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useConfirm } from '../../components/ConfirmModal.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import Loading from '../../components/Loading.jsx'
import { deletePost, listPosts } from '../../services/blogService.js'

function formatDate(str) {
  if (!str) return '—'
  return new Date(str).toLocaleDateString('pt-BR')
}

function AdminBlog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { confirm, confirmation } = useConfirm()

  async function load() {
    try {
      setPosts(await listPosts())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function handleDelete(post) {
    const confirmed = await confirm({
      title: 'Excluir artigo?',
      message: `O artigo "${post.title}" será removido permanentemente.`,
      confirmLabel: 'Excluir',
      tone: 'danger',
    })
    if (!confirmed) return
    try {
      await deletePost(post.id)
      setPosts((prev) => prev.filter((p) => p.id !== post.id))
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section className="admin-page">
      <div className="admin-page-heading">
        <div>
          <span className="eyebrow">Conteúdo</span>
          <h1>Blog</h1>
        </div>
        <Link className="button" to="/admin/blog/novo">Novo artigo</Link>
      </div>

      {error ? <div className="form-status error">{error}</div> : null}
      {loading ? <Loading /> : null}

      {!loading && !posts.length ? (
        <EmptyState title="Nenhum artigo" message="Crie o primeiro artigo do blog." />
      ) : null}

      {posts.length ? (
        <div className="panel table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Status</th>
                <th>Data</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <td>
                    <strong>{post.title}</strong>
                    {post.excerpt ? <p style={{ color: 'var(--muted)', fontSize: 12, margin: '3px 0 0' }}>{post.excerpt.slice(0, 80)}{post.excerpt.length > 80 ? '…' : ''}</p> : null}
                  </td>
                  <td>
                    <span className={post.published ? 'status-badge active' : 'status-badge inactive'}>
                      {post.published ? 'Publicado' : 'Rascunho'}
                    </span>
                  </td>
                  <td>{formatDate(post.published_at || post.created_at)}</td>
                  <td className="table-actions">
                    <Link className="button small secondary" to={`/admin/blog/editar/${post.id}`}>Editar</Link>
                    <button className="button small danger" type="button" onClick={() => handleDelete(post)}>Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
      {confirmation}
    </section>
  )
}

export default AdminBlog
