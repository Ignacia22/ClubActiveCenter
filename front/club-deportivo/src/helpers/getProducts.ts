/* eslint-disable @typescript-eslint/no-explicit-any */
import { IProducts, ProductState } from "@/interface/IProducts"
import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

export const getProducts = async (): Promise<IProducts[]> => {
  try {
    const response = await axios.get(`${API_URL}/product?page=&limit=10`);
    
    // Mapear cada producto del array de respuesta
    const products: IProducts[] = response.data.map((productData: any) => ({
      id: productData.id,
      name: productData.name,
      description: productData.description,
      price: productData.price,
      stock: productData.stock,
      image: productData.img || '', // Asegúrate de que coincida con el campo de imagen en tu backend
      State: productData.productStatus === 'available' ? ProductState.Disponible : ProductState.SinStock
    }));

    return products;
  } catch (error) {
    console.error("Error fetching products:", error)
    return [] 
  }
}