/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from 'src/Entities/Reservation.entity';
import { UserService } from 'src/User/user.service';
import { Space } from 'src/Entities/Space.entity';
import { SpaceModule } from 'src/Space/space.module';
import { User } from 'src/Entities/User.entity';
import { SpaceService } from 'src/Space/space.service';
import { SendGridModule } from 'src/SendGrid/sendGrid.module';



@Module({
  imports:[TypeOrmModule.forFeature([Reservation,Space,User]), SendGridModule],
  controllers: [ReservationController],
  providers: [ReservationService,UserService,SpaceService,],
})
export class ReservationModule {}
