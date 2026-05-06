import { env } from '../config/env.js'
import { slugify } from '../utils/slug.js'
import { getClient, unwrap } from './helpers.js'

export async function uploadStoreImage(file, folder = 'products') {
  if (!file) return ''

  const client = getClient()
  const extension = file.name.split('.').pop()
  const baseName = slugify(file.name.replace(/\.[^/.]+$/, '')) || 'imagem'
  const path = `${folder}/${Date.now()}-${baseName}.${extension}`

  unwrap(
    await client.storage.from(env.productImageBucket).upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    }),
  )

  const {
    data: { publicUrl },
  } = client.storage.from(env.productImageBucket).getPublicUrl(path)

  return publicUrl
}
