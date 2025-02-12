"use client";
import { useState, useEffect } from "react";
import { fetchSpaces } from "@/service/reservasServices";
import { createReservaService } from "@/service/createReservasService";
import stripePromise from "@/utils/stripe";
import Image from "next/image";

interface Space {
  id: string;
  title: string;
  description: string;
  price: number;
  price_hour: string;
  img: string[];
}

const Reservas = () => {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [startTime, setStartTime] = useState("07:00");
  const [endTime, setEndTime] = useState("09:00");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReserving, setIsReserving] = useState(false);
  const [reservationError, setReservationError] = useState<string | null>(null);

  useEffect(() => {
    const loadSpaces = async () => {
      try {
        const fetchedSpaces = await fetchSpaces();
        setSpaces(fetchedSpaces);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Ocurrió un error desconocido");
        }
      } finally {
        setLoading(false);
      }
    };
    loadSpaces();
  }, []);

  const openModal = (space: Space) => {
    setSelectedSpace(space);
    setIsModalOpen(true);
    setSelectedDate("");
    setStartTime("07:00");
    setEndTime("09:00");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSpace(null);
    setReservationError(null);
  };

  const handleReservation = async () => {
    if (!selectedSpace || !selectedDate || !startTime || !endTime) {
      setReservationError("Por favor, completa todos los campos.");
      return;
    }

    const reservationData = {
      spaceName: selectedSpace.title,
      price: selectedSpace.price,
      startTime,
      endTime,
      date: selectedDate,
      status: "pending",
    };

    setIsReserving(true);
    setReservationError(null);

    try {
      const reservaResponse = await createReservaService(reservationData);

      if (!reservaResponse || !reservaResponse.paymentLink) {
        throw new Error(
          "No se pudo procesar la reserva. Por favor, inténtalo de nuevo."
        );
      }

      const paymentLink = reservaResponse.paymentLink;
      console.log("🔗 Redirigiendo a la URL de pago:", paymentLink); // 👈 Agregado para ver la ruta del pago

      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Error al inicializar Stripe.");
      }

      window.location.href = paymentLink;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setReservationError(err.message);
      } else {
        setReservationError("Ocurrió un error desconocido");
      }
    } finally {
      setIsReserving(false);
    }
  };

  if (loading) return <div className="text-white">Cargando espacios...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="bg-black min-h-screen p-6">
      <h1 className="text-3xl text-white font-bold mb-6">
        Espacios Deportivos
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {spaces.map((space) => (
          <div key={space.id} className="bg-gray-100 rounded-xl shadow-lg">
            <Image
              src={
                space.img[0] && isValidUrl(space.img[0])
                  ? space.img[0]
                  : "/assets/default-image.png"
              }
              alt={space.title}
              width={400}
              height={160}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h2 className="text-lg font-bold text-black">{space.title}</h2>
              <p className="text-gray-600 text-sm">{space.description}</p>
              <p className="text-black font-semibold mt-2">
                Precio: ${space.price_hour}
              </p>
              <button
                onClick={() => openModal(space)}
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
              >
                Reservar
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && selectedSpace && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-y-auto">
          <div className="bg-white p-6 rounded-lg w-1/2 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold">{selectedSpace.title}</h2>
            <Image
              src={
                selectedSpace.img[0] && isValidUrl(selectedSpace.img[0])
                  ? selectedSpace.img[0]
                  : "/assets/default-image.png"
              }
              alt={selectedSpace.title}
              width={400}
              height={192}
              className="w-full h-48 object-cover rounded-md my-4"
            />
            <p>{selectedSpace.description}</p>
            {reservationError && (
              <p className="text-red-500 mt-2">{reservationError}</p>
            )}
            <div className="mt-4">
              <label className="block text-gray-700">Seleccionar fecha:</label>
              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setSelectedDate(e.target.value)}
                value={selectedDate}
                className="w-full px-4 py-2 mt-2 border rounded-md"
              />
              <label className="block text-gray-700 mt-4">
                Hora de inicio:
              </label>
              <input
                type="time"
                min="07:00"
                max="22:00"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-4 py-2 mt-2 border rounded-md"
              />
              <label className="block text-gray-700 mt-4">
                Hora de finalización:
              </label>
              <input
                type="time"
                min="07:00"
                max="22:00"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-4 py-2 mt-2 border rounded-md"
              />
            </div>
            <div className="mt-6 flex justify-between">
              <button
                onClick={closeModal}
                className="bg-gray-400 text-black py-2 px-4 rounded-md"
              >
                Cerrar
              </button>
              <button
                onClick={handleReservation}
                className={`py-2 px-4 rounded-md text-white ${
                  isReserving
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
                disabled={isReserving}
              >
                {isReserving ? "Procesando..." : "Confirmar Reserva y Pagar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export default Reservas;
