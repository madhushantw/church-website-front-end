export interface CResponse<T> {
    statusCode: number
    message: string
    data: T
    total?: number
}