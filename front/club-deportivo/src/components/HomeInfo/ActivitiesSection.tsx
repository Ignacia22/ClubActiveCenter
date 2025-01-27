import Image from "next/image";
import Link from "next/link";
import { IconType } from "react-icons";
import { FaSwimmer } from "react-icons/fa";
import {  GiSoccerBall, GiTennisRacket } from "react-icons/gi";


export interface ActivitiesItem {
  text: string;
  path: string;
  icon?: IconType;
}

export default function ActivitiesSection() {
  const activities: ActivitiesItem[] = [
  { text: "Padel", path: "/instalaciones/padel", icon: GiTennisRacket },
  { text: "Tennis", path: "/instalaciones/tennis", icon: GiTennisRacket },
  { text: "Futbol", path: "/instalaciones/futbol", icon: GiSoccerBall },
  { text: "Natación", path: "/instalaciones/natacion", icon: FaSwimmer },
  ];

  return (
    <div className="relative min-h-screen bg-black text-white py-20 px-6 md:px-4">
      {/* Imagen principal */}
      <div className="flex justify-center mt-16 md:w-2/3">
        <Image
          src="https://res.cloudinary.com/dqiehommi/image/upload/v1737837539/pixelcut-export_2_gqq2jh.png"
          alt="Persona con balón"
          width={700}
          height={500}
          className=" object-cover"
        />
      </div>

      {/* Título vertical */}
      <div className="absolute top-1/2 -translate-y-1/2 -right-8 md:right-6">
        <p className="text-6xl sm:text-8xl md:text-8xl px-6 -m-16 sm:mb-[21rem] md:m-[4rem] mb-[7em] md:mb-[5em] xs:mb-[6em] font-bold rotate-90">
          Actividades
        </p>
      </div>

      {/* Tarjetas de actividades */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 mx-auto max-w-4xl text-black text-center">
  {activities.map((activity, index) => (
    <Link
      key={index}
      href={activity.path}
      className="bg-white p-6 md:p-8 rounded-lg hover:bg-slate-400 hover:text-white transition flex flex-col items-center justify-center"
    >
      {activity.icon && <activity.icon className="w-12 h-12 mb-4 text-black" />} {/* Ícono centrado arriba del texto */}
      <h3 className="font-bold text-base md:text-lg">{activity.text}</h3>
    </Link>
  ))}
</div>


      {/* Botón para ver más */}
      <div className="flex justify-center mt-8">
        <Link href="/actividades">
          <button className="bg-cyan-950 text-white font-bold px-6 md:px-8 py-6 rounded-xl hover:bg-gray-300 hover:text-black transition">
            Ver horarios y más
          </button>
        </Link>
      </div>
    </div>
  );
}