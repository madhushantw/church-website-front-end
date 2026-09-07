import axios from 'axios'

export const HTTP = axios.create()

HTTP.interceptors.request.use(config => {
  const runtimeConfig = useRuntimeConfig()

  config.baseURL = runtimeConfig.public.apiBaseUrl

  if (import.meta.client) {
    const accessToken = localStorage.getItem('accessToken')

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
  }

  return config
})