/* eslint-disable @typescript-eslint/no-explicit-any */
import { IProducts } from "@/interface/IProducts";
import { mapProductData } from "@/utils/mapProductData";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface PaginatedResponse {
  products: IProducts[];
  totalPages: number;
  total: number;
}

export const getProducts = async (page?: number, limit?: number): Promise<PaginatedResponse> => {
  try {
    console.log('Solicitando productos...', { page, limit });
    
    const response = await axios.get(`${API_URL}/product`, {
      params: {
        page: page || '',
        limit: limit || 14
      }
    });
    
    console.log('Datos crudos de productos:', response.data);

    // Manejar la respuesta dependiendo de su estructura
    let productsData;
    if (Array.isArray(response.data)) {
      productsData = response.data;
    } else if (response.data.products && Array.isArray(response.data.products)) {
      productsData = response.data.products;
    } else {
      throw new Error('Formato de respuesta inválido');
    }

    // Mapear los productos
    const products: IProducts[] = productsData.map((productData: any) => {
      const mappedProduct = mapProductData(productData);
      console.log(`Producto mapeado ${productData.id}:`, mappedProduct);
      return mappedProduct;
    });

    // Obtener o calcular la metadata de paginación
    const total = response.data.total || products.length;
    const totalPages = response.data.totalPages || 
                      Math.ceil(total / (limit || 14));

    console.log('Total de productos mapeados:', products.length);
    console.log('Información de paginación:', { 
      total, 
      totalPages, 
      currentPage: page 
    });

    return {
      products,
      totalPages,
      total
    };

  } catch (error) {
    console.error("Error fetching products:", {
      error,
      message: error instanceof Error ? error.message : 'Unknown error'
    });
    
    // Retornar un objeto con la estructura esperada en caso de error
    return {
      products: [],
      totalPages: 1,
      total: 0
    };
  }
};