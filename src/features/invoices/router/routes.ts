import TestComponent from '@invoices/components/TestComponent.vue'
import DetailView from '@invoices/views/DetailView.vue'
import FormView from '@invoices/views/FormView.vue'
import TableView from '@invoices/views/TableView.vue'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '',
    name: 'InvoicesTable',
    component: TableView,
  },
  {
    path: 'add',
    name: 'AddInvoice',
    component: FormView,
  },
  {
    path: 'view/:id',
    name: 'ViewInvoice',
    component: DetailView,
    props: true,
  },
  {
    path: 'test',
    name: 'Test',
    component: TestComponent,
  },
]

export default routes
