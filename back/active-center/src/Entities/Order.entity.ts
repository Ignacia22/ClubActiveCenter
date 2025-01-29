/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User.entity";
import { StatusOrder } from "src/Order/OrderDTO/orders.dto";
import { v4 as uuid } from 'uuid';
import { Item } from "./item.entity";

@Entity({name: 'orders'})
export class Order {
    
    @PrimaryGeneratedColumn('uuid')
    id = uuid();

    @ManyToOne(() => User, (user) => user.orders)
    user: User;

    @OneToMany(() => Item, (item) => item.order)
    item: Item[];
    
    @Column({type: 'decimal', scale: 2, nullable: false})
    total: number;

    @Column({type: 'date', default: new Date, nullable: false})
    date: Date;

    @Column({type: 'enum', enum: StatusOrder, default: StatusOrder.pending})
    status: string;

}