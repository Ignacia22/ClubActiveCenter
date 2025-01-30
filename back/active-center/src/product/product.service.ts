import { Injectable, InternalServerErrorException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Item } from 'src/Entities/item.entity';
import { Product } from 'src/Entities/Product.entity';
import { Repository } from 'typeorm';
import { CreateProductDTO, pagedProducts, ProductCategory, ProductState } from './productsDTO/createProduct.dto';
import * as data from '../../data.json';
import { Category } from 'src/Entities/Category.entity';

@Injectable()
export class ProductService implements OnModuleInit {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        @InjectRepository(Item)
        private readonly itemRspository: Repository<Item>,
        private readonly cloudinaryService: CloudinaryService,
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>
    ){}
    async onModuleInit() {
            console.log('Cargando productos...');
            await this.productsSeeder(); 
         }

    async CreateProduct(newProduct: CreateProductDTO): Promise<Product | null>{

        const { img, stock, category } = newProduct;
        
        const newState = stock === 0 ? ProductState.SINSTOCK : ProductState.DISPONIBLE;

        const img_url = await this.cloudinaryService.uploadImageFromUrl(img);

        try{
            let existingCategory = await this.categoryRepository.findOne({ where: { name: category } });

            if (!existingCategory) {
                existingCategory = new Category();
                existingCategory.name = category;
                await this.categoryRepository.save(existingCategory);
            }

        const addedProduct = Object.assign({
            ...newProduct,
            state: newState,
            img: img_url,
            category: existingCategory
        });

        return await this.productRepository.save(addedProduct);
        
        }catch(err){
            throw new InternalServerErrorException(`Ocurrió un error al cargar el producto ${err.message}`)
        }
    }

    async productsSeeder() {
        for (const productData of data) {
            const { title, price, description, img, stock, category, rate } = productData;

            const productExist = await this.productRepository.findOneBy({title: title})
                if(productExist) console.log("Producto ya cargado")
            const newState: ProductState = stock === 0 ? ProductState.SINSTOCK : ProductState.DISPONIBLE;

            try {
                const img_url = await this.cloudinaryService.uploadImageFromUrl(img);

                const newProduct = {
                title,
                price,
                description,
                category,
                stock,
                img: img_url,
                state: newState,
                rate: rate
                };

                await this.CreateProduct(newProduct);
                console.log(`Producto creado: ${title}`);
        
            } catch (error) {
                console.error(`Error creando producto ${title}: ${error.message}`);
            }
        }
    }

    async getProducts(page: number, limit: number): Promise<pagedProducts>{

        const offset = (page - 1) * limit 
        const [products, total] = await this.productRepository.findAndCount({
            take: limit,
            skip: offset,
          });
        
          return {
            total,              
            page: offset / limit + 1, 
            limit,               
            totalPages: Math.ceil(total / limit),  
            data: products          
        };
        
    }

}
