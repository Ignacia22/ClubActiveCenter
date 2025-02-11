import { FaCheckCircle } from 'react-icons/fa';
import Link from 'next/link';

export default function SuccessPage() {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 to-navy-900 text-center">
        <div className="bg-white/20 p-12 rounded-2xl shadow-2xl backdrop-blur-md text-center">
          <div className="bg-stone-950 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <FaCheckCircle className="text-white text-5xl" />
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">
            ¡Pago Exitoso! 🎉
          </h1>
          
          <p className="text-xl text-white/90 mb-6">
            Tu pago ha sido confirmado con éxito
          </p>
          
          <Link
            href="/tienda"
            className="px-6 py-3 bg-white text-blue-800 font-semibold rounded-lg shadow-md hover:bg-gray-300 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
          >
            Volver a Tienda
          </Link>
        </div>
      </div>
    );
}