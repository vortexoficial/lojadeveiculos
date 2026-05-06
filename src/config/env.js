export const env = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
  supabaseAnonKey:
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    import.meta.env.VITE_SUPABASE_ANON_KEY ||
    '',
  productImageBucket:
    import.meta.env.VITE_SUPABASE_PRODUCT_IMAGE_BUCKET || 'product-images',
  appUrl:
    import.meta.env.VITE_APP_URL ||
    (typeof window !== 'undefined' ? window.location.origin : ''),
}

export const isSupabaseConfigured = Boolean(
  env.supabaseUrl && env.supabaseAnonKey,
)
