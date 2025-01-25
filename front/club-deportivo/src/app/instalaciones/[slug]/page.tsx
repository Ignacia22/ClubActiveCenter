import Carousel from "@/components/Carousel/Carousel";
import { instalacionesConfig } from "@/config/instalacionesConfig";

import { notFound } from "next/navigation";

export default async function InstalacionPage({ params }: { params: Promise<{slug: string}>}) {
  const { slug } = await params;
  const instalacion = instalacionesConfig.find((inst) => inst.id === slug);

  if (!instalacion) {
    notFound();
  }

  return (
    <div className="relative min-h-screen bg-black text-white py-20 px-6 md:px-4">
      {/* Carrusel de imágenes */}
      <div className="flex justify-center mt-16 md:w-2/3">
        <Carousel images={instalacion.carruselImagenes} />
      </div>

      {/* Título vertical */}
      <div className="absolute top-1/2 -translate-y-1/2 -right-8 md:right-6">
        <p className="text-6xl md:text-8xl px-6 m-[2rem] md:m-[4rem] mb-[3em] md:mb-[5em] font-bold rotate-90">
          {instalacion.titulo}
        </p>
      </div>

      {/* Detalles y características */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 mx-auto max-w-4xl text-black text-center">
        <div className="bg-white p-6 md:p-8 rounded-lg">
          <h3 className="font-bold text-base md:text-lg">Detalles</h3>
          <ul className="text-left mt-4 space-y-2">
            {instalacion.detalles.map((detalle, index) => (
              <li key={index} className="text-gray-700">{detalle}</li>
            ))}
          </ul>
        </div>
        <div className="bg-white p-6 md:p-8 rounded-lg">
          <h3 className="font-bold text-base md:text-lg">Características</h3>
          <ul className="text-left mt-4 space-y-2">
            {instalacion.caracteristicas.map((caracteristica, index) => (
              <li key={index} className="text-gray-700">{caracteristica}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return instalacionesConfig.map((instalacion) => ({
    slug: instalacion.id,
  }));
}