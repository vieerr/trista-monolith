<template>
  <div class="flex min-h-screen ">
    <Sidebar />
    <main class=" py-6 flex-6">
      <RouterView />
    </main>
    <VueQueryDevtools initialIsOpen position="bottom" />
  </div>
</template>

<script setup lang="ts">
import Sidebar from "@components/Sidebar.vue";
import { VueQueryDevtools } from "@tanstack/vue-query-devtools";
import { RouterView } from "vue-router";
import "./style.css";
</script>
