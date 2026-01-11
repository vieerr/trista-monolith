<template>
  <div class="pb-10">
    <Card class="mb-5" shadow="shadow-2">
      <template #title>
        <Button
          icon="pi pi-arrow-left"
          class="mr-3"
          :label="t('back')"
          severity="secondary"
          variant="text"
          rounded
          text
          @click="router.back()"
        />
        <h2 class="text-xl flex items-center mt-5">
          <span> {{ t('invoices_detail.title') }} </span>
          <Badge :value="props.id" size="xlarge" class="ml-4" severity="success" />
        </h2>
      </template>
      <template #content>
        <div class="flex gap-2 mt-4">
          <Button
            variant="outlined"
            @click="printInvoice"
            size="small"
            icon="pi pi-print"
            :label="t('invoices_detail.print')"
          />
          <Button
            variant="outlined"
            @click="printInvoice"
            size="small"
            icon="pi pi-file-pdf"
            :label="t('invoices_detail.downloadPDF')"
          />
          <!-- TODO: implement share functionality -->
          <Button
            hidden
            variant="outlined"
            size="small"
            icon="pi pi-share"
            :label="t('invoices_detail.share')"
          />
          <!-- TODO: implement more actions functionality -->
          <Button
            hidden
            variant="outlined"
            size="small"
            icon="pi pi-ellipsis-v"
            :label="t('invoices_detail.moreActions')"
          />
        </div>
      </template>
    </Card>
    <!-- TODO: implement payment details and history -->

    <div
      class="corner-div relative p-4 bg-white-100 bg-white rounded-md shadow-md overflow-hidden"
      ref="invoiceContent"
    >
      <div class="w-full p-5 mx-auto bg-white">
        <h2 class="text-lg font-mono font-thin text-center text-gray-700 py-10">
          Super Awesome Company
        </h2>
        <p class="text-center mb-5 absolute top-10 right-10">
          <span class="text-gray-500 text-lg font-medium">
            <span class="text-2xl font-light"> No. </span>
            {{ invoice?.number }}
          </span>
        </p>

        <div class="flex flex-col justify-between mb-5">
          <div class="flex justify-between">
            <p>
              <span class="text-gray-500 font-light"> {{ t('invoices_detail.client') }}: </span>
              <span class="text-gray-500 font-medium">
                {{ invoice?.client_name }}
              </span>
            </p>
            <p>
              <span class="text-gray-600 font-light"> {{ t('invoices_detail.date') }}: </span>
              <span class="text-gray-500 font-medium">
                {{
                  moment(invoice?.operation_date, 'DD-MM-YYYY').locale('es').format('DD/MM/YYYY')
                }}
              </span>
            </p>
          </div>
          <Divider />
          <div class="flex justify-between">
            <p>
              <span class="text-gray-500 font-light"> {{ t('invoices_detail.clientId') }}: </span>
              <span class="text-gray-500 font-medium">
                {{ invoice?.client_id }}
              </span>
            </p>
            <p>
              <span class="text-gray-600 font-light"> {{ t('invoices_detail.due_date') }}: </span>
              <span class="text-gray-500 font-medium">
                {{ moment(invoice?.due_date, 'DD-MM-YYYY').locale('es').format('DD/MM/YYYY') }}
              </span>
            </p>
          </div>
          <Divider />
          <div class="flex justify-between">
            <p>
              <span class="text-gray-500 font-light">
                {{ t('invoices_detail.clientPhone') }}:
              </span>
              <span class="text-gray-500 font-medium">
                {{ invoice?.client_phone }}
              </span>
            </p>
          </div>
          <Divider />
        </div>

        <div class="card">
          <DataTable :value="invoice?.products" tableStyle="min-width: 50rem" class="text-sm">
            <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header">
              <template #body="slotProps">
                <span v-if="col.type === 'currency'">
                  ${{ slotProps.data[col.field].toFixed(2) }}
                </span>
                <span v-else-if="col.type === 'percentage'">
                  {{ slotProps.data[col.field] }}%
                </span>
                <span v-else>
                  {{ slotProps.data[col.field] }}
                </span>
              </template>
            </Column>
          </DataTable>
        </div>

        <div class="w-1/3 my-10 ml-auto text-md">
          <p class="text-gray-600 my-2 grid grid-cols-2 gap-7">
            <span class="text-gray-600 font-semibold text-right"
              >{{ t('invoices_detail.subtotal') }}:</span
            >
            <span class="text-right"> {{ formatCurrency(invoice?.subtotal) }} </span>
          </p>
          <p class="text-gray-600 my-2 grid grid-cols-2 gap-7">
            <span class="text-gray-600 font-semibold text-right"
              >{{ t('invoices_detail.discount') }}:</span
            >
            <span class="text-right"> -{{ formatCurrency(invoice?.discount) }} </span>
          </p>
          <p class="text-gray-600 my-2 grid grid-cols-2 gap-7">
            <span class="text-gray-600 font-semibold text-right"
              >{{ t('invoices_detail.taxable_base') }}:</span
            >
            <span class="text-right"> {{ formatCurrency(invoice?.taxable_base) }} </span>
          </p>
          <div
            v-for="(amount, name) in invoice?.taxes"
            :key="name"
            class="text-gray-600 my-2 grid grid-cols-2 gap-7"
          >
            <span class="text-gray-600 font-semibold text-right">{{ name }}:</span>
            <span class="text-right"> {{ formatCurrency(amount) }} </span>
          </div>
          <Divider />
          <p class="text-gray-600 my-3 grid grid-cols-2 gap-7">
            <span class="text-gray-600 text-2xl font-semibold text-right"
              >{{ t('invoices_detail.total') }}:</span
            >
            <span class="text-right text-2xl"> {{ formatCurrency(invoice?.total) }} </span>
          </p>
        </div>

        <div class="flex flex-col mb-5 text-left">
          <div>
            <div class="grid grid-cols-2 text-left">
              <p>
                <span class="text-gray-500 font-light">
                  {{ t('invoices_detail.payment_method') }}:
                </span>
              </p>
              <p>
                <span class="text-gray-500 font-medium">
                  {{ t(`payment_methods.${invoice?.payment_method}`) }}
                </span>
              </p>
            </div>
            <Divider />
          </div>
          <div>
            <div class="grid grid-cols-2 text-left">
              <p>
                <span class="text-gray-500 font-light">
                  {{ t('invoices_detail.payment_period') }}:
                </span>
              </p>
              <p>
                <span class="text-gray-500 font-medium">
                  {{
                    Number(invoice?.payment_period) === 0
                      ? t('payment_periods.immediate')
                      : invoice?.payment_period + ' días'
                  }}
                </span>
              </p>
            </div>
            <Divider />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import moment from 'moment'
import { DataTable, Column, Card, Button, Divider, Badge } from 'primevue'
import type { Invoice } from '@invoices/types'
import { fetchInvoiceById } from '@invoices/services/invoices'
import { useQuery } from '@tanstack/vue-query'
import { formatCurrency } from '@invoices/utils'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const props = defineProps({
  id: String,
})

const router = useRouter()
const { t } = useI18n()
const invoiceContent = ref<HTMLElement | null>(null)

const { data: invoice } = useQuery<Invoice | null>({
  queryKey: ['invoice', props.id],
  queryFn: async () => {
    const res = await fetchInvoiceById(props.id as string)
    if (res) {
      res.products = res.products.map((item) => ({
        ...item,
        productName: item.product?.name,
        description: item.product?.description,
      }))
    }
    return res
  },
})

const columns = [
  { field: 'productName', header: t('invoices_detail.product') },
  {
    field: 'reference',
    header: t('invoices_detail.reference'),
  },
  { field: 'price', header: t('invoices_detail.price'), type: 'currency' },
  { field: 'discount', header: t('invoices_detail.discount'), type: 'percentage' },
  { field: 'taxRate', header: t('invoices_detail.tax'), type: 'percentage' },
  { field: 'description', header: t('invoices_detail.description') },
  { field: 'quantity', header: t('invoices_detail.quantity') },
  { field: 'total', header: t('invoices_detail.total'), type: 'currency' },
]

const printInvoice = () => {
  if (!invoiceContent.value) return

  const originalContents = document.body.innerHTML
  const printContents = invoiceContent.value.innerHTML

  document.body.innerHTML = printContents
  window.print()
  document.body.innerHTML = originalContents
  window.location.reload()
}
</script>
