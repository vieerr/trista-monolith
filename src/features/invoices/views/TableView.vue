<script setup lang="ts">
import InvoicesTable from '@invoices/components/InvoicesTable.vue'
import { useI18n } from 'vue-i18n'
import { Card, OverlayBadge } from 'primevue'
import Button from 'primevue/button'
const { t } = useI18n()
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { Toaster } from 'vue-sonner'
import InvoiceAudioRecorder from '@invoices/components/VoiceInvoiceAI/InvoiceAudioRecorder.vue'

const router = useRouter()

const isAudioRecorderOpen = ref(false)

const openAudioRecorder = () => {
  isAudioRecorderOpen.value = true
}

const goToCreation = () => {
  router.push(router.getRoutes().find((route) => route.name === 'AddInvoice')!.path)
}
</script>

<template>
  <Toaster richColors position="top-right" />
  <Card class="mb-5" shadow="shadow-2">
    <template #title>
      <h2 class="mb-4 text-xl">
        {{ t('invoices_table.title') }}
        <i class="pi pi-receipt ml-2 text-4xl" style="font-size: 1.5rem"></i>
      </h2>
    </template>
    <template #content>
      <p class="mb-2 text-gray-600">
        {{ t('invoices_table.description') }}
      </p>
      <div class="flex space-x-4 mt-5">
        <Button label="Añadir Factura" icon="pi pi-plus" class="mt-2" @click="goToCreation" />

        <OverlayBadge value="¡Nuevo!" severity="contrast" size="small">
          <Button
            label="Factura por Voz"
            icon="pi pi-microphone"
            class="mt-2"
            @click="openAudioRecorder"
          />
        </OverlayBadge>
      </div>
    </template>
  </Card>
  <InvoicesTable />
  <InvoiceAudioRecorder
    :open="isAudioRecorderOpen"
    @update:open="(value) => (isAudioRecorderOpen = value)"
  />
</template>
