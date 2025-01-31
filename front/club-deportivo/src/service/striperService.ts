"use client";

import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const createCheckoutSession = async (cartItems) => {
  try {
    const response = await axios.post(`${API_URL}/api/checkout`, {
      items: cartItems,
    });
    return response.data;
  } catch (error) {
    console.error("Error en createCheckoutSession:", error);
    throw error;
  }
};

export const getPaymentStatus = async (sessionId) => {
  try {
    const response = await axios.get(`${API_URL}/api/payment-status`, {
      params: { session_id: sessionId },
    });
    return response.data.status;
  } catch (error) {
    console.error("Error en getPaymentStatus:", error);
    throw error;
  }
};
