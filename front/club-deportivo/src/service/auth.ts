import { IRegisterData } from "@/interface/IRegisterData";
import axios from "axios";
import Swal from "sweetalert2";

const BASE_URL = "https://active-center-db.onrender.com";

export const AuthService = {
  async register(data: IRegisterData): Promise<void> {
    try {
      const response = await axios.post(`${BASE_URL}/auth/SignUp`, data, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("✅ Respuesta completa:", response);
      console.log("📌 Data recibida:", response.data); // Ver qué está devolviendo la API

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Registro exitoso",
          text: "¡Bienvenido a nuestra comunidad!",
        });
      } else {
        Swal.fire({
          icon: "warning",
          title: "Atención",
          text: "Registro procesado, pero con respuesta inesperada.",
        });
      }
    } catch (error) {
      console.error("❌ Error en la API:", error);
      Swal.fire({
        icon: "error",
        title: "Error al registrar",
        text: "Hubo un problema con el servidor. Inténtalo más tarde.",
      });
    }
  },
};
