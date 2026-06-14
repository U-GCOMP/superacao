import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './db/database.module';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from './mail/mail.module';
import { EventModule } from './event/event.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    DatabaseModule,
    MailModule,
    EventModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads', 'users'),
      serveRoot: '/users/image',
    }),
    ScheduleModule.forRoot(),
  ],
})
export class AppModule {}
