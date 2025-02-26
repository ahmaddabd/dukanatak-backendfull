import { Injectable } from "@nestjs/common";
import { ICommandHandler } from "../../../../infrastructure/cqrs/command.bus";
import { CreateShippingCommand } from "../create-shipping.command";
import { ShippingService } from "../../shipping.service";
import { Shipping } from "../../../../domain/entities/shipping.entity";

@Injectable()
export class CreateShippingHandler
  implements ICommandHandler<CreateShippingCommand>
{
  constructor(private readonly shippingService: ShippingService) {}

  async execute(command: CreateShippingCommand): Promise<Shipping> {
    const { orderId, shippingData, currentUser } = command;
    return this.shippingService.createShipping(
      orderId,
      shippingData,
      currentUser
    );
  }
}
