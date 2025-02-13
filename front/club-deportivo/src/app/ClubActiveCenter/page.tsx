import React from 'react';
import { 
  FaDumbbell, 
  FaTrophy, 
  FaRunning, 
  FaHeartbeat, 
  FaUsers, 
  FaCalendarAlt 
} from 'react-icons/fa';

export default function ClubActiveCenterPage() {
  const featuredActivities = [
    {
      icon: <FaRunning />,
      title: "Entrenamiento Funcional",
      description: "Desarrolla fuerza, resistencia y agilidad con nuestros entrenamientos de alta intensidad."
    },
    {
      icon: <FaTrophy />,
      title: "Competiciones Especiales",
      description: "Desafíos mensuales que te motivarán a superar tus límites y alcanzar nuevas metas."
    },
    {
      icon: <FaHeartbeat />,
      title: "Salud y Bienestar",
      description: "Programas integrales diseñados para mejorar tu condición física y mental."
    }
  ];

  const trainingPrograms = [
    {
      title: "Acondicionamiento Físico",
      level: "Todos los niveles",
      intensity: "Medio-Alto",
      schedule: "Lunes, Miércoles y Viernes"
    },
    {
      title: "Entrenamiento de Fuerza",
      level: "Intermedio-Avanzado",
      intensity: "Alto",
      schedule: "Martes y Jueves"
    },
    {
      title: "Recuperación y Flexibilidad",
      level: "Todos los niveles",
      intensity: "Bajo",
      schedule: "Sábados"
    }
  ];

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center opacity-50" 
          style={{
            backgroundImage: 'url("https://res.cloudinary.com/dqiehommi/image/upload/v1739462617/pexels-leonardho-1552249_zwo56i.jpg")'
          }}
        />
        
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Club Active Center</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-10 font-sans">
            Transforma tu cuerpo, desafía tus límites y alcanza tu máximo potencial 
            con nuestros programas de entrenamiento de élite.
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition duration-300">
            Únete Ahora
          </button>
        </div>
      </section>

      {/* Featured Activities */}
      <section className="py-20 bg-slate-950">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Nuestras Actividades Destacadas</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {featuredActivities.map((activity, index) => (
              <div 
                key={index} 
                className="bg-gray-800 p-8 rounded-lg text-center transform transition hover:scale-105"
              >
                <div className="text-6xl text-white mb-6 flex justify-center">
                  {activity.icon}
                </div>
                <h3 className="text-2xl font-semibold mb-4">{activity.title}</h3>
                <p className="text-gray-300">{activity.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Training Programs */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Programas de Entrenamiento</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {trainingPrograms.map((program, index) => (
              <div 
                key={index} 
                className="bg-gray-800 p-8 rounded-lg transform transition hover:scale-105"
              >
                <h3 className="text-2xl font-semibold mb-4">{program.title}</h3>
                <div className="space-y-3 text-gray-300">
                  <p><strong>Nivel:</strong> {program.level}</p>
                  <p><strong>Intensidad:</strong> {program.intensity}</p>
                  <p><strong>Horario:</strong> {program.schedule}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community and Membership */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-12">Únete a Nuestra Comunidad</h2>
          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
            <div>
              <FaUsers className="text-6xl text-blue-500 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold mb-4">Comunidad Activa</h3>
              <p>Conéctate con personas que comparten tu pasión por el fitness.</p>
            </div>
            <div>
              <FaCalendarAlt className="text-6xl text-blue-500 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold mb-4">Eventos Especiales</h3>
              <p>Competiciones, talleres y actividades exclusivas para miembros.</p>
            </div>
            <div>
              <FaDumbbell className="text-6xl text-blue-500 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold mb-4">Instalaciones de Élite</h3>
              <p>Equipamiento de última generación para tu entrenamiento.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Comienza Tu Transformación Hoy</h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto">
            No esperes más para convertirte en la mejor versión de ti mismo. 
            Únete a Club Active Center y marca la diferencia.
          </p>
          <button className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-full transition duration-300">
            Reserva Tu Clase Gratis
          </button>
        </div>
      </section>
    </div>
  );
}