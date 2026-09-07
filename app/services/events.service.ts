import { HTTP } from './http'

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
  getAll() {
    return HTTP.get<EventItem[]>('/events')
  },

  getById(id: string) {
    return HTTP.get<EventItem>(`/events/${id}`)
  },

  create(data: CreateEvent) {
    return HTTP.post<EventItem>('/events', data)
  },

  update(id: string, data: Partial<CreateEvent>) {
    return HTTP.put<EventItem>(`/events/${id}`, data)
  },

  delete(id: string) {
    return HTTP.delete(`/events/${id}`)
  },
}
