/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { configModule } from './config/config.module';
import { UserModule } from './User/user.module';

@Module({
  imports: [configModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
