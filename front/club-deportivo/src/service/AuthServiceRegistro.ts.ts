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
  async register(data: RegisterData) {
    try {
      const response = await fetch(`${BASE_URL}/auth/SignUp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      console.log("📌 Respuesta del servidor:", result);

      if (response.ok && result) {
        return result; // ⚠️ AQUÍ devolvemos el objeto result, que tiene el ID y demás datos.
      } else {
        throw new Error(result.message || "Error en el registro.");
      }
    } catch (error) {
      console.error("❌ Error en la API:", error);
      throw error;
    }
  },
};
