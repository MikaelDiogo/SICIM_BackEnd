import 'reflect-metadata';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';

config();

// Used by the TypeORM CLI (migration:generate/run/revert). Kept separate from
// DatabaseModule, which NestJS uses at runtime with ConfigService.
export const AppDataSource = new DataSource({
  type: 'postgres',
  ...(process.env.DATABASE_URL
    ? { url: process.env.DATABASE_URL }
    : {
        host: process.env.DB_HOST ?? 'localhost',
        port: Number(process.env.DB_PORT ?? 5432),
        username: process.env.DB_USERNAME ?? 'sicim',
        password: process.env.DB_PASSWORD ?? 'sicim_dev_pass',
        database: process.env.DB_NAME ?? 'sicim',
      }),
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  entities: ['src/**/*.orm-entity.ts'],
  migrations: ['src/shared/infrastructure/database/migrations/*.ts'],
  synchronize: false,
});
