import { ApiProperty } from "@nestjs/swagger";

export class ApiResponse<T> {
  @ApiProperty({ description: "حالة الاستجابة" })
  success: boolean;

  @ApiProperty({ description: "البيانات المرجعة" })
  data?: T;

  @ApiProperty({ description: "رسالة الاستجابة" })
  message?: string;

  @ApiProperty({ description: "رمز الخطأ", required: false })
  errorCode?: string;

  @ApiProperty({ description: "تفاصيل إضافية", required: false })
  metadata?: Record<string, any>;

  constructor(partial: Partial<ApiResponse<T>>) {
    Object.assign(this, partial);
  }

  static success<T>(data: T, message?: string): ApiResponse<T> {
    return new ApiResponse({
      success: true,
      data,
      message,
    });
  }

  static error(message: string, errorCode?: string): ApiResponse<null> {
    return new ApiResponse({
      success: false,
      message,
      errorCode,
    });
  }
}
