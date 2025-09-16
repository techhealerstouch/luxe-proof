"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CreditCard,
  Download,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  AlertTriangle,
  Plus,
  ExternalLink,
  Copy,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

// ============================================================================
// Types
// ============================================================================

type PlanType = "free" | "pro" | "enterprise";

interface CreditInvoice {
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

interface Subscription {
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
  plan: {
    id: number;
    name: string;
    price: number;
    description: string;
    features: string[];
  };
}

type BillingData = {
  currentPlan: {
    name: string;
    type: PlanType;
    price: number;
    billingCycle: "monthly" | "yearly";
    features: string[];
    nextBillingDate?: string;
  };
  paymentMethod?: {
    type: "card" | "paypal";
    last4?: string;
    brand?: string;
    expiryMonth?: number;
    expiryYear?: number;
  };
  billingHistory: {
    id: string;
    date: string;
    amount: number;
    status: "paid" | "pending" | "failed";
    invoice_url?: string;
    description: string;
  }[];
  creditsInvoices: CreditInvoice[];
  subscriptions: Subscription[];
};

// ============================================================================
// Mock Data (Replace with API calls)
// ============================================================================

const mockBillingData: BillingData = {
  billingHistory: [],
  creditsInvoices: [],
  subscriptions: [],
};

// ============================================================================
// Helper Functions
// ============================================================================

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const getStatusBadge = (status: string) => {
  const normalizedStatus = status.toLowerCase();
  switch (normalizedStatus) {
    case "paid":
    case "active":
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          {status === "active" ? "Active" : "Paid"}
        </Badge>
      );
    case "pending":
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      );
    case "failed":
    case "cancelled":
      return (
        <Badge variant="destructive" className="bg-red-100 text-red-800">
          <AlertTriangle className="w-3 h-3 mr-1" />
          {status === "cancelled" ? "Cancelled" : "Failed"}
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const getPlanBadge = (planType: PlanType) => {
  switch (planType) {
    case "free":
      return <Badge variant="secondary">Free</Badge>;
    case "pro":
      return <Badge variant="default">Pro</Badge>;
    case "enterprise":
      return <Badge variant="outline">Enterprise</Badge>;
    default:
      return <Badge variant="outline">{planType}</Badge>;
  }
};

// Helper function to get active subscription
const getActiveSubscription = (
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

// ============================================================================
// Main Component
// ============================================================================

export default function BillingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [billingData, setBillingData] = useState<BillingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ============================================================================
  // API Functions
  // ============================================================================

  const fetchCreditsInvoices = async (): Promise<CreditInvoice[]> => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/authenticator/credits/invoices`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.success) {
        return response.data.data || [];
      }
      return [];
    } catch (error) {
      console.error("Failed to fetch credits invoices:", error);
      return [];
    }
  };
  const fetchSubscriptions = async (): Promise<Subscription[]> => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/subscriptions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.message === "Subscriptions retrieved successfully.") {
        return response.data.data || [];
      }
      return [];
    } catch (error) {
      console.error("Failed to fetch subscriptions:", error);
      return [];
    }
  };

  const openInvoiceLink = (invoiceUrl: string) => {
    window.open(invoiceUrl, "_blank");
  };

  const copyInvoiceLink = async (invoiceUrl: string) => {
    try {
      await navigator.clipboard.writeText(invoiceUrl);
      toast.success("Invoice link copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    // Fetch billing data
    const fetchBillingData = async () => {
      setIsLoading(true);
      try {
        // Fetch both credits invoices and subscriptions
        const [creditsInvoices, subscriptions] = await Promise.all([
          fetchCreditsInvoices(),
          fetchSubscriptions(),
        ]);

        setBillingData({
          ...mockBillingData,
          creditsInvoices,
          subscriptions,
        });
      } catch (error) {
        console.error("Failed to fetch billing data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBillingData();
  }, [user, router]);

  const handleDownloadInvoice = (invoiceUrl: string) => {
    console.log("Download invoice:", invoiceUrl);
  };

  if (!user) return null;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h2 className="text-3xl font-bold tracking-tight">Billing</h2>
            <p className="text-muted-foreground">
              Loading billing information...
            </p>
          </div>
          <div className="grid gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-muted rounded w-1/4"></div>
                    <div className="h-8 bg-muted rounded w-1/2"></div>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-3xl font-bold tracking-tight">Billing</h2>
          <p className="text-muted-foreground">
            Manage your subscription and billing information
          </p>
        </div>

        <div className="grid gap-6">
          {/* Current Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Current Plan
              </CardTitle>
              <CardDescription>
                Your current subscription plan and usage
              </CardDescription>
            </CardHeader>
            <CardContent>
              {billingData?.subscriptions &&
              billingData.subscriptions.length > 0 ? (
                (() => {
                  const activeSubscription = getActiveSubscription(
                    billingData.subscriptions
                  );

                  if (!activeSubscription) {
                    return (
                      <div className="text-center py-6">
                        <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                        <p className="text-muted-foreground mb-4">
                          No active subscription found
                        </p>
                        <Button
                          onClick={handleUpgradePlan}
                          className="rounded-xl"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Choose a Plan
                        </Button>
                      </div>
                    );
                  }

                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <h3 className="text-2xl font-bold">
                            {activeSubscription.plan.name}
                          </h3>
                          {getStatusBadge(activeSubscription.status)}
                        </div>

                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-bold">
                            {formatCurrency(activeSubscription.price)}
                          </span>
                          <span className="text-muted-foreground">
                            /subscription
                          </span>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            Started: {formatDate(activeSubscription.start_date)}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            Ends: {formatDate(activeSubscription.end_date)}
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="font-medium">Service:</span>
                            <Badge variant="outline">
                              {activeSubscription.service}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-medium">Plan Features:</h4>
                        {activeSubscription.plan.features &&
                        activeSubscription.plan.features.length > 0 ? (
                          <ul className="space-y-2">
                            {activeSubscription.plan.features.map(
                              (feature, index) => (
                                <li
                                  key={index}
                                  className="flex items-center gap-2 text-sm"
                                >
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                  {feature}
                                </li>
                              )
                            )}
                          </ul>
                        ) : (
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">
                              {activeSubscription.plan.description ||
                                "No description available"}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <h3 className="text-2xl font-bold">
                        {billingData?.currentPlan.name || "Free Plan"}
                      </h3>
                      {getPlanBadge(billingData?.currentPlan.type || "free")}
                    </div>

                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold">
                        {formatCurrency(billingData?.currentPlan.price || 0)}
                      </span>
                      <span className="text-muted-foreground">
                        /{billingData?.currentPlan.billingCycle || "month"}
                      </span>
                    </div>

                    {billingData?.currentPlan.nextBillingDate && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        Next billing date:{" "}
                        {formatDate(billingData.currentPlan.nextBillingDate)}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        onClick={handleUpgradePlan}
                        className="rounded-xl"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Upgrade Plan
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Plan Features:</h4>
                    <ul className="space-y-2">
                      {(billingData?.currentPlan.features || []).map(
                        (feature, index) => (
                          <li
                            key={index}
                            className="flex items-center gap-2 text-sm"
                          >
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            {feature}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Credits History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  Credits Invoice History
                </div>
              </CardTitle>
              <CardDescription>View your credits invoices</CardDescription>
            </CardHeader>
            <CardContent>
              {billingData?.creditsInvoices.length ? (
                <div className="space-y-4">
                  {billingData.creditsInvoices.map((invoice) => (
                    <div
                      key={invoice.id}
                      className="flex items-center justify-between p-4 border rounded-xl"
                    >
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-medium">
                            {invoice.credit?.name || "Credits Top up"} -{" "}
                            {invoice.quantity} credits
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(invoice.created_at)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-medium">
                            {formatCurrency(invoice.amount)}
                          </p>
                          {getStatusBadge(invoice.status)}
                        </div>

                        <div className="flex gap-2">
                          {invoice.payment_url && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  openInvoiceLink(invoice.payment_url)
                                }
                                className="rounded-xl"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>

                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  copyInvoiceLink(invoice.payment_url)
                                }
                                className="rounded-xl"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </>
                          )}

                          {invoice.status.toLowerCase() === "paid" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleDownloadInvoice(invoice.payment_url)
                              }
                              className="rounded-xl"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-4">
                    No credits invoices available
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
