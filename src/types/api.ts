export interface ApiResponse<T> {
  status: number;
  success: boolean;
  data: T | null;
  error?: string;
  message?: string;
}

export type HttpStatusCode = 200 | 201 | 400 | 401 | 403 | 404 | 409 | 500;
