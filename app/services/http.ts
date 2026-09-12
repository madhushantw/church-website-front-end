import axios from 'axios'

export const HTTP = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
})

HTTP.interceptors.request.use(config => {
  const runtimeConfig = useRuntimeConfig()

  if (runtimeConfig.public.apiBaseUrl) {
    config.baseURL = runtimeConfig.public.apiBaseUrl
  }

  if (import.meta.client) {
    const accessToken = localStorage.getItem('accessToken')

    if (accessToken) {
      config.headers.set('Authorization', `Bearer ${accessToken}`)
    }
  }

  return config
})