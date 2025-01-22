/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { configModule } from './config.module';
import { UserModule } from './User/user.module';
import { ReservationModule } from './Reservation/reservation.module';

@Module({
  imports: [configModule, UserModule, ReservationModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
