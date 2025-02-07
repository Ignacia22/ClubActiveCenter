export interface IUser {
  id: string; // Cambiado de number a string porque usas UUID
  name: string;
  email: string;
  password: string; // Aunque no deberías exponer esto en el frontend
  phone: string;
  address?: string;
  dni: number;
  activities: []; // Relación ManyToMany con Activity
  reservations: []; // Relación OneToMany con Reservation
  orders: []; // Relación OneToMany con Order
  userStatus: string; // Tipo enum
  isAdmin: boolean;
  createUser?: Date;
  updateUser?: Date;
}
