const BASE_URL = "https://active-center-db-3rfj.onrender.com";

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
      if (response.ok && result) {
        return result.userInfo;  
      } else {
        throw new Error(result.message || "Error en el registro.");
      }
    } catch (error) {
      throw error;
    };
  },
};
