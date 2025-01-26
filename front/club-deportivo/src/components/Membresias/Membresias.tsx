import Image from "next/image";

import React from "react";


const MembershipPlans = () => {
  return (
    <div className="bg-black text-white min-h-screen py-12 px-6">
      {/* Contenedor principal */}
      <div className="max-w-7xl mx-auto">
        {/* Título e Imagen */}
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 mb-12">
          {/* Texto */}
          <div>
            <h1 className="text-6xl font-bold mb-6 leading-tight">
              Planes y Membresías
            </h1>
            <p className="text-gray-400 text-lg">
              Maecenas eget condimentum velit, sit amet feugiat lectus. Vivamus
              luctus eros aliquet convallis ultricies. Mauris augue massa.
            </p>
          </div>
          {/* Imagen */}
          <div className="flex justify-center">
            <Image
              src="/assets/Images/pexels-rick-hadley-1481866149-28380067.jpg"
              alt="Entrenador fitness"
              width={450}
              height={450}
              className="rounded-lg shadow-xl"
            />
          </div>
        </div>

        {/* Tarjetas de Membresías */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Tarjeta Básico */}
          <div className="bg-white text-black rounded-lg shadow-lg p-6 flex flex-col w-80 mx-auto transform transition-transform duration-300 hover:scale-105 hover:opacity-90">
            <h2 className="text-xl font-bold text-center mb-4">BÁSICO</h2>
            <div className="text-center mb-6">
              <p className="text-4xl font-extrabold">$100</p>
              <p className="text-sm font-medium">ANUAL</p>
              <p className="text-2xl font-bold">$20</p>
              <p className="text-sm font-medium">MENSUAL</p>
              <p className="text-2xl font-bold">$60</p>
              <p className="text-sm font-medium">TRIMESTRAL</p>
            </div>
            <ul className="text-gray-700 text-sm space-y-2 mb-6">
              <li>✓ Acceso al gimnasio (limitado a ciertas horas).</li>
              <li>✓ Participación en clases grupales seleccionadas.</li>
              <li>✓ Uso de vestuarios y duchas.</li>
              <li>✗ Sin acceso a piscina ni áreas especiales.</li>
              <li>✗ No incluye sesiones con entrenador personal.</li>
            </ul>
            <div className="mt-auto">
              <button className="bg-black text-white font-bold py-2 px-4 rounded w-full text-lg">
                CONTRATAR
              </button>
            </div>
          </div>

          {/* Tarjeta Estandar */}
          <div className="bg-white text-black rounded-lg shadow-lg p-6 flex flex-col w-80 mx-auto transform transition-transform duration-300 hover:scale-105 hover:opacity-90">
            <h2 className="text-xl font-bold text-center mb-4">ESTANDAR</h2>
            <div className="text-center mb-6">
              <p className="text-4xl font-extrabold">$100</p>
              <p className="text-sm font-medium">ANUAL</p>
              <p className="text-2xl font-bold">$20</p>
              <p className="text-sm font-medium">MENSUAL</p>
              <p className="text-2xl font-bold">$60</p>
              <p className="text-sm font-medium">TRIMESTRAL</p>
            </div>
            <ul className="text-gray-700 text-sm space-y-2 mb-6">
              <li>✓ Acceso al gimnasio sin límite de horarios.</li>
              <li>✓ Acceso a la piscina durante horas normales.</li>
              <li>✓ Participación en todas las clases grupales.</li>
              <li>✓ 1 sesión mensual con entrenador personal.</li>
              <li>✗ Sin acceso a áreas VIP ni beneficios exclusivos.</li>
            </ul>
            <div className="mt-auto">
              <button className="bg-black text-white font-bold py-2 px-4 rounded w-full text-lg">
                CONTRATAR
              </button>
            </div>
          </div>

          {/* Tarjeta Premium */}
          <div className="bg-white text-black rounded-lg shadow-lg p-6 flex flex-col w-80 mx-auto transform transition-transform duration-300 hover:scale-105 hover:opacity-90">
            <h2 className="text-xl font-bold text-center mb-4">PREMIUM</h2>
            <div className="text-center mb-6">
              <p className="text-4xl font-extrabold">$100</p>
              <p className="text-sm font-medium">ANUAL</p>
              <p className="text-2xl font-bold">$20</p>
              <p className="text-sm font-medium">MENSUAL</p>
              <p className="text-2xl font-bold">$60</p>
              <p className="text-sm font-medium">TRIMESTRAL</p>
            </div>
            <ul className="text-gray-700 text-sm space-y-2 mb-6">
              <li>✓ Acceso ilimitado al gimnasio y la piscina.</li>
              <li>✓ Acceso prioritario a todas las clases grupales.</li>
              <li>✓ Acceso a áreas VIP (sauna, spa, zona de relajación).</li>
              <li>✓ 5 sesiones mensuales con entrenador personal.</li>
              <li>
                ✓ Participación gratuita en eventos deportivos exclusivos.
              </li>
              <li>✓ Acceso a reserva prioritaria de canchas deportivas.</li>
            </ul>
            <div className="mt-auto">
              <button className="bg-black text-white font-bold py-2 px-4 rounded w-full text-lg">
                CONTRATAR
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipPlans;
