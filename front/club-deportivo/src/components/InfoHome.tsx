import Image from "next/image";
import Link from "next/link";

export default function InfoHome() {
  return (
    <section className="relative h-screen w-full">
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
    </section>
  );
}