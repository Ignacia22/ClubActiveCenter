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
  FaRss,
} from "react-icons/fa";
import { getUserById, getUserReservations } from "../../service/user";
import { IUser, SubscriptionDetail } from "../../interface/IUser";
import Swal from "sweetalert2";
import { Order } from "@/interface/Orders";

const menuOptions = [
  { id: "profile", label: "Datos personales", icon: <FaUser /> },
  { id: "activities", label: "Actividades", icon: <FaBasketballBall /> },
  { id: "orders", label: "Productos comprados", icon: <FaShoppingCart /> },
  { id: "reservations", label: "Reservas", icon: <FaCalendarAlt /> },
  { id: "subscriptions", label: "Suscripciones", icon: <FaRss /> }, // Nueva opción
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
  const [selectedOption, setSelectedOption] = useState<string>("profile");

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
          {selectedOption === "subscriptions" && (
            <UserSubscriptions subscriptions={user.subscriptionsDetails} />
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
    {activities.length === 0 ? (
      <p className="text-gray-600">No tienes actividades registradas.</p>
    ) : (
      <ul className="space-y-4">
        {activities.map((activity, index) => (
          <li key={index} className="bg-gray-300 p-4 rounded-lg shadow-md">
            {activity}
          </li>
        ))}
      </ul>
    )}
  </div>
);

import { StatusOrder } from "@/interface/Orders"; // Asegúrate de importar StatusOrder

const UserOrders = ({ orders }: { orders: Order[] }) => (
  <div>
    <h2 className="text-2xl font-bold mb-6 text-primary">
      Productos Comprados
    </h2>
    {orders.length === 0 ? (
      <p className="text-gray-600">No has realizado ninguna compra aún.</p>
    ) : (
      <ul className="space-y-4">
        {orders.map((order) => (
          <li key={order.id} className="bg-gray-300 p-4 rounded-lg shadow-md">
            <p className="font-semibold">Orden ID: {order.id}</p>
            <p className="flex items-center gap-2">
              <FaCalendarAlt /> <span>Fecha: {order.date}</span>
            </p>
            <p className="flex items-center gap-2">
              <FaDollarSign /> <span>Total: ${order.totalPrice}</span>
            </p>
            <p
              className={`font-medium ${
                order.status === StatusOrder.complete
                  ? "text-green-600"
                  : order.status === StatusOrder.pending
                  ? "text-yellow-500"
                  : "text-red-600"
              }`}
            >
              Estado:{" "}
              {order.status === StatusOrder.complete
                ? "Completada"
                : order.status === StatusOrder.pending
                ? "Pendiente"
                : "Cancelada"}
            </p>
            <h3 className="mt-4 font-semibold">Productos:</h3>
            <ul className="mt-2 space-y-2">
              {order.orderItems.map((item) => (
                <li key={item.id} className="bg-gray-200 p-3 rounded-lg">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-700">{item.description}</p>
                  <p>
                    <span className="font-semibold">Precio:</span> ${item.price}{" "}
                    x {item.quantity}
                  </p>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    )}
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
    {reservations.length === 0 ? (
      <p className="text-gray-600">No tienes reservas realizadas.</p>
    ) : (
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
    )}
  </div>
);

const UserSubscriptions = ({
  subscriptions,
}: {
  subscriptions: SubscriptionDetail[];
}) => (
  <div>
    <h2 className="text-2xl font-bold mb-6 text-primary">Suscripciones</h2>
    {subscriptions.length === 0 ? (
      <p className="text-gray-600">No tienes suscripciones activas.</p>
    ) : (
      <ul className="space-y-4">
        {subscriptions.map((subscription) => (
          <li
            key={subscription.id}
            className="bg-gray-300 p-4 rounded-lg shadow-md"
          >
            <p className="font-semibold">Plan: Gold</p>
            <p className="text-sm">
              Fecha de inicio:{" "}
              {new Date(subscription.dayInit).toLocaleDateString()}
            </p>

            <p className="text-sm">
              Fecha de vencimiento:{" "}
              {new Date(subscription.dayEnd).toLocaleDateString()}
            </p>

            <p className="text-sm">Precio: {subscription.price}</p>
            <p className="text-sm">
              Estado: {subscription.status ? "Activo" : "Inactivo"}
            </p>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default UserDashboard;
