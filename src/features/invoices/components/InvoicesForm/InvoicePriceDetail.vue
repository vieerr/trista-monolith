<template>
  <div class="w-1/3 my-10">
    <p class="text-gray-600 my-3 grid grid-cols-2 gap-7">
      <span class="text-gray-600 font-semibold text-right">{{ t('invoices_form.subtotal') }}</span>
      <span class="text-right"> ${{ calculateSubtotal(rows).toFixed(2) }} </span>
    </p>
    <p class="text-gray-600 my-3 grid grid-cols-2 gap-7">
      <span class="text-gray-600 font-semibold text-right">{{ t('invoices_form.discount') }}:</span>
      <span class="text-right"> -${{ calculateDiscount(rows).toFixed(2) }} </span>
    </p>
    <p class="text-gray-600 my-3 grid grid-cols-2 gap-7">
      <span class="text-gray-600 font-semibold text-right">{{ t('invoices_form.taxable_base') }}:</span>
      <span class="text-right"> ${{ calculateTaxableBase(rows).toFixed(2) }} </span>
    </p>
    <div
      v-for="(amount, taxName) in getTaxAmounts(rows)"
      :key="taxName"
      class="text-gray-600 my-3 grid grid-cols-2 gap-7"
    >
      <span class="text-gray-600 font-semibold text-right">{{ taxName }}:</span>
      <span class="text-right"> ${{ amount.toFixed(2) }} </span>
    </div>
    <Divider />
    <p class="text-gray-600 my-3 grid grid-cols-2 gap-7">
      <span class="text-gray-600 text-2xl font-semibold text-right">{{ t('invoices_form.total') }}:</span>
      <span class="text-right text-2xl"> ${{ calculateTotal(rows).toFixed(2) }} </span>
    </p>
  </div>
</template>

<script setup lang="ts">
import Divider from 'primevue/divider'
import type { ProductRow } from '@invoices/types'
import { computed } from 'vue'
import type { Reactive } from 'vue'
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  rows: Reactive<ProductRow[]>
}>()

const { t } = useI18n()

const calculateSubtotal = (rows: Reactive<ProductRow[]>): number => {
  return rows.reduce((total, row) => {
    const rowTotal = row.quantity * row.price
    return total + rowTotal
  }, 0)
}

const calculateDiscount = (rows: Reactive<ProductRow[]>): number => {
  return rows.reduce((total, row) => {
    const discountAmount = (row.discount / 100) * row.quantity * row.price
    return total + discountAmount
  }, 0)
}

const calculateTaxableBase = (rows: Reactive<ProductRow[]>): number => {
  return calculateSubtotal(rows) - calculateDiscount(rows)
}

const getTaxAmounts = (rows: Reactive<ProductRow[]>): Record<string, number> => {
  const taxAmounts: Record<string, number> = {}

  rows.forEach((row) => {
    if (row.tax && row.tax.rate > 0) {
      const taxableAmount = row.quantity * row.price * (1 - row.discount / 100)
      const taxAmount = (row.tax.rate / 100) * taxableAmount

      if (taxAmounts[row.tax.name]) {
        taxAmounts[row.tax.name] += taxAmount
      } else {
        taxAmounts[row.tax.name] = taxAmount
      }
    }
  })

  return taxAmounts
}

const calculateTotal = (rows: Reactive<ProductRow[]>): number => {
  const subtotal = calculateSubtotal(rows)
  const discount = calculateDiscount(rows)
  const taxableBase = subtotal - discount
  const totalTax = Object.values(getTaxAmounts(rows)).reduce((sum, amount) => sum + amount, 0)
  return taxableBase + totalTax
}

defineExpose({
  calculateTotal,
  subtotal: computed(() => calculateSubtotal(props.rows)),
  discount: computed(() => calculateDiscount(props.rows)),
  taxable_base: computed(() => calculateTaxableBase(props.rows)),
  taxes: computed(() => getTaxAmounts(props.rows)),
  total: computed(() => calculateTotal(props.rows)),
})
</script>
