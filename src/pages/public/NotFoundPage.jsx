import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <main className="page">
      <section className="panel narrow-panel">
        <span className="eyebrow">404</span>
        <h1>Página não encontrada</h1>
        <p>O endereço acessado não existe nesta loja.</p>
        <Link className="button" to="/">
          Voltar ao início
        </Link>
      </section>
    </main>
  )
}

export default NotFoundPage
