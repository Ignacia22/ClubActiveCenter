/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"


import axios from "axios";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { useCart } from "./CartContext";
import { IUser } from "@/interface/IUser";
import { ILogin } from "@/interface/ILogin";

interface AuthContextType {
    user: IUser | null,
    login: (form: ILogin) => Promise<void>,
    logout: () => Promise<void>,
    isAuthenticated: boolean,
    token: string | null,
    isAdmin: boolean,
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    login: async (form: ILogin) => {},
    logout: async () => {},
    isAuthenticated: false,
    token: null,
    isAdmin: false,
})

export function AuthProvider({children}: {children: React.ReactNode}) {
    const [user, setUser] = useState<IUser | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)
    const router = useRouter();
    const { emptyCart } = useCart();

    const checkLocalStorage = () => {
        try {
            const storedUser = localStorage.getItem("user");
            const storedToken = localStorage.getItem("token");
            const storedIsAdmin = localStorage.getItem("isAdmin");
    
            console.log("Datos en localStorage:", {
                user: storedUser ? JSON.parse(storedUser) : null,
                token: storedToken,
                isAdmin: storedIsAdmin
            });
    
            if (storedUser && storedToken) {
                try {
                    const parsedUser = JSON.parse(storedUser);
    
                    if (parsedUser && typeof parsedUser === 'object') {
                        // Verificamos isAdmin en userInfo si existe
                        const isAdminValue = parsedUser.userInfo?.isAdmin ?? false;
    
                        setUser(parsedUser);
                        setToken(storedToken);
                        setIsAuthenticated(true);
                        setIsAdmin(isAdminValue);
                        
                        console.log("Estado actualizado:", {
                            isAdmin: isAdminValue
                        });
                    } else {
                        resetAuthState();
                    }
                } catch (parseError) {
                    console.error("Error al parsear usuario:", parseError);
                    resetAuthState();
                }
            } else {
                resetAuthState();
            }
        } catch (error) {
            console.error("Error al verificar localStorage:", error);
            resetAuthState();
        }
    };
    
    // Función auxiliar para resetear el estado
    const resetAuthState = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("isAdmin");
        setUser(null);
        setToken(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
    };

    // Función de redirección
    const handleRedirect = (isAdmin: boolean) => {
        console.log(`Redirigiendo a ${isAdmin ? 'admin' : 'user'} dashboard`);
        const route = isAdmin ? "/adminDashboard" : "/userDashboard";
        router.push(route);
    };

    useEffect(() => {
        checkLocalStorage()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    useEffect(() => {
        // Configurar interceptor de Axios para agregar token automáticamente
        const setupAxiosInterceptors = (token: string | null) => {
          // Primero, eliminar cualquier interceptor existente
          const interceptorId = axios.interceptors.request.use(
            (config) => {
              if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
              }
              return config;
            },
            (error) => {
              return Promise.reject(error);
            }
          );
      
          // Devolver el ID del interceptor para poder eliminarlo si es necesario
          return interceptorId;
        };
      
        // Obtener el token del localStorage
        const storedToken = localStorage.getItem('token');
        
        // Configurar interceptores con el token almacenado
        if (storedToken) {
          const interceptorId = setupAxiosInterceptors(storedToken);
      
          // Limpiar el interceptor cuando el componente se desmonte
          return () => {
            axios.interceptors.request.eject(interceptorId);
          };
        }
      }, []); // Array de dependencias vacío para que se ejecute solo una vez al montar el componente

    const login = async (form: ILogin) => {
        try {
            console.log("URL de la petición:", `${process.env.NEXT_PUBLIC_API_URL}/auth/SignIn`);
            console.log("Datos enviados:", form);
    
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/SignIn`, form, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            console.log("Status de la respuesta:", response.status);
            console.log("Datos de la respuesta:", response.data);
    
            if (!response.data || Object.keys(response.data).length === 0) {
                throw new Error("La respuesta del servidor está vacía");
            }
    
            const userData = response.data;
            
            if (userData && typeof userData === 'object') {
                const isAdminValue = userData.userInfo?.isAdmin ?? false;
                
                const userToStore = {
                    ...userData,
                    isAdmin: isAdminValue
                };
    
                console.log("Valor de isAdmin:", isAdminValue);
    
                setUser(userToStore);
                setToken(userData.token);
                setIsAuthenticated(true);
                setIsAdmin(isAdminValue);
    
                localStorage.setItem("user", JSON.stringify(userToStore));
                localStorage.setItem("token", userData.token);
                localStorage.setItem("isAdmin", isAdminValue.toString());
    
                console.log("Datos guardados y estado de usuario:", {
                    isAuthenticated: true,
                    isAdmin: isAdminValue,
                    redirigiendo: isAdminValue ? 'a dashboard admin' : 'a dashboard usuario'
                });
    
                // Usando la función handleRedirect
                setTimeout(() => {
                    handleRedirect(isAdminValue);
                }, 100);
    
            } else {
                throw new Error("Datos de usuario inválidos");
            }
    
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Error de Axios:", {
                    message: error.message,
                    status: error.response?.status,
                    data: error.response?.data
                });
            }
            console.error("Error durante el inicio de sesión:", error);
            throw error;
        }
    };
    

    const logout = async () => {
        setUser(null)
        setIsAuthenticated(false)
        setIsAdmin(false)
        localStorage.removeItem("user")
        localStorage.removeItem("token")
        localStorage.removeItem("isAdmin")
        emptyCart();
        router.replace("/Home")
    }

    

    return (
        <AuthContext.Provider value={{user, login, logout, isAuthenticated, token, isAdmin}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error("useAuth debe ser usado dentro de un AuthProvider")
    }

    return context;
}