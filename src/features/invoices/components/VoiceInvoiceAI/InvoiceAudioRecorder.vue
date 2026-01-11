<script setup lang="ts">
import { AVMedia } from 'vue-audio-visual'
import { reactive, computed, ref } from 'vue'
import { Dialog, Button } from 'primevue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { createInvoice, getInvoicesCount, processInvoiceAudio } from '@invoices/services/invoices'
import type { Invoice, VoiceInvoiceData } from '@invoices/types'
import { useInvoicesStore } from '@invoices/stores/invoices'
import { useRouter } from 'vue-router'
import { fetchProducts } from '@invoices/services/products'
import { toast } from 'vue-sonner'
import { mapVoiceProductsToInvoiceProducts, createInvoiceFromVoiceData } from '@invoices/utils'

defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()

const queryClient = useQueryClient()

const { mutate: createInvoiceMutation } = useMutation({
  mutationFn: (newInvoice: Invoice) => createInvoice(newInvoice),
  onSuccess: () => {
    toast.success('Factura creada con éxito')
    queryClient.invalidateQueries({ queryKey: ['invoices'] })
    queryClient.invalidateQueries({ queryKey: ['invoice-count'] })
  },
  onError: () => {
    toast.error('Error al crear la factura')
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['dashboardAnalytics'] })
    invoicesStore.clearVoiceInvoiceData()
  },
})

const { data: products } = useQuery({ queryKey: ['products'], queryFn: fetchProducts })
const router = useRouter()
const invoicesStore = useInvoicesStore()
const state = reactive({
  status: 'idle' as 'idle' | 'recording' | 'loading' | 'done' | 'processed',
  mediaStream: null as MediaStream | null,
  mediaRecorder: null as MediaRecorder | null,
  audioChunks: [] as BlobPart[],
  audioBlob: null as Blob | null,
})

const apiResponse = ref<string>('')
const apiData = ref<VoiceInvoiceData | null>(null)

const {
  mutate: processAudio,
  isPending: isProcessing,
  isError: hasError,
  error: apiError,
} = useMutation({
  mutationFn: () => {
    if (!state.audioBlob) {
      throw new Error('No audio blob available')
    }
    return processInvoiceAudio(state.audioBlob)
  },
  onSuccess: (data) => {
    console.log('Server response:', data)
    apiResponse.value = JSON.stringify(data, null, 2)
    apiData.value = data
    if (data) {
      invoicesStore.setVoiceInvoiceData(data)
    }
    state.status = 'processed'
  },
  onError: (error) => {
    console.error('Error processing audio:', error)
    apiResponse.value = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    state.status = 'done'
  },
})

const buttonLabel = computed(() => {
  switch (state.status) {
    case 'idle':
      return 'Empezar'
    case 'recording':
      return 'Detener'
    case 'loading':
      return 'Grabación lista'
    case 'done':
      return 'Reiniciar'
    case 'processed':
      return 'Nueva Grabación'
    default:
      return 'Start Recording'
  }
})

const buttonIcon = computed(() => {
  switch (state.status) {
    case 'idle':
      return 'pi pi-microphone'
    case 'recording':
      return 'pi pi-stop'
    case 'loading':
      return 'pi pi-check'
    case 'done':
    case 'processed':
      return 'pi pi-replay'
    default:
      return 'pi pi-microphone'
  }
})

function handleProcessAudio() {
  if (!state.audioBlob) return
  processAudio()
}

// Función para iniciar/detener grabación
async function startStopRecording() {
  if (state.status === 'idle') {
    try {
      state.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true })
      state.audioChunks = []
      state.mediaRecorder = new MediaRecorder(state.mediaStream)
      state.mediaRecorder.ondataavailable = (e) => state.audioChunks.push(e.data)
      state.mediaRecorder.onstop = () => {
        state.audioBlob = new Blob(state.audioChunks, { type: 'audio/webm' })
        state.status = 'done'
        console.log('Recording done, blob:', state.audioBlob)
        // Limpiar respuesta anterior
        apiResponse.value = ''
        apiData.value = null
      }
      state.mediaRecorder.start()
      state.status = 'recording'
    } catch (error) {
      console.error('Error accessing microphone:', error)
      state.status = 'idle'
    }
  } else if (state.status === 'recording') {
    state.status = 'loading'
    state.mediaRecorder?.stop()
    state.mediaStream?.getTracks().forEach((track) => track.stop())
  } else if (
    state.status === 'done' ||
    state.status === 'loading' ||
    state.status === 'processed'
  ) {
    // Reiniciar
    resetState()
  }
}

const mappedProducts = computed(() => {
  if (!apiData.value?.products?.length || !products.value?.length) return []

  return mapVoiceProductsToInvoiceProducts(apiData.value.products, products.value)
})

const facturar = async () => {
  if (!mappedProducts.value.length) return

  const invoice = await createInvoiceFromVoiceData(mappedProducts.value, getInvoicesCount)
  createInvoiceMutation(invoice)
  closeModal()
}

const editar = () => {
  router.push(router.getRoutes().find((route) => route.name === 'AddInvoice')!.path)
}

const intentarDeNuevo = () => {
  resetState()
}

const resetState = () => {
  state.status = 'idle'
  state.audioBlob = null
  apiResponse.value = ''
  apiData.value = null
}

// Función para cancelar
function cancelRecording() {
  if (state.status === 'recording') {
    state.mediaRecorder?.stop()
    state.mediaStream?.getTracks().forEach((track) => track.stop())
  }
  resetState()
  emit('update:open', false)
}

function closeModal() {
  cancelRecording()
}

// Computed para el estado de loading que considera el useQuery
const isLoadingState = computed(() => {
  return state.status === 'loading' || isProcessing.value
})

// Computed para mostrar errores de la API
const errorMessage = computed(() => {
  if (apiError.value) {
    return apiError.value instanceof Error ? apiError.value.message : 'Error desconocido'
  }
  return null
})
</script>

<template>
  <Dialog
    :visible="open"
    @update:visible="closeModal"
    modal
    header="Factura por Voz"
    class="w-full max-w-md rounded-xl shadow-2xl"
  >
    <span class="text-gray-500"> Mejorado con IA. </span>
    <div class="flex flex-col items-center justify-center space-y-12">
      <div class="flex items-center justify-center py-5">
        <div
          v-if="state.mediaStream && state.status !== 'processed'"
          class="flex items-center justify-center w-32 h-32 rounded-full bg-white-100 shadow-sm border-1 border-gray-400 relative overflow-hidden"
        >
          <AVMedia
            :media="state.mediaStream"
            :line-width="2"
            :line-color="'#10b981'"
            type="frequ"
            :canv-height="128"
            :canv-width="128"
            frequ-direction="mo"
          />
        </div>
        <div
          v-else-if="state.status === 'processed'"
          class="flex items-center justify-center w-32 h-32 rounded-full bg-green-100 border-2 border-green-400"
        >
          <i class="pi pi-check text-green-600" style="font-size: 2rem"></i>
        </div>
        <div
          v-else-if="isProcessing"
          class="flex items-center justify-center w-32 h-32 rounded-full bg-blue-100 border-2 border-blue-400"
        >
          <i class="pi pi-spin pi-spinner text-blue-600" style="font-size: 2rem"></i>
        </div>
        <div
          v-else
          class="flex items-center justify-center w-32 h-32 rounded-full bg-gray-100 border-2 border-dashed border-gray-400"
        >
          <i class="pi pi-microphone text-gray-400" style="font-size: 2rem"></i>
        </div>
      </div>

      <!-- Mensaje de error -->
      <div v-if="hasError" class="w-full p-3 bg-red-100 border border-red-300 rounded-lg">
        <p class="text-red-700 text-sm">{{ errorMessage }}</p>
      </div>

      <!-- Botones durante grabación/procesamiento -->
      <div v-if="state.status !== 'processed'" class="flex flex-col space-y-4 w-full">
        <div class="flex justify-center space-x-4">
          <Button
            size="small"
            :label="buttonLabel"
            :icon="buttonIcon"
            :disabled="isLoadingState"
            @click="startStopRecording"
          />

          <!-- Botón de procesar (solo visible cuando hay audio grabado) -->
          <Button
            size="small"
            v-if="state.status === 'loading' || state.status === 'done'"
            :label="isProcessing ? 'Procesando...' : 'Procesar Audio'"
            :icon="isProcessing ? 'pi pi-spin pi-spinner' : 'pi pi-send'"
            @click="handleProcessAudio"
            :disabled="isLoadingState"
          />

          <!-- Botón de cancelar -->
          <Button
            size="small"
            label="Cancelar"
            icon="pi pi-times"
            severity="secondary"
            @click="cancelRecording"
          />
        </div>
      </div>

      <!-- Botones cuando hay respuesta de la API -->
      <div v-if="state.status === 'processed'" class="flex flex-col space-y-4 w-full">
        <div class="text-center mb-4">
          <h3 class="font-semibold text-green-600">¡Audio procesado exitosamente!</h3>
          <p class="text-sm text-gray-600">Se han extraído los datos de la factura</p>
        </div>

        <div class="grid grid-cols-3 max-h-18 gap-2">
          <Button outlined size="small" label="Editar" icon="pi pi-pencil" @click="editar" />

          <Button
            size="small"
            outlined
            label="Intentar de nuevo"
            icon="pi pi-refresh"
            severity="secondary"
            @click="intentarDeNuevo"
          />
          <Button
            outlined
            size="small"
            label="Cancelar"
            icon="pi pi-times"
            severity="danger"
            @click="cancelRecording"
          />
        </div>
        <Button
          size="small"
          label="Facturar"
          icon="pi pi-file-pdf"
          severity="success"
          @click="facturar"
        />
      </div>

      <!-- Área de debugging para mostrar la respuesta de la API -->
      <div v-if="apiResponse" class="w-full mt-4 p-3 bg-gray-100 rounded-lg">
        <h3 class="font-semibold text-gray-700 mb-2">Respuesta de la API (Debug):</h3>
        <pre class="text-xs text-gray-600 whitespace-pre-wrap overflow-auto max-h-40">{{
          apiResponse
        }}</pre>
      </div>
    </div>
  </Dialog>
</template>
