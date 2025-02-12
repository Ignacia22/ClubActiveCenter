const BASE_URL = "https://active-center-db-3rfj.onrender.com";

interface FormularioAuth0 {
  name: string;
  email: string;
  phone: string;
  address: string;
  dni: number;
  password: string;
  passwordConfirmation: string;
}

export const AuthServices = {
  async register(data: FormularioAuth0) {
    try {
      const response = await fetch(`${BASE_URL}/auth/SignUp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!result || !result.token) {
        throw new Error("Respuesta de inicio de sesión inválida: falta token");
      }
      const userD = result;
      const isAdmin = userD.userInfo?.isAdmin ?? false;
      const userToStore = {
        ...userD,
        isAdmin: isAdmin,
      };
      localStorage.setItem("user", JSON.stringify(userToStore));
      localStorage.setItem("token", userD.token);
      localStorage.setItem("isAdmin", isAdmin.toString());
      if (response.ok && result) {
        return result.userInfo; 
      } else {
        throw new Error(result.message || "Error en el registro.");
      }
    } catch (error) {
      throw error;
    }
  },
};
