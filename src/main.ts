import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { router } from "@core/router";
import i18n from "@core/i18n";
import { VueQueryPlugin } from "@tanstack/vue-query";
import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";
import { createPinia } from "pinia";
import Ripple from "primevue/ripple";

// Import global styles (includes theme and feature styles)

const pinia = createPinia();

const app = createApp(App);

app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      prefix: "p",
      darkModeSelector: ".darktheme",
      cssLayer: false,
    },
  },
});

app.directive("ripple", Ripple);

app.use(router)
  .use(i18n)
  .use(VueQueryPlugin)
  .use(pinia)
  .mount("#app");

document.getElementById("loading-screen")?.remove();
