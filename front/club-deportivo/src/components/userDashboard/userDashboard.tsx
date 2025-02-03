import React, { useEffect, useState } from "react";
import {
  FaUser,
  FaCreditCard,
  FaShoppingCart,
  FaCalendarAlt,
  FaSignOutAlt,
  FaChevronRight,
  FaBasketballBall,
} from "react-icons/fa";
import { getUserById } from "../../service/user";
import { IUser } from "../../interface/IUser";
import { IReservasUser } from "../../interface/IReservasUser";
import Swal from "sweetalert2"; // Importar SweetAlert

interface UserDashboardProps {
  userId: string;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ userId }) => {
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return; // Evitar llamadas si no hay userId
      try {
        const userData = await getUserById(userId);
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, [userId]);

  const handleSignOut = () => {
    // Elimina el usuario del localStorage
    localStorage.removeItem("user");

    // Muestra el mensaje de éxito con SweetAlert
    Swal.fire({
      title: "Sesión cerrada",
      text: "Se ha cerrado la sesión con éxito.",
      icon: "success",
      confirmButtonText: "Aceptar",
    }).then(() => {
      // Redirige al home después de la alerta
      window.location.href = "/home";
    });
  };

  if (!user) return <div className="text-white">Cargando...</div>;

  return (
    <div className="min-h-screen bg-black text-white flex justify-center items-start">
      <div className="max-w-7xl w-full flex gap-8 p-8 flex-col lg:flex-row">
        <aside className="w-full lg:w-1/4 bg-white text-black rounded-xl p-6 shadow-md mb-8 lg:mb-0">
          <h2 className="text-2xl font-bold mb-10">Hola, {user.name}</h2>
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
                <FaBasketballBall className="text-lg" />
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
            <li
              className="flex items-center justify-between p-4 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200"
              onClick={handleSignOut} // Llamar la función al hacer clic
            >
              <div className="flex items-center gap-4">
                <FaSignOutAlt className="text-lg" />
                <span className="font-medium">Cerrar sesión</span>
              </div>
              <FaChevronRight className="text-lg" />
            </li>
          </ul>
        </aside>

        <main className="w-full lg:w-3/4 bg-gray-200 text-black rounded-xl p-8 shadow-md">
          <h2 className="text-2xl font-bold mb-8">Reservas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {user.reservations && user.reservations.length > 0 ? (
              user.reservations.map(
                (reservation: IReservasUser, index: number) => (
                  <div
                    key={index}
                    className="flex items-start gap-6 bg-white p-6 rounded-lg shadow"
                  >
                    <div className="w-24 h-24 bg-gray-300 rounded"></div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2">
                        Reserva {index + 1}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Actividad:{" "}
                        {reservation.activities
                          ?.map((activity) => activity.title || "Sin título")
                          .join(", ")}
                      </p>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Fecha: {reservation.date}
                      </p>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Estado:{" "}
                        {reservation.status ? "Confirmada" : "Pendiente"}
                      </p>
                    </div>
                  </div>
                )
              )
            ) : (
              <p className="text-gray-600">No tienes reservas disponibles.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
