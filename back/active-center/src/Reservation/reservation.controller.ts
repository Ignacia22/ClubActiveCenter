import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Request, SetMetadata} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './ReservationDTO/reservations.dto';
import { ApiBearerAuth } from '@nestjs/swagger';




@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}
  
  @Get()
  @ApiBearerAuth()
  allReservation(){
    return this.reservationService.allReservations()
  }


  @Get(":id")
  @ApiBearerAuth()
  getReservationById(@Param("id",ParseUUIDPipe) id:string){
    return this.reservationService.getReservationById(id)

  }

  @Post("create")
  @ApiBearerAuth()
  CreateReservation(@Request() req:any , @Body() createReservationDto:CreateReservationDto){
    const userId = req.access.id;
       
    return this.reservationService.createReservation(createReservationDto,userId)
    
  }

}
