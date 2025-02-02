"use client";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { User } from "lucide-react";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";

export function UserMenu() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div className="text-white">Cargando...</div>;
  if (error) return <div className="text-red-500">{error.message}</div>;

  const handleLogout = () => {
    window.location.href = "/api/auth/logout";
  };

  return (
    <div className="relative flex items-center justify-center">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className="p-2 bg-blue-600 rounded-full transition hover:bg-blue-700">
            <User className="h-6 w-6 text-white" />
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Content className="absolute right-0 mt-2 w-48 bg-gray-800 text-white rounded-lg shadow-lg border border-gray-700">
          <div className="p-2 flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  href="/userDashboard"
                  className="block px-3 py-2 hover:bg-gray-700 rounded"
                >
                  Perfil
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 hover:bg-gray-700 rounded"
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
                  href="/registro"
                  className="block px-3 py-2 hover:bg-gray-700 rounded"
                >
                  Registrarse
                </Link>
                <Link
                  href="/home "
                  className="block px-3 py-2 hover:bg-gray-700 rounded"
                >
                  Cerrar sesion
                </Link>
              </>
            )}
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  );
}
