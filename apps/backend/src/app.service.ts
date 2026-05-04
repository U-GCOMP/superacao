import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @Inject('DATA_SOURCE')
    private readonly dataSource: DataSource,
  ) {}

  onModuleInit() {
    console.log('Connected?', this.dataSource.isInitialized);
    console.log('Database:', this.dataSource.options.database);
    console.log(
      'Entities:',
      this.dataSource.entityMetadatas.map((e) => e.name),
    );
  }
}
