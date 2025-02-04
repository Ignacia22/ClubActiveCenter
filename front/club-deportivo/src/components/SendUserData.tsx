"use client";

import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import axios from "axios";

const SendUserData = () => {
  const { user } = useAuth0();

  useEffect(() => {
    const sendUserData = async () => {
      if (!user) return;

      try {
        const userData = {
          email: user.email,
        };

        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
          userData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Usuario enviado correctamente");
      } catch (error) {
        console.error("Error al enviar los datos:", error);
      }
    };

    sendUserData();
  }, [user]); // 🔹 Se ejecuta cuando el usuario cambia

  return null; // No renderiza nada
};

export default SendUserData;
