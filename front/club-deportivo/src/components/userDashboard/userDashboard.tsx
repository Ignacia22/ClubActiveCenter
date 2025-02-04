import React, { useEffect, useState } from "react";
import {
  FaUser,
  FaShoppingCart,
  FaCalendarAlt,
  FaSignOutAlt,
  FaChevronRight,
  FaBasketballBall,
} from "react-icons/fa";
import { getUserById } from "../../service/user";
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
  const [selectedOption, setSelectedOption] = useState<string>("reservations");

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
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
    localStorage.removeItem("user");
    Swal.fire({
      title: "Sesión cerrada",
      text: "Se ha cerrado la sesión con éxito.",
      icon: "success",
      confirmButtonText: "Aceptar",
    }).then(() => {
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
            {menuOptions.map(({ id, label, icon }) => (
              <li
                key={id}
                className={`flex items-center justify-between p-4 rounded-lg cursor-pointer hover:bg-gray-200 transition ${
                  selectedOption === id ? "bg-gray-300" : "bg-gray-100"
                }`}
                onClick={() => setSelectedOption(id)}
              >
                <div className="flex items-center gap-4">
                  {icon}
                  <span className="font-medium">{label}</span>
                </div>
                <FaChevronRight className="text-lg" />
              </li>
            ))}
            <li
              className="flex items-center justify-between p-4 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200"
              onClick={handleSignOut}
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
          {selectedOption === "profile" && <UserProfile user={user} />}
          {selectedOption === "activities" && (
            <UserActivities activities={user.activities} />
          )}
          {selectedOption === "orders" && <UserOrders orders={user.orders} />}
          {selectedOption === "reservations" && (
            <UserReservations reservations={user.reservations} />
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
    {activities.length > 0 ? (
      <ul className="space-y-4">
        {activities.map((activity, index) => (
          <li key={index} className="bg-gray-300 p-4 rounded-lg shadow-md">
            <p>{activity}</p>
          </li>
        ))}
      </ul>
    ) : (
      <p>No tienes actividades registradas.</p>
    )}
  </div>
);

const UserOrders = ({ orders }: { orders: string[] }) => (
  <div>
    <h2 className="text-2xl font-bold mb-6 text-primary">
      Productos Comprados
    </h2>
    {orders.length > 0 ? (
      <ul className="space-y-4">
        {orders.map((order, index) => (
          <li key={index} className="bg-gray-300 p-4 rounded-lg shadow-md">
            <p>{order}</p>
          </li>
        ))}
      </ul>
    ) : (
      <p>No tienes productos comprados.</p>
    )}
  </div>
);

const UserReservations = ({
  reservations,
}: {
  reservations: { date: string; status: boolean }[];
}) => (
  <div>
    <h2 className="text-2xl font-bold mb-6 text-primary">Reservas</h2>
    {reservations.length > 0 ? (
      <ul className="space-y-4">
        {reservations.map((reservation, index) => (
          <li key={index} className="bg-gray-300 p-4 rounded-lg shadow-md">
            <p>
              Fecha: {reservation.date} - Estado:{" "}
              {reservation.status ? "Confirmada" : "Pendiente"}
            </p>
          </li>
        ))}
      </ul>
    ) : (
      <p>No tienes reservas disponibles.</p>
    )}
  </div>
);

export default UserDashboard;
