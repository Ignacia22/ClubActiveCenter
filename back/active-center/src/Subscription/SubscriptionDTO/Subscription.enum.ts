import { ApiProperty } from "@nestjs/swagger";
import { Subscription } from "src/Entities/Subscription.entity";

export enum Subscriptions {
    GOLD = 'Gold',
    NULL = 'Null'
}

class UserSub {
    @ApiProperty({ description: 'Identificador único del usuario', example: '123e4567-e89b-12d3-a456-426614174000' })
    id: string;

    @ApiProperty({ description: 'Indica si el usuario está suscrito', example: true })
    isSubscribed: boolean;
}

export class SubscribeResponseDTO {
    @ApiProperty({ description: 'Identificador único de la suscripción', example: 'abc123' })
    id?: string;

    @ApiProperty({ description: 'Fecha de inicio de la suscripción', example: '2024-02-06T00:00:00.000Z' })
    dayInit: Date;

    @ApiProperty({ description: 'Fecha de finalización de la suscripción', example: '2024-05-06T00:00:00.000Z' })
    dayEnd: Date;

    @ApiProperty({ description: 'Precio de la suscripción', example: 29.99 })
    price: number;

    @ApiProperty({ description: 'Estado actual de la suscripción', example: true })
    status?: boolean;

    @ApiProperty({ description: 'Información de la suscripción', type: Subscription })
    subscription?: Subscription;

    @ApiProperty({ description: 'Datos del usuario suscrito', type: UserSub })
    user: UserSub;
}

export class SubscriptionResponseDTO {
    @ApiProperty({ description: 'ID único de la suscripción', example: '550e8400-e29b-41d4-a716-446655440000' })
    id: string;
  
    @ApiProperty({ description: 'Nombre de la suscripción', example: 'Membresía Premium' })
    name: string;
  
    @ApiProperty({ description: 'Descripción de la suscripción', example: 'Acceso ilimitado al gimnasio y la piscina.' })
    description: string;
  
    @ApiProperty({ description: 'Porcentaje de descuento aplicado', example: 20, maximum: 100 })
    percentage: number;
  
    @ApiProperty({ description: 'Lista de beneficios incluidos', example: ['Acceso VIP', 'Entrenador personal', 'Piscina'] })
    benefits: string[];
  
    @ApiProperty({ description: 'Precio de la suscripción', example: 99.99 })
    price: number;
  
    @ApiProperty({ description: 'Duración de la suscripción en días', example: 180, maximum: 365 })
    duration: number;
}