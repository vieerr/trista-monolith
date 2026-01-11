<script setup lang="ts">
import ProductsForm from '@products/components/ProductsForm/ProductsForm.vue'
import { useI18n } from 'vue-i18n'
import { Card } from 'primevue'
import { useProductStore } from '@products/stores/productStore'
const { t } = useI18n()
const productStore = useProductStore()
</script>

<template>
  <Card class="mb-5" shadow="shadow-2">
    <template #title>
      <span v-if="!!productStore.selectedProduct?._id">
        {{ t('products_form.edit_title') }}
      </span>
      <span v-else>
        {{ t('products_form.title') }}
      </span>

      <i class="pi pi-box ml-2 text-4xl" style="font-size: 1.5rem"></i>
    </template>
    <template #content>
      <p v-if="!!productStore.selectedProduct?._id" class="m-0">
        {{ t('products_form.edit_description') }}
      </p>
      <p v-else class="m-0">
        {{ t('products_form.description') }}
      </p>
    </template>
  </Card>

  <ProductsForm />
</template>
