// IReservas.ts
export interface IReservas {
  spaceName: string;
  price: number;
  startTime: string;
  endTime: string;
  date: string;
  status: string;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  reservations: IReservas[];
}

export interface Reservation extends IReservas {
  id: string; // Asigna un id único para la reserva
  user: IUser; // El objeto del usuario que realizó la reserva
  spaces: string[]; // Lista de espacios reservados (o el tipo correspondiente)
  payments: string[]; // Información sobre los pagos (o el tipo correspondiente)
}
