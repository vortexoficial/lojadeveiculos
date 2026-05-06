function BrandLogo({ compact = false }) {
  return (
    <span className={compact ? 'brand-logo compact' : 'brand-logo'} aria-hidden="true">
      <svg viewBox="0 0 72 72" role="img" focusable="false">
        <path
          d="M36 5 62 18v18c0 15-10 27-26 32C20 63 10 51 10 36V18L36 5Z"
          className="logo-shield"
        />
        <path
          d="M24 25c4-8 20-8 24 0l5 9-8 14-9 5-9-5-8-14 5-9Z"
          className="logo-head"
        />
        <path d="M22 22 13 12l3 17 9 1-3-8ZM50 22l9-10-3 17-9 1 3-8Z" className="logo-ear" />
        <path d="M29 35h-6l4 5 5-2-3-3ZM43 35h6l-4 5-5-2 3-3Z" className="logo-eye" />
        <path d="M33 42h6l-3 5-3-5Z" className="logo-nose" />
        <path d="M27 49c5 5 13 5 18 0" className="logo-mouth" />
      </svg>
    </span>
  )
}

export default BrandLogo
