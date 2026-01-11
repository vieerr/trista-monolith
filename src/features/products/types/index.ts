export interface Product {
  _id?: string
  name: string
  type: string
  reference?: string
  unit: string
  price: number
  tax: object
  taxRate?: number
  taxName?: string
  description?: string
  image?: File | null
  image_url?: string
  active: boolean
}

export interface InvoiceProduct {
  row_id: string
  product: Product & { total: number }
  reference: string
  price: number
  discount: number
  taxName: string
  taxRate: number
  quantity: number
  total: number
}

export interface Invoice {
  _id: string
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
  products: InvoiceProduct[]
  subtotal: number
  discount: number
  taxable_base: number
  taxes: Record<string, number>
  total: number
  created_at: string
  status: string
}
