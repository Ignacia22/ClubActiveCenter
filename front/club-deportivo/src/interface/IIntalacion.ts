export interface Instalacion {
    id: number | string;
    name: string;
    description: string;
    image?: string;
    capacity?: number;
    schedule?: string;
}