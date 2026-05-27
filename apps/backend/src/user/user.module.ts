import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserRatingsRepository } from './userRatings.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../auth/entities/user.entity';
import { UserRatings } from './entities/user-ratings.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, UserRatings])],
  controllers: [UserController],
  providers: [UserService, UserRepository, UserRatingsRepository],
})
export class UserModule {}
