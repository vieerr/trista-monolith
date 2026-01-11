type InvoiceStatus = 'Paid' | 'Pending' | 'Overdue'

export interface ProductRow {
  row_id: string
  product: Product | null
  reference?: string
  price: number
  discount: number
  tax?: { name: string; rate: number }
  taxName?: string
  taxRate?: number
  quantity: number
  total?: number
}
export interface Invoice {
  number: string
  client_id: string
  client_name: string
  client_official_id: string
  client_phone: string
  operation_date: string
  type: string
  payment_method: string
  payment_period: string
  due_date: string
  products: ProductRow[]
  subtotal: number
  discount: number
  taxable_base: number
  taxes: Record<string, number>
  total: number
  created_at: string
  status: InvoiceStatus
}

export interface Product {
  _id: string
  type: string
  unit: string
  reference?: string
  name: string
  price: number
  total?: number
  description?: string
  image_url?: string
  taxRate?: number
  taxName?: string
}

export interface InvoicesFormData {
  number: string
  client: { name: string; id: string; official_id: string; phone: string } | null
  date: Date
  payment_method: { label: string; value: string }
  payment_period: { label: string; value: string }
  due_date: Date
  products: ProductRow[]
}

export interface VoiceInvoiceData{
  transcription: string,
  products:{
    _id: string,
    count: number
  }[]
}
