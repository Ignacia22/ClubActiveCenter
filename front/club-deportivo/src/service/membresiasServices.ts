const BASE_URL = "https://active-center-db-3rfj.onrender.com";

export const getSubscription = async () => {
  try {
    const response = await fetch(`${BASE_URL}/subscription`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener la suscripción");
    }

    const data = await response.json();
    console.log("🔍 Datos recibidos del backend en getSubscription:", data);
    return data;
  } catch (error) {
    console.error("Error en getSubscription:", error);
    return null;
  }
};
