import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  SetMetadata,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { ApiBearerAuth, ApiBody, ApiOperation,ApiResponse, ApiTags } from '@nestjs/swagger';
import { AddProductsDTO,RemoveItemDTO,UpdateItemDTO } from './cartDTO/cart.dto';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ApiBearerAuth()
  @ApiOperation({
      summary: 'Verifica si el usuario tiene un carrito activo',
      description:
        'Si ya existe un carrito activo para el usuario, lo retorna , Si no existe, crea un nuevo carrito vacío, lo asocia con el usuario y lo marca como activo y Si el usuario no se encuentra en la base de datos, lanza un error',
    })
  @Get(':userId')
  async getCart(@Param('userId') userId: string) {
    return this.cartService.getCart(userId);
  }

  @SetMetadata('isPublic', true)
  @ApiOperation({ 
    summary: 'Agregar productos al carrito', 
    description: 'Obtiene el carrito activo del usuario y agrega los productos indicados, validando stock y cantidad.'
  })
  @ApiResponse({ status: 200, description: 'Carrito actualizado con los productos añadidos.' })
  @Post('add')
  @ApiBody({ type: AddProductsDTO })
  async addProducts(@Body() body: AddProductsDTO) {
    return this.cartService.addProductToCart(body.userId, body.products);
  }

  @SetMetadata('isPublic', true)
  @ApiOperation({ 
    summary: 'Actualizar cantidad de un producto en el carrito', 
    description: 'Busca el producto en el carrito y actualiza su cantidad. Si no existe, lanza un error.' 
  })
  @ApiResponse({ status: 200, description: 'Carrito actualizado con la nueva cantidad del producto.' })
  @Put('update')
  @ApiBody({ type: UpdateItemDTO })
  @ApiBody({ type: UpdateItemDTO })
  async updateProduct(@Body() body: UpdateItemDTO) {
    return this.cartService.updateCartItem(body.userId, body.productId, body.quantity);
  }

  @SetMetadata('isPublic', true)
  @ApiOperation({ 
    summary: 'Eliminar un producto del carrito', 
    description: 'Elimina un producto específico del carrito activo del usuario.'
  })
  @ApiResponse({ status: 200, description: 'Carrito actualizado sin el producto eliminado.' })
  @Delete('remove')
  @ApiBody({ type: RemoveItemDTO })
  async removeProduct(@Body() body: RemoveItemDTO) {
    return this.cartService.removeCartItem(body.userId, body.productId);
  }
}
