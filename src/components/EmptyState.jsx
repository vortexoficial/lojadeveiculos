function EmptyState({ title, message, action }) {
  return (
    <section className="empty-state">
      <h2>{title}</h2>
      {message ? <p>{message}</p> : null}
      {action ? <div>{action}</div> : null}
    </section>
  )
}

export default EmptyState
