import axios from "axios";
import { toast } from "sonner";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
    // Remove Content-Type from default headers - let each request set its own
  },
});

// ✅ POST request to store an authenticated watch using session token
const createAuthenticatedWatch = async (data) => {
  try {
    const authToken = localStorage.getItem("accessToken");
    const formData = new FormData();

    // Add all form fields
    Object.keys(data).forEach((key) => {
      const value = data[key];

      if (value instanceof File) {
        // Handle file uploads
        formData.append(key, value);
      } else if (typeof value === "boolean") {
        // Convert boolean to string for Laravel
        formData.append(key, value ? "1" : "0");
      } else if (value !== null && value !== undefined && value !== "") {
        // Handle other form fields
        formData.append(key, value.toString());
      }
    });

    const response = await api.post("/auth-products", formData, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        // Let browser set Content-Type with boundary for multipart/form-data
      },
    });

    toast.success("Authenticated watch saved successfully!");
    return response.data;
  } catch (error) {
    console.error("Error creating authenticated watch:", error);

    const message =
      error.response?.data?.message || "Failed to save authenticated watch.";

    toast.error(message);
    throw error.response?.data || error;
  }
};

// For other API calls that don't involve file uploads, you might want separate functions
const apiCall = async (method, endpoint, data = null) => {
  try {
    const authToken = localStorage.getItem("accessToken");

    const config = {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    };

    let response;
    switch (method.toLowerCase()) {
      case "get":
        response = await api.get(endpoint, config);
        break;
      case "post":
        response = await api.post(endpoint, data, config);
        break;
      case "put":
        response = await api.put(endpoint, data, config);
        break;
      case "delete":
        response = await api.delete(endpoint, config);
        break;
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }

    return response.data;
  } catch (error) {
    console.error(`Error with ${method.toUpperCase()} ${endpoint}:`, error);

    const message =
      error.response?.data?.message || `Failed to ${method} ${endpoint}`;
    toast.error(message);

    throw error.response?.data || error;
  }
};

export default {
  createAuthenticatedWatch,
  apiCall,
  // You can add other specific methods here
  get: (endpoint) => apiCall("get", endpoint),
  post: (endpoint, data) => apiCall("post", endpoint, data),
  put: (endpoint, data) => apiCall("put", endpoint, data),
  delete: (endpoint) => apiCall("delete", endpoint),
};
