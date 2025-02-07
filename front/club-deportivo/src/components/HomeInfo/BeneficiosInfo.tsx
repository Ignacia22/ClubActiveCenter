import Image from "next/image";
import Link from "next/link";

export default function BeneficiosInfo() {
  return (
    <>
      {/* Beneficios */}
      <div className="relative h-screen w-full">
        <Image
          src="https://res.cloudinary.com/dqiehommi/image/upload/v1737838004/pexels-cottonbro-10340615_nx5l6i.jpg"
          alt="Imagen de bienvenida"
          layout="fill"
          objectFit="cover"
          className="z-0 opacity-70"
        />
        <div className="absolute inset-0 flex flex-col items-start justify-center px-6 md:px-20 text-white z-10">
          <h1 className="text-5xl md:text-[5rem] font-sans font-bold drop-shadow-lg">
            Beneficios del Club
          </h1>
          <p className="mt-6 md:mt-8 font-sans font-medium text-[1em] md:text-[1.1em] drop-shadow-md w-full md:w-1/2 text-left">
            Este complejo ofrece instalaciones de alta gama, personal capacitado
            y áreas de descanso cómodas para garantizar una excelente
            experiencia deportiva y recreativa. Además, contamos con diversas
            opciones de membresía.
          </p>
          <Link href="/instalaciones-2">
            <button className="mt-6 md:mt-8 bg-white hover:bg-slate-300 hover:text-black text-black font-bold py-2 md:py-3 px-4 md:px-6 rounded-md transition-colors duration-300">
              Aprender más
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}
