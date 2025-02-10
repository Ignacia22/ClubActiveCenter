export default function SuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-100">
      <h1 className="text-3xl font-bold text-green-700">¡Pago Exitoso! 🎉</h1>
      <p className="mt-2 text-gray-700">Tu reserva ha sido confirmada.</p>
      <a
        href="/Reservas"
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md"
      >
        Volver a Reservas
      </a>
    </div>
  );
}
