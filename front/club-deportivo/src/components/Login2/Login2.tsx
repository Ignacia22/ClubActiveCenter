"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/service/authservices";
import Swal from "sweetalert2";

import Link from "next/link";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    try {
      await AuthService.login(formData);
      Swal.fire({
        icon: "success",
        title: "Inicio de sesión exitoso",
        text: "Bienvenido de nuevo!",
      });
      router.push("/home");
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error al iniciar sesión",
        text: "Credenciales incorrectas o problema en el servidor.",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <Link
        href="/api/auth/login"
        className="block px-3 py-2 hover:bg-gray-700 rounded"
      >
        Iniciar sesión
      </Link>

      <form
        onSubmit={handleSubmit}
        className="bg-black bg-opacity-80 p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-white text-center">
          Iniciar Sesión
        </h2>

        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}

        <div className="mb-4">
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico:"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-black text-white border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
            required
          />
        </div>

        <div className="mb-4">
          <input
            type="password"
            name="password"
            placeholder="Contraseña:"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-black text-white border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-yellow-500 text-black py-2 px-4 rounded hover:bg-yellow-600 transition font-bold"
        >
          INICIAR SESIÓN
        </button>

        {/* UserMenu con estilos ajustados */}
      </form>
    </div>
  );
};

export default Login;
