import Image from "next/image";

export default function ActivitiesSection() {
    const activities = [
      { name: "Basquetball" },
      { name: "Voley" },
      { name: "Padel" },
      { name: "Tennis" },
      { name: "Futbol" },
      { name: "Natación" },
      { name: "Squash" },
      { name: "Gimnasia" },
    ];
  
    return (
      <div className="relative min-h-screen bg-black text-white py-16">
        {/* Imagen principal */}
        <div className="flex justify-center mt-16 md:w-2/3">
          <Image
            src="/assets/Images/pixelcut-export (2).png"
            alt="Persona con balón"
            width={500}
            height={300}
            className="max-h-[70vh] object-cover"
          />
        </div>


        {/* Título vertical */}
        <div className="absolute top-1/2 -translate-y-1/2 right-6">
          <p className="text-8xl px-6 m-[10rem] mb-[5em] font-bold rotate-90">Actividades</p>
        </div>
  
  
        {/* Tarjetas de actividades */}
        <div className="grid grid-cols-4 gap-6 mt-12 mx-auto max-w-4xl text-black text-center">
          {activities.map((activity, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg hover:bg-slate-400 transition"
            >
              <p>{activity.name}</p>
            </div>
          ))}
        </div>
  
        {/* Botón para ver más */}
        <div className="flex justify-center mt-8">
          <button className="bg-white text-blue-900 px-6 py-2 rounded-full hover:bg-gray-300 transition">
            Ver horarios y más
          </button>
        </div>
      </div>
    );
  }
  