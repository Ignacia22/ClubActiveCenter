/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User.entity";
import { Product } from "./Product.entity";
import { StatusOrder } from "src/Order/OrderDTO/Order.dto";

@Entity({name: 'orders'})
export class Order {
    
    @PrimaryGeneratedColumn('uuid')
    id: string

    @ManyToOne(() => User, (user) => user.orders)
    user: User;

    @ManyToMany(() => Product)
    @JoinTable()
    products: Product[];

    @Column({type: 'decimal', scale: 2, nullable: false})
    price: number;

    @Column({type: 'date', default: new Date, nullable: false})
    date: Date;

    @Column({type: 'enum', enum: StatusOrder, default: StatusOrder.pending})
    status: string;

}