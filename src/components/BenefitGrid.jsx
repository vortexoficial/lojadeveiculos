function IcoWhatsapp() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a8.5 8.5 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413" />
    </svg>
  )
}

function IcoDumbbell() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6.5 6.5h11" /><path d="M6.5 17.5h11" />
      <rect x="2" y="9" width="3" height="6" rx="1" /><rect x="19" y="9" width="3" height="6" rx="1" />
      <rect x="5" y="7" width="2" height="10" rx="1" /><rect x="17" y="7" width="2" height="10" rx="1" />
    </svg>
  )
}

function IcoShirt() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z" />
    </svg>
  )
}

function IcoTag() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  )
}

function IcoBolt() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  )
}

const benefits = [
  {
    icon: <IcoWhatsapp />,
    title: 'Atendimento via WhatsApp',
    desc: 'Atendimento rapido e personalizado direto no seu celular, sem filas ou espera.',
  },
  {
    icon: <IcoDumbbell />,
    title: 'Veiculos selecionados',
    desc: 'Opcoes revisadas para quem busca confianca, procedencia e bom negocio.',
  },
  {
    icon: <IcoShirt />,
    title: 'Consultoria na escolha',
    desc: 'Ajuda para comparar modelos, versoes, condicoes e formas de pagamento.',
  },
  {
    icon: <IcoTag />,
    title: 'Ofertas frequentes',
    desc: 'Oportunidades reais para voce negociar sem abrir mao da procedencia.',
  },
  {
    icon: <IcoBolt />,
    title: 'Negociacao simples e direta',
    desc: 'Sem formulario complicado. Escolha, chame no WhatsApp e avance com agilidade.',
  },
]

function BenefitGrid() {
  return (
    <div className="benefit-steps">
      {benefits.map((b, i) => (
        <div key={b.title} className={`benefit-step ${i % 2 === 0 ? 'is-left' : 'is-right'}`}>
          <div className="benefit-step-card">
            <div className="benefit-step-icon">{b.icon}</div>
            <div className="benefit-step-text">
              <strong>{b.title}</strong>
              <p>{b.desc}</p>
            </div>
          </div>
          <div className="benefit-step-dot" aria-hidden="true">
            <span>{String(i + 1).padStart(2, '0')}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default BenefitGrid
