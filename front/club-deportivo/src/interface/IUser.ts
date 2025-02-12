
import { UserStatus } from "@/components/InfoAdmin/UsersTable";

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



