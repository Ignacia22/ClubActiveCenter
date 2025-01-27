import React from "react";
import {
  FaUser,
  FaCreditCard,
  FaShoppingCart,
  FaCalendarAlt,
  FaSignOutAlt,
  FaChevronRight,
  FaBasketballBall,
} from "react-icons/fa";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-black text-white flex justify-center items-start">
      <div className="max-w-7xl w-full flex gap-8 p-8 flex-col lg:flex-row">
        {/* Sidebar Menu */}
        <aside className="w-full lg:w-1/4 bg-white text-black rounded-xl p-6 shadow-md mb-8 lg:mb-0">
          <h2 className="text-2xl font-bold mb-10">Hola, Pedro</h2>
          <ul className="space-y-6">
            <li className="flex items-center justify-between p-4 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200">
              <div className="flex items-center gap-4">
                <FaUser className="text-lg" />
                <span className="font-medium">Datos personales</span>
              </div>
              <FaChevronRight className="text-lg" />
            </li>
            <li className="flex items-center justify-between p-4 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200">
              <div className="flex items-center gap-4">
                <FaBasketballBall className="text-lg" /> {/* Ícono de pelota */}
                <span className="font-medium">Planes contratados</span>
              </div>
              <FaChevronRight className="text-lg" />
            </li>
            <li className="flex items-center justify-between p-4 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200">
              <div className="flex items-center gap-4">
                <FaCreditCard className="text-lg" />
                <span className="font-medium">Métodos de Pago</span>
              </div>
              <FaChevronRight className="text-lg" />
            </li>
            <li className="flex items-center justify-between p-4 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200">
              <div className="flex items-center gap-4">
                <FaShoppingCart className="text-lg" />
                <span className="font-medium">Productos comprados</span>
              </div>
              <FaChevronRight className="text-lg" />
            </li>
            <li className="flex items-center justify-between p-4 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200">
              <div className="flex items-center gap-4">
                <FaCalendarAlt className="text-lg" />
                <span className="font-medium">Reservas</span>
              </div>
              <FaChevronRight className="text-lg" />
            </li>
            <li className="flex items-center justify-between p-4 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200">
              <div className="flex items-center gap-4">
                <FaSignOutAlt className="text-lg" />
                <span className="font-medium">Cerrar sesión</span>
              </div>
              <FaChevronRight className="text-lg" />
            </li>
          </ul>
        </aside>

        <main className="w-full lg:w-3/4 bg-gray-200 text-black rounded-xl p-8 shadow-md">
          <h2 className="text-2xl font-bold mb-8">Productos comprados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(4)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="flex items-start gap-6 bg-white p-6 rounded-lg shadow"
                >
                  <div className="w-24 h-24 bg-gray-300 rounded"></div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2">TITULO</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Etiam eu turpis molestie, dictum est a, mattis tellus.
                    </p>
                    <p className="mt-4 font-bold text-lg">$39.99</p>
                  </div>
                </div>
              ))}
          </div>
          <div className="mt-8 text-center">
            <button className="bg-black text-white rounded-lg px-8 py-3 hover:bg-gray-800">
              Ver más
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
