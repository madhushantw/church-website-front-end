import { HTTP } from './http'
import type { CResponse } from './interfaces/Response.interface'

export interface Hero {
  welcomeText?: string
  title1?: string
  title2?: string
  subtitle?: string
  images: string[]
}

export interface RemoveHeroImageResponse {
  message: string
  images: string[]
}

const getImageUrl = (imageUrl: string) => {
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl

  const baseUrl = HTTP.defaults.baseURL
  return baseUrl ? `${baseUrl.replace(/\/$/, '')}${imageUrl}` : imageUrl
}

export const HeroService = {
  async get(): Promise<CResponse<Hero>> {
    const response = await HTTP.get<CResponse<Hero>>('/hero')
    return response.data
  },

  async update(hero: Hero): Promise<CResponse<Hero>> {
    const response = await HTTP.patch<CResponse<Hero>>('/hero', hero)
    return response.data
  },

  getImageUrl,

  async uploadImages(files: File[]): Promise<CResponse<Hero>> {
    const formData = new FormData()
    files.forEach(file => formData.append('images', file))

    const response = await HTTP.post<CResponse<Hero>>('/hero/images', formData)
    return response.data
  },

  async removeImage(imageUrl: string): Promise<CResponse<RemoveHeroImageResponse>> {
    const response = await HTTP.delete<CResponse<RemoveHeroImageResponse>>(
      '/hero/images',
      { data: { imageUrl } },
    )
    return response.data
  },
}