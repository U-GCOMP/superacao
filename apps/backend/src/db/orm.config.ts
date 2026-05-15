import { ConfigService } from '@nestjs/config';
import 'dotenv/config';
import { DataSourceOptions } from 'typeorm';
import { Users } from '../auth/entities/user.entity';
import { PasswordResetRequest } from '../auth/entities/reset-password-request.entity';
import { Event } from '../event/entities/event.entity';

export const getDataSourceOptions = (
  configService?: ConfigService,
): DataSourceOptions => {
  const cfg = configService ?? new ConfigService();
  return {
    type: 'postgres',
    host: cfg.get<string>('DB_HOST'),
    port: cfg.get<number>('DB_PORT'),
    username: cfg.get<string>('DB_USER'),
    password: cfg.get<string>('DB_PASSWORD'),
    database: cfg.get<string>('DB_DATABASE'),
    entities: [Users, PasswordResetRequest, Event],
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
    synchronize: false,
  };
};
