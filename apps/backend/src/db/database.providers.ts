import { DataSource } from 'typeorm';
import { baseDbConfig } from './orm.config';
import { User } from '../auth/entities/user.entity';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        ...baseDbConfig,
        entities: [User],
      });
      return dataSource.initialize();
    },
  },
];
