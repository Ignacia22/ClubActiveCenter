export interface IUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  dni: string;
  userStatus: string;
  isAdmin: boolean;
}

export interface IActivity {
  title: string;
  id: string;
  name: string;
  price: number;
  status: boolean;
}

export interface IReservasUser {
  id: string;
  date: string;
  status: boolean;
  price: number;
  user: IUser;
  activities: IActivity[];
}
