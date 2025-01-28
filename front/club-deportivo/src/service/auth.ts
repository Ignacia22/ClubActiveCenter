const BASE_URL = "https://active-center-db.onrender.com";

export const AuthService = {
  async register(data: {
    name: string;
    email: string;
    phone: string;
    address: string;
    dni: number;
    password: string;
  }): Promise<void> {
    try {
      const response = await fetch(`${BASE_URL}/auth/SignUp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        let errorDetails;
        try {
          errorDetails = await response.json();
        } catch {
          errorDetails = {
            message: "Error desconocido",
            status: response.status,
          };
        }

        console.error("Error al registrar usuario:", errorDetails.message);

        if (errorDetails.message.includes("duplicate key")) {
          alert("El correo electrónico o el DNI ya están registrados.");
        } else {
          alert(`Error al registrar el usuario: ${errorDetails.message}`);
        }

        return;
      }

      await response.json();
    } catch (error) {
      console.error("Error de red o en el backend:", error);
      alert("Hubo un error al registrar el usuario. Intenta nuevamente.");
    }
  },
};
