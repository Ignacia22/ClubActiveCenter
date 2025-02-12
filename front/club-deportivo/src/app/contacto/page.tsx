'use client';

import { useState } from 'react';
import Map from '@/components/Map';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí puedes manejar el envío del formulario
    console.log('Form data:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header Section */}
      <div className="bg-black text-white py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Contáctanos</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Estamos aquí para responder tus preguntas y ayudarte a comenzar tu viaje fitness
          </p>
        </div>
      </div>

      {/* Contact Information and Form Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="text-white">
            <h2 className="text-3xl font-bold mb-6">Información de Contacto</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">Dirección</h3>
                <p>Av. Principal #123</p>
                <p>Ciudad de México, CDMX</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Teléfono</h3>
                <p>+52 (55) 1234-5678</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Email</h3>
                <p>info@clubactivecenter.com</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Horario</h3>
                <p>Lunes a Viernes: 6:00 AM - 10:00 PM</p>
                <p>Sábados y Domingos: 8:00 AM - 8:00 PM</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-3xl font-bold mb-6 text-black">Envíanos un mensaje</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nombre completo
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2"
                  required
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Teléfono
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Mensaje
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors duration-300"
              >
                Enviar mensaje
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-6 text-white">Ubicación</h2>
        <div className="h-[400px] rounded-lg overflow-hidden">
          <Map
            center={{ lat: 19.4326, lng: -99.1332 }}
            zoom={15}
            markers={[
              {
                lat: 19.4326,
                lng: -99.1332,
                title: "Club Active Center"
              }
            ]}
          />
        </div>
      </div>
    </div>
  );
}