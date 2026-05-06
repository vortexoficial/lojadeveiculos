import { useEffect, useState } from 'react'
import FormStatus from '../../components/FormStatus.jsx'
import Loading from '../../components/Loading.jsx'
import { PRODUCT_TYPES } from '../../data/options.js'
import {
  deleteCategory,
  listCategories,
  saveCategory,
} from '../../services/categoriesService.js'

const emptyCategory = {
  id: '',
  name: '',
  slug: '',
  type: '',
  is_active: true,
}

function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState(emptyCategory)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function loadCategories() {
    setLoading(true)
    try {
      setCategories(await listCategories())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  function editCategory(category) {
    setForm(category)
    setSuccess('')
    setError('')
  }

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!form.name.trim()) {
      setError('Informe o nome da categoria.')
      return
    }

    setSaving(true)

    try {
      await saveCategory(form)
      setForm(emptyCategory)
      setSuccess('Categoria salva com sucesso.')
      await loadCategories()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm('Excluir esta categoria?')
    if (!confirmed) return

    try {
      await deleteCategory(id)
      await loadCategories()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section className="admin-page">
      <div className="admin-page-heading">
        <div>
          <span className="eyebrow">CRUD</span>
          <h1>Categorias</h1>
        </div>
      </div>

      <form className="panel form-grid" onSubmit={handleSubmit}>
        <label>
          Nome
          <input
            value={form.name}
            onChange={(event) => updateField('name', event.target.value)}
            required
          />
        </label>
        <label>
          Slug opcional
          <input
            value={form.slug || ''}
            onChange={(event) => updateField('slug', event.target.value)}
            placeholder="gerado automaticamente"
          />
        </label>
        <label>
          Tipo
          <select
            value={form.type || ''}
            onChange={(event) => updateField('type', event.target.value)}
          >
            <option value="">Geral</option>
            {PRODUCT_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </label>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(event) => updateField('is_active', event.target.checked)}
          />
          Ativa
        </label>
        <FormStatus error={error} success={success} />
        <div className="form-actions full-field">
          <button className="button" type="submit" disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar categoria'}
          </button>
          <button
            className="button secondary"
            type="button"
            onClick={() => setForm(emptyCategory)}
          >
            Limpar
          </button>
        </div>
      </form>

      {loading ? <Loading /> : null}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Slug</th>
              <th>Tipo</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td>{category.name}</td>
                <td>{category.slug}</td>
                <td>{category.type || 'Geral'}</td>
                <td>{category.is_active ? 'Ativa' : 'Inativa'}</td>
                <td className="table-actions">
                  <button type="button" onClick={() => editCategory(category)}>
                    Editar
                  </button>
                  <button type="button" onClick={() => handleDelete(category.id)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
            {!categories.length && !loading ? (
              <tr>
                <td colSpan="5">Nenhuma categoria cadastrada.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default AdminCategories
