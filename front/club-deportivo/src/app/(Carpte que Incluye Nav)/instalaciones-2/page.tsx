import React from 'react';
import Image from 'next/image';

import BeneficiosInfo from '@/components/HomeInfo/BeneficiosInfo';
import InstalacionesSlider from '@/components/Carousel/InstalacionesSlider';



const descripcionGeneral = {
  imagen: "https://res.cloudinary.com/dqiehommi/image/upload/v1737839576/pexels-tomfisk-3507477_g1cosp.jpg",
  descripcion: "Nuestro centro deportivo cuenta con modernas instalaciones para diversos deportes. Desde canchas de pádel y fútbol hasta pistas de tenis y una piscina olímpica, ofrecemos espacios de alta calidad para deportistas de todos los niveles."
};

const instalaciones = [
  {
    nombre: "Pádel",
    descripcion: "Nuestras modernas pistas de pádel están diseñadas para jugadores de todos los niveles. Con paredes de cristal templado y césped artificial de última generación, ofrecen una experiencia de juego excepcional. Contamos con iluminación LED para partidos nocturnos y un sistema de reserva en línea para tu comodidad. Organizamos torneos regulares y ofrecemos clases con instructores certificados para mejorar tu técnica.",
    imagen: "https://res.cloudinary.com/dqiehommi/image/upload/v1738532425/pexels-berend-van-der-weijden-774001736-18883859_c4hwqr.jpg"
  },
  {
    nombre: "Cancha de Fútbol",
    descripcion: "Nuestra cancha de fútbol de pasto sintético es perfecta para partidos emocionantes y entrenamientos intensivos. El césped de alta calidad asegura un juego suave y seguro, mientras que nuestro sistema de drenaje avanzado permite jugar incluso después de lluvias. La cancha está equipada con porterías profesionales, marcador electrónico y gradas para espectadores. Ideal para ligas amateur, eventos corporativos y escuelas de fútbol para niños.",
    imagen: "https://res.cloudinary.com/dqiehommi/image/upload/v1737839576/pexels-tomfisk-3507477_g1cosp.jpg"
  },
  {
    nombre: "Pistas de Tenis",
    descripcion: "Nuestras pistas de tenis de alta calidad están diseñadas para satisfacer tanto a principiantes como a expertos. Contamos con superficies de arcilla y dura, permitiendo diferentes estilos de juego. Cada pista está equipada con sillas de descanso y sombrillas para los jugadores. Ofrecemos servicios de encordado de raquetas in situ y una tienda especializada en equipamiento de tenis. Nuestros programas incluyen clases particulares, campamentos de verano y torneos mensuales.",
    imagen: "https://res.cloudinary.com/dqiehommi/image/upload/v1738532534/pexels-cottonbro-5739223_dqgpyn.jpg"
  },
  {
    nombre: "Piscina Olímpica",
    descripcion: "Nuestra piscina olímpica de 50 metros es ideal para entrenamientos, clases y recreación. Con ocho carriles y bloques de salida profesionales, es perfecta para nadadores competitivos. Mantenemos el agua a una temperatura óptima todo el año y utilizamos un sistema de filtración avanzado para garantizar la máxima higiene. Ofrecemos clases de natación para todas las edades, desde bebés hasta adultos, así como sesiones de aquaeróbics y entrenamiento de resistencia en agua.",
    imagen: "https://res.cloudinary.com/dqiehommi/image/upload/v1737840424/pexels-jim-de-ramos-395808-1263425_mkhmzn.jpg"
  }
];

export default function InstalacionesPage() {
  return (
    <div className="bg-black text-white min-h-screen">
      <div className="container mx-auto px-4 py-16">
        {/* Descripción general con imagen y título */}
        <div className="flex flex-col md:flex-row items-center mb-16">
          <div className="md:w-1/2 md:pr-8 mb-8 md:mb-0">
            <h1 className="text-5xl font-bold mb-6">Instalaciones</h1>
            <p className="text-base">{descripcionGeneral.descripcion}</p>
          </div>
          <div className="md:w-1/2">
            <Image
              src={descripcionGeneral.imagen}
              alt="Instalaciones generales"
              width={600}
              height={400}
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
        </div>

        {/* Slider de instalaciones */}
        <InstalacionesSlider instalaciones={instalaciones} />



      </div>
      {/* Beneficios */}
        <div className="mt-[7em]">
          <BeneficiosInfo />
        </div>
    </div>
  );
}
