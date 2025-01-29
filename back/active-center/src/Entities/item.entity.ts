import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import { Product } from "./Product.entity";
import { Order } from "./Order.entity"; 


@Entity({name: 'items'})
export class Item {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Order, (order) => order.item)
    order: Order; 

    @ManyToOne(() => Product, (product) => product.item)
    product: Product; 

    @Column({ type: 'integer' })
    quantity: number; 

    @Column({ type: 'decimal', scale: 2, precision: 10 })
    parcialPrice: number; 
}