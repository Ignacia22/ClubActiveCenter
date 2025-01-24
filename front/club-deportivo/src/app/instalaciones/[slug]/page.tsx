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
    <div className="container mx-auto py-20 px-4">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative h-96">
          <Image
            src={instalacion.imagen}
            alt={instalacion.titulo}
            fill
            className="object-cover rounded-lg shadow-lg"
          />
        </div>
        <div>
          <h1 className="text-4xl font-bold mb-4">{instalacion.titulo}</h1>
          <p className="text-gray-600 mb-6 text-lg">{instalacion.descripcion}</p>

          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">Detalles de la Instalación</h2>
            <ul className="list-disc list-inside space-y-2">
              {instalacion.detalles.map((detalle, index) => (
                <li key={index} className="text-gray-700">{detalle}</li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Características</h2>
            <ul className="list-disc list-inside space-y-2">
              {instalacion.caracteristicas.map((caracteristica, index) => (
                <li key={index} className="text-gray-700">{caracteristica}</li>
              ))}
            </ul>
          </div>
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