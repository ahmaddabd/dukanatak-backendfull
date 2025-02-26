import { ICommand } from "../../../infrastructure/cqrs/command.bus";
import { User } from "../../../domain/entities/user.entity";
import {
  ShippingMethod,
  DeliveryZone,
} from "../../../domain/entities/shipping.entity";

export class CreateShippingCommand implements ICommand {
  readonly type = "shipping.create";

  constructor(
    public readonly orderId: string,
    public readonly shippingData: {
      method: ShippingMethod;
      deliveryZone: DeliveryZone;
      deliveryAddress: {
        fullName: string;
        phone: string;
        alternativePhone?: string;
        address: string;
        city: string;
        region: string;
        landmark?: string;
        notes?: string;
      };
      metadata?: {
        packageWeight?: number;
        packageDimensions?: {
          length: number;
          width: number;
          height: number;
        };
        isFragile?: boolean;
        requiresRefrigeration?: boolean;
        specialHandling?: string[];
      };
    },
    public readonly currentUser: User
  ) {}
}
