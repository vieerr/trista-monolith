import type { Invoice, VoiceInvoiceData } from '@invoices/types'
import { getApiBaseUrl, getVoiceAPIBaseUrl } from '@invoices/utils'
import axios from 'axios'

export const fetchInvoices = async (): Promise<Invoice[]> => {
  try {
    const response = await axios.get(`${getApiBaseUrl()}/invoices`)
    return response.data
  } catch (error) {
    console.error('Error fetching invoices:', error)
    return []
  }
}

export const fetchInvoiceById = async (id: string): Promise<Invoice | null> => {
  try {
    const response = await axios.get(`${getApiBaseUrl()}/invoices/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching invoice with id ${id}:`, error)
    return null
  }
}

export const getInvoicesCount = async (): Promise<number> => {
  try {
    const response = await axios.get(`${getApiBaseUrl()}/invoices/count`)
    return response.data
  } catch (error) {
    console.error('Error fetching invoices count:', error)
    return 0
  }
}

export const createInvoice = async (invoice: Invoice): Promise<void> => {
  try {
    await axios.post(`${getApiBaseUrl()}/invoices`, invoice)
  } catch (error) {
    console.error('Error creating invoice:', error)
    throw error
  }
}

export const processInvoiceAudio = async (audioBlob: Blob): Promise<VoiceInvoiceData> => {
  try {
    const formData = new FormData()
    formData.append('audio', audioBlob)

    const response = await axios.post(`${getVoiceAPIBaseUrl()}/process-audio`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return response.data
  } catch (error) {
    console.error('Error processing invoice audio:', error)
    throw error
  }
}
