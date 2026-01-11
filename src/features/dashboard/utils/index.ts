export const getApiBaseUrl = (): string => {
  return import.meta.env.MODE === 'production'
    ? import.meta.env.VITE_API_URL_PROD
    : import.meta.env.VITE_API_URL_DEV
}

export const formatCurrency = (value: number | undefined): string => {
  return `$${value?.toFixed(2).replace('.', ',')}`
}
