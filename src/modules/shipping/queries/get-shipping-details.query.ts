import { IQuery } from "../../../infrastructure/cqrs/query.bus";
import { User } from "../../../domain/entities/user.entity";

export class GetShippingDetailsQuery implements IQuery {
  readonly type = "shipping.details";

  constructor(
    public readonly shippingId: string,
    public readonly currentUser: User
  ) {}
}
