import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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
        relations: ['user', 'spaces'],
      });
    
      return reservations.map(reservation => ({
        id: reservation.id,  
        date: reservation.date,
        startTime: reservation.startTime,
        endTime: reservation.endTime,
        status: reservation.status,
        price: reservation.price,
        user: {
          id: reservation.user.id, 
          name: reservation.user.name, 
          email: reservation.user.email,  
          phone: reservation.user.phone,  
        },
        spaces: Array.isArray(reservation.spaces) ? 
          reservation.spaces.map(space => ({
            id: space.id,
            title: space.title,  
          })) : [
            {
              id: reservation.spaces.id,
              title: reservation.spaces.title
            }
          ],
      }));
    }


    async getReservationsByUserId(userId: string) {
      const reservations = await this.reservationRepository.find({
        where: { user: { id: userId } },
        relations: ['user', 'spaces'],
      });
    
      if (!reservations || reservations.length === 0) {
        throw new NotFoundException('No se encontraron reservas para este usuario');
      }
    
      return reservations.map(reservation => ({
        id: reservation.id,
        date: reservation.date,
        startTime: reservation.startTime,
        endTime: reservation.endTime,
        status: reservation.status,
        price: reservation.price,
        spaces: Array.isArray(reservation.spaces)
          ? reservation.spaces.map(space => ({
              id: space.id,
              title: space.title,
            }))
          : reservation.spaces 
          ? [{ id: reservation.spaces.id, title: reservation.spaces.title }]
          : [],
      }));
    }
    
    async createReservation(createReservationDto: CreateReservationDto, userId: string) {
      const { date, startTime, endTime, spaceName } = createReservationDto;
    
      const user = await this.userService.getUserById(userId);
      if (!user) {
        throw new NotFoundException("Usuario no encontrado");
      }
    
      const [startH, startM] = startTime.split(':').map(Number);
      const [endH, endM] = endTime.split(':').map(Number);
      if (endH * 60 + endM <= startH * 60 + startM) {
        throw new BadRequestException("La hora de finalización debe ser mayor a la de inicio");
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
        user,
        spaces: space,
      });
      await this.reservationRepository.save(newReservation);
    
      const paymentSession = await this.paymentService.createCheckoutSessionForReservation(newReservation.id);
      if (!paymentSession?.url) {
        throw new Error('No se pudo generar el enlace de pago');
      }
    
      await this.sendGrid.reservationMail(
        newReservation.id,
        user.email,
        date,
        startTime,
        endTime,
        newReservation.price,
        space.title,
        user.name
      );
    
      return {
        space: space.title,
        date,
        startTime,
        endTime,
        status: newReservation.status,
        price: newReservation.price,
        user: user.name,
        paymentLink: paymentSession.url,
      };
    }
    
    async updateReservation(reservationId: string, updateReservationDto: updateReservationDto) {
      const reservation = await this.reservationRepository.findOne({ where: { id: reservationId } });
      if (!reservation) {
        throw new NotFoundException("Reserva no encontrada");
      }
      if (reservation.status === ReservationStatus.CANCELLED) {
        throw new ConflictException("No se puede actualizar una reserva cancelada");
      }
      Object.assign(reservation, updateReservationDto);
      await this.reservationRepository.save(reservation);
    
      return { message: "Su reserva fue actualizada con éxito" };
    }
    
    async cancelReservation(reservationId: string) {
      const reservation = await this.reservationRepository.findOne({ where: { id: reservationId } });
      if (!reservation) {
        throw new NotFoundException("Reserva no encontrada");
      }
      if (reservation.status === ReservationStatus.CANCELLED) {
        throw new ConflictException("La reserva ya está cancelada");
      }
      if (reservation.status !== ReservationStatus.CONFIRMED) {
        throw new ConflictException("Solo se pueden cancelar reservas confirmadas");
      }
    
      reservation.status = ReservationStatus.CANCELLED;
      await this.reservationRepository.save(reservation);
    
      return { message: "La reserva fue cancelada con éxito" };
    }
  }    