import { Navigate, useLocation } from 'react-router-dom'
import { isSupabaseConfigured } from '../config/env.js'
import { useAuth } from '../context/AuthContext.jsx'
import Loading from '../components/Loading.jsx'

function ProtectedRoute({ children }) {
  const location = useLocation()
  const { user, isAdmin, loading } = useAuth()

  if (!isSupabaseConfigured) {
    return (
      <main className="auth-shell">
        <section className="panel narrow-panel">
          <h1>Supabase não configurado</h1>
          <p>
            Crie o arquivo <code>.env.local</code> com as variáveis do
            Supabase para acessar o painel administrativo.
          </p>
        </section>
      </main>
    )
  }

  if (loading) return <Loading message="Verificando acesso..." />

  if (!user) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />
  }

  if (!isAdmin) {
    return (
      <main className="auth-shell">
        <section className="panel narrow-panel">
          <h1>Acesso restrito</h1>
          <p>Este usuário não possui permissão de administrador.</p>
        </section>
      </main>
    )
  }

  return children
}

export default ProtectedRoute
