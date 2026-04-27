import { Module } from '@nestjs/common';
import { UpdateService } from './update.service';
import { UpdateController } from './update.controller';
import { UpdateRepository } from './update.repository';

@Module({
  controllers: [UpdateController],
  providers: [UpdateService, UpdateRepository],
})
export class UpdateModule {}
