export interface Activity {
    id: number;
    title: string;
    description: string;
    date: string;
    hour: string;
    maxPeople: number;
    registeredPeople: number;
    status: string;
    imagenUrl?: string;
}


// Añade este tipo
export type CreateActivityDto = Omit<Activity, 'id'>;
