<template>
  <div class="table-container">
    <div class="border rounded-xl text-sm font-light overflow-hidden border-gray-200">
      <DataTable
        v-model:selection="selectedProducts"
        v-model:filters="filters"
        filterDisplay="row"
        removableSort
        @row-click="onRowClick"
        size="small"
        paginator
        :rows="10"
        :value="sortedProducts"
        :rowClass="() => 'group cursor-pointer'"
        tableStyle="width: 100%; table-layout: fixed;"
      >
        <template #header>
          <div class="flex justify-start p-2 py-4">
            <IconField>
              <InputIcon>
                <i class="pi pi-search" />
              </InputIcon>
              <InputText
                size="small"
                type="search"
                v-model="filters['global'].value"
                placeholder="Buscar..."
                class="text-xs h-7"
              />
            </IconField>
          </div>
        </template>
        <template #empty> {{ t('products_table.noProducts') }} </template>
        <template #loading> {{ t('products_table.loading') }} </template>
        <Column
          selectionMode="multiple"
          headerStyle="width: 3rem"
          class="selection-column"
        ></Column>
        <Column
          :bodyClass="'group-hover:bg-gray-100 transition-colors'"
          v-for="col of columns"
          :key="col.field"
          :field="col.field"
          :header="col.header"
          sortable
          :showFilterMenu="false"
          :style="{ width: col.width }"
          class="truncate"
        >
          <template #body="slotProps">
            <span :title="slotProps.data[col.field]" class="truncate block py-3">
              {{
                col.translate
                  ? t(`invoices.${slotProps.data[col.field]}`)
                  : slotProps.data[col.field]
              }}
            </span>
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText
              v-model="filterModel.value"
              size="small"
              type="text"
              @input="filterCallback()"
              :placeholder="`${t(col.header)}`"
              class="w-full text-xs h-7"
            />
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script lang="ts" setup>
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import { computed, ref } from 'vue'
import { fetchProducts } from '@products/services/products'
import type { Product } from '@products/types'
import { useQuery } from '@tanstack/vue-query'
import { FilterMatchMode } from '@primevue/core/api'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useProductStore } from '@products/stores/productStore'

const { t } = useI18n()
const router = useRouter()
const productStore = useProductStore()

const selectedProducts = ref<Product[]>([])

const { data: products } = useQuery<Product[]>({
  queryKey: ['products'],
  queryFn: fetchProducts,
})
const sortedProducts = computed(() => (products.value ?? []).slice().reverse())
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  reference: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  price: { value: null, matchMode: FilterMatchMode.CONTAINS },
  description: { value: null, matchMode: FilterMatchMode.CONTAINS },
  taxName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
})

const columns = ref([
  { field: 'name', header: t('products.name'), translate: false, width: '24%' },
  { field: 'reference', header: t('products.reference'), translate: false, width: '22%' },
  { field: 'price', header: t('products.price'), translate: false, width: '16%' },
  { field: 'description', header: t('products.description'), translate: false, width: '22%' },
  { field: 'taxName', header: t('products.taxName'), translate: false, width: '16%' },
])

const onRowClick = (event: { data: Product }) => {
  productStore.setSelectedProduct(event.data)
  router.push(
    router
      .getRoutes()
      .find((route) => route.name === 'ViewProduct')!
      .path.replace(':id', event.data._id!),
  )
}
</script>
