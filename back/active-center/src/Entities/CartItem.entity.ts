import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import { Cart } from "./Cart.entity";
import { Product } from "./Product.entity";

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Cart, (cart) => cart.items, { nullable: false })
  cart: Cart;

  @ManyToOne(() => Product, { nullable: false })
  product: Product;

  @Column({ default: 1 }) 
  quantity: number;
}
