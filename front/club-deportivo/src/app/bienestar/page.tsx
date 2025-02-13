import Image from "next/image";

export default function BienestarDeportivo() {
    const caracteristicas = [
      {
        titulo: "Entrenamiento Personalizado",
        descripcion: "Programas adaptados a tus objetivos individuales y nivel de condición física.",
        icono: "🏋️"
      },
      {
        titulo: "Comunidad Activa",
        descripcion: "Únete a una comunidad motivadora que te impulsa a alcanzar tus metas.",
        icono: "👥"
      },
      {
        titulo: "Salud Integral",
        descripcion: "Enfoque holístico que cuida tu bienestar físico, mental y emocional.",
        icono: "❤️"
      }
    ];
  
    return (
      <section className="bg-black text-white py-16 px-8 md:px-16">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Contenido de texto */}
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Bienestar Deportivo
            </h2>
            
            <p className="text-lg text-gray-300 leading-relaxed">
              Descubre una transformación completa a través del deporte. Nuestro programa de bienestar deportivo va más allá del ejercicio físico, creando una experiencia que nutre cuerpo, mente y espíritu.
            </p>
            
            <div className="space-y-4">
              {caracteristicas.map((caracteristica, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <span className="text-3xl">{caracteristica.icono}</span>
                  <div>
                    <h3 className="text-xl font-semibold">{caracteristica.titulo}</h3>
                    <p className="text-gray-400">{caracteristica.descripcion}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex space-x-4">
              <button className="px-8 py-3 bg-white text-black rounded-full font-semibold hover:bg-gray-200 transition-colors">
                Aprender más
              </button>
              <button className="px-8 py-3 border border-white text-white rounded-full font-semibold hover:bg-white hover:text-black transition-colors">
                Contactanos
              </button>
            </div>
          </div>
          
          {/* Imagen y galería */}
          <div className="grid grid-cols-2 gap-6">
            <div className="h-[400px] rounded-lg overflow-hidden">
              <Image 
                src="https://res.cloudinary.com/dqiehommi/image/upload/v1739459476/pexels-john-tekeridis-21837-14843543_berhcf.jpg" 
                alt="Atleta principal" 
                className="w-full h-full object-cover hover:scale-110 transition-transform"
                width={1200}
                height={800}
              />
            </div>
            
            <div className="space-y-6">
              <div className="h-[200px] rounded-lg overflow-hidden">
                <Image 
                  src="https://res.cloudinary.com/dqiehommi/image/upload/v1739459557/pexels-pavel-danilyuk-6339341_xmvazy.jpg" 
                  alt="Entrenamiento en grupo" 
                  className="w-full h-full object-cover hover:scale-110 transition-transform"
                  width={1200}
                  height={800}
                />
              </div>
              <div className="h-[200px] rounded-lg overflow-hidden">
                <Image 
                  src="https://res.cloudinary.com/dqiehommi/image/upload/v1739459722/pexels-pavel-danilyuk-6339356_sivjgc.jpg" 
                  alt="Actividad deportiva" 
                  className="w-full h-full object-cover hover:scale-110 transition-transform"
                  width={1200}
                  height={800}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }