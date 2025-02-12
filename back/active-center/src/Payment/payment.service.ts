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
import { SubscriptionService } from 'src/Subscription/subscriptions.service';
import { SubscriptionDetail } from 'src/Entities/SubscriptionDetails.entity';
import { Subscription } from 'src/Entities/Subscription.entity';


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
    @InjectRepository(Subscription)
private subscriptionRepository: Repository<Subscription>,
@InjectRepository(SubscriptionDetail)
private subscriptionDetailRepository: Repository<SubscriptionDetail>,

    private subscriptionService : SubscriptionService

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
      'https://club-active-center.vercel.app/payment/success?session_id={CHECKOUT_SESSION_ID}';
    const cancelUrl = 'https://club-active-center.vercel.app/payment/cancel';

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
  async createCheckoutSessionSub(userId: string, subId: string): Promise<{ sessionId: string; url: string | null; }> {
    try {
        const subscription = await this.subscriptionRepository.findOne({
            where: { id: subId },
        });

        if (!subscription) {
          throw new NotFoundException('Suscripción no encontrada');
      }

        const session = await this.stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          mode: 'payment',
          line_items: [
              {
                  price_data: {
                      currency: 'usd',
                      product_data: {
                          name: subscription.name,
                          description: subscription.description,
                      },
                      unit_amount: Math.round(subscription.price * 100),
                  },
                  quantity: 1, 
              },
          ],
          success_url: 'https://club-active-center.vercel.app/subsPayment/success?session_id={CHECKOUT_SESSION_ID}',
          cancel_url: 'https://club-active-center.vercel.app/subsPayment/cancel',
          metadata: {
              userId,
              subId,
          },
      });
        return { sessionId: session.id, url: session.url };
    } catch (error) {
        throw new InternalServerErrorException('Hubo un error al crear la sesión de pago.', error?.message || error);
    }
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
      console.error(' Error validando el webhook:', err.message);
      throw new BadRequestException('Webhook no válido');
  }
  try {
      if (event.type === 'checkout.session.completed') {
          const session = event.data.object as Stripe.Checkout.Session;
          const metadata = session.metadata || {};
          const { orderId, userId, reservationId, subId } = metadata;

          console.log('🔍 Metadata recibida:', metadata);

          if (orderId && userId) {
              await this.processOrderPayment(session, orderId, userId);
          } else if (reservationId) {
              await this.processReservationPayment(session, reservationId);
          } else if (subId && userId) {
              await this.subscriptionService.activateSubscription(userId, subId);
          } else {
              throw new BadRequestException('Datos insuficientes en la metadata del webhook');
          }
      } else {
          console.log(`ℹ️ Evento de webhook no manejado: ${event.type}`);
      }
  } catch (err) {
      throw new InternalServerErrorException('Error procesando el evento');
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
  private async activateSubscription(userId: string, subId: string) {
    const subscription = await this.subscriptionRepository.findOne({ where: { id: subId } });
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user || !subscription) throw new NotFoundException('Usuario o suscripción no encontrados');

    const newSubscription = this.subscriptionDetailRepository.create({
      user,
      subscription,
      dayInit: new Date(),
      dayEnd: new Date(new Date().setDate(new Date().getDate() + (subscription.duration ?? 31))),
      price: subscription.price,
      status: true, 
    });

    await this.subscriptionDetailRepository.save(newSubscription);
    await this.userRepository.update(user.id, { isSubscribed: true });
}
}
