"use client"

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

// Definimos la interfaz AdminRouteProps
interface AdminRouteProps {
    children: ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
    const { isAdmin } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAdmin) {
            router.push("/userDashboard");
        }
    }, [isAdmin, router]);

    console.log("AdminRoute - isAdmin:", isAdmin); // Para debugging

    if (!isAdmin) {
        return null;
    }

    return <>{children}</>;
};