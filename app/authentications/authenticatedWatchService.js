import axios from "axios";
import { toast } from "sonner";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ✅ POST request to store an authenticated watch using session token
const createAuthenticatedWatch = async (data) => {
  try {
    console.log(data);
    const authToken = localStorage.getItem("accessToken");

    const response = await api.post("/auth-products", data, {
      headers: {
        Authorization: `Bearer ${authToken}`,
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

export default {
  createAuthenticatedWatch,
};
