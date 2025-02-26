import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ApiResponse } from "../responses/api-response";

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        // إذا كانت البيانات بالفعل من نوع ApiResponse، نعيدها كما هي
        if (data instanceof ApiResponse) {
          return data;
        }

        // تحويل البيانات إلى ApiResponse
        return ApiResponse.success(data);
      })
    );
  }
}

@Injectable()
export class ExcludeNullInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => this.excludeNull(data)));
  }

  private excludeNull(data: any): any {
    if (Array.isArray(data)) {
      return data.map((item) => this.excludeNull(item));
    }
    if (data !== null && typeof data === "object") {
      return Object.fromEntries(
        Object.entries(data)
          .filter(([_, value]) => value !== null)
          .map(([key, value]) => [key, this.excludeNull(value)])
      );
    }
    return data;
  }
}
