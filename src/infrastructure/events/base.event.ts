export abstract class BaseEvent {
  constructor(
    public readonly eventType: string,
    public readonly timestamp: Date = new Date(),
    public readonly metadata: Record<string, any> = {}
  ) {}

  abstract toJSON(): Record<string, any>;
}

export interface EventHandler<T extends BaseEvent> {
  handle(event: T): Promise<void>;
}

export interface EventPublisher {
  publish<T extends BaseEvent>(event: T): Promise<void>;
  subscribe<T extends BaseEvent>(
    eventType: string,
    handler: EventHandler<T>
  ): void;
}
