import { HTTP } from './http'
import type { CResponse } from './interfaces/Response.interface'

export interface Hero {
  welcomeText?: string
  title1?: string
  title2?: string
  subtitle?: string
  image?: string
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
}