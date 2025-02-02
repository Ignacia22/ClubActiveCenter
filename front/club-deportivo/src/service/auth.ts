import Swal from "sweetalert2";

const BASE_URL = "http://localhost:3001";

interface RegisterData {
  name: string;
  email: string;
  phone: string;
  address: string;
  dni: number;
  password: string;
  passwordConfirmation: string;
}

export const AuthService = {
  async register(data: RegisterData): Promise<void> {
    try {
      const response = await fetch(`${BASE_URL}/auth/SignUp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      console.log("✅ Respuesta completa:", result);

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Registro exitoso",
          text: "¡Bienvenido a nuestra comunidad!",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error en el registro",
          text: result.message || "Hubo un problema. Inténtalo más tarde.",
        });
      }
    } catch (error) {
      console.error("❌ Error en la API:", error);
      Swal.fire({
        icon: "error",
        title: "Error desconocido",
        text: "Hubo un error al conectar con el servidor.",
      });
    }
  },
};
