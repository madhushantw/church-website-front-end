import { HTTP } from './http'

export interface Hero {
  welcomeText?: string
  title1?: string
  title2?: string
  subtitle?: string
  image?: string
}

export const HeroService = {
  get() {
    return HTTP.get<Hero>('/hero')
  },

  update(hero: Hero) {
    return HTTP.patch<Hero>('/hero', hero)
  },
}