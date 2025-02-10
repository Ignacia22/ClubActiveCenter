import { PartialType } from '@nestjs/swagger';
import { CreateReservationDto } from './reservations.dto';

export class updateReservationDto extends PartialType(CreateReservationDto) {}
