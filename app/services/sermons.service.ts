import { HTTP } from './http'
import type { CResponse } from './interfaces/Response.interface'

export enum SermonPdfType {
  PEWSHEET = 'Pewsheet',
  READINGS = 'Readings',
  SERMON = 'sermon',
}

export interface SermonPdfFile {
  type: SermonPdfType
  url: string
}

export interface SermonItem {
  id: string
  title: string
  description: string | null
  preacher: string
  sermonDate: string
  pdfFiles: SermonPdfFile[]
  createdAt: string
  updatedAt: string
}

export interface CreateSermon {
  title: string
  description?: string | null
  preacher: string
  sermonDate: string
  pdfFiles?: SermonPdfFile[]
}

export type UpdateSermon = Partial<CreateSermon>

export const SermonsService = {
  async getAll(): Promise<CResponse<SermonItem[]>> {
    const response = await HTTP.get<CResponse<SermonItem[]>>('/sermons')
    return response.data
  },

  async getById(id: string): Promise<CResponse<SermonItem>> {
    const response = await HTTP.get<CResponse<SermonItem>>(`/sermons/${id}`)
    return response.data
  },

  async create(data: CreateSermon): Promise<CResponse<SermonItem>> {
    const response = await HTTP.post<CResponse<SermonItem>>('/sermons', data)
    return response.data
  },

  async update(id: string, data: UpdateSermon): Promise<CResponse<SermonItem>> {
    const response = await HTTP.put<CResponse<SermonItem>>(`/sermons/${id}`, data)
    return response.data
  },

  delete(id: string) {
    return HTTP.delete(`/sermons/${id}`)
  },
}
