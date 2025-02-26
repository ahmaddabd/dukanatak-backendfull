import { HttpException, HttpStatus } from "@nestjs/common";

export class BusinessException extends HttpException {
  constructor(
    message: string,
    errorCode: string,
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
    details?: Record<string, any>
  ) {
    super(
      {
        message,
        errorCode,
        details,
        timestamp: new Date().toISOString(),
      },
      statusCode
    );
  }
}

export class ResourceNotFoundException extends BusinessException {
  constructor(resource: string, id?: string) {
    super(
      `${resource}${id ? ` with ID ${id}` : ""} not found`,
      "RESOURCE_NOT_FOUND",
      HttpStatus.NOT_FOUND
    );
  }
}

export class ValidationException extends BusinessException {
  constructor(errors: Record<string, any>) {
    super(
      "Validation failed",
      "VALIDATION_ERROR",
      HttpStatus.BAD_REQUEST,
      errors
    );
  }
}

export class UnauthorizedException extends BusinessException {
  constructor(message = "Unauthorized access") {
    super(message, "UNAUTHORIZED", HttpStatus.UNAUTHORIZED);
  }
}
