/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect } from "react";
import axios from "axios";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const SendUserData = () => {
  const { user } = useUser();
  const router = useRouter();
  useEffect(() => {
    const sendUserData = async () => {
      if (!user) return;
      try {
        const userData = {
          email: user.email,
        };
        const { data } = await axios.post(`${API_URL}auth/login`, userData, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!data || !data.token) {
          throw new Error(
            "Respuesta de inicio de sesión inválida: falta token"
          );
        }

        const userD = data;
        const isAdmin = userD.userInfo?.isAdmin ?? false;

        const userToStore = {
          ...userD,
          isAdmin: isAdmin,
        };

        localStorage.setItem("user", JSON.stringify(userToStore));
        localStorage.setItem("token", userD.token);
        localStorage.setItem("isAdmin", isAdmin.toString());

        axios.interceptors.request.use(
          (config) => {
            config.headers["Authorization"] = `Bearer ${userD.token}`;
            return config;
          },
          (error) => Promise.reject(error)
        );

        // Redirigir con pequeño retraso

        const route = isAdmin ? "/admin/adminDashboard" : "/userDashboard";
        router.push(route);
      } catch (error: any) {
        if (error.response.data.statusCode === 404) router.push("/Formulario");
        else alert("Hubo un error desconocido " + error);
      }
    };
    sendUserData();
  }, [user]); // 🔹 Se ejecuta cuando el usuario cambia
  return null; // No renderiza nada
};

export default SendUserData;
