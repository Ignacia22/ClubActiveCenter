import axios from "axios";
import { IUser } from "../interface/IUser";

const BACK_URL = "http://localhost:3001";

export const getUserById = async (userId: string): Promise<IUser | null> => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("No token found, user might not be logged in.");
    return null;
  }

  try {
    const headers = { Authorization: `Bearer ${token}` };
    const response = await axios.get<IUser>(`${BACK_URL}/user/${userId}`, {
      headers,
    });

    console.log("User data fetched:", response.data); // Log para depuración
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("Error fetching user data:", error.response.data);
    } else {
      console.error("Unexpected error:", error);
    }
    return null;
  }
};
