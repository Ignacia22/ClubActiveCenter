import { Reservation } from "@/interface/reservation";
import Swal from "sweetalert2";

export const createReservaService = async (reserva: Reservation) => {
  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("user"); // Obtener el objeto user almacenado

  if (!token) {
    Swal.fire("⚠️ Error", "Token no disponible o no válido.", "warning");
    return;
  }
  if (!userData) {
    Swal.fire(
      "⚠️ Error",
      "Datos del usuario no encontrados en localStorage.",
      "warning"
    );
    return;
  }

  // Parseamos el objeto `user` para extraer `userId`
  let userId: string;
  try {
    const parsedUser = JSON.parse(userData);
    userId = parsedUser.userInfo.id; // Extraemos `id`
  } catch (error) {
    Swal.fire("❌ Error", "No se pudo obtener el userId.", "error");
    console.error("Error al parsear los datos del usuario:", error);
    return;
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  // Eliminar `status` ya que no se usa
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { status, ...reservaWithoutStatus } = reserva;
  const reservaFinal = { ...reservaWithoutStatus, userId }; // Agregar userId

  console.log(
    "📤 Enviando datos al backend:",
    JSON.stringify(reservaFinal, null, 2)
  );

  try {
    const response = await fetch(
      "https://active-center-db-3rfj.onrender.com/reservation/create",
      {
        method: "POST",
        headers,
        body: JSON.stringify(reservaFinal),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Respuesta del servidor con error:", errorText);

      try {
        const errorData = JSON.parse(errorText);
        Swal.fire(
          "❌ Error",
          errorData.message || "Error desconocido",
          "error"
        );
      } catch (jsonError) {
        console.error(
          "❌ No se pudo parsear el JSON del error:",
          jsonError,
          errorText
        );
        Swal.fire("❌ Error", "Error en la solicitud al backend.", "error");
      }
      return;
    }

    const data = await response.json();
    console.log("✅ Respuesta del backend:", data);
    Swal.fire("✅ Éxito", "Reserva creada correctamente.", "success");
    return data;
  } catch (error: unknown) {
    console.error("❌ Error en el servicio de reserva:", error);
    Swal.fire(
      "❌ Error inesperado",
      "Error en la solicitud al backend.",
      "error"
    );
  }
};
