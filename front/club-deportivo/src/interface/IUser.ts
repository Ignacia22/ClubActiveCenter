export interface Subscription {
  id: string; // ID de la suscripción
  name: string; // Nombre de la suscripción
  description: string; // Descripción de la suscripción
  percentage: number; // Porcentaje de descuento (si aplica)
  benefits: string[]; // Beneficios de la suscripción
  price: number; // Precio de la suscripción
  duration: number; // Duración en días
  subscriptionsDetails: SubscriptionDetail[]; // Detalles de la suscripción
}

export interface SubscriptionDetail {
  id: string; // ID del detalle de la suscripción
  dayInit: Date; // Fecha de inicio
  dayEnd: Date; // Fecha de fin
  price: number; // Precio de la suscripción en este período
  status: boolean; // Estado (activo o inactivo)
  subscription: Subscription; // Relación con la suscripción
  duration: number; // Duración de este detalle (en días)
  user?: IUser; // Relación con el usuario (opcional)
}

export interface IUser {
  userInfo: {
    id: string; // ID del usuario
    name: string; // Nombre del usuario
    email: string; // Correo electrónico
    phone: string; // Teléfono
    address: string; // Dirección
    userStatus: string; // Estado del usuario
    isAdmin: boolean; // Si el usuario es admin
  };
  id: string; // ID global del usuario
  name: string;
  email: string;
  password: string; // Aunque no deberías exponerlo en el frontend
  phone: string;
  address?: string;
  dni: number; // DNI del usuario
  activities: []; // Relación ManyToMany con Activity
  reservations: []; // Relación OneToMany con Reservation
  orders: []; // Relación OneToMany con Order
  userStatus: string; // Tipo enum
  isAdmin: boolean;
  subscriptionsDetails: SubscriptionDetail[]; // Relación con los detalles de las suscripciones
  createUser?: Date;
  updateUser?: Date;
}
