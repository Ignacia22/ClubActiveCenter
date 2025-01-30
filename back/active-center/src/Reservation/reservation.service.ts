import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from 'src/Entities/Reservation.entity';
import { Repository } from 'typeorm';
import { CreateReservationDto } from './ReservationDTO/reservations.dto';
import { UserService } from 'src/User/user.service';
import { Space } from 'src/Entities/Space.entity';
import { SpaceService } from 'src/Space/space.service';


@Injectable()
export class ReservationService {
    constructor(@InjectRepository(Reservation) private reservationRepository:Repository<Reservation>,
    @InjectRepository(Space) private spaceRepository:Repository<Space>,
    private userService:UserService,
    private spaceService:SpaceService,){}


    async allReservations(){
       const reservations = await this.reservationRepository.find()
       return reservations;
    }

    async getReservationById(id:string){

        const reservation = await this.reservationRepository.findOne({where:{id}})
        return reservation;
    }


    async createReservation(createReservationDto:CreateReservationDto, userId:string){
        
        const {date , startTime , endTime , spaceId , status} = createReservationDto

        const user = await this.userService.getUserById(userId)
        if(!user){
            throw new NotFoundException("Usuario no encontrado")
        }

        //verifica que la hora de inicio sea menor que la hora de finalización
        const start = new Date(`${date}T${startTime}:00Z`);
        const end = new Date(`${date}T${endTime}:00Z`);

        if(end > start){
            throw new BadRequestException('End time must be after start time')
        }

        //buscar si existe el espacio
        const space = await this.spaceService.getSpaceById(spaceId)
        const price = space?.price_hour;

        if(!space){
            throw new NotFoundException("el espacio no existe")
        }else{
            space.id = spaceId;
        }
        
        // Validar si el espacio está disponible en el rango horario

        const existingReservation = await this.reservationRepository.findOne({
            where:{spaces:{id:spaceId} , date ,startTime}
        })
        

        if(existingReservation){
            throw new ConflictException("El espacio ya está reservado en ese horario")
        }
        
        const newReservation = new CreateReservationDto();
        newReservation.date = date;
        newReservation.startTime = startTime;
        newReservation.endTime = endTime;
        newReservation.price = space.price_hour;
        newReservation.spaceId = spaceId;
        newReservation.userId = user.id;

        await this.reservationRepository.save(newReservation);
  
        return {
            date,
            startTime,
            endTime,
            status,
            price,
            user,
        };
    }
}

