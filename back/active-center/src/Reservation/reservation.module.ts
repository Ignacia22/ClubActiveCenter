/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from 'src/Entities/Reservation.entity';
import { UserService } from 'src/User/user.service';
import { Space } from 'src/Entities/Space.entity';
import { User } from 'src/Entities/User.entity';
import { SpaceService } from 'src/Space/space.service';
import { PaymentModule } from 'src/Payment/payment.module';



@Module({
  imports:[TypeOrmModule.forFeature([Reservation,Space,User]),PaymentModule],
  controllers: [ReservationController],
  providers: [ReservationService,UserService,SpaceService,],
})
export class ReservationModule {}
