/* eslint-disable prettier/prettier */
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./Product.entity";

@Entity({name: 'categories'})
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'varchar', nullable: false})
    name: string;

    @OneToMany(() => Product, (product) => product.category)
    products: Product[];
}