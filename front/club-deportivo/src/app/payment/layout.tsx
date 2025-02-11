import Image from "next/image";

export default function PaymentLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Contenedor para la imagen (mitad izquierda) */}
      <div className="w-1/2 relative">
        <Image
          src="https://res.cloudinary.com/dqiehommi/image/upload/v1739136208/pexels-mastercowley-2036998_esjpiv.jpg"
          alt="after-pay"
          fill
          style={{
            objectFit: "cover",
          }}
        />
      </div>
      
      {/* Contenedor para el contenido (mitad derecha) */}
      <main className="w-1/2 p-0">
        {children}
      </main>
    </div>
  );
}