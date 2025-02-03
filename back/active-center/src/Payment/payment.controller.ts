import { Controller, Post, Body, Req, Res, Headers, SetMetadata } from '@nestjs/common';
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

 
  @Post('webhook')
  @SetMetadata('isPublic', true)
  async handleWebhook(
    @Req() req: any, 
    @Headers('stripe-signature') sig: string, 
    @Res() res: Response
  ) {
    try {
      const rawBody = req.rawBody;
      await this.paymentService.handleWebhook(rawBody, sig);

      res.status(200).send('Webhook recibido');
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }
}
