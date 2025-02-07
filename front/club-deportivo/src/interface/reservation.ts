// Usuario: para representar la información básica del usuario
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
  id?: string; // ID de la reserva (esto es lo que falta en tu DTO)
  user?: Partial<User>; // Información del usuario (debería venir del backend o contexto)
  spaces?: Partial<Space>[]; // Espacios reservados (deberían ser referencias a objetos Space)
  startTime: string;
  endTime: string;
  date: string;
  price: number; // Precio total de la reserva
  status: string; // Estado de la reserva
  payments?: string[]; // Opcional: IDs de pagos asociados
}

// DTO para crear una reserva: datos que el cliente envía al backend
export interface CreateReservationDto {
  space: string; // ID del espacio (en lugar de nombre)
  price: string; // Precio
  startTime: string;
  endTime: string;
  date: string;
  status: "pending" | "confirmed" | "cancelled"; // El estado de la reserva
}
