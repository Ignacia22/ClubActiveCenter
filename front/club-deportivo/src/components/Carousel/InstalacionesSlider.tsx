"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Instalacion {
  nombre: string;
  descripcion: string;
  imagen: string;
}

interface InstalacionesSliderProps {
  instalaciones: Instalacion[];
}

export default function InstalacionesSlider({
  instalaciones,
}: InstalacionesSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % instalaciones.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + instalaciones.length) % instalaciones.length
    );
  };

  return (
    <div className="relative">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8">
        <div className="relative md:w-1/2">
          <Image
            src={instalaciones[currentIndex].imagen}
            alt={instalaciones[currentIndex].nombre}
            width={600}
            height={400}
            objectFit="cover"
            className="rounded-lg mb-4 md:mb-0"
          />
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 text-black p-2 rounded-r"
          >
            &#8249;
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-10 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 text-black p-2 rounded-l"
          >
            &#8250;
          </button>
        </div>
        <div className="md:w-1/2 md:pl-8">
          <h2 className="text-3xl font-semibold mb-4">
            {instalaciones[currentIndex].nombre}
          </h2>
          <p className="mb-4">{instalaciones[currentIndex].descripcion}</p>
          <div className="space-y-4">
            <Link
              href="/Reservas"
              className="block w-full font-semibold bg-white text-black text-center py-3 px-6 rounded-lg hover:bg-slate-500 transition duration-300"
            >
              RESERVAR
            </Link>
            <Link
              href="/contratar-plan"
              className="block w-full font-semibold bg-white text-black text-center py-3 px-6 rounded-lg hover:bg-slate-500 transition duration-300"
            >
              CONTRATAR PLAN
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
