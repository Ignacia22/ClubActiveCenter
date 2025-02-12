
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { createContext, useContext, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { IUser } from '@/interface/IUser';
import { Activity } from '@/interface/IActivity';
import { IProducts } from '@/interface/IProducts';
import { UserStatus } from '@/components/InfoAdmin/UsersTable';
import { mapProductData } from '@/utils/mapProductData';
import { getProduct } from '@/helpers/getProduct';

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
  totalPages: number;
  currentPage: number;

  // Funciones de Usuarios
  getAllUsers: () => Promise<IUser[]>;
  deleteUser: (userId: string) => Promise<boolean>;
  isBan: (id: string) => Promise<{
    message: string;
    newStatus: UserStatus;
  }>;
  isAdmin: (userId: string) => Promise<boolean>;

  // Funciones de Actividades
  getAllActivities: () => Promise<Activity[]>;
  getActivityById: (id: string) => Promise<Activity>;
  createActivity: (activityData: Omit<Activity, 'id'>) => Promise<void>;
  updateActivityRegistration: (id: string, activityData: Partial<Activity>) => Promise<void>;
  cancelActivity: (id: string) => Promise<void>;
  
  // Funciones de Productos
  getAllProducts: (page?: number, limit?: number) => Promise<{
    products: IProducts[];
    totalPages: number;
    currentPage: number;
  }>;
  getProductById: (id: string) => Promise<IProducts>;
  createProduct: (productData: Omit<IProducts, 'id'>) => Promise<IProducts>;
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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  

  // Funciones de Usuarios
  const getAllUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/user`, {
        params: { limit: 1000 },
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const usersList = response.data.users || response.data;
      const processedUsersList = usersList.map((user: IUser) => ({
        ...user,
        userStatus: user.userStatus ? UserStatus.ACTIVE : UserStatus.BANNED
      }));
      setUsers(processedUsersList);
      setLoading(false);
      return processedUsersList;
    } catch (error) {
      setLoading(false);
      console.error('Error in getAllUsers:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };
  
  // Modificar isBan para actualizar localStorage
  const isBan = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró token de autenticación');
      }
      const response = await axios.delete(`${API_URL}/auth/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log('Respuesta completa del servidor:', response.data);
  
      // Determinar el nuevo estado basado en el mensaje, no en el newStatus devuelto
      const newStatus = response.data.message.toLowerCase().includes('desbaneado')
        ? UserStatus.ACTIVE
        : UserStatus.BANNED;
  
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === id ? { ...user, userStatus: newStatus } : user
        )
      );
  
      return {
        id: response.data.id || id,
        message: response.data.message,
        newStatus: newStatus
      };
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      throw error;
    }
  };
  
  
  const deleteUser = async (userId: string) => {
    try {
      const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No se encontró token de autenticación');
    }

    const { data } = await axios.delete(`${API_URL}/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    // Obtener usuarios actuales de localStorage
    const storedUsers = localStorage.getItem('usersList');
    let usersList = storedUsers ? JSON.parse(storedUsers) : [];

    // Filtrar el usuario eliminado
    const updatedUsers = usersList.filter((user: IUser) => user.id !== userId);

    // Guardar usuarios actualizados en localStorage
    localStorage.setItem('usersList', JSON.stringify(updatedUsers));

    // Actualizar estado local
    setUsers(updatedUsers);

    return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Error al eliminar usuario';
        console.error('Error detallado al eliminar usuario:', {
          status: error.response?.status,
          data: error.response?.data,
          message: errorMessage
        });
  
        // Manejar errores específicos
        switch (error.response?.status) {
          case 401:
            throw new Error('No autorizado. Verifica tus permisos.');
          case 404:
            throw new Error('Usuario no encontrado.');
          case 403:
            throw new Error('No tienes permiso para eliminar este usuario.');
            default:
            throw new Error(errorMessage);
          }
        }
        
        // Manejar errores que no son de Axios
        throw new Error('Error inesperado al eliminar usuario');
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
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró token de autenticación');
      }
  
      try {
        const response = await axios.get(`${API_URL}/activity`, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
  
        // Log para ver la estructura exacta de la respuesta
        console.log('Estructura de response.data:', {
          type: typeof response.data,
          value: response.data
        });
  
        // Asegurarnos de que estamos manejando correctamente el array de actividades
        let activitiesArray;
        if (Array.isArray(response.data)) {
          activitiesArray = response.data;
        } else if (response.data.activities) {
          activitiesArray = response.data.activities;
        } else if (response.data.data) {
          activitiesArray = response.data.data;
        } else {
          activitiesArray = [];
          console.error('Estructura de datos inesperada:', response.data);
        }
  
        console.log('Array de actividades procesado:', activitiesArray);
  
        // Actualizar el estado solo si tenemos un array válido
        if (Array.isArray(activitiesArray)) {
          setActivities(activitiesArray);
        }
  
        return activitiesArray;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          // Si es un error 404, establece un array vacío
          console.warn('No se encontraron actividades (404)');
          setActivities([]);
          return []; // Devuelve un array vacío
        }
        // Si es otro tipo de error, lo relanza
        throw error;
      }
    } catch (error) {
      console.error('Error completo al obtener actividades:', error);
      if (axios.isAxiosError(error)) {
        console.error('Detalles del error Axios:', {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers,
          message: error.message,
          config: error.config
        });
      }
  
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Error desconocido al obtener actividades';
      
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const getActivityById = async (id: string) => {
    try {
      const { data } = await axios.get(`${API_URL}/activity/${id}`);
      return data;
    } catch (error) {
      throw new Error('Error al obtener actividad');
    }
  };

  const createActivity = async (activityData: Omit<Activity, 'id'>): Promise<void> => {
    try {
      const maxPeopleValue = Number(activityData.maxPeople);
      if (isNaN(maxPeopleValue) || maxPeopleValue <= 0) {
        throw new Error("El número máximo de personas debe ser un valor mayor a 0.");
      }
  
      // Crear un FormData
      const formData = new FormData();
      formData.append('title', activityData.title);
      formData.append('description', activityData.description);
      formData.append('date', activityData.date);
      formData.append('hour', activityData.hour);
      formData.append('maxPeople', String(Number(maxPeopleValue))); // Asegurar que maxPeople es un string numérico
  
      if (activityData.file) {
        formData.append('file', activityData.file);
      }
  
      // Obtener el token desde localStorage (o donde sea que lo estés almacenando)
      const token = localStorage.getItem('token'); // Cambia esto según tu implementación
  
      // Verificar si el token existe
      if (!token) {
        throw new Error('No se encontró un token de autenticación.');
      }
  
      // Enviar la solicitud POST al backend con el token en los encabezados
      const response = await axios.post(`${API_URL}/activity/createActivity`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`, // Agregar el token al encabezado
        }
      });
  
      if (!response) {
        throw new Error(`Error al crear la actividad: ${response}`);
      }
  
      console.log('Actividad creada:', response.data);
      return response.data; // Retornar el resultado de la creación
  
    } catch (error) {
      console.error('Error al crear actividad:', error);
      if (error instanceof Error) {
        console.error('Detalles del error:', error.message);
      }
      throw error;
    }
  };
  


  const updateActivityRegistration = async (id: string, activityData: Partial<Activity>) => {
    try {
      const { data } = await axios.put(`${API_URL}/activity/toggle-registration/${id}`, activityData);
      setActivities(prev => prev.map(activity => activity.id === id ? data : activity));
    } catch (error) {
      throw new Error('Error al actualizar actividad');
    }
  };

  const cancelActivity = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró token de autenticación');
      }

      await axios.delete(`${API_URL}/activity/delete-activity/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      

      // Actualizar el estado local
      setActivities(prevActivities => 
        prevActivities.map(activity => 
          activity.id === id 
            ? { ...activity, status: false }
            : activity
        )
      );

    } catch (error) {
      console.error('Error al cancelar actividad:', error);
      throw error;
    }
};

  // Funciones de Productos 


  const getAllProducts = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      console.log(`Obteniendo productos - página ${page}, límite ${limit}`);
      
      // Realizar la petición con los parámetros de paginación
      const response = await axios.get(`${API_URL}/product`, {
        params: { 
          page,
          limit
        }
      });
  
      console.log('Respuesta del servidor:', response.data);
  
      // Verificar la estructura de la respuesta
      if (!response.data) {
        throw new Error('No hay datos en la respuesta');
      }
  
      let productsData;
      let total;
      
      if (Array.isArray(response.data)) {
        // Si la respuesta es un array directo
        productsData = response.data;
        total = response.data.length;
      } else if (response.data.products && Array.isArray(response.data.products)) {
        // Si la respuesta tiene una estructura con products y metadata
        productsData = response.data.products;
        total = response.data.total || response.data.products.length;
      } else {
        throw new Error('Formato de respuesta inválido');
      }
  
      // Mapear los productos usando el helper existente
      const mappedProducts = productsData.map(mapProductData);
      console.log('Productos mapeados:', mappedProducts);
  
      // Calcular el total de páginas
      const calculatedTotalPages = Math.ceil(total / limit);
  
      // Actualizar el estado
      setProducts(mappedProducts);
      setTotalPages(calculatedTotalPages);
      setCurrentPage(page);
  
      return {
        products: mappedProducts,
        totalPages: calculatedTotalPages,
        currentPage: page
      };
  
    } catch (error) {
      console.error('Error en getAllProducts:', error);
      // Establecer valores por defecto en caso de error
      setProducts([]);
      setTotalPages(1);
      setCurrentPage(1);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getProductById = async (id: string) => {
    try {
      setLoading(true);
      const product = await getProduct(id);
      if (!product) {
        throw new Error('Producto no encontrado');
      }
      return product;
    } catch (error) {
      console.error('Error en getProductById:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData: Omit<IProducts, 'id'>): Promise<IProducts> => {
    try {
      // Validaciones iniciales
      const priceValue = Number(productData.price);
      const stockValue = Number(productData.stock);
  
      if (isNaN(priceValue) || priceValue <= 0) {
        throw new Error("El precio debe ser un valor mayor a 0.");
      }
  
      // Crear un FormData
      const formData = new FormData();
      formData.append('name', productData.name);
      formData.append('description', productData.description);
      formData.append('price', String(priceValue));
      formData.append('stock', String(stockValue));
      formData.append('category', productData.category || '');
  
      if (productData.file) {
        formData.append('file', productData.file);
      }
  
      // Obtener el token desde localStorage
      const token = localStorage.getItem('token');
  
      // Verificar si el token existe
      if (!token) {
        throw new Error('No se encontró un token de autenticación.');
      }
  
      // Enviar la solicitud POST al backend con el token en los encabezados
      const response = await axios.post(`${API_URL}/product/create`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
  
      console.log('Respuesta del backend al crear producto:', response.data);
  
      if (!response.data) {
        throw new Error(`Error al crear el producto: Respuesta vacía`);
      }
  
      // Mapea el producto y lo devuelve
      const newProduct = mapProductData(response.data);
      
      console.log('Producto mapeado:', newProduct);
      
      // Actualizar el estado de productos en el contexto
      setProducts(prevProducts => {
        console.log('Estado anterior de productos:', prevProducts);
        
        const productExists = prevProducts.some(p => p.id === newProduct.id);
        
        if (productExists) {
          console.log('Producto ya existe, no se añade');
          return prevProducts;
        }
        
        const updatedProducts = [...prevProducts, newProduct];
        console.log('Estado actualizado de productos:', updatedProducts);
        
        return updatedProducts;
      });
  
      return newProduct; // Devuelve el producto mapeado
    } catch (error) {
      console.error('Error al crear producto:', error);
      if (error instanceof Error) {
        console.error('Detalles del error:', error.message);
      }
      throw error;
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
    totalPages, 
    currentPage,
    // Añadir nuevas funciones de usuario
    getAllUsers,
    deleteUser,
    isBan,
    isAdmin,
    // Funciones de Actividades
    getAllActivities,
    getActivityById,
    createActivity,
    updateActivityRegistration,
    cancelActivity,
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