import { DataSource } from 'typeorm';
import { baseDbConfig } from './orm.config';
import { Users } from '../auth/entities/user.entity';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        ...baseDbConfig,
        entities: [Users],
      });
      return dataSource.initialize();
    },
  },
];
