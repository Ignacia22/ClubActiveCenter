import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Stripe from 'stripe';
import { Payment } from 'src/Entities/Payment.entity';
import { User } from 'src/Entities/User.entity';
import { Order } from 'src/Entities/Order.entity';
import { PaymentStatus } from './PaymentDTO/payment.dto';
import { StatusOrder } from 'src/Order/OrderDTO/orders.dto';
import {
  Reservation,
  ReservationStatus,
} from 'src/Entities/Reservation.entity';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
  ) {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      throw new InternalServerErrorException(
        'La clave secreta de Stripe no está definida en las variables de entorno',
      );
    }

    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-01-27.acacia',
    });
  }
  async createCheckoutSession(
    orderId: string,
    userId: string,
  ): Promise<string> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['orderItems', 'orderItems.product', 'user'],
    });

    if (!order) throw new NotFoundException('Orden no encontrada');
    if (!order.orderItems || order.orderItems.length === 0) {
      throw new BadRequestException('La orden no tiene productos asociados.');
    }

    const lineItems = order.orderItems.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: { name: item.product.name },
        unit_amount: Math.round(item.product.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url:
        'https://club-active-center.vercel.app/pago/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://club-active-center.vercel.app/pago/cancel',
      metadata: {
        orderId: orderId,
        userId: userId,
      },
    });

    if (!session.url) {
      throw new InternalServerErrorException(
        'No se pudo generar el enlace de pago.',
      );
    }

    return session.url;
  }

  async createCheckoutSessionForReservation(
    reservationId: string,
  ): Promise<Stripe.Checkout.Session> {
    const reservation = await this.reservationRepository.findOne({
      where: { id: reservationId },
      relations: ['spaces', 'user'],
    });

    if (!reservation) {
      throw new NotFoundException('Reserva no encontrada');
    }

    const user = reservation.user;
    if (!user) {
      throw new NotFoundException('Usuario no encontrado en la reserva');
    }

    const successUrl =
      'https://club-active-center.vercel.app/pago/success?session_id={CHECKOUT_SESSION_ID}';
    const cancelUrl = 'https://club-active-center.vercel.app/pago/cancel';

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Reserva en ${reservation.spaces.title}`,
              description: `Fecha: ${reservation.date} | Horario: ${reservation.startTime} - ${reservation.endTime}`,
            },
            unit_amount: reservation.price * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        reservationId: reservation.id,
        userId: reservation.user.id,
      },
    });

    return session;
  }

  async handleWebhook(rawBody: string, sig: string) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      throw new InternalServerErrorException('Webhook secret no está definido');
    }

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    } catch (err) {
      console.error('Error validando el webhook:', err.message);
      throw new BadRequestException('Webhook no válido');
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      const orderId = session.metadata?.orderId;
      const userId = session.metadata?.userId;
      const reservationId = session.metadata?.reservationId;

      try {
        if (orderId && userId) {
          await this.processOrderPayment(session, orderId, userId);
        } else if (reservationId) {
          await this.processReservationPayment(session, reservationId);
        } else {
          console.error('Metadata faltante en el webhook');
          throw new BadRequestException(
            'Orden, usuario o reserva no especificados en el webhook',
          );
        }
      } catch (err) {
        console.error('Error procesando el evento:', err.message);
        throw new InternalServerErrorException('Error procesando el evento');
      }
    }
  }

  private async processOrderPayment(
    session: Stripe.Checkout.Session,
    orderId: string,
    userId: string,
  ) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });

    if (!user || !order) {
      console.error('Usuario u orden no encontrados en el webhook');
      throw new NotFoundException('Usuario u orden no encontrados');
    }

    const paymentIntentId =
      typeof session.payment_intent === 'string' ? session.payment_intent : '';

    if (!paymentIntentId) {
      console.error('Payment intent no disponible en el webhook');
      throw new BadRequestException('Payment intent no disponible');
    }

    const payment = this.paymentRepository.create({
      amount: session.amount_total ? session.amount_total / 100 : 0,
      currency: session.currency || 'usd',
      paymentStatus: PaymentStatus.PAID,
      user: { id: userId },
      order: { id: orderId },
      paymentIntentId: paymentIntentId,
      reservationId: null,
    });

    await this.paymentRepository.save(payment);
    order.status = StatusOrder.complete;
    await this.orderRepository.save(order);
  }

  private async processReservationPayment(
    session: Stripe.Checkout.Session,
    reservationId: string,
  ) {
    const reservation = await this.reservationRepository.findOne({
      where: { id: reservationId },
      relations: ['user'],
    });

    if (!reservation) {
      console.error('Reserva no encontrada en el webhook');
      throw new NotFoundException('Reserva no encontrada');
    }

    const paymentIntentId =
      typeof session.payment_intent === 'string' ? session.payment_intent : '';

    if (!paymentIntentId) {
      console.error('Payment intent no disponible en el webhook');
      throw new BadRequestException('Payment intent no disponible');
    }

    const payment = this.paymentRepository.create({
      amount: session.amount_total ? session.amount_total / 100 : 0,
      currency: session.currency || 'usd',
      paymentStatus: PaymentStatus.PAID,
      reservation: reservation,
      user: reservation.user,
      paymentIntentId: paymentIntentId,
      reservationId: reservationId,
    });

    await this.paymentRepository.save(payment);
    reservation.status = ReservationStatus.CONFIRMED;
    await this.reservationRepository.save(reservation);
  }
}
