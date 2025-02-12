export const comprarMembresia = async (
  membershipId: string
): Promise<string> => {
  try {
    // Obtener el token del usuario desde el localStorage
    const userData = localStorage.getItem("user");
    const parsedUserData = userData ? JSON.parse(userData) : null;

    // Verificar si el token está presente
    const userToken = parsedUserData?.token;

    if (!userToken) {
      throw new Error("Usuario no autenticado. Debes iniciar sesión.");
    }

    const response = await fetch(
      `https://active-center-db-3rfj.onrender.com/subscription/subscribe/${membershipId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`, // Incluir el token de autenticación
        },
      }
    );

    // Mostrar la respuesta en consola para verificar
    console.log("📢 Estado de la respuesta:", response.status); // Muestra el código de estado
    const data = await response.json();

    console.log("📢 Respuesta del backend:", data); // Muestra la respuesta completa

    if (!response.ok) {
      throw new Error("Error al procesar la suscripción.");
    }

    // Suponiendo que el backend responde con la URL de Stripe
    if (data?.url) {
      return data.url;
    } else {
      throw new Error("No se recibió una URL válida.");
    }
  } catch (error) {
    console.error("Error en el servicio de suscripción:", error);
    throw error;
  }
};
