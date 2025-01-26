"use client";
import React, { useState } from "react";
import Image from "next/image";

const Reservas = () => {
  const deportes = [
    {
      id: 1,
      nombre: "Tenis",
      horario: "07:20 - 09:20",
      imagen:
        "https://res.cloudinary.com/dqiehommi/image/upload/v1737837714/pexels-lluis-aragones-968548-4536850_zupmsu.jpg",
    },
    {
      id: 2,
      nombre: "Fútbol",
      horario: "07:20 - 09:20",
      imagen:
        "https://res.cloudinary.com/dqiehommi/image/upload/v1737837720/pexels-cottonbro-10349969_idwenu.jpg",
    },
    {
      id: 3,
      nombre: "Tenis",
      horario: "07:20 - 09:20",
      imagen:
        "https://res.cloudinary.com/dqiehommi/image/upload/v1737837714/pexels-lluis-aragones-968548-4536850_zupmsu.jpg",
    },
    {
      id: 4,
      nombre: "Pádel",
      horario: "07:20 - 09:20",
      imagen:
        "https://res.cloudinary.com/dqiehommi/image/upload/v1737837713/pexels-roger-aribau-gisbert-19420784-8485104_mldemx.jpg",
    },
    {
      id: 5,
      nombre: "Fútbol",
      horario: "07:20 - 09:20",
      imagen:
        "https://res.cloudinary.com/dqiehommi/image/upload/v1737837720/pexels-cottonbro-10349969_idwenu.jpg",
    },
    {
      id: 6,
      nombre: "Pádel",
      horario: "07:20 - 09:20",
      imagen:
        "https://res.cloudinary.com/dqiehommi/image/upload/v1737837713/pexels-roger-aribau-gisbert-19420784-8485104_mldemx.jpg",
    },
    {
      id: 7,
      nombre: "Fútbol",
      horario: "07:20 - 09:20",
      imagen:
        "https://res.cloudinary.com/dqiehommi/image/upload/v1737837720/pexels-cottonbro-10349969_idwenu.jpg",
    },
    {
      id: 8,
      nombre: "Fútbol",
      horario: "07:20 - 09:20",
      imagen:
        "https://res.cloudinary.com/dqiehommi/image/upload/v1737837720/pexels-cottonbro-10349969_idwenu.jpg",
    },
  ];

  const [selectedSport, setSelectedSport] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (sport) => {
    setSelectedSport(sport);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedSport(null);
    setSelectedDate("");
    setSelectedTime("");
    setIsModalOpen(false);
  };

  const confirmReservation = () => {
    if (selectedDate && selectedTime) {
      alert(`Reserva confirmada para ${selectedSport.nombre}`);
      closeModal();
    } else {
      alert("Por favor, selecciona un día y un horario.");
    }
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <header className="text-center py-8">
        <h1 className="text-4xl font-bold">Reserva:</h1>
        <p className="text-gray-400 mt-2">
          Selecciona un deporte para realizar tu reserva.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4 md:px-16">
        {deportes.map((deporte) => (
          <div
            key={deporte.id}
            className="relative bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow aspect-[3/4]"
          >
            <div className="relative w-full h-full">
              <Image
                src={deporte.imagen}
                alt={deporte.nombre}
                fill
                className="object-cover"
              />
              <div className="absolute bottom-0 w-full bg-gradient-to-t from-black to-transparent h-1/3"></div>
            </div>
            <div className="absolute bottom-0 w-full bg-white bg-opacity-60 p-4 rounded-b-2xl">
              <h2 className="text-lg font-bold truncate text-black text-center">
                {deporte.nombre}
              </h2>
              <p className="text-sm text-gray-600 text-center">
                {deporte.horario}
              </p>
              <button
                onClick={() => openModal(deporte)}
                className="mt-4 w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
              >
                RESERVAR
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-black rounded-lg p-6 w-96 shadow-xl">
            <h2 className="text-lg font-bold text-center mb-4">
              Selecciona un día y horario
            </h2>
            <p className="text-center text-white-700 mb-6">
              Reserva para:{" "}
              <span className="font-bold">{selectedSport.nombre}</span>
            </p>
            <div className="mb-4">
              <label
                className="block text-sm font-medium text-white-600 mb-2"
                htmlFor="date"
              >
                Día:
              </label>
              <input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary p-2 text-black"
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-sm font-medium text-white-600 mb-2"
                htmlFor="time"
              >
                Horario:
              </label>
              <select
                id="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary p-2 text-black"
              >
                <option value="">Selecciona un horario</option>
                <option value="07:20 - 09:20">07:20 - 09:20</option>
                <option value="09:30 - 11:30">09:30 - 11:30</option>
                <option value="12:00 - 14:00">12:00 - 14:00</option>
              </select>
            </div>
            <div className="flex justify-between mt-6">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 text-white rounded-md hover:bg-red-600 transition"
              >
                Cancelar
              </button>
              <button
                onClick={confirmReservation}
                className="px-4 py-2 bg-green-400 text-white rounded-md hover:bg-green-600 transition"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reservas;
