/* eslint-disable prettier/prettier */
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./Product.entity";
import { v4 as uuid } from 'uuid';

@Entity({name: 'categories'})
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id = uuid();

    @Column({type: 'varchar', nullable: false})
    name: string;

    @OneToMany(() => Product, (product) => product.category)
    products: Product[];
}