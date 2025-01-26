import BotonReserva from "@/components/Botones/BotonReserva";
import Carousel from "@/components/Carousel/Carousel";
import BeneficiosInfo from "@/components/HomeInfo/BeneficiosInfo";
import Parallax from "@/components/Parallax";
import { instalacionesConfig } from "@/config/instalacionesConfig";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function InstalacionPage({ params }: { params: Promise<{slug: string}>}) {
  const { slug } = await params;
  const instalacion = instalacionesConfig.find((inst) => inst.id === slug);

  if (!instalacion) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black text-white py-20 px-6 md:px-12">
  {/* Efecto Parallax para la Imagen */}
  <Parallax>
  <div className="relative w-full mb-8 md:mb-16">
  {/* Imagen */}
  <Image
    src={instalacion.images}
    alt={instalacion.titulo2}
    className="w-full h-auto rounded-xl shadow-md"
    width={800}
    height={600}
    objectFit="cover"
  />

  {/* Título */}
  <div className="absolute inset-0 flex items-center justify-center">
    <h1 className="font-sans tracking-wide text-9xl md:text-9xl font-bold text-white drop-shadow-lg">
      {instalacion.titulo2}
    </h1>
  </div>
</div>

    {/* Resto del contenido */}
    <div>
      {/* Carrusel y Título */}
      <div className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto">
        {/* Carrusel de imágenes */}
        <div className="w-full md:w-1/2 mb-8 md:mb-0">
          <Carousel images={instalacion.carruselImagenes} />
        </div>

        {/* Título */}
        <div className="w-full md:w-1/2 text-center md:text-left md:pl-12">
          <h1 className="text-6xl md:text-7xl tracking-wide font-bold mb-6">{instalacion.titulo}</h1>
          <BotonReserva />
        </div>
      </div>
    </div>
  </Parallax>

 {/* Detalles y Características */}
<div className="mt-16 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
  {/* Detalles */}
  <div className="bg-white bg-opacity-15 p-8 rounded-lg shadow-lg">
    <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 border-b border-gray-700 pb-4">
      Detalles
    </h2>
    <ul className="space-y-4">
      {instalacion.detalles.map((detalle, index) => (
        <li
          key={index}
          className="flex items-center gap-4 text-lg text-white"
        >
          <span className="w-4 h-4 bg-blue-600 rounded-full flex-shrink-0"></span>
          {detalle}
        </li>
      ))}
    </ul>
  </div>

  {/* Características */}
  <div className="bg-gray-800 bg-opacity-60 p-8 rounded-lg shadow-lg">
    <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 border-b border-gray-700 pb-4">
      Características
    </h2>
    <ul className="space-y-4">
      {instalacion.caracteristicas.map((caracteristica, index) => (
        <li
          key={index}
          className="flex items-center gap-4 text-lg text-gray-300"
        >
          <span className="w-4 h-4 bg-green-500 rounded-full flex-shrink-0"></span>
          {caracteristica}
        </li>
      ))}
    </ul>
  </div>
</div>

  

  {/* Beneficios */}
  <div className="mt-[7em]">
    <BeneficiosInfo />
  </div>
</div>

  );
}

export function generateStaticParams() {
  return instalacionesConfig.map((instalacion) => ({
    slug: instalacion.id,
  }));
}