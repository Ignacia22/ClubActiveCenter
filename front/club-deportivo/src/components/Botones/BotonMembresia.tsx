import Link from "next/link";

export default function BotonMembresia() {
    return (
        <Link href={"/planes"}>
      <button 
      className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400">
        Reservar
      </button>
      </Link>
    );
}
  
