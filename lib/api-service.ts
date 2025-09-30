// import { apiClient } from "./api-interceptor";

// // Types for API responses
// export interface User {
//   id: number;
//   name: string;
//   email: string;
//   account: {
//     name: string;
//     slug: string;
//   };
// }

// export interface Subscription {
//   id: number;
//   account_id: number;
//   plan_id: number;
//   service: string;
//   status: "active" | "pending" | "suspended" | "cancelled";
//   start_date: string;
//   end_date: string;
//   cancelled_at: string | null;
//   created_at: string | null;
//   updated_at: string | null;
//   plan: {
//     id: number;
//     name: "Starter" | "Professional" | "Enterprise"; // adjust based on your actual plan names
//     slug: "starter" | "professional" | "enterprise";
//     price: string;
//     domain: string;
//     sub_user_limit: number;
//     product_limit: number;
//     created_at: string | null;
//     updated_at: string | null;
//   };
// }

// export interface SubscriptionsApiResponse {
//   message: string;
//   data: Subscription[];
// }

// export interface SubscriptionPlan {
//   id: string;
//   name: string;
//   price: number;
//   features: string[];
//   isActive: boolean;
//   sub_user_limit: number;
//   product_limit: number;
// }

// export interface CustomPlanUserLimit {
//   id: string;
//   type: string;
//   count: number;
//   price: number;
// }

// export interface NewSubscription {
//   payment_url: string;
// }

// export interface AccountSettings {
//   notifications: {
//     email: boolean;
//     sms: boolean;
//     push: boolean;
//   };
//   privacy: {
//     profileVisible: boolean;
//     analyticsEnabled: boolean;
//   };
//   billing: {
//     autoRenew: boolean;
//     invoiceEmail: string;
//   };
// }

// class ApiService {
//   // Account endpoints
//   async getAccount(): Promise<User> {
//     return apiClient.get("/api/user");
//   }

//   async updateAccount(data: {
//     name: string;
//     email: string;
//     account: {
//       name: string;
//     };
//   }): Promise<User> {
//     return apiClient.put("/api/user", data);
//   }

//   async changePassword(data: {
//     currentPassword: string;
//     newPassword: string;
//   }): Promise<void> {
//     return apiClient.put("/api/user/change-password", data);
//   }

//   // Subscription endpoints
//   async getSubscriptions(): Promise<SubscriptionsApiResponse> {
//     return apiClient.get("/api/subscriptions");
//   }

//   async getSubscription(id: string): Promise<Subscription> {
//     return apiClient.get(`/subscriptions/${id}`);
//   }

//   async createSubscription(data: {
//     plan_id: string;
//     service: string;
//     start_date: string;
//     end_date: string;
//     duration: number;
//   }): Promise<NewSubscription> {
//     return apiClient.post("/api/subscriptions", data);
//   }

//   async updateSubscription(
//     id: string,
//     data: Partial<Subscription>
//   ): Promise<Subscription> {
//     return apiClient.put(`/api/subscriptions/${id}`, data);
//   }

//   async cancelSubscription(id: string): Promise<void> {
//     return apiClient.delete(`/api/subscriptions/${id}`);
//   }

//   // Subscription plans
//   async upgradeSubscription(
//     subscriptionId: string,
//     planId: string,
//     duration: number
//   ): Promise<Subscription> {
//     return apiClient.put(`/api/subscriptions/${subscriptionId}/upgrade`, {
//       plan_id: planId,
//       duration,
//     });
//   }

//   async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
//     return apiClient.get("/api/subscription-plans");
//   }

//   async getSelectedPlan(): Promise<SubscriptionPlan> {
//     return apiClient.get(`/api/subscriptions/${id}`);
//   }

//   async getCustomUserLimit(): Promise<CustomPlanUserLimit[]> {
//     return apiClient.get(`/api/plan/custom-limit`);
//   }

//   async createCustomSubscription(data: {
//     plan_id: number;
//     service: string;
//     duration: number;
//     user_limit_id: number;
//   }): Promise<any> {
//     return apiClient.post(`/api/subscriptions/custom`, data);
//   }

//   async changePlan(planId: string): Promise<void> {
//     return apiClient.post("/api/subscription-plans/change", { planId });
//   }

//   // Settings
//   async getSettings(): Promise<AccountSettings> {
//     return apiClient.get("/api/account/settings");
//   }

//   async updateSettings(
//     data: Partial<AccountSettings>
//   ): Promise<AccountSettings> {
//     return apiClient.put("/api/account/settings", data);
//   }

//   // Analytics
//   async getAnalytics(
//     subscriptionId: string,
//     period: "7d" | "30d" | "90d" = "30d"
//   ) {
//     return apiClient.get(
//       `/api/subscriptions/${subscriptionId}/analytics?period=${period}`
//     );
//   }
// }

// export const apiService = new ApiService();
