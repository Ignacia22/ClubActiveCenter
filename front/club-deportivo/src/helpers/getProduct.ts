import { IProducts, ProductState } from "@/interface/IProducts";
import axios from "axios";
import { validate as uuidValidate } from 'uuid';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const getProduct = async (id: string): Promise<IProducts | null> => {
  try {
    // Decodifica el ID y elimina el ":" inicial si existe
    const decodedId = decodeURIComponent(id).replace(/^:/, '');

    // Verifica si el ID es un UUID válido
    if (!uuidValidate(decodedId)) {
      console.error('ID inválido, no es un UUID:', decodedId);
      return null;
    }

    console.log(`Solicitando producto con UUID: ${decodedId}`);
    console.log(`URL completa: ${API_URL}/product/${decodedId}`);

    // Realiza la solicitud al servidor
    const response = await axios.get(`${API_URL}/product/${decodedId}`);
    const productData = response.data;

    // Mapea los datos del backend a la interfaz IProducts
    const product: IProducts = {
      id: productData.id,
      name: productData.name,
      description: productData.description,
      price: productData.price,
      stock: productData.stock,
      image: productData.img || '', // Asume que 'img' es el campo para la imagen
      State: productData.productStatus === 'available' ? ProductState.Disponible : ProductState.SinStock
    };

    console.log("Producto mapeado:", product);
    return product;

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error de Axios:", error.message);
      console.error("Datos de respuesta:", error.response?.data);
      console.error("Estado de respuesta:", error.response?.status);
      console.error("Headers de respuesta:", error.response?.headers);
    } else {
      console.error("Error no Axios:", error);
    }
    return null;
  }
};