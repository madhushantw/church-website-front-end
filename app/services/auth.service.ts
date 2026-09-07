import { HTTP } from './http'

export enum UserRole {
  ROOT = 'ROOT',
  USER = 'USER',
}

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
}

export interface LoginData {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  user: User
}

export const AuthService = {
  login(data: LoginData) {
    return HTTP.post<LoginResponse>('/auth/login', data)
  },

  loginWithAccessToken(accessToken: string) {
    return HTTP.post<LoginResponse>('/auth/login/access-token', { accessToken })
  },
}