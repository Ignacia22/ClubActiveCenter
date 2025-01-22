const Register = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-[url('/assets/Images/pexels-sukh-winder-3740393-5611633.jpg')] bg-cover bg-center">
      <form className="bg-black bg-opacity-80 p-8 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-3xl font-bold mb-6 text-white text-center">
          ¡Se parte de nuestra comunidad!
        </h2>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Nombre:"
            className="w-full px-4 py-2 bg-black text-white border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
            required
          />
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Apellidos:"
            className="w-full px-4 py-2 bg-black text-white border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
            required
          />
        </div>

        <div className="mb-4">
          <input
            type="email"
            placeholder="Correo electrónico:"
            className="w-full px-4 py-2 bg-black text-white border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
            required
          />
        </div>

        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Número de teléfono:"
            className="w-1/2 px-4 py-2 bg-black text-white border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
            required
          />
          <input
            type="date"
            placeholder="Fecha de nacimiento:"
            className="w-1/2 px-4 py-2 bg-black text-white border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
            required
          />
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Dirección:"
            className="w-full px-4 py-2 bg-black text-white border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
            required
          />
        </div>

        <div className="mb-4">
          <input
            type="number"
            placeholder="DNI/Documento:"
            className="w-full px-4 py-2 bg-black text-white border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-white text-black py-2 px-4 rounded hover:bg-gray-200 transition font-bold"
        >
          REGISTRATE
        </button>
      </form>
    </div>
  );
};

export default Register;
