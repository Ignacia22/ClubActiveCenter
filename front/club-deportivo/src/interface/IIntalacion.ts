export interface Instalacion {
    id: number | string;
    title: string;
    description: string;
    characteristics: string[]; 
    image?: string[];
    status: boolean;
    price: number;
}



