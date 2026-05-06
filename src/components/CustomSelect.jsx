import { useEffect, useMemo, useRef, useState } from 'react'

function CustomSelect({ value, options = [], onChange, disabled = false, placeholder = 'Selecione' }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)

  const selectedOption = useMemo(
    () => options.find((option) => option.value === value),
    [options, value],
  )

  useEffect(() => {
    if (!open) return undefined

    function handlePointerDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false)
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  function selectOption(nextValue) {
    onChange(nextValue)
    setOpen(false)
  }

  return (
    <div className={`custom-select${open ? ' open' : ''}`} ref={rootRef}>
      <button
        className="custom-select-trigger"
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span>{selectedOption?.label || placeholder}</span>
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M7 10l5 5 5-5" />
        </svg>
      </button>

      {open ? (
        <div className="custom-select-menu" role="listbox">
          {options.map((option) => (
            <button
              key={option.value}
              className={option.value === value ? 'selected' : ''}
              type="button"
              role="option"
              aria-selected={option.value === value}
              onClick={() => selectOption(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export default CustomSelect
