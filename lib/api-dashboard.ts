// lib/api-dashboard.ts

// ---------- TYPES ---------- //

export interface DashboardStatsResponse {
  totalAuthentications: number;
  pendingAuthentications: number;
  completedAuthentications: number;
  rejectedAuthentications: number;
  totalRevenue: number;
  thisMonthRevenue: number;
  lastMonthRevenue: number;
  totalClients: number;
  creditsUsed: number;
}

export interface AuthenticationItem {
  id: string;
  name?: string;
  client_name?: string;
  brand: string;
  model?: string;
  serial_number?: string;
  estimated_production_year?: string | number;
  authenticity_verdict?: string;
  status?: string;
  document_sent_at?: string;
  created_at?: string;
}

export interface TopBrand {
  brand: string;
  count: number;
  revenue: number;
}

// ---------- FETCH HELPER ---------- //

const baseURL = process.env.NEXT_PUBLIC_API_URL || "";

async function fetchWithAuth<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("No authentication token available");

  const res = await fetch(`${baseURL}${url}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }

  return res.json();
}

// ---------- API FUNCTIONS ---------- //

/**
 * Dashboard statistics
 */
export async function fetchDashboardStats(): Promise<DashboardStatsResponse> {
  return fetchWithAuth<DashboardStatsResponse>("/api/dashboard/stats");
}
export async function fetchNfcTotal(): Promise<{ totalNfc: number }> {
  return fetchWithAuth<{ totalNfc: number }>("/api/dashboard/nfc-total");
}
/**
 * Latest 5 authentications
 */
export async function fetchRecentAuthentications(): Promise<
  AuthenticationItem[]
> {
  const data = await fetchWithAuth<{ data?: any[] }>("/api/auth-products");

  if (!Array.isArray(data?.data)) return [];

  return data.data
    .sort((a, b) => {
      const dateA = new Date(a.created_at || 0).getTime();
      const dateB = new Date(b.created_at || 0).getTime();
      return dateB - dateA;
    })
    .slice(0, 5)
    .map<AuthenticationItem>((item) => ({
      id: item.id,
      name: item.client_name || item.name || "Unknown Client",
      client_name: item.client_name,
      brand: item.brand,
      model: item.model,
      serial_number: item.serial_number,
      estimated_production_year: item.estimated_production_year,
      authenticity_verdict: item.authenticity_verdict,
      status: item.status || "completed",
      document_sent_at: item.document_sent_at,
      created_at: item.created_at,
    }));
}

/**
 * Top 5 brands
 */
export async function fetchTopBrands(): Promise<TopBrand[]> {
  const data = await fetchWithAuth<{ data?: TopBrand[] }>(
    "/api/dashboard/top-brands"
  );
  const brands = data?.data || (data as unknown as TopBrand[]);
  return Array.isArray(brands) ? brands.slice(0, 5) : [];
}
