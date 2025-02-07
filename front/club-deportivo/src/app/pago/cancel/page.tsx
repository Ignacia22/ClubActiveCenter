export default function CancelPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-100">
      <h1 className="text-3xl font-bold text-red-700">Pago Cancelado ❌</h1>
      <p className="mt-2 text-gray-700">No se ha procesado tu reserva.</p>
      <a
        href="/Reservas"
        className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md"
      >
        Volver a Reservas
      </a>
    </div>
  );
}
