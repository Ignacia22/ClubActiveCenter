import React from "react";
import Image from "next/image"; // Utiliza next/image para optimización

const Reservas = () => {
  const deportes = [
    {
      id: 1,
      nombre: "Baloncesto",
      horario: "07:20 - 09:20",
      imagen: "/assets/Images/pexels-thalittlemarc-28776236.jpg",
    },
    {
      id: 2,
      nombre: "Vóley",
      horario: "07:20 - 09:20",
      imagen: "/assets/Images/pexels-cottonbro-10350345.jpg",
    },
    {
      id: 3,
      nombre: "Tenis",
      horario: "07:20 - 09:20",
      imagen: "/assets/Images/pexels-lluis-aragones-968548-4536850.jpg",
    },
    {
      id: 4,
      nombre: "Baloncesto",
      horario: "07:20 - 09:20",
      imagen: "/assets/Images/pexels-thalittlemarc-28776236.jpg",
    },
    {
      id: 5,
      nombre: "Fútbol",
      horario: "07:20 - 09:20",
      imagen: "/assets/Images/pexels-cottonbro-10349969.jpg",
    },
    {
      id: 6,
      nombre: "Pádel",
      horario: "07:20 - 09:20",
      imagen: "/assets/Images/pexels-thalittlemarc-28776236.jpg",
    },
    {
      id: 7,
      nombre: "Fútbol",
      horario: "07:20 - 09:20",
      imagen: "/assets/Images/pexels-cottonbro-10349969.jpg",
    },
    {
      id: 8,
      nombre: "Natación",
      horario: "07:20 - 09:20",
      imagen: "/assets/Images/pexels-david-hou-1637526441-30191397.jpg",
    },
  ];

  return (
    <div className="bg-black text-white min-h-screen">
      <header className="text-center py-8">
        <h1 className="text-4xl font-bold">Reserva:</h1>
        <p className="text-gray-400 mt-2">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
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
              <div className="mb-6 absolute bottom-0 w-full bg-gradient-to-t from-black to-transparent h-1/3"></div>
            </div>
            <div className="mb-6 absolute bottom-0 w-full bg-white bg-opacity-60 p-4 rounded-b-2xl">
              <h2 className="text-lg font-bold truncate text-black text-center">
                {deporte.nombre}
              </h2>
              <p className="text-sm text-gray-600 text-center"></p>
              <button className="mt-4 w-full bg-black text-white py-2 rounded-md hover:bg-secondary-color transition">
                RESERVAR
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reservas;
