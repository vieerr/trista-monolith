<template>
  <div class="flex flex-1 h-screen">
    <button
      class="absolute md:hidden top-0 left-4 z-auto p-4 rounded-full hover:bg-green-500 transition text-green-700"
      @click="isOpen = true"
    >
      <i class="pi pi-bars"></i>
    </button>

    <aside
      :class="[
        'bg-white shadow-lg flex flex-col fixed inset-y-0 left-0 transform transition-transform duration-300 ease-in-out z-40',
        isOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64',
        'md:translate-x-0 md:relative md:w-64',
      ]"
    >
      <!-- Menu -->
      <Menu :model="menuItems" class="flex-1 p-2">
        <template #start>
          <div class="flex items-center h-22 mx-4 border-b border-gray-200">
            <span class="font-semibold text-lg"> (╥‸╥) </span>
            <span class="font-semibold ml-3 text-2xl text-gray-600 font-mono">
              trista
            </span>
            <!-- Close button (only on mobile) -->
            <Button
              v-if="isOpen"
              variant="text"
              severity="contrast"
              class="ml-auto md:hidden"
              @click="isOpen = false"
            >
              <i class="pi pi-times"></i>
            </Button>
          </div>
        </template>

        <template #item="{ item, props }">
          <a
            v-ripple
            class="flex justify-between items-center m-0 my-1 p-0 group"
            v-bind="props.action"
          >
            <div class="p-0 text-gray-700">
              <span :class="item.icon" />
              <span class="ml-3 text-sm">{{ t(`${item.label}`) }}</span>
            </div>

            <Button
              variant="outlined"
              size="small"
              v-if="item.createButton"
              @click.stop="item.createCommand"
              icon="pi pi-plus"
              class="opacity-0 group-hover:opacity-100 transition-opacity"
            />
            <Badge v-if="item.badge" class="ml-auto" :value="item.badge" />
          </a>
        </template>
      </Menu>

      <!-- Created by section -->
      <div class="p-4 border-t flex items-center justify-between">
        <div>
          <p class="font-semibold">{{ t("createdBy") }}</p>
          <p class="text-sm text-gray-500">Olivier Paspuel</p>
          <p class="text-sm text-gray-500">@vieerr</p>
        </div>
        <a
          href="https://github.com/vieerr"
          target="_blank"
          rel="noopener noreferrer"
          class="text-gray-500 hover:text-gray-700 transition"
        >
          <i class="pi pi-github" style="font-size: xx-large"></i>
        </a>
      </div>
    </aside>

    <!-- Page content -->
    <main class="flex-1">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import Menu from "primevue/menu";
import Badge from "primevue/badge";
import { Button } from "primevue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

const router = useRouter();
const { t } = useI18n();
const isOpen = ref(false);

const menuItems = ref([
  {
    label: "Dashboard",
    icon: "pi pi-home",
    command: () => router.push("/"),
  },
  {
    label: "Invoices",
    icon: "pi pi-receipt",
    command: () => router.push("/invoices"),
    createButton: true,
    createCommand: () => router.push("/invoices/add"),
  },
  {
    label: "Products",
    icon: "pi pi-box",
    command: () => router.push("/products"),
    createButton: true,
    createCommand: () => router.push("/products/add"),
  },
]);
</script>
