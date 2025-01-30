import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import Stripe from "stripe";
import { Payment } from "src/Entities/Payment.entity";
import { User } from "src/Entities/User.entity";
import { Order } from "src/Entities/Order.entity";
import { PaymentStatus } from "./PaymentDTO/payment.dto";
import { StatusOrder } from "src/Order/OrderDTO/orders.dto";


@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Payment)
    private  paymentRepository: Repository<Payment>,
    @InjectRepository(User)
    private  userRepository: Repository<User>,
    @InjectRepository(Order)
    private  orderRepository: Repository<Order>
  ){
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      throw new Error('Stripe secret key is not defined in environment variables');
    }


    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-01-27.acacia',
    });
  }

  async createCheckoutSession(orderId: string, userId: string): Promise<string> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ["products", "user"],
    });
    
    if (!order) throw new Error("Orden no encontrada");

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: order.products.map((product) => ({
        price_data: {
          currency: "usd",
          product_data: { name: product.name },
          unit_amount: Math.round(product.price * 100),
        },
        quantity: 1,
      })),
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      metadata: {
        orderId: order.id,
        userId: userId,
      },
    });

    if (!session.url) {
      throw new Error("No se pudo generar el enlace de pago.");
    }

    return session.url;
  }

  async handleWebhook(req: any, sig: string) {
    let event: Stripe.Event;
  
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
   
    if (!webhookSecret) {
      console.error("STRIPE_WEBHOOK_SECRET no está definido en las variables de entorno");
      throw new Error("Webhook no puede ser validado debido a la configuración del entorno");
    }
  
    try {
      
      event = this.stripe.webhooks.constructEvent(
        req.body as Buffer, 
        sig,
        webhookSecret
      );
    } catch (err) {
      console.error("Error validando el webhook:", err.message);
      throw new Error("Webhook no válido");
    }
  
    
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
  
      const orderId = session.metadata?.orderId ?? "";
      const userId = session.metadata?.userId ?? "";
  
      if (!orderId || !userId) {
        console.error("Metadata faltante en el webhook");
        throw new Error("Orden o usuario no especificados en el webhook");
      }
  
      try {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        const order = await this.orderRepository.findOne({ where: { id: orderId } });
  
        if (!user || !order) {
          console.error("Usuario u orden no encontrados en el webhook");
          throw new Error("Usuario u orden no encontrados");
        }
  
        const payment = this.paymentRepository.create({
          amount: session.amount_total ? session.amount_total / 100 : 0,
          currency: session.currency || "usd",
          paymentStatus: PaymentStatus.PAID, 
          user,
          order,
        });
  
        await this.paymentRepository.save(payment);
  
        
        order.status = StatusOrder.complete; 
        await this.orderRepository.save(order);
  
        console.log("Pago registrado y orden completada");
      } catch (err) {
        console.error("Error procesando el evento de webhook:", err.message);
        throw new Error("Error al procesar el evento de webhook");
      }
    }
  }
}
  