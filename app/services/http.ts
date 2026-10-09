import axios from 'axios'

export const HTTP = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
})

HTTP.interceptors.request.use(config => {
  if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
    config.headers.delete('Content-Type')
  }

  if (import.meta.client) {
    const accessToken = localStorage.getItem('accessToken')

    if (accessToken) {
      config.headers.set('Authorization', `Bearer ${accessToken}`)
    }
  }

  return config
})