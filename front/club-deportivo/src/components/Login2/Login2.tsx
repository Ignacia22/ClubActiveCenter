"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/service/authservices"; // Asegúrate de que esté correctamente importado
import Swal from "sweetalert2";

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
      // Llamamos al servicio de login
      const response = await AuthService.login(formData);

      if (response && response.userInfo && response.token) {
        // Guardamos los datos del usuario y el token en localStorage
        localStorage.setItem("user", JSON.stringify(response.userInfo));
        localStorage.setItem("token", response.token);

        Swal.fire({
          icon: "success",
          title: "Inicio de sesión exitoso",
          text: "Bienvenido de nuevo!",
        });

        // Redirigimos al usuario a la página principal
        router.push("/home");
      } else {
        setError("Hubo un problema con la autenticación.");
      }
    } catch (error) {
      console.error("Error en el login:", error); // Muestra el error en la consola (solo para desarrolladores)
      Swal.fire({
        icon: "error",
        title: "Error al iniciar sesión",
        text: "Credenciales incorrectas o problema en el servidor.",
      });
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "/api/auth/login";
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[url('https://res.cloudinary.com/dqiehommi/image/upload/v1737912176/pexels-sukh-winder-3740393-5611633_y1bx8n.jpg')] bg-cover bg-center">
      <form
        onSubmit={handleSubmit}
        className="bg-black bg-opacity-80 p-8 rounded-lg shadow-md w-full max-w-lg"
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
          className="w-full bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-600 transition font-bold"
        >
          INICIAR SESIÓN
        </button>

        <div className="mt-6 text-center">
          <p className="text-gray-400">O inicia sesión con tu cuenta Gmail:</p>
          <button
            onClick={handleGoogleLogin}
            className="w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition font-bold"
          >
            Iniciar sesión con Google
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
