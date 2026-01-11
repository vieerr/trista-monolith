import { z } from 'zod'

export const productValidator = z.object({
  type: z.enum(['Producto', 'Servicio'], {
    errorMap: () => ({ message: "El tipo debe ser 'Producto' o 'Servicio'" }),
  }),
  name: z.string({ required_error: 'El nombre es requerido' }).min(1, { message: 'El nombre es requerido' }),
  unit: z.string({ required_error: 'La unidad es requerida' }).min(1, { message: 'La unidad es requerida' }),
  reference: z.string().optional(),
  price: z.number({ required_error: 'El precio es requerido' }).min(0, { message: 'Price must be non-negative' }),
  tax: z.object(
    {
      name: z.string({ required_error: 'El nombre del impuesto es requerido' }),
      rate: z
        .number({ required_error: 'La tasa del impuesto es requerida' })
        .min(0, { message: 'Tax rate must be non-negative' }),
    },
    { errorMap: () => ({ message: 'El impuesto es requerido' }) },
  ),
  description: z.string().optional(),
  image: z.union([z.instanceof(File), z.null()]).optional(),
})
