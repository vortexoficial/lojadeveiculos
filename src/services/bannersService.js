import { getClient, unwrap } from './helpers.js'

export async function listBanners({ onlyActive = false } = {}) {
  const client = getClient()
  let query = client
    .from('home_banners')
    .select('*')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (onlyActive) query = query.or('is_active.eq.true,is_active.is.null')

  return unwrap(await query)
}

export async function saveBanner(banner) {
  const client = getClient()
  const payload = {
    title: banner.title || 'Banner da home',
    desktop_image_url: banner.desktop_image_url || null,
    mobile_image_url: banner.mobile_image_url || null,
    desktop_position: banner.desktop_position || 'center center',
    mobile_position: banner.mobile_position || 'center center',
    display_order: Number(banner.display_order || 1),
    is_active: Boolean(banner.is_active),
    updated_at: new Date().toISOString(),
  }

  if (banner.id) {
    return unwrap(
      await client
        .from('home_banners')
        .update(payload)
        .eq('id', banner.id)
        .select()
        .single(),
    )
  }

  return unwrap(
    await client
      .from('home_banners')
      .insert({ ...payload, created_at: new Date().toISOString() })
      .select()
      .single(),
  )
}

export async function deleteBanner(id) {
  const client = getClient()
  return unwrap(await client.from('home_banners').delete().eq('id', id))
}
