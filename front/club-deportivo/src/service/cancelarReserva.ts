import axios from "axios";
import Swal from "sweetalert2";

export const cancelarReserva = async (id: string) => {
  try {
    const token: string | null = localStorage.getItem("token");
    console.log(token);
    
    if(!token) Swal.fire('No estas autentificado por favor vuelve a loguearte.');
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    const { data } = await axios.delete(`https://active-center-db-3rfj.onrender.com/reservation/${id}`,
      {
        headers
      }
    );
    console.log('esto es la data', data);
    
    return data;
  } catch (error) {
    console.log(error);
  }
  
};
