import { IProducts } from "@/interface/IProducts";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Función que obtiene un producto por ID
export const getProduct = async (id: string): Promise<IProducts | null> => {
  try {
    // Llamada al backend pasando el ID del producto
    const response = await axios.get(`${API_URL}/product/${id}`);
    
    // Retorna el producto directamente si la solicitud fue exitosa
    return response.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null; // Retorna null en caso de error
  }
};
