import { ILogin } from "@/interface/ILogin";
import axios from "axios";

const BASE_URL = "https://active-center-db.onrender.com";

export const AuthService = {
  async login(data: ILogin): Promise<void> {
    try {
      const response = await axios.post(`${BASE_URL}/auth/SignIn`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error al iniciar sesión:",
          error.response?.data?.message || error.message
        );

        if (error.response) {
          const errorMessage =
            error.response.data?.message || "Error desconocido";
          alert(`Error al iniciar sesión: ${errorMessage}`);
        } else {
          alert("Hubo un error al iniciar sesión. Intenta nuevamente.");
        }
      } else {
        console.error("Error inesperado:", error);
        alert("Ocurrió un error inesperado. Intenta nuevamente.");
      }
    }
  },
};
