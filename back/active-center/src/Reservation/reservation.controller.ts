import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Request,
  SetMetadata,
} from '@nestjs/common';
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
    summary: 'Todas las reservas',
    description: 'Este Endpoint permite llamar a todas las reservaciones.',
  })
  allReservation() {
    return this.reservationService.allReservations();
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'busca una reserva por id',
    description: 'Este endpoint permite traer una reserva por id.',
  })
  getReservationsByUserId(@Param('id', ParseUUIDPipe) id: string) {
    return this.reservationService.getReservationsByUserId(id);
  }

  @Post('create')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'crea una reserva',
    description: 'Este endpoint permite crear una reservación.',
  })
  CreateReservation(
    @Request() req: any,
    @Body() createReservationDto: CreateReservationDto,
  ) {
    const userId = req.access.id;
    return this.reservationService.createReservation(
      createReservationDto,
      userId,
    );
  }

  @Patch()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'actualiza una reserva',
    description: 'Este endpoint permite actualizar una reserva.',
  })
  updateReservation(
    @Body() updateReservationDto: updateReservationDto,
    @Request() req: any,
  ) {
    const userId = req.access.id;
    return this.reservationService.updateReservation(
      userId,
      updateReservationDto,
    );
  }

  @Delete()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'cancela una reserva',
    description: 'Este endpoint permite cancelar una reserva.',
  })
  cancelReservation(@Request() req: any) {
    const userId = req.access.id;
    return this.reservationService.cancelReservation(userId);
  }
}
