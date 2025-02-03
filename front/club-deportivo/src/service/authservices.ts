import axios from "axios";

const API_URL = "http://localhost:3001/auth/SignIn"; // Cambia esta URL si es necesario

export const AuthService = {
  async login(credentials: { email: string; password: string }) {
    try {
      const response = await axios.post(API_URL, credentials, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data && response.data.token && response.data.userInfo) {
        return {
          token: response.data.token,
          userInfo: response.data.userInfo,
        };
      } else {
        throw new Error("No se recibieron los datos correctos.");
      }
    } catch (error) {
      console.error("Error en la llamada de login:", error);
      throw error;
    }
  },
};
