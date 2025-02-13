import { Instalacion } from "@/interface/IIntalacion";
import axios from "axios";
import Swal from "sweetalert2";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default async function getInstalaciones(): Promise<Instalacion[]> {
  try {
    const response = await axios.get<Instalacion[]>(`${API_URL}/space/`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener las instalaciones:", error);
    Swal.fire({
      icon: "error",
      title: "Error al obtener las instalaciones",
      text: "Por favor, intenta de nuevo más tarde.",
    });
    return [];
  }
}
