import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import FormStatus from '../../components/FormStatus.jsx'
import Loading from '../../components/Loading.jsx'
import {
  createPost,
  getPostById,
  updatePost,
} from '../../services/blogService.js'

const EMPTY = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  cover_url: '',
  published: false,
  published_at: '',
}

function slugify(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function AdminBlogForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)

  const [form, setForm] = useState(EMPTY)
  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!isEditing) return
    getPostById(id)
      .then((data) => {
        if (data) setForm({ ...EMPTY, ...data, published_at: data.published_at?.slice(0, 10) || '' })
        else setError('Artigo não encontrado.')
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id, isEditing])

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleTitleChange(e) {
    const val = e.target.value
    setForm((prev) => ({
      ...prev,
      title: val,
      slug: isEditing ? prev.slug : slugify(val),
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!form.title.trim()) { setError('Informe o título.'); return }
    if (!form.slug.trim()) { setError('Informe o slug.'); return }

    setSaving(true)
    try {
      const payload = {
        ...form,
        published_at: form.published ? (form.published_at || new Date().toISOString()) : null,
      }
      delete payload.id

      if (isEditing) {
        await updatePost(id, payload)
        setSuccess('Artigo atualizado.')
      } else {
        const created = await createPost(payload)
        navigate(`/admin/blog/editar/${created.id}`, { replace: true })
        setSuccess('Artigo criado.')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Loading />

  return (
    <section className="admin-page">
      <div className="admin-page-heading">
        <div>
          <span className="eyebrow">Blog</span>
          <h1>{isEditing ? 'Editar artigo' : 'Novo artigo'}</h1>
        </div>
      </div>

      <form className="panel form-grid" onSubmit={handleSubmit}>
        <div className="form-block-title full-field">
          <span>01</span>
          <strong>Conteúdo</strong>
        </div>

        <label className="full-field">
          Título
          <input value={form.title} onChange={handleTitleChange} required />
        </label>

        <label>
          Slug (URL)
          <input value={form.slug} onChange={(e) => update('slug', e.target.value)} required />
        </label>

        <label>
          URL da imagem de capa
          <input value={form.cover_url} onChange={(e) => update('cover_url', e.target.value)} placeholder="https://..." />
        </label>

        <label className="full-field">
          Resumo (excerpt)
          <textarea
            value={form.excerpt}
            onChange={(e) => update('excerpt', e.target.value)}
            rows={2}
            placeholder="Breve descrição exibida na listagem..."
          />
        </label>

        <label className="full-field">
          Conteúdo (HTML)
          <textarea
            value={form.content}
            onChange={(e) => update('content', e.target.value)}
            rows={16}
            placeholder="<p>Escreva o conteúdo em HTML aqui...</p>"
            style={{ fontFamily: 'monospace', fontSize: 13 }}
          />
        </label>

        <div className="form-block-title full-field">
          <span>02</span>
          <strong>Publicação</strong>
        </div>

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => update('published', e.target.checked)}
          />
          Publicado (visível no site)
        </label>

        <label>
          Data de publicação
          <input
            type="date"
            value={form.published_at}
            onChange={(e) => update('published_at', e.target.value)}
          />
        </label>

        <FormStatus error={error} success={success} />

        <div className="form-actions full-field">
          <button className="button" type="submit" disabled={saving}>
            {saving ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Criar artigo'}
          </button>
          <button className="button secondary" type="button" onClick={() => navigate('/admin/blog')}>
            Cancelar
          </button>
        </div>
      </form>
    </section>
  )
}

export default AdminBlogForm
