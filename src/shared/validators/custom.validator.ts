import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

@ValidatorConstraint({ name: "isStrongPassword", async: false })
export class IsStrongPasswordConstraint
  implements ValidatorConstraintInterface
{
  validate(password: string) {
    // على الأقل 8 أحرف، حرف كبير، حرف صغير، رقم، وحرف خاص
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  }

  defaultMessage() {
    return "كلمة المرور يجب أن تحتوي على الأقل 8 أحرف، حرف كبير، حرف صغير، رقم، وحرف خاص";
  }
}

export function IsStrongPassword(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsStrongPasswordConstraint,
    });
  };
}

@ValidatorConstraint({ name: "isPhoneNumber", async: false })
export class IsPhoneNumberConstraint implements ValidatorConstraintInterface {
  validate(phone: string) {
    // تنسيق رقم الهاتف السعودي
    const phoneRegex = /^((\+9665)|(05))[0-9]{8}$/;
    return phoneRegex.test(phone);
  }

  defaultMessage() {
    return "رقم الهاتف غير صالح";
  }
}

export function IsPhoneNumber(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPhoneNumberConstraint,
    });
  };
}
