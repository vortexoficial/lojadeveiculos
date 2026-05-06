import { useEffect, useState } from 'react'
import FormStatus from '../../components/FormStatus.jsx'
import ImageUploader from '../../components/ImageUploader.jsx'
import Loading from '../../components/Loading.jsx'
import {
  deleteBanner,
  listBanners,
  saveBanner,
} from '../../services/bannersService.js'
import { uploadStoreImage } from '../../services/storageService.js'

const emptyBanner = {
  id: '',
  title: '',
  desktop_image_url: '',
  mobile_image_url: '',
  desktop_position: 'center center',
  mobile_position: 'center center',
  display_order: 1,
  is_active: true,
}

const positionOptions = [
  'center center',
  'center top',
  'center bottom',
  'left center',
  'right center',
  'left top',
  'right top',
]

function AdminBanners() {
  const [banners, setBanners] = useState([])
  const [form, setForm] = useState(emptyBanner)
  const [desktopFile, setDesktopFile] = useState(null)
  const [mobileFile, setMobileFile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function loadBanners() {
    setLoading(true)
    try {
      setBanners(await listBanners())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBanners()
  }, [])

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }))
  }

  function resetForm() {
    setForm(emptyBanner)
    setDesktopFile(null)
    setMobileFile(null)
    setError('')
    setSuccess('')
  }

  function editBanner(banner) {
    setForm(banner)
    setDesktopFile(null)
    setMobileFile(null)
    setError('')
    setSuccess('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!form.title.trim()) {
      setError('Informe um nome interno para o banner.')
      return
    }

    if (!desktopFile && !form.desktop_image_url) {
      setError('Envie a imagem desktop do banner.')
      return
    }

    if (!mobileFile && !form.mobile_image_url) {
      setError('Envie a imagem mobile do banner.')
      return
    }

    setSaving(true)

    try {
      let desktopImageUrl = form.desktop_image_url
      let mobileImageUrl = form.mobile_image_url

      if (desktopFile) {
        desktopImageUrl = await uploadStoreImage(desktopFile, 'banners/desktop')
      }

      if (mobileFile) {
        mobileImageUrl = await uploadStoreImage(mobileFile, 'banners/mobile')
      }

      await saveBanner({
        ...form,
        desktop_image_url: desktopImageUrl,
        mobile_image_url: mobileImageUrl,
      })

      resetForm()
      setSuccess('Banner salvo com sucesso.')
      await loadBanners()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm('Excluir este banner?')
    if (!confirmed) return

    try {
      await deleteBanner(id)
      await loadBanners()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section className="admin-page">
      <div className="admin-page-heading">
        <div>
          <span className="eyebrow">Home</span>
          <h1>Banners</h1>
          <p>Cadastre uma versão desktop e uma versão mobile para cada banner.</p>
        </div>
      </div>

      <form className="panel form-grid" onSubmit={handleSubmit}>
        <div className="form-block-title full-field">
          <span>01</span>
          <strong>Dados do banner</strong>
        </div>

        <label>
          Nome interno
          <input
            value={form.title}
            onChange={(event) => updateField('title', event.target.value)}
            placeholder="Ex.: Banner suplementos"
            required
          />
        </label>
        <label>
          Ordem
          <input
            type="number"
            min="1"
            value={form.display_order}
            onChange={(event) => updateField('display_order', event.target.value)}
          />
        </label>
        <label>
          Posição desktop
          <select
            value={form.desktop_position || 'center center'}
            onChange={(event) => updateField('desktop_position', event.target.value)}
          >
            {positionOptions.map((position) => (
              <option key={position} value={position}>
                {position}
              </option>
            ))}
          </select>
        </label>
        <label>
          Posição mobile
          <select
            value={form.mobile_position || 'center center'}
            onChange={(event) => updateField('mobile_position', event.target.value)}
          >
            {positionOptions.map((position) => (
              <option key={position} value={position}>
                {position}
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
          Banner ativo
        </label>

        <div className="form-block-title full-field">
          <span>02</span>
          <strong>Imagens</strong>
        </div>
        <ImageUploader
          label="Imagem desktop"
          currentUrl={form.desktop_image_url}
          onFileChange={setDesktopFile}
          disabled={saving}
        />
        <ImageUploader
          label="Imagem mobile"
          currentUrl={form.mobile_image_url}
          onFileChange={setMobileFile}
          disabled={saving}
        />

        <FormStatus error={error} success={success} />
        <div className="form-actions full-field">
          <button className="button" type="submit" disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar banner'}
          </button>
          <button className="button secondary" type="button" onClick={resetForm}>
            Limpar
          </button>
        </div>
      </form>

      {loading ? <Loading /> : null}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Ordem</th>
              <th>Banner</th>
              <th>Desktop</th>
              <th>Mobile</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {banners.map((banner) => (
              <tr key={banner.id}>
                <td>{banner.display_order}</td>
                <td>
                  <strong>{banner.title}</strong>
                  <br />
                  <small>
                    D: {banner.desktop_position} | M: {banner.mobile_position}
                  </small>
                </td>
                <td>
                  <img
                    className="table-banner-image desktop"
                    src={banner.desktop_image_url}
                    alt={`Desktop: ${banner.title}`}
                  />
                </td>
                <td>
                  <img
                    className="table-banner-image mobile"
                    src={banner.mobile_image_url}
                    alt={`Mobile: ${banner.title}`}
                  />
                </td>
                <td>{banner.is_active ? 'Ativo' : 'Inativo'}</td>
                <td className="table-actions">
                  <button type="button" onClick={() => editBanner(banner)}>
                    Editar
                  </button>
                  <button type="button" onClick={() => handleDelete(banner.id)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
            {!banners.length && !loading ? (
              <tr>
                <td colSpan="6">Nenhum banner cadastrado.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default AdminBanners
