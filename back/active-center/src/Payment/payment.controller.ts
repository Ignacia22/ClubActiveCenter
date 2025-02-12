import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  Headers,
  SetMetadata,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Request, Response } from 'express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Crear una sesión de pago',
    description:
      'Genera una nueva sesión de pago para un pedido específico, utilizando el ID de la orden y el ID del usuario. Esta sesión se utilizará para realizar el proceso de pago en la plataforma de Stripe.',
  })
  @Post('create-checkout-session')
  async createCheckoutSession(
    @Body() body: { orderId: string; userId: string },
  ) {
    return this.paymentService.createCheckoutSession(body.orderId, body.userId);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Crear una sesión de pago para una reserva',
    description:
      'Genera una nueva sesión de pago en Stripe para una reserva específica.',
  })
  @Post('create-checkout-session-reservation')
  async createCheckoutSessionForReservation(
    @Body() body: { reservationId: string },
  ) {
    return this.paymentService.createCheckoutSessionForReservation(
      body.reservationId,
    );
  }

  @ApiOperation({
    summary: 'Manejar eventos de webhook de Stripe',
    description:
      'Recibe y maneja los eventos enviados por Stripe a través de webhooks. Verifica la firma del webhook utilizando el `stripe-signature` y procesa el cuerpo de la solicitud para confirmar el estado del pago.',
  })
  @Post('webhook')
@SetMetadata('isPublic', true)
async handleWebhook(
  @Req() req: any, 
  @Headers('stripe-signature') sig: string,
  @Res() res: Response,
) {
  try {
    const rawBody = req.rawBody;
    if (!rawBody) {
      console.error(' No se encontró rawBody en la solicitud.');
      return res.status(400).send('rawBody no encontrado');
    }

    await this.paymentService.handleWebhook(rawBody, sig);
    res.status(200).send('Webhook recibido');
  } catch (err) {
    console.error(' Error en el webhook:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
}
}
