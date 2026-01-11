import type { Product, ProductRow } from '@invoices/types'
import moment from 'moment'

const defaultTax = { name: 'IVA Tarifa 0', rate: 0 }

export const getApiBaseUrl = (): string => {
  return import.meta.env.MODE === 'production'
    ? import.meta.env.VITE_API_URL_PROD
    : import.meta.env.VITE_API_URL_DEV
}

export const getVoiceAPIBaseUrl = (): string => {
  return import.meta.env.MODE === 'production'
    ? import.meta.env.VITE_VOICE_API_URL_PROD
    : import.meta.env.VITE_VOICE_API_URL_DEV
}
export const formatCurrency = (value: number | undefined): string => {
  return `$${value?.toFixed(2).replace('.', ',')}`
}

export const createRow = (): ProductRow => ({
  row_id: Date.now().toString(),
  product: null,
  quantity: 1,
  price: 0,
  discount: 0,
  tax: defaultTax,
  reference: '',
})

export const createProductRow = (product: Product, quantity: number): ProductRow => {
  return {
    ...createRow(),
    product: product,
    price: product.price,
    tax: {
      rate: product.taxRate || 0,
      name: product.taxName || '',
    },
    reference: product.reference,
    quantity: quantity,
    discount: 0,
  }
}

export const mapVoiceProductsToInvoiceProducts = (voiceProducts: Array<{ _id: string; count: number }>, availableProducts: Product[]) => {
  if (!voiceProducts?.length || !availableProducts?.length) return []

  return voiceProducts
    .map((item) => {
      const prod = availableProducts.find((p) => p._id === item._id)
      if (prod) {
        return {
          ...prod,
          count: item.count,
        }
      }
      return null
    })
    .filter((p) => p !== null)
}

export const calculateInvoiceTotals = (products: Array<Product & { count: number }>) => {
  const subtotal = products.reduce(
    (sum, item) => sum + (item.price || 0) * (item.count || 0),
    0
  )

  const taxAmount = products.reduce(
    (sum, item) => sum + ((item.price || 0) * (item.count || 0) * (item.taxRate || 0)) / 100,
    0
  )

  const total = subtotal + taxAmount

  return {
    subtotal,
    taxAmount,
    total,
    taxable_base: subtotal,
    taxes: {
      'IVA General 12%': taxAmount
    }
  }
}

export const createInvoiceFromVoiceData = async (
  voiceProducts: Array<Product & { count: number }>,
  getInvoicesCount: () => Promise<number>
) => {
  const invoiceCount = await getInvoicesCount()
  const totals = calculateInvoiceTotals(voiceProducts)
  const currentDate = moment().format('DD/MM/YYYY')
  const currentDateTime = moment().format('DD/MM/YYYY HH:mm:ss')

  return {
    number: (invoiceCount + 1).toString(),
    client_id: '0',
    client_name: 'Consumidor Final',
    client_official_id: '00000000',
    client_phone: '098765432',
    operation_date: currentDate,
    type: 'Simple',
    payment_method: 'cash',
    payment_period: '0',
    due_date: currentDate,
    products: voiceProducts.map((item) => ({
      row_id: Date.now().toString(),
      product: item,
      reference: item.reference,
      price: item.price,
      discount: 0,
      taxName: item.taxName || 'IVA Tarifa 0',
      taxRate: item.taxRate || 0,
      description: item.description,
      quantity: item.count,
      total: (item.price || 0) * (item.count || 0),
    })),
    subtotal: totals.subtotal,
    discount: 0,
    taxes: totals.taxes,
    taxable_base: totals.taxable_base,
    total: totals.total,
    created_at: currentDateTime,
    status: 'Paid' as const,
  }
}
