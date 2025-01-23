import { Module } from '@nestjs/common';
import { SendGridConfig } from 'src/config/sendGrid.config';

@Module({
  providers: [SendGridConfig],
  exports: [SendGridConfig], 
})
export class SendGridModule {}