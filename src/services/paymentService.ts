// src/services/paymentApi.ts
import api from "./api"; // Import your configured axios instance

export const createOrder = async (amount: number) => {
  try {
    // This now automatically gets the Bearer token from your interceptor!
    const res = await api.post("/create-order", { amount });
    return res.data;
  } catch (error: any) {
    console.error("Order Creation Failed:", error.response?.data);
    throw error;
  }
};

export const verifyPayment = async (payload: any) => {
  try {
    // This also sends the token automatically
    const res = await api.post("/verify-payment", payload);
    return res.data;
  } catch (error: any) {
    console.error("Payment Verification Failed:", error.response?.data);
    throw error;
  }
};
