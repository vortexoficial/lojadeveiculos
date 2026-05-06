function Loading({ message = 'Carregando...' }) {
  return (
    <div className="loading-state" role="status" aria-live="polite" aria-label={message}>
      <span className="spinner" aria-hidden="true" />
    </div>
  )
}

export default Loading
