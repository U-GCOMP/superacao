import { ConfigService } from '@nestjs/config';
import 'dotenv/config';
import { DataSourceOptions } from 'typeorm';
import { Users } from '../auth/entities/user.entity';
import { UserRatings } from '../user/entities/user-ratings.entity';
import { PasswordResetRequest } from '../auth/entities/reset-password-request.entity';
import { Event } from '../event/entities/event.entity';
import { EventRatings } from '../event/entities/event-rating.entity';
import { EventVolunteers } from '../event/entities/event-volunteers.entity';

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
    entities: [
      Users,
      UserRatings,
      PasswordResetRequest,
      Event,
      EventRatings,
      EventVolunteers,
    ],
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
    synchronize: false,
  };
};
