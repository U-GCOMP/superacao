import { Module } from '@nestjs/common';
import { MailService } from './auth.service';

@Module({
  providers: [
    {
      provide: IMailProvider,
      // Use Mock in dev, SES in production
      useClass: process.env.NODE_ENV === 'production' ? SESMailProvider : MockMailProvider,
    },
  ],
  exports: [IMailProvider],
})
export class MailModule {}