function FormStatus({ error, success }) {
  if (!error && !success) return null

  return (
    <div className={error ? 'form-status error' : 'form-status success'}>
      {error || success}
    </div>
  )
}

export default FormStatus
