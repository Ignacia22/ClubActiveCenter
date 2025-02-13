import { IProducts } from "@/interface/IProducts";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export const getProducts = async (page: number = 1): Promise<{ products: IProducts[], totalPages: number }> => {
  try {
    console.log('API URL:', API_URL);
    console.log('Solicitando página:', page);

    const response = await axios.get(`${API_URL}/product`, {
      params: { 
        page: page,
        limit: 14,
        pagination: true // 👀 Si la API lo necesita
      }
    });

    console.log("Respuesta de la API:", response.data); // 📌 Verifica qué devuelve

    const products = response.data.products ?? []; 
    const totalItems = response.data.totalItems ?? 60; // ⚠️ Asegúrate de que la API devuelve esto
    const totalPages = Math.ceil(totalItems / 10); 

    return { products, totalPages };
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return { products: [], totalPages: 0 };
  }
};
