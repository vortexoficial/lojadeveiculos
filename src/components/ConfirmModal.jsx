import { useCallback, useState } from 'react'
import { createPortal } from 'react-dom'

function ConfirmModal({ config, onCancel, onConfirm }) {
  if (!config) return null

  const tone = config.tone || 'danger'

  return createPortal(
    <div className="confirm-modal-layer" role="presentation">
      <button
        className="confirm-modal-backdrop"
        type="button"
        aria-label="Cancelar"
        onClick={onCancel}
      />
      <section className={`confirm-modal ${tone}`} role="dialog" aria-modal="true" aria-labelledby="confirm-title">
        <div className="confirm-modal-icon" aria-hidden="true">
          {tone === 'danger' ? (
            <svg viewBox="0 0 24 24">
              <path d="M12 9v4M12 17h.01" />
              <path d="M10.3 4.3L2.4 18a2 2 0 001.7 3h15.8a2 2 0 001.7-3L13.7 4.3a2 2 0 00-3.4 0z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24">
              <path d="M12 5v14M5 12h14" />
            </svg>
          )}
        </div>
        <div className="confirm-modal-body">
          <span className="eyebrow">{config.eyebrow || 'Confirmação'}</span>
          <h2 id="confirm-title">{config.title}</h2>
          {config.message ? <p>{config.message}</p> : null}
        </div>
        <div className="confirm-modal-actions">
          <button className="button secondary small" type="button" onClick={onCancel}>
            {config.cancelLabel || 'Cancelar'}
          </button>
          <button className={`button small ${tone === 'danger' ? 'danger' : ''}`} type="button" onClick={onConfirm}>
            {config.confirmLabel || 'Confirmar'}
          </button>
        </div>
      </section>
    </div>,
    document.body,
  )
}

export function useConfirm() {
  const [config, setConfig] = useState(null)

  const confirm = useCallback(
    (nextConfig) =>
      new Promise((resolve) => {
        setConfig({
          ...nextConfig,
          resolve,
        })
      }),
    [],
  )

  function handleCancel() {
    config?.resolve(false)
    setConfig(null)
  }

  function handleConfirm() {
    config?.resolve(true)
    setConfig(null)
  }

  const confirmation = (
    <ConfirmModal config={config} onCancel={handleCancel} onConfirm={handleConfirm} />
  )

  return { confirm, confirmation }
}

export default ConfirmModal
