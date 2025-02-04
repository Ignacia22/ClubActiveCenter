import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Request, SetMetadata} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './ReservationDTO/reservations.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { updateReservationDto } from './ReservationDTO/update-reservation.dto';




@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}
  
  @Get()
  @ApiBearerAuth()
  @ApiOperation({
    summary: "todas las reservas"
  })
  allReservation(){
    return this.reservationService.allReservations()
  }


  @Get(":id")
  @ApiBearerAuth()
  @ApiOperation({
    summary:"busca una reserva por id"
  })
  getReservationById(@Param("id",ParseUUIDPipe) id:string){
    return this.reservationService.getReservationById(id)

  }

  @Post("create")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "crea una reserva"
  })
  CreateReservation(@Request() req:any , @Body() createReservationDto:CreateReservationDto){
    const userId = req.access.id;
       
    return this.reservationService.createReservation(createReservationDto,userId)
    
  }

  @Patch()
  @ApiBearerAuth()
  @ApiOperation({
    summary:"actualiza una reserva"
  })
  updateReservation(@Body() updateReservationDto:updateReservationDto , @Request() req:any){

    const userId = req.access.id;
    return this.reservationService.updateReservation(userId,updateReservationDto);

  }

  @Delete()
  @ApiBearerAuth()
  @ApiOperation({
    summary:"cancela una reserva"
  })
  cancelReservation(@Request() req:any){
    
    const userId = req.access.id;
    return this.reservationService.cancelReservation(userId)

  }

}
