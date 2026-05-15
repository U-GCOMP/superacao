import 'reflect-metadata';

import { config } from 'dotenv';

import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

import { getDataSourceOptions } from './orm.config';

config();

const configService = new ConfigService();
const dataSourceOptions = getDataSourceOptions(configService);

export default new DataSource(dataSourceOptions);
