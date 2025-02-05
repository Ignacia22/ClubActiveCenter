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
  const [localUser, setLocalUser] = useState<boolean>(false);
  const { isAdmin } = useAuth();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setLocalUser(!!storedUser);
  }, []);

  const { user, error } = useUser();

  const handleLogout = () => {
    if (localStorage.getItem("user")) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setLocalUser(false);
      router.push("/");
    } else {
      window.location.href = "/api/auth/logout";
    }
  };


  // Simplificamos handleDashboardClick
  const handleDashboardClick = () => {
    const route = isAdmin ? "/adminDashboard" : "/userDashboard";
    router.push(route);
  };

  if (error) return <div className="text-red-500">{error.message}</div>;

  return (
    <div className="relative flex items-center justify-center">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className="p-2 hover:bg-white/10 rounded-full text-white">
            <User className="h-6 w-6 text-white" />
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Content className="absolute right-0 mt-2 w-48 bg-gray-800 text-white rounded-lg shadow-lg border border-gray-700">
          <div className="p-2 flex flex-col gap-2">
            {(user || localUser) ? (
              <>
                <button
                  onClick={handleDashboardClick}
                  className="block w-full text-left px-3 py-2 hover:bg-gray-700 rounded"
                >
                  {isAdmin ? 'Panel de Admin' : 'Mi Perfil'}
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