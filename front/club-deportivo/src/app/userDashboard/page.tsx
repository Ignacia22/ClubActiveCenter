"use client";
import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import UserDashboard from "@/components/userDashboard/userDashboard";

export default function UserPage() {
  const { user } = useAuth();

  useEffect(() => {
    console.log("user:", user); // Verifica si el usuario está disponible
  }, [user]);

  if (!user) {
    return <p>Cargando usuario...</p>;
  }

  // Renderiza el componente UserDashboard cuando el usuario esté disponible
  return (
    <div>
      <UserDashboard userId={user.id} /> {/* Pasa el userId como prop */}
    </div>
  );
}
