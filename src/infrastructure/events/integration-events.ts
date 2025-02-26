import { BaseEvent } from "./base.event";

export class OrderCreatedEvent extends BaseEvent {
  constructor(
    public readonly orderId: string,
    public readonly userId: string,
    public readonly storeId: string,
    public readonly products: Array<{ id: string; quantity: number }>,
    metadata?: Record<string, any>
  ) {
    super("order.created", new Date(), metadata);
  }

  toJSON() {
    return {
      eventType: this.eventType,
      timestamp: this.timestamp,
      orderId: this.orderId,
      userId: this.userId,
      storeId: this.storeId,
      products: this.products,
      metadata: this.metadata,
    };
  }
}

export class PaymentCompletedEvent extends BaseEvent {
  constructor(
    public readonly paymentId: string,
    public readonly orderId: string,
    public readonly amount: number,
    metadata?: Record<string, any>
  ) {
    super("payment.completed", new Date(), metadata);
  }

  toJSON() {
    return {
      eventType: this.eventType,
      timestamp: this.timestamp,
      paymentId: this.paymentId,
      orderId: this.orderId,
      amount: this.amount,
      metadata: this.metadata,
    };
  }
}

export class ShipmentCreatedEvent extends BaseEvent {
  constructor(
    public readonly shipmentId: string,
    public readonly orderId: string,
    public readonly address: string,
    metadata?: Record<string, any>
  ) {
    super("shipment.created", new Date(), metadata);
  }

  toJSON() {
    return {
      eventType: this.eventType,
      timestamp: this.timestamp,
      shipmentId: this.shipmentId,
      orderId: this.orderId,
      address: this.address,
      metadata: this.metadata,
    };
  }
}
