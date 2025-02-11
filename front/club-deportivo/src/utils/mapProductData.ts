/* eslint-disable @typescript-eslint/no-explicit-any */
import { IProducts, ProductState } from "@/interface/IProducts";

export const mapProductData = (productData: any): IProducts => ({
  id: productData.id,
  name: productData.name,
  description: productData.description,
  price: typeof productData.price === 'string' ? parseFloat(productData.price) : productData.price,
  stock: typeof productData.stock === 'string' ? parseInt(productData.stock) : productData.stock,
  image: productData.image || productData.img || '', // Maneja ambos casos
  State: productData.productStatus === 'available' ? ProductState.Disponible : 
         productData.productStatus === 'outOfStock' ? ProductState.SinStock :
         productData.State || ProductState.Disponible,
  category: productData.category || ''
});