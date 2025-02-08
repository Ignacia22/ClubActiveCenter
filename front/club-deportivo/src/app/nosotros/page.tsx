/* eslint-disable @next/next/no-img-element */
"use client";
import axios from "axios";
import ContactForm from "../../components/ContactForm/ContactForm";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Nosotros() {

  const BACK_URL = "http://localhost:3007";

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleFormSubmit = async (formData: { name: string; phone: string; email: string; message: string }) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await axios.post(`${BACK_URL}/sendGrid/contacForm`, formData, {
        headers: { "Content-Type": "application/json" },
      });
      console.log(response.data)
      setSuccessMessage("¡Formulario enviado con éxito!");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.message || "Hubo un error al enviar el formulario.");
      } else {
        setError("Hubo un error al enviar el formulario. Intenta nuevamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="bg-black text-white px-6 py-12 space-y-16">
      {/* Sección 1: Historia del gimnasio */}
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Carrusel de imágenes */}
        <div className="relative w-full md:w-1/2 h-96 overflow-hidden">
          <div className="flex w-[300%] h-full animate-slow-scroll">
            <img
              src="https://res.cloudinary.com/dqiehommi/image/upload/v1737839430/WhatsApp_Image_2025-01-25_at_5.53.49_PM_bfft2z.jpg"
              alt="Imagen 1"
              className="w-1/3 flex-shrink-0 object-cover rounded-lg"
            />
            <img
              src="https://res.cloudinary.com/dqiehommi/image/upload/v1737839365/WhatsApp_Image_2025-01-25_at_5.53.48_PM_1_rvb6ec.jpg"
              alt="Imagen 2"
              className="w-1/3 flex-shrink-0 object-cover rounded-lg"
            />
            <img
              src="https://res.cloudinary.com/dqiehommi/image/upload/v1737839364/WhatsApp_Image_2025-01-25_at_5.53.48_PM_liku7i.jpg"
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
              src="https://res.cloudinary.com/dqiehommi/image/upload/v1737839576/pexels-tomfisk-3507477_g1cosp.jpg"
              alt="Fútbol"
              className="w-1/3 flex-shrink-0 object-cover rounded-lg"
            />
            <img
              src="https://res.cloudinary.com/dqiehommi/image/upload/v1737839423/WhatsApp_Image_2025-01-25_at_5.53.50_PM_ghadh9.jpg"
              alt="Paddel"
              className="w-1/3 flex-shrink-0 object-cover rounded-lg"
            />
            <img
              src="https://res.cloudinary.com/dqiehommi/image/upload/v1737837727/pexels-willianjusten-29175966_mlmlbx.jpg"
              alt="Tenis"
              className="w-1/3 flex-shrink-0 object-cover rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Sección 3: Beneficios */}
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
          <Link href="../Membresias">
            <button className="mt-6 md:mt-8 bg-white hover:bg-slate-300 hover:text-black text-black font-bold py-2 md:py-3 px-4 md:px-6 rounded-md transition-colors duration-300">
              Aprender más
            </button>
          </Link>
        <div className="bg-black text-white px-6 py-12 space-y-16">
      </div>
    </div>
      </div>
      {/* Otras secciones de "Nosotros" */}
      <div className="flex flex-col items-center">
      <ContactForm onSubmit={handleFormSubmit} />
        {isLoading && <p>Enviando...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      </div>
    </div>
  );
}
