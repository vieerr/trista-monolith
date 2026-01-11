<script setup lang="ts">
import InvoiceDetail from '@invoices/components/InvoicesDetail/InvoiceDetail.vue'
import { Toaster } from 'vue-sonner'
import { useRoute } from 'vue-router'
const route = useRoute()
</script>
<template>
  <Toaster richColors position="top-right" />
  <InvoiceDetail :id="route.params.id + ''" />
</template>
