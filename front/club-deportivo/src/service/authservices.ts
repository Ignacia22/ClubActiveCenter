import axios from "axios";

const BASE_URL = "https://active-center-db-3rfj.onrender.com";

export const AuthService = {
  async login(credentials: { email: string; password: string }) {
    try {
      // Realizamos la solicitud POST al backend con las credenciales
      const response = await axios.post(
        `${BASE_URL}/auth/SignIn`,
        credentials,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      // Verificamos si la respuesta contiene el token y la información del usuario
      if (response.data?.token && response.data?.userInfo) {
        // Guardamos el token y la información del usuario en localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.userInfo));

        // Retornamos el token y la información del usuario
        return {
          token: response.data.token,
          userInfo: response.data.userInfo,
        };
      } else {
        throw new Error("No se recibieron los datos correctos.");
      }
    } catch (error) {
      console.error("Error en la llamada de login:", error);
      throw error; // Lanza el error para que lo maneje el componente
    }
  },
};
