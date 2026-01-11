<script setup lang="ts">
import InvoicesForm from '@invoices/components/InvoicesForm/InvoicesForm.vue'
import { useI18n } from 'vue-i18n'
import { Card } from 'primevue'
import { Toaster } from 'vue-sonner'
const { t } = useI18n()
</script>

<template>
  <Toaster richColors position="top-right" />

  <Card class="mb-5" shadow="shadow-2">
    <template #title>
      {{ t('invoices_form.title') }}
      <i class="pi pi-receipt ml-2 text-4xl" style="font-size: 1.5rem"></i>
    </template>
    <template #content>
      <p class="m-0">
        {{ t('invoices_form.description') }}
      </p>
    </template>
  </Card>

  <InvoicesForm />
</template>
