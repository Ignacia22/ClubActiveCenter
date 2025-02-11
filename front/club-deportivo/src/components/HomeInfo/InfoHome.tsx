import Image from "next/image";
import Link from "next/link";
import ActivitiesSection from "./ActivitiesSection";
import BeneficiosInfo from "./BeneficiosInfo";
import Map from "../Map";


export default function InfoHome() {
  return (
    <div>
      {/* Sección principal */}
      <div className="relative h-screen w-full">
        <Image
          src="https://res.cloudinary.com/dqiehommi/image/upload/v1737912176/pexels-sukh-winder-3740393-5611633_y1bx8n.jpg"
          alt="Imagen de bienvenida"
          fill
          objectFit="cover"
          className="z-0"
        />
        <div className="absolute inset-0 flex flex-col items-start justify-center pb-0 pt-20 px-6 md:px-20 text-white z-10">
          <h1 className="text-6xl pl-4 md:text-[6rem] sm:text-[5rem] xs:text-[5rem] font-sans font-bold drop-shadow-lg">
            Club Active Center
          </h1>
          <p className="mt-6 pl-4 md:mt-8 font-sans text-[1em] md:text-[1.1em] drop-shadow-md w-full md:w-1/2 text-left">
            Este complejo deportivo ofrece instalaciones de última generación
            para diversas disciplinas. Contamos con canchas de fútbol, tenis,
            pádel y piscina, todas diseñadas y equipadas para brindar a nuestros
            clientes una experiencia de entrenamiento y recreación de
            excelencia.
          </p>
          <Link href="/instalaciones-2">
            <button className="mt-6 pl-5 md:mt-8 bg-white hover:bg-slate-300 hover:text-black text-black font-bold py-2 md:py-3 px-4 md:px-6 rounded-md transition-colors duration-300">
              Ver Instalaciones
            </button>
          </Link>
        </div>
      </div>

      {/* Segunda imagen */}
      <div className="bg-black py-20 px-6 md:px-4">
        <div className="container mx-auto flex flex-col md:flex-row items-center">
          <div className="w-full md:w-2/3 mb-8 md:mb-0">
            <Image
              src="https://res.cloudinary.com/dqiehommi/image/upload/v1737837626/pixelcut-export_n5iubx.png"
              alt="Bienestar"
              width={3902}
              height={3952}
              className="w-full h-auto"
            />
          </div>
          <div className="w-full md:w-1/3 md:ml-8 text-center md:text-left">
            <h2 className="text-5xl md:text-6xl font-sans font-bold mb-4 text-white">
              Bienestar Deportivo
            </h2>
            <p className="text-white my-6 md:my-9">
              Descubre cómo el deporte puede transformar tu bienestar físico y
              mental. Únete a nuestras actividades llenas de energía, desde
              emocionantes competiciones hasta entrenamientos diseñados para
              todos los niveles. Mantente activo, diviértete y forma parte de
              una comunidad apasionada por el movimiento.
            </p>
            <Link href="/eventos">
              <button className="mt-4 bg-white hover:bg-slate-300 text-black font-sans font-bold py-2 md:py-3 px-4 md:px-6 rounded-md transition-colors duration-300">
                Aprender más
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Tercera imagen */}
      <div className="bg-black py-10 px-6 md:px-4">
        <div className="container mx-auto flex flex-col md:flex-row-reverse items-center">
          <div className="w-full md:w-2/3 mb-8 md:mb-0">
            <Image
              src="https://res.cloudinary.com/dqiehommi/image/upload/v1737837539/pixelcut-export_1_pyyrvq.png"
              alt="Hombre de Pie"
              width={3902}
              height={3952}
              className="w-full h-auto"
            />
          </div>
          <div className="w-full md:w-1/3 md:ml-8 text-center md:text-left">
            <h2 className="text-5xl md:text-7xl font-sans font-bold mb-4 text-white">
              Club Active Center
            </h2>
            <p className="text-white my-6 md:my-9">
              Mantente al tanto de nuestros próximos eventos y actividades
              especiales. Tenemos una agenda llena de emocionantes
              competiciones, entrenamientos y actividades recreativas para que
              disfrutes al máximo.
            </p>
            <Link href="/eventos">
              <button className="mt-4 bg-white hover:bg-slate-300 text-black font-sans font-bold py-2 md:py-3 px-4 md:px-6 rounded-md transition-colors duration-300">
                Aprender más
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Actividades */}
      <div className="p-6 md:p-10 bg-black">
        <ActivitiesSection />
      </div>

      <div>
        <BeneficiosInfo />
      </div>

      {/* Sección del Mapa */}
      <div className="bg-black py-10 px-6 md:px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-sans font-bold mb-8 text-white text-center">
            Encuéntranos
          </h2>
          <div className="rounded-lg overflow-hidden">
            <Map 
              center={{ lat: 19.4326, lng: -99.1332 }} // Cambia estas coordenadas por la ubicación real de tu club
              zoom={15}
              markers={[
                {
                  lat: 19.4326,
                  lng: -99.1332,
                  title: "Club Active Center"
                }
              ]}
            />
          </div>
          <div className="mt-6 text-center">
            <p className="text-white mb-4">Visítanos en nuestras instalaciones</p>
            <Link href="/contacto">
              <button className="bg-white hover:bg-slate-300 text-black font-sans font-bold py-2 md:py-3 px-4 md:px-6 rounded-md transition-colors duration-300">
                Cómo llegar
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}