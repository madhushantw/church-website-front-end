import { HTTP } from '~/services/http'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  if (config.public.apiBaseUrl) {
    HTTP.defaults.baseURL = config.public.apiBaseUrl as string
  }
})