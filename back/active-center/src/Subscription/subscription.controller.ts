import {
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { SubscriptionService } from './subscriptions.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CreateSubscriptionDTO } from './SubscriptionDTO/subscription.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/User/UserDTO/Role.enum';
import { RolesGuard } from 'src/Auth/Guard/roles.guard';
import {  SubscribeResponseDTO, SubscriptionResponseDTO } from './SubscriptionDTO/Subscription.enum';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener todas las suscripciones',
    description: 'Retorna una lista con todas las suscripciones disponibles.',
  })
  @SetMetadata('isPublic', true)
  async getSubscriptions(): Promise<SubscriptionResponseDTO[]> {
    return await this.subscriptionService.getSubscriptions();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener una suscripción por ID',
    description: 'Busca y devuelve una suscripción específica según su ID.',
  })
  @SetMetadata('isPublic', true)
  async getSubscriptionById(@Param('id') id: string): Promise<SubscriptionResponseDTO> {
    return this.subscriptionService.getSubscriptionById(id);
  }

  @Post('create-subscrition')
  @ApiOperation({
    summary: 'Craer una subscripción.',
    description: 'Este endpoint permite crear una nueva suscripción.',
  })
  @ApiBearerAuth()
  @Roles(Role.admin)
  @UseGuards(RolesGuard)
  async createSubscrition(data: CreateSubscriptionDTO): Promise<SubscriptionResponseDTO> {
    return await this.subscriptionService.createSubscription(data);
  }

  @Post('subscribe/:id')
@ApiOperation({
  summary: 'Suscribirse a una suscripción',
  description: 'Redirige al usuario a Stripe Checkout para completar el pago.',
})
@ApiBearerAuth()
async subscribe(
  @Req() req: any,
  @Param('id', ParseUUIDPipe) subId: string,
): Promise<{ url: string }> {
  const userId: string = req.access.id;
  return this.subscriptionService.subscribe(userId, subId);
}

  @Delete('unsubscribe/:id')
  @ApiOperation({
    summary: 'Cancelar suscripción',
    description: 'Cambia el estado de la suscripción a inactiva.',
  })
  @ApiBearerAuth()
  async unsubscribe(@Param('id') id: string): Promise<string> {
    return this.subscriptionService.unsubscribe(id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar una suscripción',
    description: 'Borra una suscripción del sistema.',
  })
  @Roles(Role.admin)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  async deleteSubscription(@Param('id') id: string): Promise<string> {
    return this.subscriptionService.deleteSubscription(id);
  }
}
