import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, Column } from "typeorm";
import { User } from "./User.entity";
import { CartItem } from "./CartItem.entity";


@Entity()
export class Cart {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, (user) => user.cart, { nullable: false })
  user: User;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart, { cascade: true })
  items: CartItem[];

  

  @Column({ default: true }) 
  isActive: boolean;
}
