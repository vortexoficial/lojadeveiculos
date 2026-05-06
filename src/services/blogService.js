import { getClient, isMissingTable, unwrap, unwrapMaybe } from './helpers.js'

function throwMissingBlogTable(error) {
  if (isMissingTable(error, 'blog_posts')) {
    throw new Error('A tabela blog_posts ainda nao existe no Supabase. Rode o schema.sql atualizado no SQL Editor.')
  }

  throw new Error(error.message)
}

export async function listPosts({ onlyPublished = false, limit = 50 } = {}) {
  const client = getClient()
  let query = client
    .from('blog_posts')
    .select('id, title, slug, excerpt, cover_url, published, published_at, created_at')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (onlyPublished) query = query.eq('published', true)

  const result = await query
  if (isMissingTable(result.error, 'blog_posts')) return []

  return unwrap(result)
}

export async function getPostBySlug(slug) {
  const client = getClient()
  const result = await client.from('blog_posts').select('*').eq('slug', slug).maybeSingle()
  if (isMissingTable(result.error, 'blog_posts')) return null

  return unwrapMaybe(result)
}

export async function getPostById(id) {
  const client = getClient()
  const result = await client.from('blog_posts').select('*').eq('id', id).maybeSingle()
  if (isMissingTable(result.error, 'blog_posts')) return null

  return unwrapMaybe(result)
}

export async function createPost(post) {
  const client = getClient()
  const result = await client.from('blog_posts').insert(post).select().single()
  if (result.error) throwMissingBlogTable(result.error)

  return result.data
}

export async function updatePost(id, post) {
  const client = getClient()
  const result = await client.from('blog_posts').update(post).eq('id', id).select().single()
  if (result.error) throwMissingBlogTable(result.error)

  return result.data
}

export async function deletePost(id) {
  const client = getClient()
  const { error } = await client.from('blog_posts').delete().eq('id', id)
  if (error) throwMissingBlogTable(error)
}
