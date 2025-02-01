// src/Order/order.service.ts

import { Product } from "src/Entities/Product.entity";
import { StatusOrder } from "./OrderDTO/orders.dto";
import { Order } from "src/Entities/Order.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "src/Entities/User.entity";
import { CartService } from "src/Cart/cart.service";
import { PaymentService } from "src/Payment/payment.service";  // Inyectar PaymentService
import { OrderItem } from "src/Entities/OrdenItem.entity";

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem) private orderItemRepository: Repository<Order>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(User) private userRepository: Repository<User>, 
    private readonly cartService: CartService,
    private readonly paymentService: PaymentService,  // Inyectar PaymentService
  ) {}

  async convertCartToOrder(userId: string): Promise<{ order: Order, checkoutUrl: string }> {
    // Obtener el carrito del usuario
    const cart = await this.cartService.getCart(userId);
  
    if (!cart || cart.items.length === 0) {
      throw new Error('No se encontró un carrito con productos para este usuario');
    }
  
    // Obtener el usuario completo
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
  
    // Crear la orden base (sin los items aún)
    const orderData = {
      user: { id: user.id },  // Pasar solo el id si 'user' es una relación ManyToOne
      price: 0,  // Precio inicial
      totalPrice: 0,  // Precio total que se calculará después
      status: StatusOrder.pending,  // Estado de la orden
      date: new Date(),  // Fecha de la orden
    };
    
    const order = this.orderRepository.create(orderData);  // Crear la instancia de la entidad
    
    await this.orderRepository.save(order)
  
    // Obtener los productos del carrito y mapearlos a las instancias completas de Product
const productPromises = cart.items.map(async (item) => {
  const productEntity = await this.productRepository.findOne({ where: { id: item.productId } });
  if (!productEntity) {
    throw new Error(`Producto con ID ${item.productId} no encontrado`);
  }
  return productEntity;  // Devolvemos la instancia completa de Product
});

const products = await Promise.all(productPromises);

// Crear los OrderItems con la cantidad y el precio correcto
// Crear los OrderItems con la cantidad y el precio correcto
const orderItems = await Promise.all(cart.items.map((cartItem) => {
  // Buscar el producto correspondiente en el array de productos obtenidos
  const productEntity = products.find(product => product.id === cartItem.productId);

  if (!productEntity) {
    throw new Error(`Producto con ID ${cartItem.productId} no encontrado`);
  }

  // Crear el OrderItem manualmente
  const orderItem = new OrderItem();
  
  // Asignar las propiedades del OrderItem
  orderItem.order = order;  // Asegúrate de que 'order' sea la instancia de 'Order'
  orderItem.product = productEntity;  // Asociar el producto completo
  orderItem.quantity = cartItem.quantity;  // Asignar la cantidad
  orderItem.price = productEntity.price * cartItem.quantity;  // Calcular el precio total por item

  return orderItem;
}));

// Guardar los items en la base de datos
await this.orderItemRepository.save(orderItems);


// Guardar los items en la base de datos
await this.orderItemRepository.save(orderItems);


// Guardar los items en la base de datos
await this.orderItemRepository.save(orderItems);

  
    // Calcular el precio total de la orden sumando todos los precios de los items
    const totalPrice = orderItems.reduce((sum, item) => sum + item.price, 0);
  
    // Actualizar el precio total de la orden
    order.totalPrice = totalPrice;
  
    // Guardar la orden con el precio total actualizado
    await this.orderRepository.save(order);
  
    // Crear la sesión de pago con Stripe
    const checkoutUrl = await this.paymentService.createCheckoutSession(order.id, userId);
  
    // Retornar la orden y la URL de Stripe para el pago
    return {
      order,
      checkoutUrl,  // URL para completar el pago en Stripe
    };
  }
  
  
  

  
  calculateTotalPrice(products: Product[], items: import("../Cart/cartDTO/cart.dto").CartItemDTO[]) {
    let total = 0;
  
    items.forEach((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (product) {
        total += product.price * item.quantity;  // Precio por cantidad de cada producto
      }
    });
  
    // Aquí puedes agregar impuestos o descuentos si es necesario
    return total;
  }
}
  