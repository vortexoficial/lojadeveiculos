import { formatCurrency } from './formatters.js'

export function sanitizeWhatsappNumber(phone) {
  return String(phone || '').replace(/\D/g, '')
}

export function createWhatsappLink(phone, message) {
  const cleanPhone = sanitizeWhatsappNumber(phone)
  const encodedMessage = encodeURIComponent(message || '')

  if (!cleanPhone) return ''

  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`
}

export function buildProductWhatsappMessage(product, productUrl) {
  const price = product?.promo_price || product?.price

  return `Olá! Tenho interesse no produto: ${product?.name || ''}. Valor: ${formatCurrency(price)}. Link: ${productUrl}`
}

export function buildNutritionWhatsappMessage(goal) {
  return `Olá! Gere uma sugestão alimentar no site e gostaria de ajuda para escolher produtos adequados ao meu objetivo: ${goal}.`
}
