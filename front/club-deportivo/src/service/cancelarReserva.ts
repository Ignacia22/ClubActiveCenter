export const cancelarReserva = async (reservationId: string) => {
  // Lógica para cancelar la reserva, por ejemplo:
  const response = await fetch(
    `https://active-center-db-3rfj.onrender.com/reservas/${reservationId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error("Error al cancelar la reserva");
  }

  return response.json();
};
