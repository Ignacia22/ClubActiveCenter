import Image from "next/image";
import Link from "next/link";
import ActivitiesSection from "./ActivitiesSection";

export default function InfoHome() {
  return (
    <div>
      {/* Contenedor principal */}
      <div className="relative h-screen w-full">
        {/* Imagen de fondo */}
        <Image
          src="/assets/Images/pexels-sukh-winder-3740393-5611633.jpg"
          alt="Imagen de bienvenida"
          layout="fill"
          objectFit="cover"
          className="z-0"
        />

        {/* Texto superpuesto */}
        <div className="absolute inset-0 flex flex-col items-start justify-center px-20 text-white z-10">
          <h1 className="text-[5rem] font-sans font-bold drop-shadow-lg">Club Active Center</h1>
          <p className="mt-8 font-sans text-[1.1em] drop-shadow-md w-1/2 text-left">
            Este complejo deportivo ofrece instalaciones de última generación para diversas disciplinas. Contamos con canchas de fútbol, tenis, pádel y piscina, todas diseñadas y equipadas para brindar a nuestros clientes una experiencia de entrenamiento y recreación de excelencia. Nuestras instalaciones cuentan con tecnología de vanguardia, personal capacitado y áreas de descanso cómodas para garantizar el máximo disfrute de nuestros servicios.
          </p>
          <Link href="/instalaciones">
            <button className="mt-8 bg-white hover:bg-slate-300 hover:text-black text-black font-bold py-3 px-6 rounded-md transition-colors duration-300">
              Ver Instalaciones
            </button>
          </Link>
        </div>
      </div>

      {/* Sección adicional */}
<section className="bg-black py-20">
  <div className="container  px-4 flex flex-col md:flex-row items-center">
    {/* Imagen más grande */}
    <div className="w-full md:w-2/3 mb-8 md:mb-0">
      <Image
        src="/assets/Images/pixelcut-export.png"
        alt="Próximos Eventos"
        width={3902}
        height={3952}
        className="w-full h-auto" 
      />
    </div>
    
    {/* Contenido de texto */}
    <div className="w-full md:w-1/3 md:ml-8 text-center md:text-left">
      <h2 className="text-7xl font-sans font-bold mb-4 text-white">Bienestar deportivo</h2>
      <p className="text-white my-9">
        Mantente al tanto de nuestros próximos eventos y actividades especiales. Tenemos una agenda llena de emocionantes competiciones, entrenamientos y actividades recreativas para que disfrutes al máximo.
      </p>
      <Link href="/eventos">
        <button className="mt-4 bg-white hover:bg-slate-300 text-black font-sans font-bold py-3 px-6 rounded-md transition-colors duration-300">
          Ver más
        </button>
      </Link>
    </div>
  </div>
</section>


<div className="bg-black py-10">
<div className="container mx-20 px-4 flex flex-col md:flex-row items-center">
    
    {/* Contenido de texto */}
    <div className="w-full md:w-1/3 md:ml-8 text-center md:text-left">
      <h2 className="text-7xl font-sans font-bold mb-4 text-white">ClubActive Center</h2>
      <p className="text-white my-9">
        Mantente al tanto de nuestros próximos eventos y actividades especiales. Tenemos una agenda llena de emocionantes competiciones, entrenamientos y actividades recreativas para que disfrutes al máximo.
      </p>
      <Link href="/eventos">
        <button className="mt-4 bg-white hover:bg-slate-300 text-black font-sans font-bold py-3 px-6 rounded-md transition-colors duration-300">
          Ver más
        </button>
      </Link>
    </div>

    {/* Imagen más grande */}
    <div className="w-full md:w-2/3 mb-8 md:mb-0">
      <Image
        src="/assets/Images/pixelcut-export (1).png"
        alt="Próximos Eventos"
        width={3902}
        height={3952}
        className="w-full h-auto" 
      />
    </div>
  </div>
</div>

<div className="">
  <ActivitiesSection/>
</div>


    </div>
  );
}