import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation, ReservationStatus } from 'src/Entities/Reservation.entity';
import { Repository } from 'typeorm';
import { CreateReservationDto } from './ReservationDTO/reservations.dto';
import { UserService } from 'src/User/user.service';
import { Space } from 'src/Entities/Space.entity';
import { SpaceService } from 'src/Space/space.service';
import { PaymentService } from 'src/Payment/payment.service';



@Injectable()
export class ReservationService {
    constructor(@InjectRepository(Reservation) private reservationRepository:Repository<Reservation>,
    @InjectRepository(Space) private spaceRepository:Repository<Space>,
    private paymentService: PaymentService,
    private userService:UserService,
    private spaceService:SpaceService,
    ){}


    async allReservations() {
      const reservations = await this.reservationRepository.find({
        relations: ['spaces'], 
      });
      
      return reservations;
    }

    async getReservationById(id:string){

        const reservation = await this.reservationRepository.findOne({where:{id}})
        return reservation;
    }

    async createReservation(createReservationDto: CreateReservationDto, userId: string) {
      const { date, startTime, endTime, spaceName, status } = createReservationDto;
    
      const user = await this.userService.getUserById(userId);
    
      if (!user) {
        throw new NotFoundException("Usuario no encontrado");
      }
    
      const start = new Date(`${date}T${startTime}:00Z`);
      const end = new Date(`${date}T${endTime}:00Z`);
    
      if (end <= start) {
        throw new BadRequestException('End time must be after start time');
      }
    
      const space = await this.spaceService.getSpaceByName(spaceName);
      const price = space?.price_hour;
    
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
}