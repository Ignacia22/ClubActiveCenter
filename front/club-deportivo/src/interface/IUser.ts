import { UserStatus } from '@/components/InfoAdmin/UsersTable';

export interface IUser {
  userInfo: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    userStatus: string;
    isAdmin: boolean;
  };
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  address?: string;
  dni: number;
  activities: [];
  reservations: [];
  orders: [];
  userStatus: UserStatus; // Usar el enum aquí
  isAdmin: boolean;
  createUser?: Date;
  updateUser?: Date;
}