"use client";
import React, { useState } from "react";
import { AuthService } from "@/service/auth";
import Swal from "sweetalert2";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    dni: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.address ||
      !formData.dni ||
      !formData.password
    ) {
      setError("Todos los campos son obligatorios.");
      return false;
    }
    if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
      setError("El nombre solo debe contener letras.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Por favor, ingresa un correo electrónico válido.");
      return false;
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      setError("El número de teléfono debe tener 10 dígitos.");
      return false;
    }
    if (isNaN(Number(formData.dni)) || formData.dni.length < 7) {
      setError("El DNI debe ser un número válido con al menos 7 dígitos.");
      return false;
    }
    if (formData.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await AuthService.register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        dni: Number(formData.dni),
        password: formData.password,
      });

      Swal.fire({
        icon: "success",
        title: "Registro exitoso",
        text: "¡Bienvenido a nuestra comunidad!",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        dni: "",
        password: "",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al registrar usuario",
        text: "Por favor, intenta de nuevo más tarde.",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[url('https://res.cloudinary.com/dqiehommi/image/upload/v1737912176/pexels-sukh-winder-3740393-5611633_y1bx8n.jpg')] bg-cover bg-center">
      <form
        onSubmit={handleSubmit}
        className="bg-black bg-opacity-80 p-8 rounded-lg shadow-md w-full max-w-lg"
      >
        <h2 className="text-3xl font-bold mb-6 text-white text-center">
          ¡Sé parte de nuestra comunidad!
        </h2>

        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}

        <div className="mb-4">
          <input
            type="text"
            name="name"
            placeholder="Nombre:"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-black text-white border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
            required
          />
        </div>

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
            type="text"
            name="phone"
            placeholder="Número de teléfono:"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-black text-white border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
            required
          />
        </div>

        <div className="mb-4">
          <input
            type="text"
            name="address"
            placeholder="Dirección:"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-black text-white border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
            required
          />
        </div>

        <div className="mb-4">
          <input
            type="text"
            name="dni"
            placeholder="DNI/Documento:"
            value={formData.dni}
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
          className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-700 transition font-bold"
        >
          REGÍSTRATE
        </button>
      </form>
    </div>
  );
};

export default Register;
