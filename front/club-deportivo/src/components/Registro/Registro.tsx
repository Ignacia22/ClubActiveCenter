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
      !formData.address ||
      !formData.dni ||
      !formData.password ||
      formData.password !== formData.passwordConfirmation
    ) {
      setError(
        "Todos los campos son obligatorios y las contraseñas deben coincidir."
      );
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
    console.log("Formulario enviado con datos:", formData); // 🛠 Depuración

    if (!validateForm()) return;

    try {
      await AuthService.register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        dni: Number(formData.dni),
        password: formData.password,
        passwordConfirmation: formData.passwordConfirmation, // Incluir passwordConfirmation
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
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
    <form onSubmit={handleSubmit}>
      {/* Aquí van los campos de entrada con los valores correspondientes */}
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
      />
      <input
        type="text"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
      />
      <input
        type="text"
        name="address"
        value={formData.address}
        onChange={handleChange}
      />
      <input
        type="number"
        name="dni"
        value={formData.dni}
        onChange={handleChange}
      />
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
      />
      <input
        type="password"
        name="passwordConfirmation"
        value={formData.passwordConfirmation}
        onChange={handleChange}
      />
      <button type="submit">REGÍSTRATE</button>
    </form>
  );
};

export default Register;
