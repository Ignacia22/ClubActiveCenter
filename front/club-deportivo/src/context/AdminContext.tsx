/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { createContext, useContext, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { IUser } from '@/interface/IUser';
import { Activity } from '@/interface/IActivity';
import { IProducts } from '@/interface/IProducts';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Definir interfaz para órdenes
interface Order {
  id: string;
  userId: string;
  products: Array<{
    productId: string;
    quantity: number;
  }>;
  total: number;
  status: string;
  createdAt: Date;
}

interface AdminContextType {
  users: IUser[];
  activities: Activity[];
  products: IProducts[];
  loading: boolean;
  error: string | null;

  // Funciones de Usuarios
  getAllUsers: () => Promise<IUser[]>;
  isRetired: (userId: string) => Promise<boolean>;
  isBan: (userId: string) => Promise<boolean>;
  isAdmin: (userId: string) => Promise<boolean>;
  updateUserStatus: (userId: string) => Promise<void>;

  // Funciones de Actividades
  getAllActivities: () => Promise<Activity[]>;
  getActivityById: (id: number) => Promise<Activity>;
  createActivity: (activityData: Omit<Activity, 'id'>) => Promise<void>;
  updateActivityRegistration: (id: number, activityData: Partial<Activity>) => Promise<void>;
  deleteActivity: (id: number) => Promise<void>;
  
  // Funciones de Productos
  getAllProducts: () => Promise<IProducts[]>;
  getProductById: (id: string) => Promise<IProducts>;
  createProduct: (productData: Omit<IProducts, 'id'>) => Promise<void>;
  updateProduct: (id: string, productData: Partial<IProducts>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;

  // Funciones de Órdenes
  getAllOrders: () => Promise<Order[]>;
  getOrderById: (id: string) => Promise<Order>;
  convertCartToOrder: (userId: string) => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<IUser[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [products, setProducts] = useState<IProducts[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Funciones de Usuarios
  const getAllUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      console.log('Token:', token);
  
      console.log('Iniciando solicitud GET a', `${API_URL}/user`);
      const response = await axios.get(`${API_URL}/user`, {
        params: { limit: 1000 },
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log('Respuesta recibida:', response);
  
      const usersList = response.data.users || response.data;
      console.log('Lista de usuarios:', usersList);
  
      setUsers(usersList);
      setLoading(false);
      return usersList;
    } catch (error) {
      setLoading(false);
      console.error('Error en getAllUsers:', error);
      if (axios.isAxiosError(error)) {
        console.error('Detalles del error:', {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers
        });
      }
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const getUserById = async (userId: string) => {
    try {
      const { data } = await axios.get(`${API_URL}/user/${userId}`);
      return data;
    } catch (error) {
      // Verificar si es un error de Axios
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message || error.message || 'Error al obtener usuario';
        throw new Error(errorMessage);
      }
      
      // Manejo de errores genéricos
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Error desconocido al obtener usuario';
      
      throw new Error(errorMessage);
    }
  };

  const updateUserStatus = async (userId: string) => {
    try {
      await axios.put(`${API_URL}/user/${userId}`);
    } catch (error) {
      console.error('Error al actualizar estado del usuario:', error);
      throw error;
    }
  };

  const isRetired = async (userId: string) => {
    try {
      const { data } = await axios.get(`${API_URL}/user/${userId}/isRetired`);
      return data;
    } catch (error) {
      throw new Error('Error al verificar estado de jubilación');
    }
  };

  const isBan = async (userId: string) => {
    try {
      const { data } = await axios.delete(`${API_URL}/auth/${userId}`);
      return data; // Devuelve la respuesta del backend
    } catch (error) {
      console.error('Error al verificar estado de ban:', error);
      return false;
    }
  };

  const isAdmin = async (userId: string) => {
    try {
      const { data } = await axios.get(`${API_URL}/user/${userId}/isAdmin`);
      return data;
    } catch (error) {
      throw new Error('Error al verificar si es administrador');
    }
  };

  // Funciones de Actividades (previous implementation remains the same)
  const getAllActivities = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/activity`);
      setActivities(data);
      return data;
    } catch (error) {
      throw new Error('Error al obtener actividades');
    }
  };

  const getActivityById = async (id: number) => {
    try {
      const { data } = await axios.get(`${API_URL}/activity/${id}`);
      return data;
    } catch (error) {
      throw new Error('Error al obtener actividad');
    }
  };

  const createActivity = async (activityData: Omit<Activity, 'id'>) => {
    try {
      const { data } = await axios.post(`${API_URL}/activity/createActivity`, activityData);
      setActivities(prev => [...prev, data]);
    } catch (error) {
      throw new Error('Error al crear actividad');
    }
  };

  const updateActivityRegistration = async (id: number, activityData: Partial<Activity>) => {
    try {
      const { data } = await axios.put(`${API_URL}/activity/toggle-registration/${id}`, activityData);
      setActivities(prev => prev.map(activity => activity.id === id ? data : activity));
    } catch (error) {
      throw new Error('Error al actualizar actividad');
    }
  };

  const deleteActivity = async (id: number) => {
    try {
      await axios.delete(`${API_URL}/activity/delete-activity/${id}`);
      setActivities(prev => prev.filter(activity => activity.id !== id));
    } catch (error) {
      throw new Error('Error al eliminar actividad');
    }
  };

  // Funciones de Productos (previous implementation remains the same)
  const getAllProducts = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/product`);
      setProducts(data);
      return data;
    } catch (error) {
      throw new Error('Error al obtener productos');
    }
  };

  const getProductById = async (id: string) => {
    try {
      const { data } = await axios.get(`${API_URL}/product/${id}`);
      return data;
    } catch (error) {
      throw new Error('Error al obtener producto');
    }
  };

  const createProduct = async (productData: Omit<IProducts, 'id'>) => {
    try {
      const { data } = await axios.post(`${API_URL}/product`, productData);
      setProducts(prev => [...prev, data]);
    } catch (error) {
      throw new Error('Error al crear producto');
    }
  };

  const updateProduct = async (id: string, productData: Partial<IProducts>) => {
    try {
      const { data } = await axios.put(`${API_URL}/product/${id}`, productData);
      setProducts(prev => prev.map(product => product.id === id ? data : product));
    } catch (error) {
      throw new Error('Error al actualizar producto');
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/product/${id}`);
      setProducts(prev => prev.filter(product => product.id !== id));
    } catch (error) {
      throw new Error('Error al eliminar producto');
    }
  };

  // Funciones de Órdenes
  const getAllOrders = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/order/allOrders`);
      return data;
    } catch (error) {
      throw new Error('Error al obtener órdenes');
    }
  };

  const getOrderById = async (id: string) => {
    try {
      const { data } = await axios.get(`${API_URL}/order/${id}`);
      return data;
    } catch (error) {
      throw new Error('Error al obtener orden');
    }
  };

  const convertCartToOrder = async (userId: string) => {
    try {
      await axios.post(`${API_URL}/order/${userId}/convert-cart`);
    } catch (error) {
      throw new Error('Error al convertir carrito en orden');
    }
  };

  const value = {
    users,
    activities,
    products,
    loading,
    error,
    // Añadir nuevas funciones de usuario
    getAllUsers,
    isRetired,
    isBan,
    isAdmin,
    updateUserStatus,
    // Funciones de Actividades
    getAllActivities,
    getActivityById,
    createActivity,
    updateActivityRegistration,
    deleteActivity,
    // Funciones de Productos
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    // Funciones de Órdenes
    getAllOrders,
    getOrderById,
    convertCartToOrder
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}