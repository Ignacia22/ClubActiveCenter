import { IProducts } from "@/interface/IProducts"
import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

export const getProducts = async (): Promise<IProducts[]> => {
  try {
    const response = await axios.get(`${API_URL}/product?page=&limit=10`);
    return response.data
  } catch (error) {
    console.error("Error fetching products:", error)
    return [] // Retorna un array vacío en caso de error
  }
}
