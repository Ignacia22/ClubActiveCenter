/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  FaUser,
  FaShoppingCart,
  FaCalendarAlt,
  FaSignOutAlt,
  FaChevronRight,
  FaBasketballBall,
  FaDollarSign,
  FaRss,
} from "react-icons/fa";
import { getUserById, getUserReservations } from "../../service/user";
import { IUser, SubscriptionDetail } from "../../interface/IUser";
import Swal from "sweetalert2";
import { Order, StatusOrder } from "@/interface/Orders";
import { cancelarReserva } from "@/service/cancelarReserva";

import { Activity } from "@/interface/IActivity";

import { deletedUser } from "@/service/deletedUserService";
import { useRouter } from "next/navigation";
import { CancelSub } from "@/service/CancelSubscriptionService";


const menuOptions = [
  { id: "profile", label: "Datos personales", icon: <FaUser /> },
  { id: "activities", label: "Actividades", icon: <FaBasketballBall /> },
  { id: "orders", label: "Productos comprados", icon: <FaShoppingCart /> },
  { id: "reservations", label: "Reservas", icon: <FaCalendarAlt /> },
  { id: "subscriptions", label: "Suscripciones", icon: <FaRss /> },
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
        Swal.fire({
          icon: "error",
          title: "Error al buscar la data",
          text: "Por favor, intenta de nuevo más tarde.",
        });
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

  const handleCancelReservation = (reservationId: string) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Se cancelará esta reserva.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, cancelar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        // Eliminar la reserva cancelada del estado
        const updatedReservations = reservations.filter(
          (reservation) => reservation.id !== reservationId
        );

        // Actualizar el estado de las reservas
        setReservations(updatedReservations);

        // Guardar las reservas actualizadas en el localStorage
        localStorage.setItem(
          "reservations",
          JSON.stringify(updatedReservations)
        );

        // Log para ver las reservas actualizadas
        console.log("Reservas actualizadas:", updatedReservations);

        Swal.fire("Reservación cancelada", "", "success");
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
            <UserReservations
              reservations={reservations}
              onCancel={handleCancelReservation}
            />
          )}
          {selectedOption === "subscriptions" && (
            <UserSubscriptions subscriptions={user.subscriptionsDetails} />
          )}
        </main>
      </div>
    </div>
  );
};

const UserProfile = ({ user }: { user: IUser }) => {
  const route = useRouter()
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-primary">Datos Personales</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <p className="font-medium text-lg">Nombre: {user.name}</p>
        <p className="font-medium text-lg">Email: {user.email}</p>
        <p className="font-medium text-lg">Teléfono: {user.phone}</p>
        <p className="font-medium text-lg">Dirección: {user.address}</p>
      </div>
      <button
        onClick={async () => {
          const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción eliminará permanentemente tu cuenta.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            reverseButtons: true, // Cambia el orden de los botones
          });
        
          // Si el usuario confirma, eliminar la cuenta
          if (result.isConfirmed) {
            try {
              const res: string | undefined = await deletedUser(user.id);
              if (!res) {
                Swal.fire('Lo lamentamos, hubo un error. Vuelva a intentar más tarde.');
                return;
              }
              Swal.fire('Cuenta eliminada', 'Tu cuenta ha sido eliminada correctamente.', 'success');
              route.push('/Login2');
            } catch (error) {
              Swal.fire('Lo lamentamos, hubo un error. Vuelva a intentar más tarde.');
            }
          } else {
            return Swal.fire('Acción cancelada', 'Tu cuenta no fue eliminada.', 'info');
          }
        }
        }
        className="bg-gray-500 text-white px-4 py-2 rounded-md transition-colors duration-300 hover:bg-red-600 disabled:opacity-50"
      >
        Eliminar cuenta
      </button>
    </div>
  )
};

export const UserActivities: React.FC<{ activities: Activity[] }> = ({ activities }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-primary">Actividades</h2>
      {activities.length === 0 ? (
        <p className="text-gray-600">No tienes actividades registradas.</p>
      ) : (
        <ul className="space-y-4">
          {activities.map((activity, index) => (
            <li key={index} className="bg-gray-300 p-4 rounded-lg shadow-md">
              <h3 className="font-bold">{activity.title}</h3>
              <p>Fecha: {new Date(activity.date).toLocaleDateString()}</p>
              <p>Hora: {activity.hour}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

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
  onCancel: (id: string) => void;
}) => {

  const route = useRouter()

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-primary">Mis Reservas</h2>
      {reservations.length === 0 ? (
        <p className="text-gray-600">No tienes reservas actuales.</p>
      ) : (
        <ul className="space-y-4">
          {reservations.map((reservation) => (
            <li
              key={reservation.id}
              className="bg-gray-300 p-4 rounded-lg shadow-md flex justify-between"
            >
              <div>
                <p className="font-semibold">{reservation.date}</p>
                <p>
                  <span className="font-medium">Horario:</span>{" "}
                  {reservation.startTime} - {reservation.endTime}
                </p>
                <p className="font-medium">Precio: ${reservation.price}</p>
                <p
                  className={`font-medium ${
                    reservation.status === "confirmed"
                      ? "text-green-600"
                      : reservation.status === "pending"
                      ? "text-yellow-500"
                      : "text-red-600"
                  }`}
                >
                  Estado: {reservation.status}
                </p>
              </div>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
                onClick={async () => {
                  const result = await Swal.fire({
                    title: '¿Estás seguro?',
                    text: 'Esta acción cancelara tu reserva. No hay reembolso.',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Cancelar reserva',
                    cancelButtonText: 'No cancelar',
                    reverseButtons: true, 
                  });
                  if (result.isConfirmed) {
                    try {
                      const res: string | undefined = await cancelarReserva(reservation.id);
                      if (!res) {
                        Swal.fire('Lo lamentamos, hubo un error. Vuelva a intentar más tarde.');
                        return;
                      }
                      Swal.fire('Reserva cancelada', 'Tu reserva ha sido cancelada correctamente.', 'success');
                      route.push('/home');
                    } catch (error) {
                      Swal.fire('Lo lamentamos, hubo un error. Vuelva a intentar más tarde.');
                    };
                  } else {
                    return Swal.fire('Acción cancelada', 'Tu reserva no fué cancelada.', 'info');
                  };
                }}
                disabled= { reservation.status === "cancelled" || reservation.status === "pending" ? true : false}
              >
                {reservation.status === "cancelled" ? 'Cancelado' :  'Cancelar'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
};

const UserSubscriptions = ({
  subscriptions,
}: {
  subscriptions: SubscriptionDetail[];
}) => {
  const route = useRouter();
  return (
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
            
              <button
              onClick={async () => {
                const result = await Swal.fire({
                  title: '¿Estás seguro?',
                  text: 'Esta acción cancelara tu suscripción. No hay reembolso.',
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonText: 'Cancelar suscripción',
                  cancelButtonText: 'No cancelar',
                  reverseButtons: true, 
                });
                if (result.isConfirmed) {
                  try {
                    const res: string | undefined = await CancelSub(subscription.id);
                    if (!res) {
                      Swal.fire('Lo lamentamos, hubo un error. Vuelva a intentar más tarde.');
                      return;
                    }
                    Swal.fire('Suscripción cancelada', 'Tu suscripción ha sido cancelada correctamente.', 'success');
                    route.push('/home');
                  } catch (error) {
                    Swal.fire('Lo lamentamos, hubo un error. Vuelva a intentar más tarde.');
                  };
                } else {
                  return Swal.fire('Acción cancelada', 'Tu suscripción no fué cancelada.', 'info');
                };
              }
              }
              className="bg-gray-500 text-white px-4 py-2 rounded-md transition-colors duration-300 hover:bg-red-600 disabled:opacity-50"
              >
              Cancelar suscripción
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
};

export default UserDashboard;
