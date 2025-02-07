/* eslint-disable react-hooks/exhaustive-deps */
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
        const route = isAdmin ? "/admin/adminDashboard" : "/userDashboard";
        router.push(route);
    };

    useEffect(() => {
        checkLocalStorage()
    }, [])


    useEffect(() => {
        // Configurar interceptores de solicitud
        const requestInterceptor = axios.interceptors.request.use(
          (config) => {
            const token = localStorage.getItem('token');
            if (token) {
              config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
          },
          (error) => Promise.reject(error)
        );
      
        // Configurar interceptores de respuesta
        const responseInterceptor = axios.interceptors.response.use(
          (response) => response,
          (error) => {
            if (error.response?.status === 401) {
              // Token inválido o expirado
              console.error('Token inválido o expirado');
              
              // Limpiar estado de autenticación
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              localStorage.removeItem('isAdmin');
              
              // Resetear estado de autenticación
              setUser(null);
              setToken(null);
              setIsAuthenticated(false);
              setIsAdmin(false);
              
              // Redirigir al login
              router.push('/login');
            }
            return Promise.reject(error);
          }
        );
      
        // Limpiar interceptores cuando el componente se desmonte
        return () => {
          axios.interceptors.request.eject(requestInterceptor);
          axios.interceptors.response.eject(responseInterceptor);
        };
      }, []); // Array de dependencias vacío para que se ejecute solo una vez

      const login = async (form: ILogin) => {
        try {
            console.log("Iniciando login con:", {
                url: `${process.env.NEXT_PUBLIC_API_URL}/auth/SignIn`,
                datos: form
            });
    
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/SignIn`, form, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            console.log("Respuesta del servidor:", {
                status: response.status,
                data: response.data
            });
    
            // Validaciones más robustas
            if (!response.data || !response.data.token) {
                throw new Error("Respuesta de inicio de sesión inválida: falta token");
            }
    
            const userData = response.data;
            const isAdminValue = userData.userInfo?.isAdmin ?? false;
            
            const userToStore = {
                ...userData,
                isAdmin: isAdminValue
            };
    
            // Actualizar estado
            setUser(userToStore);
            setToken(userData.token);
            setIsAuthenticated(true);
            setIsAdmin(isAdminValue);
    
            // Almacenar en localStorage
            localStorage.setItem("user", JSON.stringify(userToStore));
            localStorage.setItem("token", userData.token);
            localStorage.setItem("isAdmin", isAdminValue.toString());
    
            // Configurar interceptor de Axios con nuevo token
            axios.interceptors.request.use(
                (config) => {
                    config.headers['Authorization'] = `Bearer ${userData.token}`;
                    return config;
                },
                (error) => Promise.reject(error)
            );
    
            console.log("Login exitoso, redirigiendo...", {
                isAdmin: isAdminValue
            });
    
            // Redirigir con pequeño retraso
            setTimeout(() => {
                handleRedirect(isAdminValue);
            }, 100);
    
        } catch (error) {
            // Manejo detallado de errores
            if (axios.isAxiosError(error)) {
                console.error("Error de Axios en login:", {
                    mensaje: error.message,
                    codigo: error.response?.status,
                    datos: error.response?.data,
                    headers: error.response?.headers
                });
    
                // Mensajes de error más específicos
                if (error.response?.status === 401) {
                    throw new Error("Credenciales incorrectas. Por favor, verifica tu email y contraseña.");
                } else if (error.response?.status === 500) {
                    throw new Error("Error del servidor. Por favor, intenta de nuevo más tarde.");
                }
            } else {
                console.error("Error desconocido durante el login:", error);
            }
    
            // Limpiar cualquier dato de autenticación previo
            setUser(null);
            setToken(null);
            setIsAuthenticated(false);
            setIsAdmin(false);
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            localStorage.removeItem("isAdmin");
    
            throw error;
        }
    };
    

    const logout = async () => {
        try {
            if (user && user.id) {
                await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/Log-out/${user.id}`);
            }
            setUser(null);
            setIsAuthenticated(false);
            setIsAdmin(false);
            localStorage.clear();
            emptyCart();
            router.replace("/Home");
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    

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