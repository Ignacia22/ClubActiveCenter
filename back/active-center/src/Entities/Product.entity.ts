/* eslint-disable prettier/prettier */
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Category } from './Category.entity';
import { v4 as uuid } from 'uuid';
import { StatusProduct } from 'src/Product/productDTO/product.dto';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id = uuid();

  @Column({ type: 'text', nullable: false })
  img: string;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  @Column({ type: 'decimal', scale: 2, precision: 8, nullable: false })
  price: number;

  @Column({ type: 'integer', nullable: false })
  stock: number;

  @Column({
    type: 'enum',
    enum: StatusProduct,
    nullable: false,
    default: StatusProduct.Available,
  })
  productStatus: string;
}
