function NumberInput({
  value,
  onChange,
  min,
  max,
  step = 1,
  disabled = false,
  required = false,
}) {
  const numericStep = Number(step) || 1

  function clamp(nextValue) {
    if (nextValue === '') return ''

    let parsed = Number(nextValue)
    if (Number.isNaN(parsed)) return value || ''
    if (min !== undefined) parsed = Math.max(Number(min), parsed)
    if (max !== undefined) parsed = Math.min(Number(max), parsed)

    return String(parsed)
  }

  function adjust(direction) {
    const currentValue = value === '' || value === null || value === undefined
      ? Number(min || 0)
      : Number(value)
    const nextValue = currentValue + direction * numericStep
    onChange(clamp(nextValue))
  }

  return (
    <div className="number-input">
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        required={required}
        inputMode="decimal"
        onChange={(event) => onChange(event.target.value)}
        onBlur={(event) => onChange(clamp(event.target.value))}
      />
      <div className="number-input-controls">
        <button type="button" tabIndex={-1} disabled={disabled} onClick={() => adjust(1)}>
          <svg viewBox="0 0 24 24">
            <path d="M7 14l5-5 5 5" />
          </svg>
        </button>
        <button type="button" tabIndex={-1} disabled={disabled} onClick={() => adjust(-1)}>
          <svg viewBox="0 0 24 24">
            <path d="M7 10l5 5 5-5" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default NumberInput
