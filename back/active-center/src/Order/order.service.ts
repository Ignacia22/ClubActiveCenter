import { Product } from 'src/Entities/Product.entity';
import { StatusOrder } from './OrderDTO/orders.dto';
import { Order } from 'src/Entities/Order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from 'src/Entities/User.entity';
import { CartService } from 'src/Cart/cart.service';
import { PaymentService } from 'src/Payment/payment.service';
import { OrderItem } from 'src/Entities/OrdenItem.entity';
import { Cart } from 'src/Entities/Cart.entity';
import { CartItem } from 'src/Entities/CartItem.entity';
import { SendGridService } from 'src/SendGrid/sendGrid.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem) private orderItemRepository: Repository<Order>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Cart) private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    private readonly cartService: CartService,
    private readonly paymentService: PaymentService,
    private readonly sendGrid: SendGridService,
  ) {}

  async convertCartToOrder(
    userId: string,
  ): Promise<{ order: Order; checkoutUrl: string }> {
    const cart = await this.cartService.getCart(userId);

    if (!cart || cart.items.length === 0) {
      throw new NotFoundException(
        'No se encontró un carrito con productos para este usuario',
      );
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const orderData = {
      user: { id: user.id },
      price: 0,
      totalPrice: 0,
      status: StatusOrder.pending,
      date: new Date(),
    };

    const order = this.orderRepository.create(orderData);

    await this.orderRepository.save(order);

    const productPromises = cart.items.map(async (item) => {
      const productEntity = await this.productRepository.findOne({
        where: { id: item.productId },
      });
      if (!productEntity) {
        throw new NotFoundException(
          `Producto con ID ${item.productId} no encontrado`,
        );
      }
      return productEntity;
    });

    const products = await Promise.all(productPromises);

    const orderItems = cart.items.map((cartItem) => {
      const productEntity = products.find(
        (product) => product.id === cartItem.productId,
      );

      if (!productEntity) {
        throw new NotFoundException(
          `Producto con ID ${cartItem.productId} no encontrado`,
        );
      }

      productEntity.stock -= cartItem.quantity;

      const orderItem = new OrderItem();
      orderItem.order = order;
      orderItem.product = productEntity;
      orderItem.quantity = cartItem.quantity;
      orderItem.price = productEntity.price * cartItem.quantity;

      return orderItem;
    });

    await this.orderItemRepository.save(orderItems);
    await this.productRepository.save(products);

    const totalPrice = orderItems.reduce((sum, item) => sum + item.price, 0);

    order.totalPrice = totalPrice;

    await this.orderRepository.save(order);

    await this.sendGrid.orderEmail(
      order.id,
      order.date,
      user.email,
      user.name,
      orderItems,
      order.totalPrice,
    );

    const checkoutUrl = await this.paymentService.createCheckoutSession(
      order.id,
      userId,
    );

    cart.items = [];

    await this.cartItemRepository.delete({ cart: cart });

    await this.cartRepository.save(cart);

    return {
      order,
      checkoutUrl,
    };
  }

  calculateTotalPrice(
    products: Product[],
    items: import('../Cart/cartDTO/cart.dto').CartItemDTO[],
  ) {
    let total = 0;

    items.forEach((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (product) {
        total += product.price * item.quantity;
      }
    });

    return total;
  }

  async getAllOrder(): Promise<any[]> {
    const orders = await this.orderRepository.find({
      relations: ['user', 'orderItems', 'orderItems.product'],
    });

    return orders.map((order) => ({
      id: order.id,
      price: order.price,
      totalprice: order.totalPrice,
      status: order.status,
      date: order.date,
      user: {
        id: order.user.id,
        username: order.user.name,
        email: order.user.email,
      },
      orderItems: order.orderItems.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        price: item.price,
        product: {
          id: item.product.id,
          name: item.product.name,
        },
      })),
    }));
  }

  async getOrdersByUserId(userId: string): Promise<any> {
    const orders = await this.orderRepository.find({
      where: { user: { id: userId } },
      relations: ['user', 'orderItems', 'orderItems.product'],
    });

    if (!orders || orders.length === 0) {
      throw new NotFoundException(
        'No se encontraron órdenes para este usuario',
      );
    }

    return orders.map((order) => ({
      id: order.id,
      price: order.price,
      totalprice: order.totalPrice,
      status: order.status,
      date: order.date,
      user: {
        id: order.user.id,
        username: order.user.name,
        email: order.user.email,
      },
      orderItems: order.orderItems.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        price: item.price,
        product: {
          id: item.product.id,
          name: item.product.name,
        },
      })),
    }));
  }
}
