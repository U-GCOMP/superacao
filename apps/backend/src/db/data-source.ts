import 'dotenv/config';
import { DataSource } from 'typeorm';

//TODO: Nao consegui importar de arquivo de configuracao base e gerar migrations
//import { baseDbConfig } from './orm.config';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false,
  entities: ['src/**/entities/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
});
