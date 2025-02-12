"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { getSubscription } from "@/service/membresiasServices";
import { comprarMembresia } from "@/service/compraMembresia"; // Importar el servicio

interface Membership {
  id: string;
  name: string;
  description: string;
  price: string;
  benefits: string[];
  duration: number; // Duración en días
  percentage: number; // Descuento en la tienda
}

const MembershipPlans = () => {
  const [membership, setMembership] = useState<Membership | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMembership = async () => {
      setLoading(true);
      const data = await getSubscription();
      console.log("📢 Datos recibidos del backend:", data);

      if (Array.isArray(data) && data.length > 0) {
        setMembership(data[0]); // Usamos el primer elemento del array
      } else {
        setMembership(null);
      }

      setLoading(false);
    };

    fetchMembership();
  }, []);

  // Función para manejar la compra
  const handleBuy = async () => {
    if (membership) {
      try {
        const stripeUrl = await comprarMembresia(membership.id);
        // Redirigir al usuario a la URL de Stripe
        window.location.href = stripeUrl;
      } catch (error) {
        console.error("Error al procesar la compra:", error);
      }
    }
  };

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
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            {loading ? (
              <p className="text-center text-lg text-gray-600">Cargando...</p>
            ) : membership ? (
              <>
                <h2 className="text-2xl font-bold text-center mb-2 text-black">
                  {membership.name}
                </h2>
                <p className="text-gray-600 text-center mb-4">
                  {membership.description}
                </p>

                {/* Precio y Duración */}
                <div className="text-center mb-6">
                  <p className="text-4xl font-extrabold text-gray-900">
                    ${membership.price}
                  </p>
                  <p className="text-sm font-medium text-gray-500">PRECIO</p>
                  <p className="text-lg font-medium text-gray-700 mt-2">
                    ⏳ Duración: {membership.duration} días
                  </p>
                </div>

                {/* Beneficios */}
                <ul className="text-black text-base space-y-3 mb-6">
                  {membership.benefits.length > 0 ? (
                    membership.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center">
                        ✅ <span className="ml-2">{benefit}</span>
                      </li>
                    ))
                  ) : (
                    <li>❌ No hay beneficios disponibles.</li>
                  )}
                </ul>

                {/* Descuento en tienda */}
                <div className="text-center mb-6">
                  <p className="text-xl font-semibold text-gray-900">
                    🛍️ {membership.percentage}% de descuento en tienda
                  </p>
                </div>

                {/* Botón de compra */}
                <button
                  className="w-full bg-black text-white font-bold py-3 px-6 rounded text-lg hover:opacity-90 transition"
                  onClick={handleBuy} // Llamar a handleBuy cuando se haga clic
                >
                  COMPRAR
                </button>
              </>
            ) : (
              <p className="text-center text-lg text-gray-600">
                ❌ No hay membresías disponibles.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipPlans;
