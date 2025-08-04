import axios from "axios";

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
    const authToken = sessionStorage.getItem("auth_token"); // or sessionStorage.getItem("token")

    const response = await api.post("/auth-products", data, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error creating authenticated watch:", error);
    throw error.response?.data || error;
  }
};

export default {
  createAuthenticatedWatch,
};
