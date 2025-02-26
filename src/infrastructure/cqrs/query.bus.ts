import { Injectable } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";

export interface IQuery {
  readonly type: string;
}

export interface IQueryHandler<T extends IQuery> {
  execute(query: T): Promise<any>;
}

@Injectable()
export class QueryBus {
  private handlers = new Map<string, any>();

  constructor(private moduleRef: ModuleRef) {}

  register(queryType: string, handler: any) {
    this.handlers.set(queryType, handler);
  }

  async execute<T extends IQuery>(query: T): Promise<any> {
    const handler = this.handlers.get(query.type);
    if (!handler) {
      throw new Error(`لا يوجد معالج للاستعلام ${query.type}`);
    }

    const handlerInstance = this.moduleRef.get(handler);
    return handlerInstance.execute(query);
  }
}
