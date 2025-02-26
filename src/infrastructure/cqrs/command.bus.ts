import { Injectable } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";

export interface ICommand {
  readonly type: string;
}

export interface ICommandHandler<T extends ICommand> {
  execute(command: T): Promise<any>;
}

@Injectable()
export class CommandBus {
  private handlers = new Map<string, any>();

  constructor(private moduleRef: ModuleRef) {}

  register(commandType: string, handler: any) {
    this.handlers.set(commandType, handler);
  }

  async execute<T extends ICommand>(command: T): Promise<any> {
    const handler = this.handlers.get(command.type);
    if (!handler) {
      throw new Error(`لا يوجد معالج للأمر ${command.type}`);
    }

    const handlerInstance = this.moduleRef.get(handler);
    return handlerInstance.execute(command);
  }
}
