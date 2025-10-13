export interface AuthenticatedProduct {
  id: number;
  name: string;
  brand: string;
  model: string;
  verified_at: string;
  account_id: number;
  authenticity_verdict: string;
  company_address: string | null;
  company_name: string | null;
  contact_method: string;
  created_at: string;
  date_of_sale: string;
  email: string;
  phone: string;
  estimated_production_year: string;
  final_summary: string;
  status: string | null;
  updated_at: string;
  user_id: number;
}

export interface PublicProfile {
  ref_code: string;
  product: AuthenticatedProduct;
  verified_at: string;
  status: string;
}

export interface ApiResponse<T = any> {
  success?: boolean;
  valid?: boolean;
  message: string;
  data?: T;
}
