import 'reflect-metadata';

import { config } from 'dotenv';

import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';

import { Users } from '../auth/entities/user.entity';
import { PasswordResetRequest } from '../auth/entities/reset-password-request.entity';

config();

const configService = new ConfigService();
const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USER'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_DATABASE'),
  entities: [Users, PasswordResetRequest],
  migrations: [__dirname + '/../migrations/*.ts'],
  synchronize: false,
};

export default new DataSource(dataSourceOptions);
