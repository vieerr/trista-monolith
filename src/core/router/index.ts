import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import dashboardRoutes from "@dashboard/router/routes";
import productsRoutes from "@products/router/routes";
import invoicesRoutes from "@invoices/router/routes";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    children: dashboardRoutes,
  },
  {
    path: "/products",
    children: productsRoutes,
  },
  {
    path: "/invoices",
    children: invoicesRoutes,
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
