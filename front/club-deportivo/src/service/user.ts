import axios from "axios";
import { IUser } from "../interface/IUser";
import Swal from "sweetalert2";

const BACK_URL = "https://active-center-db-3rfj.onrender.com";

// ✅ FUNCIÓN ORIGINAL: Obtener datos del usuario por ID
export const getUserById = async (userId: string): Promise<IUser | null> => {
  const token = localStorage.getItem("token");

  if (!token) {
    Swal.fire(
      "⚠️ Error",
      "No se encontró un token. Es posible que no estés autenticado.",
      "warning"
    );
    return null;
  }

  if (!userId) {
    Swal.fire("⚠️ Error", "El ID del usuario es inválido o nulo.", "warning");
    return null;
  }

  try {
    console.log(`🔍 Fetching user with ID: ${userId}`);
    const headers = { Authorization: `Bearer ${token}` };
    const response = await axios.get<IUser>(`${BACK_URL}/user/${userId}`, {
      headers,
    });

    console.log("✅ User data fetched:", response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      Swal.fire(
        "❌ Error",
        `No se pudo obtener los datos del usuario. Código: ${error.response.status}`,
        "error"
      );
      console.error(
        "❌ Error fetching user data:",
        error.response.status,
        error.response.data
      );
    } else {
      Swal.fire(
        "❌ Error inesperado",
        "Ocurrió un error inesperado al obtener los datos del usuario.",
        "error"
      );
      console.error("❌ Unexpected error:", error);
    }
    return null;
  }
};

export const getUserReservations = async (userId: string) => {
  const token = localStorage.getItem("token");

  if (!token) {
    Swal.fire(
      "⚠️ Error",
      "No se encontró un token. Es posible que no estés autenticado.",
      "warning"
    );
    return [];
  }

  if (!userId) {
    Swal.fire("⚠️ Error", "El ID del usuario es inválido o nulo.", "warning");
    return [];
  }

  try {
    console.log(`🔍 Fetching reservations for user ID: ${userId}`);
    const headers = { Authorization: `Bearer ${token}` };
    const response = await axios.get(`${BACK_URL}/reservation/${userId}`, {
      headers,
    });

    if (response.data.length === 0) {
      Swal.fire("📅 Sin Reservas", "No tienes reservas aún.", "info");
    } else {
      console.log("✅ Reservations fetched:", response.data);
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 404) {
        // Mostrar mensaje informativo cuando no hay reservas
      } else {
        // Mostrar el mensaje de error si el status es diferente
        Swal.fire(
          "❌ Error",
          `No se pudieron obtener las reservas. Código: ${error.response.status}`,
          "error"
        );
        console.error(
          "❌ Error fetching reservations:",
          error.response.status,
          error.response.data
        );
      }
    } else {
      Swal.fire(
        "❌ Error inesperado",
        "Ocurrió un error inesperado al obtener las reservas.",
        "error"
      );
      console.error("❌ Unexpected error:", error);
    }
    return [];
  }
};
