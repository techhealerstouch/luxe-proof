// Types
export interface AuthenticatedProduct {
  id: number;
  account_id?: number;
  user_id?: number;
  name: string;
  brand?: string;
  email?: string;
  phone?: string;
  contact_method?: string;
  company_name?: string | null;
  abn?: string | null;
  company_address?: string | null;
  reference_number?: string | null;
  model?: string;
  date_of_sale?: string;
  authenticity_verdict?: string;
  estimated_production_year?: string;
  final_summary?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  image_url?: string;
  price?: number;
  warranty?: string;
  manufacturer_date?: string;
  description?: string;
  category?: string;
  serial_number?: string;
}

export interface NfcData {
  ref_code: string;
  product: AuthenticatedProduct;
  verified_at: string;
  status: string;
}

export interface ApiResponse {
  valid: boolean;
  message?: string;
  data?: NfcData;
}
