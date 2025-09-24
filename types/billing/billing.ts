// types/billing.ts

export type PlanType = "free" | "pro" | "enterprise";

export interface CreditInvoice {
  id: string;
  external_id: string;
  amount: number;
  quantity: number;
  status: string;
  payment_url: string;
  created_at: string;
  updated_at: string;
  credit?: {
    name: string;
    price: number;
  };
}

export interface Plan {
  id: number;
  name: string;
  price: number;
  description: string;
  features: string[];
}

export interface Subscription {
  id: number;
  account_id: number;
  plan_id: number;
  service: string;
  status: string;
  start_date: string;
  end_date: string;
  price: number;
  created_at: string;
  updated_at: string;
  plan: Plan;
}

export interface CurrentPlan {
  name: string;
  type: PlanType;
  price: number;
  billingCycle: "monthly" | "yearly";
  features: string[];
  nextBillingDate?: string;
}

export interface BillingHistoryItem {
  id: string;
  date: string;
  amount: number;
  status: "paid" | "pending" | "failed";
  invoice_url?: string;
  description: string;
}

export interface BillingData {
  currentPlan: CurrentPlan;
  billingHistory: BillingHistoryItem[];
  creditsInvoices: CreditInvoice[];
  subscriptions: Subscription[];
}

// Pagination and filtering interfaces
export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

export interface DateFilter {
  startDate: string;
  endDate: string;
  status: string;
}
