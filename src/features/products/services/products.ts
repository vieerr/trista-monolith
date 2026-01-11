import type { Invoice, Product } from '@products/types'
import axios from 'axios'
import { getApiBaseUrl } from '@products/utils'

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await axios.get(`${getApiBaseUrl()}/products`)
    return response.data
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export const getProductsCount = async (): Promise<number> => {
  try {
    const response = await axios.get(`${getApiBaseUrl()}/products/count`)
    return response.data
  } catch (error) {
    console.error('Error fetching products count:', error)
    return 0
  }
}

export const createProduct = async (product: FormData): Promise<void> => {
  try {
    await axios.post(`${getApiBaseUrl()}/products`, product)
  } catch (error) {
    console.error('Error creating product:', error)
    throw error
  }
}

export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const response = await axios.get(`${getApiBaseUrl()}/products/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error)
    return null
  }
}

export const getInvoicesByProductId = async (id: string): Promise<Invoice[]> => {
  try {
    const response = await axios.get(`${getApiBaseUrl()}/invoices/product/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching invoices for product with id ${id}:`, error)
    return []
  }
}


export const updateProduct = async (id: string, product: FormData): Promise<void> => {
  try {
    await axios.patch(`${getApiBaseUrl()}/products/${id}`, product)
  } catch (error) {
    console.error(`Error updating product with id ${id}:`, error)
    throw error
  }
}
