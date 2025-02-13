/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation"; 

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const SendUserData = () => {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const [dataSaved, setDataSaved] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return; // Evitar ejecución en el servidor

    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setDataSaved(true); // Si ya hay datos en localStorage, no enviamos de nuevo
      return;
    }

    const sendUserData = async () => {
      if (!user || isLoading || dataSaved) return;

      try {
        const userData = { email: user.email };
        const { data } = await axios.post(`${API_URL}/auth/login`, userData, {
          headers: { "Content-Type": "application/json" },
        });

        if (!data || !data.token) {
          throw new Error("Respuesta de inicio de sesión inválida: falta token");
        }

        const userD = data;
        const isAdmin = userD.userInfo?.isAdmin ?? false;

        const userToStore = {
          ...userD,
          isAdmin,
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

        setDataSaved(true);

        setTimeout(() => {
          const route = isAdmin ? "/admin/adminDashboard" : "/userDashboard";
          router.push(route);
        }, 500);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        if (error.response?.data?.statusCode === 404) {
          router.push("/Formulario");
        } else {
          alert("Hubo un error desconocido: " + error);
        }
      }
    };

    sendUserData();
  }, [user, isLoading, dataSaved]);

  return null;
};

export default SendUserData;