import Image from "next/image";
import Link from "next/link";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaPhone,
  FaMailBulk,
} from "react-icons/fa";
import { FaLocationPin } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-10">
      {/* Línea divisoria */}
      <div className="w-10/12 mx-auto border-t-2 border-white my-8"></div>

      {/* Contenedor principal */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center md:text-left">
        {/* Sección 1: Logo */}
        <div className="flex justify-center md:justify-center lg:justify-start">
          <Link href="/home">
            <Image
              src="https://res.cloudinary.com/dqiehommi/image/upload/v1737838109/imagen_2025-01-15_210703968-removebg-preview_pzguoo.png"
              alt="Logo"
              width={80}
              height={80}
              className="h-16 w-auto"
            />
          </Link>
        </div>

        {/* Sección 2: Información de contacto */}
        <div className="text-sm">
          {/* Dirección */}
          <p className="flex items-center justify-center md:justify-start space-x-2">
            <FaLocationPin className="text-gray-400" />
            <a href="#" className="hover:underline text-center md:text-left">
              Dirección: Avenida Siempre Viva 123
            </a>
          </p>

          {/* Teléfono */}
          <p className="flex items-center justify-center md:justify-start space-x-2 mt-4">
            <FaPhone className="text-gray-400" />
            <a href="#" className="hover:underline text-center md:text-left">
              +46789489893
            </a>
          </p>

          {/* Correo */}
          <p className="flex items-center justify-center md:justify-start space-x-2 mt-4">
            <FaMailBulk className="text-gray-400" />
            <a href="#" className="hover:underline text-center md:text-left">
              example@gmail.com
            </a>
          </p>
        </div>

        {/* Sección 3: Redes sociales */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Síguenos:</h2>
          <div className="flex justify-center md:justify-start space-x-4">
            <a href="#" target="_blank" rel="noopener noreferrer">
              <FaFacebook className="text-gray-400 hover:text-blue-500 text-2xl transition duration-200" />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <FaTwitter className="text-gray-400 hover:text-sky-500 text-2xl transition duration-200" />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <FaInstagram className="text-gray-400 hover:text-pink-500 text-2xl transition duration-200" />
            </a>
          </div>
        </div>
      </div>

      {/* Derechos reservados */}
      <div className="text-center mt-12">
        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} Nuestra Compañía. Todos los derechos
          reservados.
        </p>
      </div>
    </footer>
  );
}
