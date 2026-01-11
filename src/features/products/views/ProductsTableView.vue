<script setup lang="ts">
import ProductsTable from '@products/components/ProductsTable.vue'
import { useI18n } from 'vue-i18n'
import { Card } from 'primevue'
import Button from 'primevue/button'
import { useRouter } from 'vue-router'
const { t } = useI18n()

const router = useRouter()

const goToCreation = () => {
  router.push(router.getRoutes().find((route) => route.name === 'AddProduct')!.path)
}
</script>

<template>
  <Card class="mb-5" shadow="shadow-2">
    <template #title>
      <h2 class="mb-4 text-xl">
        {{ t('products_view.title') }}
        <i class="pi pi-box ml-2 text-4xl" style="font-size: 1.5rem"></i>
      </h2>
    </template>
    <template #content>
      <p class="mb-2 text-gray-600">
        {{ t('products_view.description') }}
      </p>
      <Button
        :label="t('products_view.createProduct')"
        icon="pi pi-plus"
        class="mt-2"
        @click="goToCreation"
      />
    </template>
  </Card>
  <ProductsTable />
</template>
