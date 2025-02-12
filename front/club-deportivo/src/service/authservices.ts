import axios from "axios";

const BASE_URL = "https://active-center-db-3rfj.onrender.com";

export const AuthService = {
  async login(credentials: { email: string; password: string }) {
    try {
      const response = await axios.post(
        `${BASE_URL}/auth/SignIn`,
        credentials,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.data?.token && response.data?.userInfo) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.userInfo));
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
