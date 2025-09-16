import axios from "axios";

export interface Package {
  id: string;
  name: string;
  credits: number;
  price: number;
  popular?: boolean;
}

export interface TopUpResponse {
  success: boolean;
  invoice_url?: string;
  message?: string;
}

export interface CreditsResponse {
  success: boolean;
  credits: number;
  message?: string;
}

export interface DeductCreditsResponse {
  success: boolean;
  message?: string;
  remaining_credits?: number;
  deducted_amount?: number;
}

// Default packages configuration
export const DEFAULT_PACKAGES: Package[] = [
  { id: "starter", name: "Starter Package", credits: 1000, price: 1000 },
  {
    id: "basic",
    name: "Basic Package",
    credits: 5000,
    price: 5000,
    popular: true,
  },
  { id: "standard", name: "Standard Package", credits: 10000, price: 10000 },
];

// Utility functions
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const getAuthenticationCount = (credits: number): number =>
  Math.floor(credits / 1000);

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken");
  }
  return null;
};

// Create axios headers with authentication
const createAuthHeaders = () => {
  const token = getAuthToken();
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  };
};

/**
 * Fetch user's current credits balance
 */
export const fetchCredits = async (): Promise<number> => {
  try {
    const response = await axios.get<CreditsResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/api/authenticator/credits`,
      {
        headers: createAuthHeaders(),
      }
    );

    if (response.data.success) {
      return response.data.credits;
    }
    throw new Error(response.data.message || "Failed to fetch credits");
  } catch (error) {
    console.error("Error fetching credits:", error);

    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(
          error.response.data?.message ||
            `Server error: ${error.response.status}`
        );
      } else if (error.request) {
        throw new Error("Network error. Please check your connection.");
      }
    }
    throw error;
  }
};

/**
 * Deduct credits from user's account
 */
export const deductCredits = async (amount: number): Promise<boolean> => {
  try {
    const response = await axios.put<DeductCreditsResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/api/authenticator/deduct-credits`,
      {
        amount: amount,
      },
      {
        headers: createAuthHeaders(),
        withCredentials: true, // Add this if using Sanctum
      }
    );

    return response.data.success;
  } catch (error) {
    console.error("Error deducting credits:", error);
    return false;
  }
};

/**
 * Create a payment invoice for credit top-up
 */
export const createInvoice = async (
  userId: string,
  packageData: Package
): Promise<string> => {
  try {
    const response = await axios.post<TopUpResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/api/authenticator/top-up`,
      {
        user_id: userId,
        package: packageData.name,
        credits: packageData.credits,
      },
      {
        headers: createAuthHeaders(),
      }
    );

    if (response.data.success && response.data.invoice_url) {
      return response.data.invoice_url;
    }
    throw new Error(response.data.message || "Failed to create invoice");
  } catch (error) {
    console.error("Error creating invoice:", error);

    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(
          error.response.data?.message ||
            `Server error: ${error.response.status}`
        );
      } else if (error.request) {
        throw new Error("Network error. Please check your connection.");
      }
    }
    throw error;
  }
};

/**
 * Refresh credits after successful payment
 * This can be used to poll for credit updates or after payment completion
 */
export const refreshCredits = async (): Promise<number> => {
  return await fetchCredits();
};

/**
 * Get package by ID
 */
export const getPackageById = (packageId: string): Package | undefined => {
  return DEFAULT_PACKAGES.find((pkg) => pkg.id === packageId);
};

/**
 * Calculate the value per credit for a package
 */
export const calculateValuePerCredit = (pkg: Package): number => {
  return pkg.price / pkg.credits;
};

// Credit service class (optional, for more complex state management)
export class CreditService {
  private static instance: CreditService;
  private credits: number = 0;
  private listeners: Array<(credits: number) => void> = [];

  static getInstance(): CreditService {
    if (!CreditService.instance) {
      CreditService.instance = new CreditService();
    }
    return CreditService.instance;
  }

  async loadCredits(): Promise<number> {
    try {
      this.credits = await fetchCredits();
      this.notifyListeners();
      return this.credits;
    } catch (error) {
      throw error;
    }
  }

  getCurrentCredits(): number {
    return this.credits;
  }

  subscribe(listener: (credits: number) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.credits));
  }

  async topUp(userId: string, packageData: Package): Promise<string> {
    const invoiceUrl = await createInvoice(userId, packageData);
    return invoiceUrl;
  }

  async refreshCredits(): Promise<number> {
    return await this.loadCredits();
  }
}
