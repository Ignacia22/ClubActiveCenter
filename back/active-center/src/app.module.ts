/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { configModule } from './config.module';
import { UserModule } from './User/user.module';
import { ReservationModule } from './Reservation/reservation.module';
import { OrderModule } from './Order/order.module';
import { AuthModule } from './Auth/auth.module';
import { JWTModule } from './jwt.module';

@Module({
  imports: [configModule, UserModule, ReservationModule, OrderModule, AuthModule, JWTModule],
  controllers: [],
  providers: [],
})
export class AppModule {}