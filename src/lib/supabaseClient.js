import { createClient } from '@supabase/supabase-js'
import { env, isSupabaseConfigured } from '../config/env.js'

export const supabase = isSupabaseConfigured
  ? createClient(env.supabaseUrl, env.supabaseAnonKey)
  : null

export function requireSupabase() {
  if (!supabase) {
    throw new Error(
      'Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo .env.local.',
    )
  }

  return supabase
}
