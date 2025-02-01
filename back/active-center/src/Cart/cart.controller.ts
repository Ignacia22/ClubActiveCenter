import { Controller, Post, Get, Put, Delete, Body, Param } from "@nestjs/common";
import { CartService } from "./cart.service";


@Controller("cart")
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get(":userId")
  async getCart(@Param("userId") userId: string) {
    return this.cartService.getCart(userId);
  }

  @Post("add")
async addProducts(@Body() body: { userId: string; products: { productId: string; quantity: number }[] }) {
  // Llama al servicio pasando el arreglo de productos
  return this.cartService.addProductToCart(body.userId, body.products);
}

  @Put("update")
  async updateProduct(@Body() body: { userId: string; productId: string; quantity: number }) {
    return this.cartService.updateCartItem(body.userId, body.productId, body.quantity);
  }

  @Delete("remove")
  async removeProduct(@Body() body: { userId: string; productId: string }) {
    return this.cartService.removeCartItem(body.userId, body.productId);
  }
}
