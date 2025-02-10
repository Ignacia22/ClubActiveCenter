import Image from "next/image";
import Link from "next/link";

export default function WelcomePage() {
  return (
    <div className="relative h-screen w-full">
      {/* Imagen de fondo */}
      <Image
        src="https://res.cloudinary.com/dqiehommi/image/upload/v1737912176/pexels-sukh-winder-3740393-5611633_y1bx8n.jpg"
        alt="Imagen de bienvenida"
        fill
        objectFit="cover"
        className="z-0"
      />

      {/* Contenido superpuesto */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6 md:px-20 z-10">
        <h1 className="text-6xl md:text-[6rem] sm:text-[5rem] font-sans font-bold drop-shadow-lg">
          Bienvenido a
        </h1>
        <h1 className="text-6xl md:text-[6rem] sm:text-[5rem] font-sans font-bold drop-shadow-lg">
          Club Active Center
        </h1>
        <p className="mt-6 md:mt-8 font-sans text-lg md:text-xl drop-shadow-md w-full md:w-2/3">
          Un espacio diseñado para potenciar tu bienestar físico y mental.
          Descubre nuestras Canchas de última generación y únete a nuestra
          comunidad apasionada por el deporte.
        </p>
        <div className="mt-6 flex flex-col md:flex-row gap-4">
          <Link href="/instalaciones-2">
            <button className="bg-white hover:bg-slate-300 hover:text-black text-black font-bold py-3 px-6 rounded-md transition-colors duration-300">
              Ver Canchas
            </button>
          </Link>
          <Link href="/Membresias">
            <button className="bg-transparent border-2 border-white hover:bg-white hover:text-black text-white font-bold py-3 px-6 rounded-md transition-colors duration-300">
              Quiero ser socio!
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
