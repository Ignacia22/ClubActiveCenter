"use client";

import { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import axios from "axios";

function RefreshTokenButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleRefreshToken = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token"); // Obtener token actual
      const {data} = await axios.put("https://active-center-db-3rfj.onrender.com/auth/tokenRefresh", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      localStorage.removeItem("token")
      localStorage.setItem("token", data.tokenAccess);
      router.push("/home");
    } catch (error) {
      console.log(error);
      
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handleRefreshToken}
        disabled={loading}
        className="px-6 py-3 bg-white text-blue-800 font-semibold rounded-lg shadow-md hover:bg-gray-300 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 disabled:opacity-50"
      >
        {loading ? "Actualizando..." : "Volver a home"}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}

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

        <RefreshTokenButton />
      </div>
    </div>
  );
}