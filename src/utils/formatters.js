export function formatCurrency(value) {
  const number = Number(value || 0)

  return number.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

export function formatNumber(value, digits = 0) {
  if (value === null || value === undefined || value === '') return '-'
  return Number(value).toLocaleString('pt-BR', {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  })
}

export function getProductTypeLabel(type) {
  const labels = {
    suplemento: 'Suplemento',
    vestuario: 'Vestuário',
    acessorio: 'Acessório',
    outro: 'Outro',
  }

  return labels[type] || type || 'Produto'
}

export function getGoalLabel(goal) {
  const labels = {
    emagrecer: 'Emagrecer',
    manter: 'Manter peso',
    ganhar_massa: 'Ganhar massa',
  }

  return labels[goal] || goal || '-'
}

export function getMealTypeLabel(type) {
  const labels = {
    cafe_manha: 'Café da manhã',
    almoco: 'Almoço',
    lanche: 'Lanche',
    jantar: 'Jantar',
    ceia: 'Ceia',
  }

  return labels[type] || type || 'Refeição'
}

export function splitByComma(value) {
  if (Array.isArray(value)) return value

  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}
