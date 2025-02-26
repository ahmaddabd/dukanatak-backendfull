import { Injectable } from "@nestjs/common";
import { Connection, QueryRunner } from "typeorm";
import { IsolationLevel } from "typeorm/driver/types/IsolationLevel";

@Injectable()
export class UnitOfWork {
  constructor(private readonly connection: Connection) {}

  async withTransaction<T>(
    work: (queryRunner: QueryRunner) => Promise<T>,
    isolationLevel: IsolationLevel = "READ COMMITTED"
  ): Promise<T> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction(isolationLevel);

    try {
      const result = await work(queryRunner);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async withRepositories<T>(
    work: (repositories: { [key: string]: any }) => Promise<T>,
    isolationLevel: IsolationLevel = "READ COMMITTED"
  ): Promise<T> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction(isolationLevel);

    try {
      // يمكن إضافة المستودعات المطلوبة هنا
      const repositories = {
        shipping: queryRunner.manager.getRepository("Shipping"),
        order: queryRunner.manager.getRepository("Order"),
        payment: queryRunner.manager.getRepository("Payment"),
        notification: queryRunner.manager.getRepository("Notification"),
      };

      const result = await work(repositories);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async executeInTransaction<T>(
    work: () => Promise<T>,
    isolationLevel: IsolationLevel = "READ COMMITTED"
  ): Promise<T> {
    if (this.connection.queryRunner?.isTransactionActive) {
      return work();
    }
    return this.withTransaction(() => work(), isolationLevel);
  }
}
