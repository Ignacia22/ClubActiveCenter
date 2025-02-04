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
        const storedUser = localStorage.getItem("user")
        const storedToken = localStorage.getItem("token")
        const storedIsAdmin = localStorage.getItem("isAdmin")
        if(storedUser && storedToken) {
            const parsedUser = JSON.parse(storedUser) as IUser;
            setUser(parsedUser)
            setToken(storedToken)
            setIsAuthenticated(true)
            setIsAdmin(storedIsAdmin === "true")
        } else {
            setUser(null)
            setToken(null)
            setIsAuthenticated(false)
            setIsAdmin(false)
        }
    }

    useEffect(() => {
        checkLocalStorage()
    }, [])

    const login = async (form: ILogin) => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/login`, form);
            const userData = response.data.user as IUser;
            const tokenData = response.data.token;
            const isAdminData = userData.isAdmin;
            
            setUser(userData)
            setToken(tokenData)
            setIsAuthenticated(true)
            setIsAdmin(isAdminData)
            
            localStorage.setItem("user", JSON.stringify(userData))
            localStorage.setItem("token", tokenData)
            localStorage.setItem("isAdmin", isAdminData.toString())
            
            router.push("/Home")
        } catch (error) {
            console.error("Error durante el inicio de sesión:", error)
            throw error;
        }
    }

    const logout = async () => {
        if (user) {
           localStorage.removeItem("favorites");
        }
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