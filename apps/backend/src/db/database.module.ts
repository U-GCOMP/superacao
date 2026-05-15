import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { getDataSourceOptions } from './orm.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: getDataSourceOptions,
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
