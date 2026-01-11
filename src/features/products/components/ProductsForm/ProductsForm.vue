<template>
  <div class="flex gap-6">
    <!-- Left Side Form -->
    <div class="flex-1 bg-white rounded-md shadow-md p-6">
      <h3 class="text-gray-700 text-lg font-semibold mb-6">Información general</h3>

      <Form :initialValues="formValues" :resolver="resolver" class="space-y-6">
        <!-- Tipo de ítem -->
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-2">Tipo de ítem *</label>
          <div class="flex gap-4">
            <Button
              :outlined="formValues.type !== 'Producto'"
              :label="'Producto'"
              @click="formValues.type = 'Producto'"
              class="w-32"
            />
            <Button
              :outlined="formValues.type !== 'Servicio'"
              :label="'Servicio'"
              @click="formValues.type = 'Servicio'"
              class="w-32"
            />
          </div>
          <!-- <p class="text-xs text-gray-400 mt-2">
            Ten en cuenta que, una vez creado, no podrás cambiar el tipo de ítem.
          </p> -->
        </div>

        <!-- Nombre -->
        <div>
          <label for="name" class="block text-sm font-medium text-gray-600 mb-1">Nombre *</label>
          <InputText
            v-model="formValues.name"
            id="name"
            name="name"
            placeholder="Escribe el nombre"
            class="w-full"
          />
        </div>

        <!-- Unidad de medida -->
        <div>
          <label for="unit" class="block text-sm font-medium text-gray-600 mb-1"
            >Unidad de medida *</label
          >
          <Select v-model="formValues.unit" :options="units" id="unit" class="w-full" />
        </div>

        <!-- Referencia -->
        <div>
          <label for="reference" class="block text-sm font-medium text-gray-600 mb-1"
            >Referencia</label
          >
          <InputText
            v-model="formValues.reference"
            id="reference"
            name="reference"
            class="w-full"
          />
        </div>

        <!-- Precios -->
        <div class="grid grid-cols-3 gap-4">
          <div>
            <label for="price" class="block text-sm font-medium text-gray-600 mb-1"
              >Precio base *</label
            >
            <InputNumber
              inputId="currency-us"
              id="price"
              name="price"
              mode="currency"
              currency="USD"
              locale="en-US"
              fluid
              v-model="formValues.price"
            />
          </div>
          <div>
            <label for="tax" class="block text-sm font-medium text-gray-600 mb-1">Impuesto *</label>
            <Select
              v-model="formValues.tax"
              :options="taxes"
              optionLabel="name"
              id="tax"
              class="w-full"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1">Precio Total *</label>
            <InputNumber
              v-model="computedTotal"
              mode="currency"
              currency="USD"
              locale="en-US"
              fluid
              readonly
              class="w-full bg-gray-100"
            />
          </div>
        </div>

        <!-- Descripción -->
        <div>
          <label for="description" class="block text-sm font-medium text-gray-600 mb-1"
            >Descripción</label
          >
          <Textarea v-model="formValues.description" id="description" rows="3" class="w-full" />
        </div>

        <!-- Buttons -->
      </Form>
    </div>

    <!-- Right Side Preview -->
    <div class="w-72 bg-white rounded-md shadow-md flex flex-col  items-center p-6">
      <ImageForm ref="imageForm" />
      <p class="text-gray-600 pt-8 font-medium">{{ formValues.name || 'Producto sin nombre' }}</p>
      <p class="text-lg font-semibold text-gray-800">$ {{ computedTotal }}</p>
      <div class="flex flex-col justify-between items-stretch w-full gap-3 pt-10">
        <div class="flex justify-between gap-3">
          <Button
            type="button"
            icon="pi pi-times"
            severity="secondary"
            :label="t('products_form.cancel')"
            @click="goToProductsTable"
          />

          <Button
            type="button"
            @click="onFormSubmit({ redirect: true })"
            icon="pi pi-save"
            :label="t('products_form.save')"
          />
        </div>

        <Button
        v-if="!isEdit"
        type="button"
          icon="pi pi-plus"
          severity="secondary"
          :label="t('products_form.create_again')"
          @click="handleCreateAgain"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import ImageForm from './ImageForm.vue'
import { reactive, computed, ref } from 'vue'
import { Form } from '@primevue/forms'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Select from 'primevue/select'
import Button from 'primevue/button'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { productValidator } from '@products/validators/ProductValidator'
import InputNumber from 'primevue/inputnumber'
import { useI18n } from 'vue-i18n'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { createProduct, updateProduct } from '@products/services/products'
import { toast } from 'vue-sonner'
import type { ZodError } from 'zod'
import { onBeforeRouteLeave, useRouter } from 'vue-router'
import { useProductStore } from '@products/stores/productStore'

interface FormValues {
  type: 'Producto' | 'Servicio'
  name: string
  unit: string
  reference: string
  price: number
  tax: { name: string; rate: number } | null
  description: string
  image: File | null
}

const productStore = useProductStore()
const router = useRouter()
const { t } = useI18n()
const queryClient = useQueryClient()


const resolver = ref(zodResolver(productValidator))
const imageForm = ref()
const redirectAfterCreate = ref(false)
const units = ref(['Unidad', 'Litro', 'Kilogramo', 'Metro', 'Caja'])

const taxes = ref([
  { name: 'IVA General 12%', rate: 12 },
  { name: 'IVA Tarifa 0', rate: 0 },
])

const formValues = reactive<FormValues>({
  type: 'Producto',
  name: '',
  unit: '',
  reference: '',
  price: 0,
  tax: null,
  description: '',
  image: null,
})

const isEdit = computed(() => !!productStore.selectedProduct?._id)
console.log(isEdit.value)
if (isEdit.value) {
  formValues.type = productStore.selectedProduct?.type as 'Producto' | 'Servicio'
  formValues.name = productStore.selectedProduct?.name || ''
  formValues.unit = productStore.selectedProduct?.unit || ''
  formValues.reference = productStore.selectedProduct?.reference || ''
  formValues.price = productStore.selectedProduct?.price || 0
  formValues.tax = {
    name: productStore.selectedProduct?.taxName ?? taxes.value[0].name,
    rate: productStore.selectedProduct?.taxRate ?? taxes.value[0].rate,
  }
  formValues.description = productStore.selectedProduct?.description || ''
}

const computedTotal = computed(() => {
  if (!formValues.tax) return Number(formValues.price.toFixed(2))
  const taxAmount = (formValues.price * formValues.tax.rate) / 100
  return parseFloat((formValues.price + taxAmount).toFixed(2))
})

const { mutate: createProductMutation } = useMutation({
  mutationFn: (newProduct: FormData) => createProduct(newProduct),
  onSuccess: () => {
    toast.success('Producto creado con éxito')
    if (redirectAfterCreate.value) {
      goToProductsTable()
    }
  },
  onError: () => {
    toast.error('Error al crear el producto')
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['dashboardAnalytics'] })
  },
})

const { mutate: updateProductMutation } = useMutation({
  mutationFn: (updatedProduct: FormData) =>
    updateProduct(productStore.selectedProduct?._id as string, updatedProduct),
  onSuccess: () => {
    toast.success('Producto actualizado con éxito')

    if (redirectAfterCreate.value) {
      goToProductsTable()
    }
  },
  onError: () => {
    toast.error('Error al actualizar el producto')
  },
})

const goToProductsTable = () => {
  router.push(router.getRoutes().find((route) => route.name === 'ProductsTable')!.path)
}

const handleCreateAgain = () => {
  onFormSubmit({ redirect: false })
  resetForm()
}

const resetForm = () => {
  formValues.type = 'Producto'
  formValues.name = ''
  formValues.unit = ''
  formValues.reference = ''
  formValues.price = 0
  formValues.tax = null
  formValues.description = ''
  formValues.image = null

  if (imageForm.value) {
    imageForm.value.resetForm()
  }
}

const onFormSubmit = ({ redirect = true }: { redirect?: boolean } = {}) => {
  redirectAfterCreate.value = redirect

  const { success, error } = productValidator.safeParse(formValues)

  const formData: FormData = new FormData()
  formData.append('type', formValues.type)
  formData.append('name', formValues.name)
  formData.append('unit', formValues.unit)
  formData.append('reference', formValues.reference)
  formData.append('price', String(formValues.price))
  formData.append('status', 'active')
  if (formValues.tax) {
    formData.append('taxName', formValues.tax.name)
    formData.append('taxRate', String(formValues.tax.rate))
  }
  formData.append('total', String(computedTotal.value))
  formData.append('description', formValues.description)

  if (imageForm.value?.files[0]) {
    formData.append('image', imageForm.value.files[0])
  }

  // const { success, error } = productValidator.safeParse(formData)
  if (success) {
    if (isEdit.value) {
      updateProductMutation(formData)
    } else {
      createProductMutation(formData)
    }
  } else {
    toast.error(
      'Error en la validación del formulario:\n' +
        (error as ZodError).issues.map((err) => err.message).join(' || '),
    )
  }

  console.log('FormData being sent:', formData)
}

onBeforeRouteLeave(() => {
  productStore.cleanSelectedProduct()
})
</script>
