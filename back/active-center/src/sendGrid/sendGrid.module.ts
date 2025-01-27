/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { SendGridConfig } from 'src/config/sendGrid.config';
import { SendGridService } from './sendGrid.service';

@Module({
  providers: [
    SendGridConfig,
    SendGridService
  ],
  exports: [
    SendGridConfig,
    SendGridService
  ], 
  
})
export class SendGridModule {}