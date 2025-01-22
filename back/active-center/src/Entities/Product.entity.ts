/* eslint-disable prettier/prettier */
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "./Category.entity";

@Entity({name: 'products'})
export class Product {
    
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'text', nullable: false})
    img: string;

    @Column({type: 'varchar', nullable: false})
    name: string;

    @Column({type: 'text', nullable: false})
    description: string;

    @ManyToOne(() => Category, (category) => category.products)
    category: Category;

    @Column({type: 'decimal', scale: 2, precision: 8, nullable: false})
    price: number;

    @Column({type: 'integer', precision: 4, nullable: false})
    stock: number;
}