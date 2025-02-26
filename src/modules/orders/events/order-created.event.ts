import { BaseEvent } from "../../../infrastructure/events/base.event";
import { OrderStatus } from "../../../core/domain/entities/order.entity";

export interface OrderCreatedEventData {
  orderId: string;
  customerId: string;
  storeId: string;
  total: number;
  status: OrderStatus;
}

export class OrderCreatedEvent extends BaseEvent {
  constructor(public readonly data: OrderCreatedEventData) {
    super("order.created");
  }

  toJSON(): Record<string, any> {
    return {
      eventType: this.eventType,
      timestamp: this.timestamp,
      data: this.data,
      metadata: this.metadata,
    };
  }
}
