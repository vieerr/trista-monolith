import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { VoiceInvoiceData } from '@invoices/types'

export const useInvoicesStore = defineStore('invoices', () => {
  // State
  const voiceInvoiceData = ref<VoiceInvoiceData | null>(null)

  // Actions
  function setVoiceInvoiceData(data: VoiceInvoiceData) {
    voiceInvoiceData.value = data
  }

  function clearVoiceInvoiceData() {
    voiceInvoiceData.value = null
  }

  // Getters
  function getVoiceInvoiceData(): VoiceInvoiceData | null {
    return voiceInvoiceData.value
  }

  return {
    // State
    voiceInvoiceData,

    // Actions
    setVoiceInvoiceData,
    clearVoiceInvoiceData,

    // Getters
    getVoiceInvoiceData,
  }
})
