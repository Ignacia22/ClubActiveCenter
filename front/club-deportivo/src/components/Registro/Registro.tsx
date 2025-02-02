"use client";
import React, { useState } from "react";
import { AuthService } from "@/service/auth";
import Swal from "sweetalert2";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "+549",
    address: "",
    dni: "",
    password: "",
    passwordConfirmation: "",
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
      !formData.dni ||
      !formData.password ||
      !formData.passwordConfirmation
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
    if (!/^\+?\d{1,4}[-\s]?\(?\d{1,5}\)?[-\s]?\d{4,9}$/.test(formData.phone)) {
      setError("El número de teléfono no es válido. Incluye el prefijo.");
      return false;
    }
    if (isNaN(Number(formData.dni)) || formData.dni.length < 7) {
      setError("El DNI debe ser un número válido con al menos 7 dígitos.");
      return false;
    }
    if (formData.password !== formData.passwordConfirmation) {
      setError("Las contraseñas no coinciden.");
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
    console.log("Formulario enviado con datos:", formData); // 🛠 Depuración

    if (!validateForm()) return;

    try {
      await AuthService.register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address || " ",
        dni: Number(formData.dni),
        password: formData.password,
        passwordConfirmation: formData.passwordConfirmation,
      });

      setFormData({
        name: "",
        email: "",
        phone: "+549",
        address: "",
        dni: "",
        password: "",
        passwordConfirmation: "",
      });
    } catch (error) {
      console.error("Error en el registro:", error);
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

        {Object.keys(formData).map((field) => {
          return (
            <div className="mb-4" key={field}>
              <input
                type={field.includes("password") ? "password" : "text"}
                name={field}
                placeholder={`${
                  field === "passwordConfirmation"
                    ? "Confirmar Contraseña:"
                    : field.charAt(0).toUpperCase() + field.slice(1) + ":"
                }`}
                value={formData[field as keyof typeof formData]}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-black text-white border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
                required
              />
            </div>
          );
        })}

        <button
          type="submit"
          className="w-full bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-600 transition font-bold"
        >
          REGÍSTRATE
        </button>
      </form>
    </div>
  );
};

export default Register;
