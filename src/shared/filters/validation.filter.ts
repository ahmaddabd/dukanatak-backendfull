import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { ValidationError } from "class-validator";
import { Response } from "express";

@Catch(ValidationError)
export class ValidationFilter implements ExceptionFilter {
  catch(exception: ValidationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const errorResponse = {
      statusCode: 400,
      timestamp: new Date().toISOString(),
      message: "Validation failed",
      errors: this.formatErrors(exception),
    };

    response.status(400).json(errorResponse);
  }

  private formatErrors(error: ValidationError): any {
    if (error.children && error.children.length > 0) {
      const errors = {};
      error.children.forEach((childError) => {
        errors[childError.property] = this.formatErrors(childError);
      });
      return errors;
    }

    return Object.values(error.constraints || {});
  }
}
