/* eslint-disable prettier/prettier */
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "./Category.entity";
import { v4 as uuid } from 'uuid';
import { Item } from "./item.entity";
import { ProductCategory, ProductState } from "src/product/productsDTO/createProduct.dto";


@Entity ('products')
export class Product {
    
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'varchar', nullable: false, unique: true})
    title: string;

    @Column({type: 'decimal', scale: 2, precision: 8, nullable: false})
    price: number;
    
    @Column({type: 'text', nullable: false})
    description: string;
    
    @Column({type: 'text', nullable: false})
    img: string;

    @Column({type: "enum", enum:ProductState, default: ProductState.DISPONIBLE})
    state: ProductState;
    
    @Column({type: 'integer', nullable: false})
    stock: number;

    @Column({ type: 'float', default: 5.0 })
    rate: number;

    @ManyToOne(() => Item, (item) => item.product)
    item: Item;

    @ManyToOne(() => Category, (category) => category.products)
    category: Category;
}

