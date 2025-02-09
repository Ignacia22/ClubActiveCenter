import { Reservation } from "@/interface/reservation";

export const createReservaService = async (reserva: Reservation) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Token no disponible o no válido.");
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  // Desestructuración sin usar el `status`
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { status, ...reservaWithoutStatus } = reserva;

  console.log(
    "Datos enviados al backend:",
    JSON.stringify(reservaWithoutStatus, null, 2)
  );

  try {
    const response = await fetch("http://localhost:3001/reservation/create", {
      method: "POST",
      headers: headers,
      body: JSON.stringify(reservaWithoutStatus),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Respuesta del servidor con error:", errorText);

      try {
        const errorData = JSON.parse(errorText);
        throw new Error(
          errorData.message || errorData.error || "Error desconocido"
        );
      } catch (jsonError) {
        console.error(
          "No se pudo parsear el JSON del error:",
          jsonError,
          errorText
        );
        throw new Error("Error en la solicitud al backend.");
      }
    }

    const data = await response.json();
    console.log("Respuesta del backend:", data);
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error en el servicio de reserva:", error);
      throw new Error(
        error.message || "Error desconocido en el servicio de reserva."
      );
    } else {
      console.error("Error inesperado:", error);
      throw new Error("Error inesperado en el servicio de reserva.");
    }
  }
};
