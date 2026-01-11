<template>
  <div class="p-6 space-y-6">
    <h2 class="text-xl font-semibold">Resumen del negocio</h2>

    <!-- If still loading, show skeletons -->
    <template v-if="isLoading">
      <!-- Chart skeleton -->
      <Card class="p-4">
        <CardHeader>
          <Skeleton class="h-6 w-40 mb-2" />
          <Skeleton class="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton class="h-[300px] w-full" />
        </CardContent>
      </Card>

      <!-- Tables skeleton -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card class="p-4">
          <CardHeader>
            <Skeleton class="h-6 w-32 mb-2" />
            <Skeleton class="h-4 w-56" />
          </CardHeader>
          <CardContent class="space-y-2">
            <Skeleton class="h-10 w-full" v-for="i in 5" :key="i" />
          </CardContent>
        </Card>

        <Card class="p-4">
          <CardHeader>
            <Skeleton class="h-6 w-32 mb-2" />
            <Skeleton class="h-4 w-56" />
          </CardHeader>
          <CardContent class="space-y-2">
            <Skeleton class="h-10 w-full" v-for="i in 5" :key="i" />
          </CardContent>
        </Card>
      </div>
    </template>

    <!-- Once all loaded, show actual components -->
    <template v-else>
      <SalesChart :data="salesData" />
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TrendingTable :data="products" type="products" />
        <TrendingTable :data="customers" type="customers" />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import SalesChart from './SalesChart.vue'
import TrendingTable from './TrendingTable.vue'
import { Card, CardHeader, CardContent } from '@dashboard/components/ui/card'
import { Skeleton } from '@dashboard/components/ui/skeleton'
import { useQuery } from '@tanstack/vue-query'
import { getDashboardAnalytics } from '@dashboard/services/analytics'
import { computed } from 'vue'

const { data: dashboardData, isLoading: isDashboardLoading } = useQuery({
  queryKey: ['dashboardAnalytics'],
  queryFn: () => getDashboardAnalytics(),
})

const salesData = computed(() => dashboardData.value?.sales_over_time || [])
const products = computed(() => dashboardData.value?.top_products || [])
const customers = computed(() => dashboardData.value?.top_customers || [])

const isLoading = computed(() => isDashboardLoading.value)
</script>
