import { Injectable } from "@nestjs/common";
import { Subject } from "rxjs";
import { filter } from "rxjs/operators";
import { BaseEvent } from "./base.event";

@Injectable()
export class EventBus {
  private subject = new Subject<BaseEvent>();

  publish<T extends BaseEvent>(event: T): void {
    this.subject.next(event);
  }

  subscribe<T extends BaseEvent>(
    eventType: string,
    handler: (event: T) => void | Promise<void>
  ): void {
    this.subject
      .pipe(filter((event) => event.eventType === eventType))
      .subscribe(async (event) => {
        try {
          await handler(event as T);
        } catch (error) {
          console.error(`Error handling event ${eventType}:`, error);
        }
      });
  }

  // للاستخدام في الاختبارات
  clearSubscriptions(): void {
    this.subject.complete();
    this.subject = new Subject<BaseEvent>();
  }
}
