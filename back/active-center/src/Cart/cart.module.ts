import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from 'src/Entities/Cart.entity';
import { CartItem } from 'src/Entities/CartItem.entity';
import { Product } from 'src/Entities/Product.entity';
import { User } from 'src/Entities/User.entity';



@Module({
  imports: [TypeOrmModule.forFeature([Cart,CartItem,Product,User])],
  controllers: [CartController],
  providers: [CartService],
  exports:[CartService]
})
export class CartModule {}
