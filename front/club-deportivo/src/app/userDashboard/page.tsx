"use client";
import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import UserDashboard from "@/components/userDashboard/userDashboard";

export default function UserPage() {
  const { user } = useAuth();

  useEffect(() => {
    console.log("Estado actual de user:", user);
  }, [user]);

  if (!user || !user.userInfo || !user.userInfo.id) {
    console.log("Esperando a que user tenga un ID válido...", user);
    return <p>Cargando usuario...</p>;
  }

  return (
    <div>
      <UserDashboard userId={user.userInfo.id} />{" "}
    </div>
  );
}
