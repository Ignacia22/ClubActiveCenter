import { IRegisterData } from "@/interface/IRegisterData";
import axios from "axios";

const BASE_URL = "https://active-center-db.onrender.com";

export const AuthService = {
  async register(data: IRegisterData): Promise<void> {
    try {
      const response = await axios.post(`${BASE_URL}/auth/SignUp`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error al registrar usuario:",
          error.response?.data?.message || error.message
        );

        if (error.response) {
          const errorMessage =
            error.response.data?.message || "Error desconocido";
          if (errorMessage.includes("duplicate key")) {
            if (errorMessage.includes("email")) {
              alert("El correo electrónico ya está registrado.");
            } else if (errorMessage.includes("dni")) {
              alert("El DNI ya está registrado.");
            } else {
              alert("El correo electrónico o el DNI ya están registrados.");
            }
          } else {
            alert(`Error al registrar el usuario: ${errorMessage}`);
          }
        } else {
          alert("Hubo un error al registrar el usuario. Intenta nuevamente.");
        }
      } else {
        console.error("Error inesperado:", error);
        alert("Ocurrió un error inesperado. Intenta nuevamente.");
      }
    }
  },
};
