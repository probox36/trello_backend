import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

dotenv.config();

const baseConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'trello_db',
  logging: ['query', 'error', 'schema', 'warn', 'info', 'log', 'migration'],
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  migrationsTableName: 'typeorm_migrations_history',
  migrationsRun: true,
  synchronize: false,
};

export const typeOrmConfig: TypeOrmModuleOptions = baseConfig;

const dataSource = new DataSource(baseConfig);
export default dataSource;
