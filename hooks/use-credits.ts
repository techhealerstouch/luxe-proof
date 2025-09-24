// hooks/useCredits.ts
import { useState, useEffect, useCallback } from "react";
import axios from "axios";

interface UseCreditsResult {
  credits: number;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateCredits: (newCredits: number) => void;
}

export const useCredits = (): UseCreditsResult => {
  const [credits, setCredits] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCredits = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No access token found");
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/authenticator/credits`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.data.success) {
        setCredits(response.data.credits);
      } else {
        throw new Error(response.data.message || "Failed to fetch credits");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load credits";
      setError(errorMessage);
      console.error("Error fetching credits:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCredits = useCallback((newCredits: number) => {
    setCredits(newCredits);
  }, []);

  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  return {
    credits,
    loading,
    error,
    refetch: fetchCredits,
    updateCredits,
  };
};
