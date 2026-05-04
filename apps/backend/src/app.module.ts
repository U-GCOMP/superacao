import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './db/database.module';
import { AppService } from './app.service';

@Module({
  imports: [AuthModule, UserModule, DatabaseModule],
  providers: [AppService],
})
export class AppModule {}
