/* eslint-disable @next/next/no-img-element */
import futbol from "../public/assets/futbol.jpg";
import paddel from "../public/assets/paddel.png";
import tennis from "../public/assets/tennis.jpg";
import nosotros from "../public/assets/nosotros.jpg";
import nosotros2 from "../public/assets/nosotros2.jpg";
import fotonosotros from "../public/assets/fotonosotros.jpg";
import beneficiosdelclub from "../public/assets/beneficiosdelclub.png";

export default function Nosotros() {
  return (
    <div className="bg-black text-white px-6 py-12 space-y-16">
      {/* Sección 1: Historia del gimnasio */}
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Carrusel de imágenes */}
        <div className="relative w-full md:w-1/2 h-96 overflow-hidden">
          <div className="flex w-[300%] h-full animate-slow-scroll">
            <img
              src={nosotros.src}
              alt="Imagen 1"
              className="w-1/3 flex-shrink-0 object-cover rounded-lg"
            />
            <img
              src={nosotros2.src}
              alt="Imagen 2"
              className="w-1/3 flex-shrink-0 object-cover rounded-lg"
            />
            <img
              src={fotonosotros.src}
              alt="Imagen 3"
              className="w-1/3 flex-shrink-0 object-cover rounded-lg"
            />
          </div>
        </div>
        <div className="md:w-1/2 md:pl-8">
          <h2 className="text-3xl font-bold mb-4">Nuestra Historia</h2>
          <p>
            Desde que abrimos nuestras puertas en el año 2010, nos hemos
            dedicado a ofrecer un espacio donde el deporte y la comunidad se
            unen. Nuestro gimnasio fue fundado con la visión de brindar un lugar
            accesible y profesional para todos, desde principiantes hasta
            atletas experimentados.
          </p>
        </div>
      </div>

      {/* Sección 2: Calidad de las canchas */}
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Texto al costado */}
        <div className="md:w-1/2 md:pr-8">
          <h2 className="text-3xl font-bold mb-4">
            Canchas de Primera Calidad
          </h2>
          <p>
            Contamos con canchas de fútbol 5, paddel y tenis, diseñadas con los
            mejores materiales para garantizar un alto rendimiento. Además,
            nuestros espacios son amplios, seguros y mantenidos de manera
            profesional para tu comodidad y disfrute.
          </p>
        </div>
        {/* Carrusel de imágenes */}
        <div className="relative w-full md:w-1/2 h-96 overflow-hidden">
          <div className="flex w-[300%] h-full animate-slow-scroll">
            <img
              src={futbol.src}
              alt="Fútbol"
              className="w-1/3 flex-shrink-0 object-cover rounded-lg"
            />
            <img
              src={paddel.src}
              alt="Paddel"
              className="w-1/3 flex-shrink-0 object-cover rounded-lg"
            />
            <img
              src={tennis.src}
              alt="Tenis"
              className="w-1/3 flex-shrink-0 object-cover rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Sección 3: Beneficios */}
      <div className="text-center">
        <img
          src={beneficiosdelclub.src}
          alt="Beneficios del gimnasio"
          width={1440}
          height={500}
          className="w-full rounded-lg mb-6"
        />
        <h2 className="text-3xl font-bold mb-4">Beneficios de Elegirnos</h2>
        <p className="mx-auto max-w-4xl">
          En nuestro gimnasio encontrarás entrenadores profesionales, tecnología
          de última generación, clases grupales para todas las edades, acceso a
          canchas premium y un ambiente que te motivará a dar lo mejor de ti.
        </p>
      </div>
    </div>
  );
}
