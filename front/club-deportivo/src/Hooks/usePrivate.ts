"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import Swal from "sweetalert2";

export const usePrivate = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const isAuthMemo = useMemo(() => isAuthenticated, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthMemo) {
      Swal.fire({
        icon: "warning",
        title: "¡Atención!",
        text: "Debes loguearte para acceder al carrito.",
        confirmButtonText: "OK",
      }).then(() => {
        router.push("/home");
      });
    }
  }, [isAuthMemo, router]);
};
