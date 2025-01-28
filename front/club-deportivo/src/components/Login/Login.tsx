import React from "react";

const Login = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-[url('https://res.cloudinary.com/dqiehommi/image/upload/v1737912176/pexels-sukh-winder-3740393-5611633_y1bx8n.jpg')] bg-cover bg-center">
      <form className="bg-black bg-opacity-80 p-8 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-3xl font-bold mb-6 text-white text-center">
          ¡ Bienvenido !
        </h2>

        <div className="mb-4">
          <input
            type="email"
            placeholder="Correo electrónico:"
            className="w-full px-4 py-2 bg-black text-white border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
            required
          />
        </div>

        <div className="mb-4">
          <input
            type="password"
            placeholder="Contraseña:"
            className="w-full px-4 py-2 bg-black text-white border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-700 transition font-bold"
        >
          LOGIN
        </button>
      </form>
    </div>
  );
};

export default Login;
