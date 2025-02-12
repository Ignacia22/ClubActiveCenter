import { IProducts } from "@/interface/IProducts";
import { mapProductData } from "@/utils/mapProductData";
import axios from "axios";
import { validate as uuidValidate } from 'uuid';


const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const getProduct = async (id: string): Promise<IProducts | null> => {
  try {
    const decodedId = decodeURIComponent(id).replace(/^:/, '');

    if (!uuidValidate(decodedId)) {
      console.error('ID inválido, no es un UUID:', decodedId);
      return null;
    }

    console.log(`Solicitando producto con UUID: ${decodedId}`);
    console.log(`URL completa: ${API_URL}/product/${decodedId}`);

    const response = await axios.get(`${API_URL}/product/${decodedId}`);
    console.log("Datos crudos del servidor:", response.data);

    const product = mapProductData(response.data);
    console.log("Producto mapeado:", product);

    return product;

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error de Axios:", {
        message: error.message,
        response: {
          data: error.response?.data,
          status: error.response?.status,
          headers: error.response?.headers
        }
      });
    } else {
      console.error("Error no Axios:", error);
    }
    return null;
  }
};