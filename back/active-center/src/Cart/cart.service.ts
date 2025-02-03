import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Cart } from "src/Entities/Cart.entity";
import { CartItem } from "src/Entities/CartItem.entity";
import { Product } from "src/Entities/Product.entity";
import { User } from "src/Entities/User.entity";
import { Repository } from "typeorm";
import { CartDTO } from "./cartDTO/cart.dto";

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem) private cartItemRepository: Repository<CartItem>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(User) private userRepository: Repository<User>
  ) {}

  async getOrCreateCart(userId: string): Promise<Cart> {
    let cart = await this.cartRepository.findOne({
      where: { user: { id: userId }, isActive: true },
      relations: ["items", "items.product", "user"],
    });
  
    if (!cart) {
      const user = await this.userRepository.findOne({ where: { id: userId } });
  
      if (!user) {
        throw new Error("Usuario no encontrado");
      }
  
      cart = this.cartRepository.create({ user, items: [], isActive: true });
      await this.cartRepository.save(cart);
    }
  
    return cart;
  }
  

  async addProductToCart(userId: string, products: { productId: string; quantity: number }[]): Promise<CartDTO> {
    const cart = await this.getOrCreateCart(userId);
    
    for (const { productId, quantity } of products) {
      const product = await this.productRepository.findOne({ where: { id: productId } });
      if (!product) {
        throw new Error(`Producto con ID ${productId} no encontrado`);
      }
      let cartItem = await this.cartItemRepository.findOne({ where: { cart: { id: cart.id }, product: { id: productId } } });
      if (cartItem) {
        cartItem.quantity += quantity;
      } else {
        if (quantity > product.stock) {
          throw new Error(`No hay suficiente stock para el producto ${product.name}. Disponible: ${product.stock}`);
      }
        cartItem = this.cartItemRepository.create({ cart, product, quantity });
      }
      await this.cartItemRepository.save(cartItem);
    }
    return this.getCart(userId);
  }

  async getCart(userId: string): Promise<CartDTO> {
    const cart = await this.getOrCreateCart(userId);
    return {
      id: cart.id,
      isActive: cart.isActive,
      items: cart.items.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        productPrice: item.product.price,
        quantity: item.quantity,
      })),
      userId: cart.user.id,
      userName: cart.user.name,
    };
  }

  async updateCartItem(userId: string, productId: string, quantity: number): Promise<CartDTO> {
    const cart = await this.getOrCreateCart(userId);
    const cartItem = await this.cartItemRepository.findOne({ where: { cart: { id: cart.id }, product: { id: productId } } });
    if (!cartItem) throw new Error("Producto no encontrado en el carrito");
    cartItem.quantity = quantity;
    await this.cartItemRepository.save(cartItem);
    return this.getCart(userId);
  }

  async removeCartItem(userId: string, productId: string): Promise<CartDTO> {
    const cart = await this.getOrCreateCart(userId);
    await this.cartItemRepository.delete({ cart: { id: cart.id }, product: { id: productId } });
    return this.getCart(userId);
  }
}
