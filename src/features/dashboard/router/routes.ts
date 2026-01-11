import BusinnessSummary from '@dashboard/components/BusinnessSummary.vue'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '',
    name: 'Dashboard',
    component: BusinnessSummary,
  },
]

export default routes
