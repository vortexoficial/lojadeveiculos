import { requireSupabase } from '../lib/supabaseClient.js'

export function getClient() {
  return requireSupabase()
}

export function unwrap(result) {
  if (result.error) throw new Error(result.error.message)
  return result.data
}

export function unwrapMaybe(result) {
  if (result.error && result.error.code !== 'PGRST116') {
    throw new Error(result.error.message)
  }

  return result.data || null
}

export function isMissingColumn(error, column) {
  const message = error?.message || ''
  return (
    (error?.code === '42703' && message.includes(column)) ||
    (error?.code === 'PGRST204' && message.includes(column)) ||
    message.includes(`'${column}' column`) ||
    message.includes(`column ${column}`)
  )
}

export function isMissingTable(error, table) {
  const message = error?.message || ''
  return (
    error?.code === '42P01' ||
    error?.code === 'PGRST205' ||
    message.includes(`'public.${table}'`) ||
    message.includes(`relation "public.${table}" does not exist`)
  )
}
