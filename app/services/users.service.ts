import { HTTP } from './http'
import type { CResponse } from './interfaces/Response.interface'

export enum UserRole {
  ROOT = 'ROOT',
  USER = 'USER',
}

export interface UserItem {
  id: string
  name: string
  email: string
  role: UserRole
}

export interface CreateUser {
  name: string
  email: string
  password: string
}

export type UpdateUser = Partial<CreateUser>

export const UsersService = {
  async getAll(): Promise<CResponse<UserItem[]>> {
    const response = await HTTP.get<CResponse<UserItem[]>>('/users')
    return response.data
  },

  async getById(id: string): Promise<CResponse<UserItem>> {
    const response = await HTTP.get<CResponse<UserItem>>(`/users/${id}`)
    return response.data
  },

  async create(data: CreateUser): Promise<CResponse<UserItem>> {
    const response = await HTTP.post<CResponse<UserItem>>('/users', data)
    return response.data
  },

  async update(id: string, data: UpdateUser): Promise<CResponse<UserItem>> {
    const response = await HTTP.patch<CResponse<UserItem>>(`/users/${id}`, data)
    return response.data
  },

  delete(id: string) {
    return HTTP.delete(`/users/${id}`)
  },
}
