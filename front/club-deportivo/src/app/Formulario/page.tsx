"use client";
import React, { useState, useEffect } from "react";
import { AuthServices } from "../../service/Auth0service";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";

const FormAuth = () => {
  const router = useRouter();
  const { user } = useUser();
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "+549",
    address: "",
    dni: "",
    password: "",
    passwordConfirmation: "",
  });

  useEffect(() => {
    if (user?.email) {
      setFormData((prev) => ({ ...prev, email: user.email || "" }));
    }
    setLoading(false);
  }, [user]);

  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (Object.values(formData).some((value) => !value)) {
      setError("Todos los campos son obligatorios.");
      return false;
    }
    if (!/^[a-zA-ZÀ-ÿ\s']+$/.test(formData.name)) {
      setError("El nombre solo debe contener letras, espacios o apóstrofes.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Por favor, ingresa un correo electrónico válido.");
      return false;
    }
    if (
      !/^\+?\d{1,4}[-\s]?\(?\d{1,5}\)?[-\s]?\d{4,9}$/.test(formData.phone) ||
      formData.phone.length > 20
    ) {
      setError(
        "El número de teléfono no es válido o excede los 20 caracteres."
      );
      return false;
    }
    if (!/^\d{7,10}$/.test(formData.dni)) {
      setError("El DNI debe tener entre 7 y 10 dígitos.");
      return false;
    }

    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await AuthServices.register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address || " ",
        dni: Number(formData.dni),
        password: formData.password,
        passwordConfirmation: formData.passwordConfirmation,
      });

      if (response?.id) {
        Swal.fire({
          icon: "success",
          title: "Gracias por Completar sus datos",
          text: "¡Bienvenido a nuestra comunidad!",
          confirmButtonText: "Ir a Home",
        }).then(() => {
          router.push("/home");
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
      } else {
        Swal.fire({
          icon: "error",
          title: "Error en el registro",
          text: "Hubo un error vuelve a intentarlo.",
        });
      }
    } catch (error) {
      console.error("❌ Error en el registro:", error);
      Swal.fire({
        icon: "error",
        title: "Error al registrar usuario",
        text: "Por favor, intenta de nuevo más tarde.",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-white text-lg">Cargando...</p>
      </div>
    );
  }

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

        {Object.keys(formData).map((field) => (
          <div className="mb-4" key={field}>
            <input
              type={field.includes("password") ? "password" : "text"}
              name={field}
              placeholder={
                field === "passwordConfirmation"
                  ? "Confirmar contraseña:"
                  : field.charAt(0).toUpperCase() + field.slice(1) + ":"
              }
              value={formData[field as keyof typeof formData]}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-black text-white border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-600 transition font-bold"
        >
          IR A HOME
        </button>
      </form>
    </div>
  );
};

export default FormAuth;
