"use client";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { User } from "lucide-react";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export function UserMenu() {
  const router = useRouter();
  const [localUser, setLocalUser] = useState<boolean | null>(null);
  const { isAdmin } = useAuth();
  const { user, error } = useUser();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      setLocalUser(!!storedUser);
    }
  }, []);

  // Debugging logs
  useEffect(() => {
    console.log("UserMenu montado");
    console.log("Auth0 User:", user);
    console.log("Local User:", localUser);
    console.log("Error:", error);
    console.log("isAuthenticated:", !!user || localUser);
  }, [user, localUser, error]);

  if (error) return <div className="text-red-500">{error.message}</div>;

  // Evitar renderizado hasta que se determine si hay usuario en localStorage
  if (localUser === null) return null;

  const isAuthenticated = !!user || localUser;

  const handleLogout = () => {
    if (typeof window !== "undefined" && localStorage.getItem("user")) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setLocalUser(false);
      router.push("/");
    } else {
      window.location.href = "/api/auth/logout";
    }
  };

  const handleDashboardClick = () => {
    const userIsAdmin = isAdmin; // usando el valor del contexto
    console.log("Accediendo al dashboard como:", userIsAdmin ? "admin" : "usuario");
    const route = userIsAdmin ? "/admin/adminDashboard" : "/userDashboard";
    router.push(route);
};

  return (
    <div className="relative flex items-center justify-center">
      <DropdownMenu.Root modal={false}>
        <DropdownMenu.Trigger asChild>
          <button className="p-2 hover:bg-white/10 rounded-full text-white">
            <User className="h-6 w-6 text-white" />
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Content className="absolute right-0 mt-2 w-48 bg-gray-800 text-white rounded-lg shadow-lg border border-gray-700">
          <div className="p-2 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <button
                  onClick={handleDashboardClick}
                  className="block w-full text-left px-3 py-2 hover:bg-gray-700 rounded"
                >
                  {isAdmin ? "Panel de Admin" : "Mi Perfil"}
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 hover:text-red-600 rounded transition duration-200"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/Login2"
                  className="block px-3 py-2 hover:bg-gray-700 rounded"
                >
                  Iniciar sesión
                </Link>
                <Link
                  href="/Registro"
                  className="block px-3 py-2 hover:bg-gray-700 rounded"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  );
}
