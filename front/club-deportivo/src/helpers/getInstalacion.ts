
import { Instalacion } from "@/interface/IIntalacion";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default async function getInstalaciones(): Promise<Instalacion[]> {
  try {
    const response = await axios.get<Instalacion[]>(`${API_URL}/space/`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener las instalaciones:", error);
    return [];
  }
}