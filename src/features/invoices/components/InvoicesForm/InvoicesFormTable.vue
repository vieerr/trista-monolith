<template>
  <div>
    <div class="card">
      <DataTable
        v-model:selection="selectedProducts"
        class="text-xs"
        size="small"
        :value="rows"
        dataKey="row_id"
        responsiveLayout="scroll"
      >
        <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
        <Column
          field="product-service"
          headerStyle="width: 13rem"
          :header="t('invoices_form.product_service')"
          :key="`product-service-${Date.now()}`"
        >
          <template #body="slotProps">
            <FloatLabel variant="on" class="my-3">
              <Select
                size="small"
                :name="`product-select-${slotProps.data.row_id}`"
                variant="filled"
                editable
                :options="productOptions"
                optionLabel="name"
                v-model="slotProps.data.product"
                @change="onProductChange(slotProps.data, $event.value)"
                :key="`product-select-${slotProps.data.row_id}`"
                fluid
              />
            </FloatLabel>
          </template>
        </Column>
        <Column field="reference" :header="t('invoices_form.reference')">
          <template #body="slotProps">
            <InputText
              size="small"
              :id="`reference-${slotProps.data.row_id}`"
              v-model="slotProps.data.reference"
              type="text"
              fluid
            />
          </template>
        </Column>
        <Column field="price" :header="t('invoices_form.price')">
          <template #body="slotProps">
            <InputNumber
              size="small"
              :id="`price-${slotProps.data.row_id}`"
              v-model.number="slotProps.data.price"
              :min="0"
              mode="currency"
              currency="USD"
              locale="en-US"
              fluid
            />
          </template>
        </Column>
        <Column field="discount" :header="t('invoices_form.discount')" headerStyle="width: 1rem">
          <template #body="slotProps">
            <InputNumber
              size="small"
              :id="`discount-${slotProps.data.row_id}`"
              v-model.number="slotProps.data.discount"
              :min="0"
              :max="100"
              :step="0.1"
              mode="decimal"
              suffix="%"
              fluid
            />
          </template>
        </Column>
        <Column field="tax" :header="t('invoices_form.tax')" headerStyle="width: 9rem">
          <template #body="slotProps">
            <Select
              size="small"
              :name="`tax-select-${slotProps.data.row_id}`"
              variant="filled"
              :options="taxes"
              optionLabel="name"
              v-model="slotProps.data.tax"
              fluid
            />
          </template>
        </Column>
        <Column field="quantity" :header="t('invoices_form.quantity')" headerStyle="width: 1rem">
          <template #body="slotProps">
            <InputNumber
              :id="`quantity-${slotProps.data.row_id}`"
              v-model.number="slotProps.data.quantity"
              size="small"
              mode="decimal"
              :min="1"
              fluid
            />
          </template>
        </Column>
        <Column field="total" :header="t('invoices_form.total')">
          <template #body="slotProps">
            <span>{{ calculateRowTotal(slotProps.data).toFixed(2) }}</span>
          </template>
        </Column>
        <Column headerStyle="width: 5rem">
          <template #body="slotProps">
            <Button @click="deleteRow(slotProps.data.row_id)"> <i class="pi pi-times"></i> </Button>
          </template>
        </Column>
      </DataTable>
    </div>
    <div class="mt-4">
      <Button @click="addRow" variant="outlined" class="mr-4">
        <i class="pi pi-plus"></i>
        {{ t('invoices_form.add_row') }}</Button
      >
    </div>
    <div>
      <InvoicePriceDetail ref="priceDetailRef" :rows="rows" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import FloatLabel from 'primevue/floatlabel'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Select from 'primevue/select'
import { ref, reactive, type Reactive, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuery } from '@tanstack/vue-query'
import { fetchProducts } from '@invoices/services/products'
import type { ProductRow, Product } from '@invoices/types'
import InvoicePriceDetail from './InvoicePriceDetail.vue'
import { InputNumber } from 'primevue'
import { useRoute } from 'vue-router'
import { useInvoicesStore } from '@invoices/stores/invoices'
import { createProductRow, createRow } from '@invoices/utils'

const { t } = useI18n()
const route = useRoute()
const invoicesStore = useInvoicesStore()

const { data: products } = useQuery({ queryKey: ['products'], queryFn: fetchProducts })
const productOptions = computed(() => products.value ?? [])

const selectedProducts = ref([])
const priceDetailRef = ref()

const taxes = ref([
  { name: 'IVA General 12%', rate: 12 },
  { name: 'IVA Tarifa 0', rate: 0 },
])

const rows: Reactive<ProductRow[]> = reactive([createRow()])

watch(
  () => route.query.product,
  (newProductId) => {
    if (newProductId && products.value) {
      const prod = products.value.find((p) => p._id === newProductId)
      if (prod) {
        const newRow = createProductRow(prod, 1)
        rows.splice(0, 1, newRow)
      }
    }
  },
  { immediate: true },
)

watch(
  [() => invoicesStore.getVoiceInvoiceData()?.products, () => products.value],
  ([newProducts, productsData]) => {
    if (!newProducts?.length || !productsData?.length) return

    // Clear existing rows first
    rows.splice(0, rows.length)

    newProducts.forEach((product) => {
      const productFromStore = productsData.find((p) => p._id === product?._id)
      if (!productFromStore) return

      const newRow = createProductRow(productFromStore, product.count)
      console.log(newRow);
      rows.push(newRow)
    })

    // If no products were added, ensure at least one empty row
    if (rows.length === 0) {
      rows.push(createRow())
    }
  },
  { immediate: true, deep: true },
)

const addRow = () => {
  rows.push(createRow())
}
const onProductChange = (row: ProductRow, selectedProduct: Product) => {
  if (selectedProduct) {
    const productCopy = { ...selectedProduct }
    row.product = productCopy
    row.price = selectedProduct.price || 0
    row.tax = {
      rate: selectedProduct.taxRate || 0,
      name: selectedProduct.taxName || '',
    }

    row.reference = selectedProduct.reference
    console.log(row)
  }
}

const deleteRow = (row_id: string) => {
  const index = rows.findIndex((row) => row.row_id === row_id) // 👈 fixed
  if (index !== -1) {
    rows.splice(index, 1)
  }
}

const calculateRowTotal = (row: ProductRow) => {
  const priceAfterDiscount = row.price * (1 - row.discount / 100)
  const taxAmount = priceAfterDiscount * (row.tax?.rate ?? 0) / 100
  return (priceAfterDiscount + taxAmount) * row.quantity
}

const getProductRows = () => {
  const mappedRows = rows.map((row) => ({
    row_id: row.row_id,
    product: row.product,
    reference: row.reference,
    price: row.price,
    discount: row.discount,
    taxRate: row.tax?.rate ?? 0,
    taxName: row.tax?.name ?? 'IVA Tarifa 0',
    quantity: row.quantity,
    total: calculateRowTotal(row),
  }))
  return mappedRows
}

const resetTable = () => {
  rows.splice(0, rows.length, createRow())
}
defineExpose({ getProductRows, resetTable, totals: priceDetailRef })
</script>
