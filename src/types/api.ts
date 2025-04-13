export interface FinMindResponse<T> {
  msg: string;
  status: number;
  data: T[];
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T[];
}

export interface ApiError {
  status: number;
  message: string;
} 