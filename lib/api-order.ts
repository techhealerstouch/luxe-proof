import axios from "axios";

// TypeScript Interfaces
interface User {
  id: number;
  xendit_customer_id: string | null;
  account_id: number;
  role: string;
  status: string;
  name: string;
  email: string;
  phone_number: string | null;
  timezone: string;
  email_verified_at: string | null;
  service: string | null;
  created_at: string;
  updated_at: string;
}

interface AddedBy {
  id: number;
  name: string;
}

interface Shipment {
  id: number;
  credit_invoice_id: number;
  shipment_number: string;
  tracking_number: string | null;
  courier: string | null;
  full_name: string;
  phone_number: string;
  street: string;
  barangay: string;
  city: string;
  province: string;
  postal_code: string;
  country: string;
  shipment_date: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

interface Order {
  id: number;
  invoice_number: string;
  shipping_cost: string;
  discount: string;
  credit_name: string;
  added_by: AddedBy;
  credits_id: number;
  user_id: number;
  payment_url: string;
  amount: string;
  external_id: string;
  quantity: number;
  status: string;
  created_at: string;
  updated_at: string;
  shipment: Shipment;
  user: User;
}

interface PaginationData {
  current_page: number;
  data: Order[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: any[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: PaginationData;
}

// Get access token from localStorage
const getAccessToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken");
  }
  return null;
};

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API Functions

/**
 * Get paginated orders
 * @param page - Page number (default: 1)
 * @param perPage - Number of items per page (default: 10)
 * @returns Promise with API response
 */
export const getOrders = async (
  page: number = 1,
  perPage: number = 10
): Promise<ApiResponse> => {
  const response = await apiClient.get<ApiResponse>(
    `/api/orders?page=${page}&per_page=${perPage}`
  );
  return response.data;
};

// Export types for use in components
export type { Order, User, AddedBy, Shipment, ApiResponse, PaginationData };
