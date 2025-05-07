import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
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
import { SubscriptionEntity } from 'src/Entities/Subscription.entity';

@Injectable()
export class PaymentService {
  private stripe: Stripe | null = null;
  private isEnabled: boolean = false;
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    @InjectRepository(SubscriptionEntity)
    private subscriptionRepository: Repository<SubscriptionEntity>,
    @InjectRepository(SubscriptionDetail)
    private subscriptionDetailRepository: Repository<SubscriptionDetail>,
    private subscriptionService: SubscriptionService,
  ) {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    
    if (!stripeSecretKey) {
      this.isEnabled = false;
      this.logger.warn('La clave secreta de Stripe no está definida en las variables de entorno. La funcionalidad de pagos estará en modo simulación.');
    } else {
      this.isEnabled = true;
      this.stripe = new Stripe(stripeSecretKey, {
        apiVersion: '2025-01-27.acacia',
      });
      this.logger.log('Stripe inicializado correctamente');
    }
  }

  // Método auxiliar para verificar si Stripe está habilitado
  private checkStripeEnabled(): boolean {
    if (!this.isEnabled || !this.stripe) {
      this.logger.log('Operación de Stripe simulada - Stripe no está configurado');
      return false;
    }
    return true;
  }

  // Método para generar un ID simulado
  private generateMockId(prefix: string): string {
    return `${prefix}_mock_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
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

    // Si Stripe no está habilitado, devolver una URL simulada
    if (!this.checkStripeEnabled()) {
      // Simular el procesamiento del pago y actualizar la orden directamente
      const payment = this.paymentRepository.create({
        amount: order.orderItems.reduce((total, item) => total + (item.product.price * item.quantity), 0),
        currency: 'usd',
        paymentStatus: PaymentStatus.PAID,
        user: { id: userId },
        order: { id: orderId },
        paymentIntentId: this.generateMockId('pi'),
        reservationId: null,
      });

      await this.paymentRepository.save(payment);
      order.status = StatusOrder.complete;
      await this.orderRepository.save(order);

      // Devolver una URL simulada que indique que el pago fue procesado en modo simulación
      return 'https://club-active-center.vercel.app/payment/mock-success?simulation=true';
    }

    // En este punto sabemos que this.stripe no es null porque checkStripeEnabled() devolvió true
    if (!this.stripe) {
      throw new InternalServerErrorException('Stripe no está inicializado correctamente');
    }

    // Código original con Stripe
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
        'https://club-active-center.vercel.app/payment/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://club-active-center.vercel.app/payment/cancel',
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
  ): Promise<Stripe.Checkout.Session | { id: string; url: string }> {
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

    // Si Stripe no está habilitado, procesar la reserva directamente
    if (!this.checkStripeEnabled()) {
      // Crear un pago simulado
      const payment = this.paymentRepository.create({
        amount: reservation.price,
        currency: 'usd',
        paymentStatus: PaymentStatus.PAID,
        reservation: reservation,
        user: reservation.user,
        paymentIntentId: this.generateMockId('pi'),
        reservationId: reservationId,
      });

      await this.paymentRepository.save(payment);
      
      // Actualizar el estado de la reserva
      reservation.status = ReservationStatus.CONFIRMED;
      await this.reservationRepository.save(reservation);

      // Devolver un objeto similar al de Stripe
      return {
        id: this.generateMockId('cs'),
        url: 'https://club-active-center.vercel.app/pago/mock-success?simulation=true',
      };
    }

    // En este punto sabemos que this.stripe no es null porque checkStripeEnabled() devolvió true
    if (!this.stripe) {
      throw new InternalServerErrorException('Stripe no está inicializado correctamente');
    }

    // Código original con Stripe
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

  async createCheckoutSessionSub(
    userId: string,
    subId: string,
  ): Promise<{ sessionId: string; url: string | null }> {
    try {
      const subscription = await this.subscriptionRepository.findOne({
        where: { id: subId },
      });

      if (!subscription) {
        throw new NotFoundException('Suscripción no encontrada');
      }

      // Si Stripe no está habilitado, procesar la suscripción directamente
      if (!this.checkStripeEnabled()) {
        // Activar la suscripción directamente
        await this.subscriptionService.activateSubscription(userId, subId);
        
        return { 
          sessionId: this.generateMockId('cs'), 
          url: 'https://club-active-center.vercel.app/subsPayment/mock-success?simulation=true' 
        };
      }

      // En este punto sabemos que this.stripe no es null porque checkStripeEnabled() devolvió true
      if (!this.stripe) {
        throw new InternalServerErrorException('Stripe no está inicializado correctamente');
      }

      // Código original con Stripe
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
        success_url:
          'https://club-active-center.vercel.app/subsPayment/success?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: 'https://club-active-center.vercel.app/subsPayment/cancel',
        metadata: {
          userId,
          subId,
        },
      });
      return { sessionId: session.id, url: session.url };
    } catch (error) {
      // Si el error se debe a que Stripe no está configurado, ya lo manejamos arriba
      // Este catch es para otros errores
      throw new InternalServerErrorException(
        'Hubo un error al crear la sesión de pago.',
        error?.message || error,
      );
    }
  }

  async handleWebhook(rawBody: string, sig: string) {
    // Si Stripe no está habilitado, simplemente registrar y retornar
    if (!this.checkStripeEnabled()) {
      this.logger.log('Webhook recibido en modo simulación, ignorando');
      return { received: true, mode: 'simulation' };
    }

    // En este punto sabemos que this.stripe no es null porque checkStripeEnabled() devolvió true
    if (!this.stripe) {
      throw new InternalServerErrorException('Stripe no está inicializado correctamente');
    }

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
        if (orderId && userId) {
          await this.processOrderPayment(session, orderId, userId);
        } else if (reservationId) {
          await this.processReservationPayment(session, reservationId);
        } else if (subId && userId) {
          await this.subscriptionService.activateSubscription(userId, subId);
        } else {
          throw new BadRequestException(
            'Datos insuficientes en la metadata del webhook',
          );
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
}