import { Module } from '@nestjs/common';
import { RegisterService } from './register.service';
import { RegisterController } from './register.controller';
import { RegisterRepository } from './register.repository';

@Module({
  controllers: [RegisterController],
  providers: [RegisterService, RegisterRepository],
})
export class RegisterModule {}
