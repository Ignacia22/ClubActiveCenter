import { useEffect, useState } from "react";
import { IUser } from "../interface/IUser";

interface UseUserReturn {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
}

export const useUser = (): UseUserReturn => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/auth/me"); // Endpoint para obtener el usuario autenticado
        if (res.ok) {
          const userData: IUser = await res.json(); // Ajustamos a la interfaz actualizada
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        setError(err as Error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, isAuthenticated, isLoading, error };
};
