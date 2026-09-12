import { HTTP } from './http'
import type { CResponse } from './interfaces/Response.interface'

export enum MinistryType {
  GENERAL = 'general',
  CHILDREN = 'children',
  YOUTH = 'youth',
  WOMEN = 'women',
  MEN = 'men',
  WORSHIP = 'worship',
  OUTREACH = 'outreach',
  PRAYER = 'prayer',
  MEDIA = 'media',
}

export interface MinistryItem {
  id: string
  name: string
  type: MinistryType
  description: string | null
  image: string | null
  leader: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateMinistry {
  name: string
  type?: MinistryType
  description?: string | null
  image?: string | null
  leader?: string | null
}

export type UpdateMinistry = Partial<CreateMinistry>

export const MinistriesService = {
  async getAll(): Promise<CResponse<MinistryItem[]>> {
    const response = await HTTP.get<CResponse<MinistryItem[]>>('/ministries')
    return response.data
  },

  async getById(id: string): Promise<CResponse<MinistryItem>> {
    const response = await HTTP.get<CResponse<MinistryItem>>(`/ministries/${id}`)
    return response.data
  },

  async create(data: CreateMinistry): Promise<CResponse<MinistryItem>> {
    const response = await HTTP.post<CResponse<MinistryItem>>('/ministries', data)
    return response.data
  },

  async update(id: string, data: UpdateMinistry): Promise<CResponse<MinistryItem>> {
    const response = await HTTP.patch<CResponse<MinistryItem>>(`/ministries/${id}`, data)
    return response.data
  },

  delete(id: string) {
    return HTTP.delete(`/ministries/${id}`)
  },
}