export interface Activity {
    id: string;
    title: string;
    description: string;
    date: string;
    hour: string;
    maxPeople: number;
    file?: File;
    img?: string; 
    status?: boolean;
    registeredPeople?: number;
}


// Añade este tipo
export type CreateActivityDto = Omit<Activity, 'id'>;
