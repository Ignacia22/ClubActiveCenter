import { IProducts } from "@/interface/IProducts";
import axios from "axios";

// Asegúrate de que siempre use la URL de producción si está disponible
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export const getProducts = async (): Promise<IProducts[]> => {
  try {
    // Log para verificar qué URL se está usando
    console.log('API URL being used:', API_URL);

    const response = await axios.get(`${API_URL}/product`, {
      params: {
        limit: 10
      },
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error("Error al obtener productos:", {
      url: API_URL,
      error: error,
      envVars: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
        nodeEnv: process.env.NODE_ENV
      }
    });
    return [];
  }
};