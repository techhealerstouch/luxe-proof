import axios from "axios";
import { toast } from "sonner";
import type { CreditInvoice, Subscription } from "@/types/billing/billing";

// Common headers for API requests
const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  Accept: "application/json",
  "Content-Type": "application/json",
});

// Base API URL
const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export const fetchCreditsInvoices = async (): Promise<CreditInvoice[]> => {
  try {
    const { data } = await axios.get(
      `${API_BASE}/api/authenticator/credits/invoices`,
      { headers: getAuthHeaders() }
    );
    return data.success ? data.data || [] : [];
  } catch (error) {
    console.error("Failed to fetch credits invoices:", error);
    return [];
  }
};

export const fetchSubscriptions = async (): Promise<Subscription[]> => {
  try {
    const { data } = await axios.get(`${API_BASE}/api/subscriptions`, {
      headers: getAuthHeaders(),
    });
    return data.message === "Subscriptions retrieved successfully."
      ? data.data || []
      : [];
  } catch (error) {
    console.error("Failed to fetch subscriptions:", error);
    return [];
  }
};

export const openInvoiceLink = (invoiceUrl: string) => {
  window.open(invoiceUrl, "_blank");
};

export const copyInvoiceLink = async (invoiceUrl: string) => {
  try {
    await navigator.clipboard.writeText(invoiceUrl);
    toast.success("Invoice link copied to clipboard!");
  } catch (error) {
    toast.error("Failed to copy link");
  }
};
