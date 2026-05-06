import { getClient, isMissingColumn, unwrap, unwrapMaybe } from './helpers.js'

export const DEFAULT_SETTINGS = {
  id: null,
  store_name: 'Pitbull Suplementos',
  whatsapp_number: '5511918334855',
  logo_url: '/logo.webp',
  instagram_url: '',
  default_message: 'Ola! Quero saber mais sobre os produtos da loja.',
  promo_title: 'Ofertas para treinar forte',
  promo_text: 'Fale no WhatsApp e confira suplementos, combos e vestuario disponiveis hoje.',
}

function normalizeSettings(settings) {
  if (!settings) return DEFAULT_SETTINGS

  return {
    ...DEFAULT_SETTINGS,
    ...settings,
    instagram_url: settings.instagram_url ?? settings.instagram ?? '',
  }
}

function buildSettingsPayload(settings, { legacyInstagram = false } = {}) {
  const payload = {
    store_name: settings.store_name,
    whatsapp_number: settings.whatsapp_number,
    logo_url: settings.logo_url || null,
    instagram_url: settings.instagram_url || '',
    default_message: settings.default_message || '',
    promo_title: settings.promo_title || '',
    promo_text: settings.promo_text || '',
    updated_at: new Date().toISOString(),
  }

  if (legacyInstagram) {
    payload.instagram = payload.instagram_url
    delete payload.instagram_url
  }

  return payload
}

export async function getStoreSettings() {
  const client = getClient()
  const data = unwrapMaybe(
    await client
      .from('store_settings')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
  )

  return normalizeSettings(data)
}

export async function saveStoreSettings(settings) {
  const client = getClient()
  const normalizedSettings = normalizeSettings(settings)
  const persist = (payload) => {
    if (normalizedSettings.id) {
      return client
        .from('store_settings')
        .update(payload)
        .eq('id', normalizedSettings.id)
        .select()
        .single()
    }

    return client.from('store_settings').insert(payload).select().single()
  }

  let result = await persist(buildSettingsPayload(normalizedSettings))

  if (isMissingColumn(result.error, 'instagram_url')) {
    result = await persist(
      buildSettingsPayload(normalizedSettings, { legacyInstagram: true }),
    )
  }

  return normalizeSettings(unwrap(result))
}
