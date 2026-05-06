import { getClient, unwrap } from './helpers.js'

export async function listHomeCategoryBanners() {
  const client = getClient()
  return unwrap(
    await client
      .from('home_category_banners')
      .select('*')
      .order('slot', { ascending: true }),
  )
}

export async function updateHomeCategoryBanner(id, fields) {
  const client = getClient()
  return unwrap(
    await client
      .from('home_category_banners')
      .update({ ...fields, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single(),
  )
}
