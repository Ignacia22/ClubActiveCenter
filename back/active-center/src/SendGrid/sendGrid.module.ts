import { Module } from '@nestjs/common';
import { SendGridConfig } from 'src/config/sendGrid.config';
import { SendGridService } from './sendGrid.service';
import { SendGridController } from './sendGrid.controller';

@Module({
  providers: [SendGridConfig, SendGridService],
  controllers: [SendGridController],
  exports: [SendGridConfig, SendGridService],
})
export class SendGridModule {}
