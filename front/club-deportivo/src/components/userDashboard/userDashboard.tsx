import React, { useEffect, useState } from "react";
import {
  FaUser,
  FaShoppingCart,
  FaCalendarAlt,
  FaSignOutAlt,
  FaChevronRight,
  FaBasketballBall,
  FaClock,
  FaDollarSign,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import { getUserById, getUserReservations } from "../../service/user";
import { IUser } from "../../interface/IUser";
import Swal from "sweetalert2";

const menuOptions = [
  { id: "profile", label: "Datos personales", icon: <FaUser /> },
  { id: "activities", label: "Actividades", icon: <FaBasketballBall /> },
  { id: "orders", label: "Productos comprados", icon: <FaShoppingCart /> },
  { id: "reservations", label: "Reservas", icon: <FaCalendarAlt /> },
];

interface UserDashboardProps {
  userId: string;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ userId }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [reservations, setReservations] = useState<
    {
      id: string;
      date: string;
      startTime: string;
      endTime: string;
      price: string;
      status: string;
    }[]
  >([]);
  const [selectedOption, setSelectedOption] = useState<string>("reservations");

  useEffect(() => {
    const fetchUserAndReservations = async () => {
      if (!userId) return;
      try {
        const userData = await getUserById(userId);
        setUser(userData);

        const reservationsData = await getUserReservations(userId);
        setReservations(reservationsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchUserAndReservations();
  }, [userId]);

  const handleSignOut = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Se cerrará tu sesión y perderás el acceso.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("user");
        Swal.fire(
          "Sesión cerrada",
          "Has cerrado sesión con éxito.",
          "success"
        ).then(() => {
          window.location.href = "/home";
        });
      }
    });
  };

  if (!user)
    return <div className="text-white text-center mt-10">Cargando...</div>;

  return (
    <div className="min-h-screen bg-black text-white flex justify-center items-start p-8">
      <div className="max-w-7xl w-full flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-1/4 bg-white text-black rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-8">Hola, {user.name}</h2>
          <ul className="space-y-4">
            {menuOptions.map(({ id, label, icon }) => (
              <li
                key={id}
                className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition ${
                  selectedOption === id
                    ? "bg-gray-300 font-semibold"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
                onClick={() => setSelectedOption(id)}
              >
                <div className="flex items-center gap-3">
                  {icon} <span>{label}</span>
                </div>
                <FaChevronRight />
              </li>
            ))}
            <li
              className="flex items-center justify-between p-4 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200"
              onClick={handleSignOut}
            >
              <div className="flex items-center gap-3">
                <FaSignOutAlt /> <span>Cerrar sesión</span>
              </div>
              <FaChevronRight />
            </li>
          </ul>
        </aside>

        {/* Contenido Principal */}
        <main className="w-full lg:w-3/4 bg-gray-200 text-black rounded-xl p-8 shadow-md">
          {selectedOption === "profile" && <UserProfile user={user} />}
          {selectedOption === "activities" && (
            <UserActivities activities={user.activities} />
          )}
          {selectedOption === "orders" && <UserOrders orders={user.orders} />}
          {selectedOption === "reservations" && (
            <UserReservations reservations={reservations} />
          )}
        </main>
      </div>
    </div>
  );
};

const UserProfile = ({ user }: { user: IUser }) => (
  <div>
    <h2 className="text-2xl font-bold mb-6 text-primary">Datos Personales</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <p className="font-medium text-lg">Nombre: {user.name}</p>
      <p className="font-medium text-lg">Email: {user.email}</p>
      <p className="font-medium text-lg">Teléfono: {user.phone}</p>
      <p className="font-medium text-lg">Dirección: {user.address}</p>
    </div>
  </div>
);

const UserActivities = ({ activities }: { activities: string[] }) => (
  <div>
    <h2 className="text-2xl font-bold mb-6 text-primary">Actividades</h2>
    <ul className="space-y-4">
      {activities.map((activity, index) => (
        <li key={index} className="bg-gray-300 p-4 rounded-lg shadow-md">
          {activity}
        </li>
      ))}
    </ul>
  </div>
);

const UserOrders = ({ orders }: { orders: string[] }) => (
  <div>
    <h2 className="text-2xl font-bold mb-6 text-primary">
      Productos Comprados
    </h2>
    <ul className="space-y-4">
      {orders.map((order, index) => (
        <li key={index} className="bg-gray-300 p-4 rounded-lg shadow-md">
          {order}
        </li>
      ))}
    </ul>
  </div>
);

const UserReservations = ({
  reservations,
}: {
  reservations: {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    price: string;
    status: string;
  }[];
}) => (
  <div>
    <h2 className="text-2xl font-bold mb-6 text-primary">Reservas</h2>
    <ul className="space-y-4">
      {reservations.map((reservation) => (
        <li
          key={reservation.id}
          className="bg-gray-300 p-4 rounded-lg shadow-md"
        >
          <p className="flex items-center gap-2">
            <FaCalendarAlt /> <span>Fecha: {reservation.date}</span>
          </p>
          <p className="flex items-center gap-2">
            <FaClock />{" "}
            <span>
              Horario: {reservation.startTime} - {reservation.endTime}
            </span>
          </p>
          <p className="flex items-center gap-2">
            <FaDollarSign /> <span>Precio: ${reservation.price}</span>
          </p>
          <p
            className={`flex items-center gap-2 ${
              reservation.status === "confirmed"
                ? "text-green-600"
                : "text-yellow-500"
            }`}
          >
            {reservation.status === "confirmed" ? (
              <FaCheckCircle />
            ) : (
              <FaExclamationTriangle />
            )}
            {reservation.status === "confirmed" ? "Confirmada" : "Pendiente"}
          </p>
        </li>
      ))}
    </ul>
  </div>
);

export default UserDashboard;
