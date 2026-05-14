import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MailModule } from '../mail/mail.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';
import { PasswordResetRequest } from './entities/reset-password-request.entity';
import { AuthRepository } from './auth.repository';
import { PasswordRepository } from './password.repository';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'secretKey',
      signOptions: { expiresIn: '1d' },
    }),
    TypeOrmModule.forFeature([Users, PasswordResetRequest]),
    MailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, PasswordRepository],
})
export class AuthModule {}
