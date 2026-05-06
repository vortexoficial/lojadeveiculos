import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { isSupabaseConfigured } from '../config/env.js'
import { supabase } from '../lib/supabaseClient.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return undefined
    }

    let isMounted = true

    async function loadSession() {
      const { data } = await supabase.auth.getSession()
      if (!isMounted) return
      setSession(data.session)
      setLoading(false)
    }

    loadSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setLoading(false)
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!session?.user?.id || !isSupabaseConfigured) {
      setProfile(null)
      return
    }

    let isMounted = true

    async function loadProfile() {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle()

      if (!isMounted) return

      if (error) {
        setProfile(null)
        return
      }

      setProfile(data)
    }

    loadProfile()

    return () => {
      isMounted = false
    }
  }, [session])

  async function signIn(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw new Error(error.message)
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw new Error(error.message)
  }

  const value = useMemo(
    () => ({
      session,
      user: session?.user || null,
      profile,
      isAdmin: profile?.role === 'admin',
      loading,
      signIn,
      signOut,
    }),
    [session, profile, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider.')
  }

  return context
}
