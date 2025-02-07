// Usuario: para representar la información del usuario
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  dni: number;
  activities: string[];
  reservations: string[]; // Lista de IDs de reservas del usuario
  orders: string[]; // Lista de IDs de órdenes
  userStatus: string;
  isAdmin: boolean;
  createUser?: Date;
  updateUser?: Date;
  payments?: string[]; // Lista de IDs de pagos
  cart?: string[]; // Lista de IDs de productos en el carrito
}

// Espacio: conteniendo el título y el precio por hora
export interface Space {
  id: string;
  title: string;
  img: string[]; // Enlaces a imágenes del espacio
  description: string;
  details: string[]; // Detalles adicionales del espacio
  characteristics: string[]; // Características del espacio
  price_hour: number; // Precio por hora del espacio
  status: boolean; // Estado del espacio (activo o inactivo)
  reservations: string[]; // Lista de IDs de reservas asociadas a este espacio
}

// Reserva: con las relaciones del espacio y el usuario
export interface Reservation {
  id: string;
  date: string; // Fecha de la reserva
  price: number; // Precio de la reserva
  user: Partial<User>; // Datos básicos del usuario
  spaces: Partial<Space>[]; // Datos básicos del espacio
  startTime: string; // Hora de inicio de la reserva
  endTime: string; // Hora de fin de la reserva
  status: "pending" | "confirmed" | "cancelled"; // Estado de la reserva
  payments: string[]; // Lista de IDs de pagos asociados a la reserva
}

// DTO para crear una reserva: datos que el cliente envía al backend
export interface CreateReservationDto {
  space: string; // Cambiado de spaceName a space
  price: string; // Ahora obligatorio porque el backend lo devuelve
  startTime: string;
  endTime: string;
  date: string;
  status: "pending" | "confirmed" | "cancelled"; // Coincide con la respuesta del backend
}
