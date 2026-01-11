import DetailedProductView from '@products/views/DetailedProductView.vue'
import ProductsFormView from '@products/views/ProductsFormView.vue'
import ProductsTableView from '@products/views/ProductsTableView.vue'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '',
    name: 'ProductsTable',
    component: ProductsTableView,
  },
  {
    path: 'add',
    name: 'AddProduct',
    component: ProductsFormView,
  },
  {
    path: 'view/:id',
    name: 'ViewProduct',
    component: DetailedProductView,
    props: true,
  },
]

export default routes
