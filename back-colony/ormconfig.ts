import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'admin',
  database: 'colony_db',
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: true,
  logging: true,
});