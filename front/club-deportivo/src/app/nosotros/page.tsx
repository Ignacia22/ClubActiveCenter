/* eslint-disable @next/next/no-img-element */

import futbol from "../public/assets/futbol.jpg";
import paddel from "../public/assets/paddel.png";
import tennis from "../public/assets/tennis.jpg";
import nosotros from "../public/assets/nosotros.jpg";
import nosotros2 from "../public/assets/nosotros2.jpg";
import fotonosotros from "../public/assets/fotonosotros.jpg";
import Image from "next/image";
import Link from "next/link";

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
          <h2 className="text-4xl md:text-[4rem] font-sans font-bold drop-shadow-lg">
            Nuestra Historia
          </h2>
          <p className="mt-8">
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
          <h2 className="text-4xl md:text-[4rem] font-sans font-bold drop-shadow-lg leading-relaxed">
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
      <div className="relative h-screen w-full">
        <Image
          src="/assets/Images/pexels-cottonbro-10340615.jpg"
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
          <Link href="../Membresias">
            <button className="mt-6 md:mt-8 bg-white hover:bg-slate-300 hover:text-black text-black font-bold py-2 md:py-3 px-4 md:px-6 rounded-md transition-colors duration-300">
              Aprender más
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
