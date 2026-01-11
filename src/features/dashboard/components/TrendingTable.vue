<template>
  <Card class="p-4">
    <CardHeader>
      <CardTitle>{{ labels_map[props.type].title }}</CardTitle>
      <CardDescription>{{ labels_map[props.type].description }}</CardDescription>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader class="text-gray-700">
          <TableRow>
            <TableHead>Concepto</TableHead>
            <TableHead>N° </TableHead>
            <TableHead>Total Vendido</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow class="text-gray-500" v-for="(item, i) in props.data" :key="i">
            <TableCell v-for="(column, index) in columns" :key="index">
              {{
                column === 'total'
                  ? formatCurrency(item[column])
                  : item[column as keyof typeof item]
              }}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { formatCurrency } from '@dashboard/utils'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@dashboard/components/ui/card'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@dashboard/components/ui/table'

const props = defineProps<{
  data: { concept: string; documents?: number; items?: number; total: number }[]
  type: 'products' | 'customers'
}>()

const labels_map = {
  products: {
    title: 'Productos más vendidos',
    description: ' El total vendido tiene impuestos incluidos. ',
    item_count_type: 'Items',
    column_count_type: 'items',
  },
  customers: {
    title: 'Mejores clientes',
    description: ' El total vendido tiene impuestos incluidos. ',
    item_count_type: 'Documentos',
    column_count_type: 'documents',
  },
}
const columns = ['concept', labels_map[props.type].column_count_type, 'total']
</script>
