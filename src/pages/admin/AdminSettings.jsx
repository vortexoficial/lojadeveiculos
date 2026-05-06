import { useEffect, useState } from 'react'
import FormStatus from '../../components/FormStatus.jsx'
import Loading from '../../components/Loading.jsx'
import {
  DEFAULT_SETTINGS,
  getStoreSettings,
  saveStoreSettings,
} from '../../services/settingsService.js'

function AdminSettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    getStoreSettings()
      .then(setSettings)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  function updateField(name, value) {
    setSettings((current) => ({ ...current, [name]: value }))
  }

  function validateSettings() {
    if (!settings.store_name.trim()) return 'Informe o nome da loja.'
    if (!/^\d{12,13}$/.test(settings.whatsapp_number || '')) {
      return 'Use o WhatsApp no formato 55DDDNUMERO, sem espaços.'
    }

    return ''
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSuccess('')

    const validationError = validateSettings()
    if (validationError) {
      setError(validationError)
      return
    }

    setSaving(true)

    try {
      const saved = await saveStoreSettings(settings)
      setSettings(saved)
      setSuccess('Configurações salvas com sucesso.')
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
          <span className="eyebrow">Loja</span>
          <h1>Configurações</h1>
        </div>
      </div>

      <form className="panel form-grid" onSubmit={handleSubmit}>
        <div className="form-block-title full-field">
          <span>01</span>
          <strong>Dados da loja</strong>
        </div>
        <label>
          Nome da loja
          <input
            value={settings.store_name}
            onChange={(event) => updateField('store_name', event.target.value)}
            required
          />
        </label>
        <label>
          WhatsApp
          <input
            value={settings.whatsapp_number || ''}
            onChange={(event) => updateField('whatsapp_number', event.target.value)}
            placeholder="55DDDNUMERO"
            required
          />
        </label>
        <label>
          Instagram
          <input
            value={settings.instagram_url || ''}
            onChange={(event) => updateField('instagram_url', event.target.value)}
            placeholder="https://instagram.com/sualoja"
          />
        </label>
        <label className="full-field">
          Mensagem padrão
          <textarea
            value={settings.default_message || ''}
            onChange={(event) => updateField('default_message', event.target.value)}
          />
        </label>

        <div className="form-block-title full-field">
          <span>02</span>
          <strong>Promoções</strong>
        </div>
        <label className="full-field">
          Título da área de promoções
          <input
            value={settings.promo_title || ''}
            onChange={(event) => updateField('promo_title', event.target.value)}
          />
        </label>
        <label className="full-field">
          Texto da área de promoções
          <textarea
            value={settings.promo_text || ''}
            onChange={(event) => updateField('promo_text', event.target.value)}
          />
        </label>

        <FormStatus error={error} success={success} />
        <button className="button full-field" type="submit" disabled={saving}>
          {saving ? 'Salvando...' : 'Salvar configurações'}
        </button>
      </form>
    </section>
  )
}

export default AdminSettings
