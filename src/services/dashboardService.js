import { getClient, isMissingTable } from './helpers.js'

async function countTable(client, table) {
  const { count, error } = await client
    .from(table)
    .select('*', { count: 'exact', head: true })

  if (isMissingTable(error, table)) return 0
  if (error) throw new Error(error.message)
  return count || 0
}

export async function getDashboardSummary() {
  const client = getClient()
  const [products, categories, banners, posts] = await Promise.all([
    countTable(client, 'products'),
    countTable(client, 'categories'),
    countTable(client, 'home_banners'),
    countTable(client, 'blog_posts'),
  ])

  return { products, categories, banners, posts }
}
