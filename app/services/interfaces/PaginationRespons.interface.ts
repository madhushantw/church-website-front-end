import type { CResponse } from './Response.interface'

export type PaginationResponse<T> = CResponse<T[]> & {
    total: number
}