import { Module, Global } from "@nestjs/common";
import { CommandBus } from "./command.bus";
import { QueryBus } from "./query.bus";

@Global()
@Module({
  providers: [CommandBus, QueryBus],
  exports: [CommandBus, QueryBus],
})
export class CqrsModule {}
