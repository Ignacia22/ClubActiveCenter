import { UserStatus } from "@/components/InfoAdmin/UsersTable";

export interface IUser {
  userInfo: {
    id: string; // ID del usuario (UUID)
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
  userStatus: UserStatus; // Tipo enum
  isAdmin: boolean;
  createUser?: Date;
  updateUser?: Date;
}
