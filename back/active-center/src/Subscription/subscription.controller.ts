import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { SubscriptionService } from './subscriptions.service';
import { ApiOperation } from '@nestjs/swagger';
import { Subscription } from 'src/Entities/Subscription.entity';
import { SubscriptionDetail } from 'src/Entities/SubscriptionDetails.entity';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener todas las suscripciones',
    description: 'Retorna una lista con todas las suscripciones disponibles.',
  })
  async getSubscriptions(): Promise<Subscription[]> {
    return await this.subscriptionService.getSubscriptions();
  };

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener una suscripción por ID',
    description: 'Busca y devuelve una suscripción específica según su ID.',
  })
  async getSubscriptionById(@Param('id') id: string): Promise<Subscription> {
    return this.subscriptionService.getSubscriptionById(id);
  };

  @Post('subscribe')
  @ApiOperation({
    summary: 'Suscribirse a una suscripción',
    description:
      'Permite a un usuario suscribirse a una suscripción específica.',
  })
  async subscribe(
    @Req() req: any,
    @Body() subId: string,
  ): Promise<SubscriptionDetail> {
    const userId: string = req.access.id;
    return this.subscriptionService.subscribe(userId, subId);
  };

  @Put('unsubscribe/:id')
  @ApiOperation({
    summary: 'Cancelar suscripción',
    description: 'Cambia el estado de la suscripción a inactiva.',
  })
  async unsubscribe(@Param('id') id: string): Promise<string> {
    return this.subscriptionService.unsubscribe(id);
  };

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar una suscripción',
    description: 'Borra una suscripción del sistema.',
  })
  async deleteSubscription(@Param('id') id: string): Promise<string> {
    return this.subscriptionService.deleteSubscription(id);
  };
}
