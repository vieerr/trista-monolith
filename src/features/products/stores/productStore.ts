import { defineStore } from 'pinia'
import type { Product } from '@products/types'

export const useProductStore = defineStore('product', {
  state: () => ({
    selectedProduct: null as Product | null
  }),
  actions: {
    setSelectedProduct(product: Product) {
      this.selectedProduct = product
    },
    cleanSelectedProduct() {
      this.selectedProduct = null
    }
  },
  getters: {
    getSelectedProduct: (state) => state.selectedProduct
  }
})
