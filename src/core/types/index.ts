// أنواع عامة للتطبيق
export type ID = string;
export type Timestamp = Date;

// أنواع الاستجابة
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

// أنواع الطلب
export interface PaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "ASC" | "DESC";
}

// أنواع الأمان
export interface TokenPayload {
  sub: string;
  email: string;
  roles: string[];
  iat?: number;
  exp?: number;
}

// أنواع الأخطاء
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}
