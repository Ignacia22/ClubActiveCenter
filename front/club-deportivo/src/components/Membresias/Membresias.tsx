import Image from "next/image";
import React from "react";

const MembershipPlans = () => {
  return (
    <div className="bg-black text-white min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 mb-12">
          <div>
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Membresía Exclusiva
            </h1>
            <p className="text-white text-lg">
              Únete a nuestra membresía y accede a beneficios exclusivos: áreas
              VIP, descuentos en nuestra tienda y participación en actividades
              especiales. ¡Mejora tu experiencia deportiva!
            </p>
          </div>
          <div className="flex justify-center">
            <Image
              src="https://res.cloudinary.com/dqiehommi/image/upload/v1737837996/pexels-rick-hadley-1481866149-28380067_t30y5a.jpg"
              alt="Entrenador fitness"
              width={400}
              height={400}
              className="rounded-lg shadow-xl"
            />
          </div>
        </div>

        {/* Membership Card */}
        <div className="flex justify-center">
          <div className="bg-white text-black rounded-lg shadow-lg p-8 flex flex-col w-full max-w-xl transform transition-transform duration-300 hover:scale-105 hover:opacity-90">
            <h2 className="text-2xl font-bold text-center mb-6">
              Membresía Exclusiva
            </h2>
            <div className="text-center mb-8">
              <p className="text-4xl font-extrabold">$200</p>
              <p className="text-sm font-medium">ANUAL</p>
              <p className="text-2xl font-bold">$60</p>
              <p className="text-sm font-medium">TRIMESTRAL</p>
              <p className="text-2xl font-bold">$25</p>
              <p className="text-sm font-medium">MENSUAL</p>
            </div>
            <ul className="text-black text-base space-y-3 mb-8">
              <li>✓ Acceso a áreas VIP .</li>
              <li>✓ Descuentos exclusivos en la tienda.</li>
              <li>✓ Inscripción a actividades del centro.</li>
              <li>✓ Participación en eventos deportivos exclusivos.</li>
              <li>✓ Acceso ilimitado al gimnasio y la piscina.</li>
            </ul>
            <div className="mt-auto">
              <button className="bg-black text-white font-bold py-3 px-6 rounded w-full text-lg">
                COMPRAR
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipPlans;
