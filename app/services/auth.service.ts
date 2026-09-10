import { HTTP } from './http'
import type { CResponse } from './interfaces/Response.interface'
import type { UserRole } from './users.service'

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

export interface LoginDataResponse {
  accessToken: string
  user: User
}

export type LoginResponse = CResponse<LoginDataResponse>

export const AuthService = {
  async login(data: LoginData): Promise<LoginResponse> {
    const response = await HTTP.post<LoginResponse>('/auth/login', data)
    return response.data
  },

  async loginWithAccessToken(accessToken: string): Promise<LoginResponse> {
    const response = await HTTP.post<LoginResponse>('/auth/login/access-token', { accessToken })
    return response.data
  },
}