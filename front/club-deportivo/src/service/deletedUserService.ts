import axios from "axios";

export const deletedUser = async (id: string): Promise<string | undefined> => {
    try {
        const token: string | null = localStorage.getItem('token');
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        }; 
        const { data } = await axios.delete(`https://active-center-db-3rfj.onrender.com/user/${id}`, {
            headers,
        });

        localStorage.removeItem('user')
        localStorage.removeItem('isAdmin')
        localStorage.removeItem('token')
        localStorage.removeItem('reservations')

        return !data.length ? undefined : data;
    } catch (error) {
        console.log(error);
    }
    
}