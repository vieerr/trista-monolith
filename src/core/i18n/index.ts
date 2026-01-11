import { createI18n, type I18n } from "vue-i18n";
import { messages as invoicesMessages } from "@invoices/i18n";
import { messages as productsMessages } from "@products/i18n";

export const setupI18n = (options = { locale: "es" }): I18n => {
  const messages = {
    [options.locale]: {
      Invoices: "Facturas",
      Dashboard: "Inicio",
      Products: "Productos",
      createdBy: "Creado por",
      ...invoicesMessages[options.locale as keyof typeof invoicesMessages],
      ...productsMessages[options.locale as keyof typeof productsMessages],
    },
  };

  const i18n = createI18n({
    legacy: false,
    locale: options.locale,
    fallbackLocale: "es",
    messages,
  });

  return i18n;
};

const i18n = setupI18n({ locale: "es" });
export default i18n;
