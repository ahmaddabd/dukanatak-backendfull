import { Injectable } from "@nestjs/common";
import { IQueryHandler } from "../../../../infrastructure/cqrs/query.bus";
import { GetShippingDetailsQuery } from "../get-shipping-details.query";
import { ShippingService } from "../../shipping.service";
import { Shipping } from "../../../../domain/entities/shipping.entity";

@Injectable()
export class GetShippingDetailsHandler
  implements IQueryHandler<GetShippingDetailsQuery>
{
  constructor(private readonly shippingService: ShippingService) {}

  async execute(query: GetShippingDetailsQuery): Promise<Shipping> {
    return this.shippingService.getShippingDetails(
      query.shippingId,
      query.currentUser
    );
  }
}
