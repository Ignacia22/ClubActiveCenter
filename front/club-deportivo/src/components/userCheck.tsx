// components/UserCheck.tsx

"use client";

import Link from "next/link";
import { useUserCheck } from "@/context/UserCheckContext"; // Importa el nuevo hook

export default function UserCheck() {
  const { isAuthenticated, user, logout } = useUserCheck(); // Usando el nuevo hook

  return isAuthenticated ? (
    <div className="flex items-center justify-between gap-4 text-white">
      <p className="text-lg font-light tracking-wide">
        Hola, <span className="text-lg font-medium">{user?.name}</span>
      </p>
      <button
        onClick={() => logout()}
        className="text-lg font-medium text-white hover:text-red-500 transition-colors duration-200"
      >
        LOG OUT
      </button>
    </div>
  ) : (
    <div className="flex gap-4">
      <Link href="/api/auth/login">
        <button className="text-lg font-medium text-gray-600 hover:text-indigo-500 transition-colors duration-200">
          LOGIN
        </button>
      </Link>
      <Link href="/api/auth/signup">
        <button className="text-lg font-medium text-gray-600 hover:text-green-500 transition-colors duration-200">
          SIGNUP
        </button>
      </Link>
    </div>
  );
}
