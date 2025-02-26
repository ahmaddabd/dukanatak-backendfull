export const CACHE_TTL = 60 * 60 * 1000; // ساعة واحدة
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 ميجابايت
export const RATE_LIMIT_TTL = 60 * 1000; // دقيقة واحدة
export const RATE_LIMIT_MAX = 100; // الحد الأقصى للطلبات

export const ROLES = {
  ADMIN: "admin",
  MERCHANT: "merchant",
  CUSTOMER: "customer",
} as const;

export const ERROR_MESSAGES = {
  UNAUTHORIZED: "غير مصرح",
  FORBIDDEN: "محظور",
  NOT_FOUND: "غير موجود",
  VALIDATION_ERROR: "خطأ في التحقق",
  INTERNAL_SERVER_ERROR: "خطأ في الخادم",
} as const;

export const SUCCESS_MESSAGES = {
  CREATED: "تم الإنشاء بنجاح",
  UPDATED: "تم التحديث بنجاح",
  DELETED: "تم الحذف بنجاح",
} as const;
