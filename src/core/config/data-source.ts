import { DataSource, DataSourceOptions } from "typeorm";
import * as dotenv from "dotenv";

dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: "postgres",
  url: process.env.DATABASE_URL,
  entities: ["dist/**/*.entity.js"],
  migrations: ["dist/migrations/*.js"],
  synchronize: process.env.NODE_ENV === "development",
  logging: process.env.NODE_ENV === "development",
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
  poolSize: 10,
  maxQueryExecutionTime: 1000,
  cache: {
    duration: 30000,
  },
  extra: {
    max: 25,
    connectionTimeoutMillis: 10000,
  },
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
