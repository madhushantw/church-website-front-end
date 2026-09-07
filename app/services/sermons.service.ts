import { HTTP } from './http'

export interface SermonItem {
  id: string
  title: string
  description: string | null
  image: string | null
  preacher: string
  sermonDate: string
  videoUrl: string | null
  audioUrl: string | null
  bibleReference: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateSermon {
  title: string
  description?: string | null
  image?: string | null
  preacher: string
  sermonDate: string
  videoUrl?: string | null
  audioUrl?: string | null
  bibleReference?: string | null
}

export type UpdateSermon = Partial<CreateSermon>

export const SermonsService = {
  getAll() {
    return HTTP.get<SermonItem[]>('/sermons')
  },

  getById(id: string) {
    return HTTP.get<SermonItem>(`/sermons/${id}`)
  },

  create(data: CreateSermon) {
    return HTTP.post<SermonItem>('/sermons', data)
  },

  update(id: string, data: UpdateSermon) {
    return HTTP.put<SermonItem>(`/sermons/${id}`, data)
  },

  delete(id: string) {
    return HTTP.delete(`/sermons/${id}`)
  },
}
