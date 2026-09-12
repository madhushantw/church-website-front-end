import { HTTP } from './http'
import type { CResponse } from './interfaces/Response.interface'

export interface EventItem {
  id: string
  title: string
  description: string | null
  image: string | null
  startDate: string
  endDate: string
  location: string | null
  isFeatured: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateEvent {
  title: string
  description?: string | null
  image?: string | null
  startDate: string
  endDate: string
  location?: string | null
  isFeatured?: boolean
}

export const EventsService = {
  async getAll(): Promise<CResponse<EventItem[]>> {
    const response = await HTTP.get<CResponse<EventItem[]>>('/events')
    return response.data
  },

  async getById(id: string): Promise<CResponse<EventItem>> {
    const response = await HTTP.get<CResponse<EventItem>>(`/events/${id}`)
    return response.data
  },

  async create(data: CreateEvent): Promise<CResponse<EventItem>> {
    const response = await HTTP.post<CResponse<EventItem>>('/events', data)
    return response.data
  },

  async update(id: string, data: Partial<CreateEvent>): Promise<CResponse<EventItem>> {
    const response = await HTTP.patch<CResponse<EventItem>>(`/events/${id}`, data)
    return response.data
  },

  delete(id: string) {
    return HTTP.delete(`/events/${id}`)
  },
}
