import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Reservation,
  ReservationStatus,
} from 'src/Entities/Reservation.entity';
import { Repository } from 'typeorm';
import { CreateReservationDto } from './ReservationDTO/reservations.dto';
import { UserService } from 'src/User/user.service';
import { SpaceService } from 'src/Space/space.service';
import { PaymentService } from 'src/Payment/payment.service';
import { SendGridService } from 'src/SendGrid/sendGrid.service';
import { updateReservationDto } from "src/Reservation/ReservationDTO/update-reservation.dto"





@Injectable()
export class ReservationService {
    constructor(@InjectRepository(Reservation) private reservationRepository:Repository<Reservation>,
    private paymentService: PaymentService,
    private userService:UserService,
    private spaceService:SpaceService,
    private readonly sendGrid: SendGridService
    ){}
    async allReservations() {
      const reservations = await this.reservationRepository.find({
        relations: ['spaces'], 
      });
      
      return reservations;
    }


  async getReservationById(id: string) {
    const reservation = await this.reservationRepository.findOne({
      where: { id },
    });
    return reservation;
  }

    async createReservation(createReservationDto: CreateReservationDto, userId: string) {
      const { date, startTime, endTime, spaceName } = createReservationDto;
    
      const user = await this.userService.getUserById(userId);
    
      if (!user) {
        throw new NotFoundException("Usuario no encontrado");
      }

      const [startH, startM] = startTime.split(':').map(Number);
          const [endH, endM] = endTime.split(':').map(Number);

          const startTotalMinutes = startH * 60 + startM;
          const endTotalMinutes = endH * 60 + endM;
          if(endTotalMinutes < startTotalMinutes){
            return "la hora de finalizacion debe ser mayor"
          }
    
      const space = await this.spaceService.getSpaceByName(spaceName);
    
      if (!space) {
        throw new NotFoundException("El espacio no existe");
      }
    
      const existingReservation = await this.reservationRepository.findOne({
        where: { spaces: { title: spaceName }, date, startTime },
      });
    
      if (existingReservation) {
        throw new ConflictException("El espacio ya está reservado en ese horario");
      }
    
      const newReservation = this.reservationRepository.create({
        date,
        startTime,
        endTime,
        price: space.price_hour,
        status: ReservationStatus.PENDING,
        user: user,
        spaces: space,
      });
    
      await this.reservationRepository.save(newReservation);

      
    
      const paymentSession = await this.paymentService.createCheckoutSessionForReservation(newReservation.id);
    
     
      if (!paymentSession || !paymentSession.url) {
        throw new Error('No se pudo generar el enlace de pago');
      }

      await this.sendGrid.reservationMail(
        newReservation.id, 
        user.email, 
        date, 
        startTime, 
        endTime, 
        price, 
        space.title, 
        user.name 
      )
      
      return {
        space: space.title,
        date,
        startTime,
        endTime,
        status: newReservation.status,
        price: newReservation.price,
        user: user.name,
        paymentLink: paymentSession.url,
      }
    }


    async updateReservation(userId:string,updateReservationDto:updateReservationDto){
    
      const reservations = await this.reservationRepository.findOne({where:{user:{id:userId}}})
         
        if(!reservations){
         throw new NotFoundException("no se encontraron reservas");
        }
     
        Object.assign(reservations,updateReservationDto);
        await this.reservationRepository.save(reservations);
     
        return "su reserva fue actualizada con exito";
    
     
      }

      async cancelReservation(userId:string){

        const reservations = await this.reservationRepository.findOne({where:{user:{id:userId}}})
        if(!reservations){
          throw new NotFoundException("no se encontraron reservas")
        }

        if(reservations.status === ReservationStatus.CONFIRMED){
            await this.reservationRepository.save({
                ...reservations,
                status:ReservationStatus.CANCELLED
            })
        }
        return {message: "la reserva fue cancelada"}

      }


}
