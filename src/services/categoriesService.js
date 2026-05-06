import { slugify } from '../utils/slug.js'
import { getClient, isMissingColumn, unwrap, unwrapMaybe } from './helpers.js'

function normalizeCategory(category) {
  if (!category) return category
  return {
    ...category,
    is_active: category.is_active ?? true,
  }
}

export async function listCategories({ onlyActive = false, type = '' } = {}) {
  const client = getClient()
  let query = client.from('categories').select('*').order('name')

  if (onlyActive) query = query.or('is_active.eq.true,is_active.is.null')
  if (type) query = query.eq('type', type)

  const result = await query

  if (onlyActive && isMissingColumn(result.error, 'is_active')) {
    let fallbackQuery = client.from('categories').select('*').order('name')
    if (type) fallbackQuery = fallbackQuery.eq('type', type)

    return unwrap(await fallbackQuery).map(normalizeCategory)
  }

  return unwrap(result).map(normalizeCategory)
}

export async function getCategoryBySlug(slug) {
  const client = getClient()

  return normalizeCategory(unwrapMaybe(
    await client.from('categories').select('*').eq('slug', slug).maybeSingle(),
  ))
}

export async function saveCategory(category) {
  const client = getClient()
  const payload = {
    name: category.name,
    slug: category.slug || slugify(category.name),
    type: category.type || null,
    is_active: Boolean(category.is_active),
  }

  const saveQuery = category.id
    ? client
        .from('categories')
        .update(payload)
        .eq('id', category.id)
        .select()
        .single()
    : client.from('categories').insert(payload).select().single()

  const result = await saveQuery

  if (!isMissingColumn(result.error, 'is_active')) {
    return normalizeCategory(unwrap(result))
  }

  const fallbackPayload = { ...payload }
  delete fallbackPayload.is_active

  const fallbackQuery = category.id
    ? client
        .from('categories')
        .update(fallbackPayload)
        .eq('id', category.id)
        .select()
        .single()
    : client.from('categories').insert(fallbackPayload).select().single()

  return normalizeCategory(unwrap(await fallbackQuery))
}

export async function deleteCategory(id) {
  const client = getClient()
  return unwrap(await client.from('categories').delete().eq('id', id))
}
