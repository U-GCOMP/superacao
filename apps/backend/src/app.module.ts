import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './db/database.module';
import { AppService } from './app.service';

@Module({
  imports: [AuthModule, DatabaseModule],
  providers: [AppService],
})
export class AppModule {}
