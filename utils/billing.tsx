import type { Subscription } from "@/types/billing/billing";

// Helper function to get active subscription
export const getActiveSubscription = (
  subscriptions: Subscription[]
): Subscription | null => {
  return (
    subscriptions.find(
      (sub) =>
        sub.status === "active" ||
        sub.status === "pending" ||
        (sub.status !== "cancelled" && new Date(sub.end_date) > new Date())
    ) || null
  );
};
