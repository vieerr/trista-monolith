import { z } from 'zod'

export const invoiceSchema = z.object({
  number: z.string().min(1, { message: 'Número es requerido' }),
  client_id: z.string({ required_error: 'Seleccionar un cliente es requerido' }),
  operation_date: z.string().regex(/^\d{2}-\d{2}-\d{4}$/, {
    message: 'Fecha de operación debe tener formato DD-MM-YYYY',
  }),
  type: z.string().min(1, { message: 'Tipo es requerido' }),
  payment_method: z.string().min(1, { message: 'Método de pago es requerido' }),
  payment_period: z.string().min(1, { message: 'Período de pago es requerido' }),
  due_date: z.string().regex(/^\d{2}-\d{2}-\d{4}$/, {
    message: 'Fecha de vencimiento debe tener formato DD-MM-YYYY',
  }),
  // only validating product name cause its a select field, if there is a name, there is a product
  products: z
    .array(
      z.object({
        product: z.object({
          _id: z.string({ required_error: 'Seleccionar un producto es requerido' }),
        }),
      }),
    )
    .min(1, { message: 'Al menos un producto es requerido' }),
  subtotal: z.number(),
  discount: z.number(),
  taxable_base: z.number(),
  taxes: z.record(
    z.string(),
    z.number().nonnegative({ message: 'Los impuestos no pueden ser negativos' }),
  ),
  total: z.number(),
  created_at: z.string().regex(/^\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2}$/, {
    message: 'Fecha de creación debe tener formato DD-MM-YYYY HH:MM:SS',
  }),
  status: z.string().min(1, { message: 'Estado es requerido' }),
})
