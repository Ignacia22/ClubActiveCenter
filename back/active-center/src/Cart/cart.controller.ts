import { Controller, Post, Get, Put, Delete, Body, Param, SetMetadata } from "@nestjs/common";
import { CartService } from "./cart.service";
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from "@nestjs/swagger";
import { CartItemDTO, updateItemtDTO } from "./cartDTO/cart.dto";


@ApiTags('Cart')
@Controller("cart")
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ApiBearerAuth()
  @Get(":userId")
  async getCart(@Param("userId") userId: string) {
    return this.cartService.getCart(userId);
  }

  @SetMetadata('isPublic', true)
  @Post("add")
  @ApiBody({ type: CartItemDTO })
  async addProducts(@Body() body: { userId: string; products: { productId: string; quantity: number }[] }) {
  
  return this.cartService.addProductToCart(body.userId, body.products);
}

  @SetMetadata('isPublic', true)
  @Put("update")
  @ApiBody({ type: updateItemtDTO })
  async updateProduct(@Body() body: { userId: string; productId: string; quantity: number }) {
    return this.cartService.updateCartItem(body.userId, body.productId, body.quantity);
  }

  @SetMetadata('isPublic', true)
  @Delete("remove")
  @ApiBody({ type: updateItemtDTO })
  async removeProduct(@Body() body: { userId: string; productId: string }) {
    return this.cartService.removeCartItem(body.userId, body.productId);
  }
}
