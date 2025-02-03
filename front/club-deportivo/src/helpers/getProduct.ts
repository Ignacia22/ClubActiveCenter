import { IProducts } from "@/interface/IProducts";
import axios from "axios";
import { validate as uuidValidate } from 'uuid';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const getProduct = async (id: string): Promise<IProducts | null> => {
  try {
    // Decodifica el ID y elimina el ":" inicial si existe
    let decodedId = decodeURIComponent(id);
    if (decodedId.startsWith(':')) {
      decodedId = decodedId.substring(1);
    }

    // Verifica si el ID es un UUID válido
    if (!uuidValidate(decodedId)) {
      console.error('ID inválido, no es un UUID:', decodedId);
      return null;
    }

    console.log(`Requesting product with UUID: ${decodedId}`);

    // Realiza la solicitud al servidor
    const response = await axios.get(`${API_URL}/product/${decodedId}`);

    // Verifica si la respuesta es válida
    if (response.status === 200) {
      return response.data;
    } else {
      console.error(`Error: Status code ${response.status}`);
      return null;
    }

  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Error de Axios
      console.error("Axios error:", error.message);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      } else {
        console.error("No response received.");
      }
    } else {
      // Otro tipo de error
      console.error("Non-Axios error:", error);
    }
    return null;
  }
};
