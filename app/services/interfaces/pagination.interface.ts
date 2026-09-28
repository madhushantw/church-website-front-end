export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginationResponse<T> {
  data: {
    page: number;
    limit: number;
    total: number
    totalPages: number;
    items: T[];
  };
  message: string;
  statusCode: number;
}
