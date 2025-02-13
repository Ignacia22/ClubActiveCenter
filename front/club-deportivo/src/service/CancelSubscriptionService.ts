import axios from "axios";

export const CancelSub = async (id: string): Promise<string | undefined> => {
    try {
        const token: string | null = localStorage.getItem('token');
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        }; 
        const { data } = await axios.delete(`https://active-center-db-3rfj.onrender.com/subscription/unsubscribe/${id}`, {
            headers
        });
        return data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}