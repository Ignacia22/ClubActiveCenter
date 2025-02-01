import { Controller, Post, Body, Req, Res, Headers } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Request, Response } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @ApiBearerAuth()
  @Post('create-checkout-session')
  async createCheckoutSession(
    @Body() body: { orderId: string; userId: string },
  ) {
    return this.paymentService.createCheckoutSession(body.orderId, body.userId);
  }

  @ApiBearerAuth()
  @Post('webhook')
  async handleWebhook(
    @Req() req: Request,
    @Res() res: Response,
    @Headers('stripe-signature') sig: string,
  ) {
    try {
      await this.paymentService.handleWebhook(req as any, sig);
      res.status(200).send('Webhook recibido');
    } catch (err) {
      console.error('Error en webhook:', err.message);
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }
}
