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
} from "lucide-react";

// ============================================================================
// Types
// ============================================================================

type PlanType = "free" | "pro" | "enterprise";

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
};

// ============================================================================
// Mock Data (Replace with API calls)
// ============================================================================

const mockBillingData: BillingData = {
  currentPlan: {
    name: "Pro Plan",
    type: "pro",
    price: 29.99,
    billingCycle: "monthly",
    features: [
      "Unlimited projects",
      "Advanced analytics",
      "Priority support",
      "Custom integrations",
      "Team collaboration",
    ],
    nextBillingDate: "2025-09-20",
  },
  paymentMethod: {
    type: "card",
    last4: "4242",
    brand: "Visa",
    expiryMonth: 12,
    expiryYear: 2027,
  },
  billingHistory: [
    {
      id: "inv_001",
      date: "2025-08-20",
      amount: 29.99,
      status: "paid",
      invoice_url: "#",
      description: "Pro Plan - Monthly subscription",
    },
    {
      id: "inv_002",
      date: "2025-07-20",
      amount: 29.99,
      status: "paid",
      invoice_url: "#",
      description: "Pro Plan - Monthly subscription",
    },
    {
      id: "inv_003",
      date: "2025-06-20",
      amount: 29.99,
      status: "paid",
      invoice_url: "#",
      description: "Pro Plan - Monthly subscription",
    },
  ],
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
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "paid":
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Paid
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
      return (
        <Badge variant="destructive" className="bg-red-100 text-red-800">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Failed
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

// ============================================================================
// Main Component
// ============================================================================

export default function BillingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [billingData, setBillingData] = useState<BillingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    // Simulate API call
    const fetchBillingData = async () => {
      setIsLoading(true);
      try {
        // Replace with actual API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setBillingData(mockBillingData);
      } catch (error) {
        console.error("Failed to fetch billing data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBillingData();
  }, [user, router]);

  const handleUpgradePlan = () => {
    // Handle plan upgrade logic
    console.log("Upgrade plan clicked");
  };

  const handleUpdatePaymentMethod = () => {
    // Handle payment method update logic
    console.log("Update payment method clicked");
  };

  const handleDownloadInvoice = (invoiceUrl: string) => {
    // Handle invoice download logic
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-bold">
                      {billingData?.currentPlan.name}
                    </h3>
                    {getPlanBadge(billingData?.currentPlan.type || "free")}
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">
                      {formatCurrency(billingData?.currentPlan.price || 0)}
                    </span>
                    <span className="text-muted-foreground">
                      /{billingData?.currentPlan.billingCycle}
                    </span>
                  </div>

                  {billingData?.currentPlan.nextBillingDate && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Next billing date:{" "}
                      {formatDate(billingData.currentPlan.nextBillingDate)}
                    </div>
                  )}

                  <Button onClick={handleUpgradePlan} className="rounded-xl">
                    <Plus className="h-4 w-4 mr-2" />
                    Upgrade Plan
                  </Button>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Plan Features:</h4>
                  <ul className="space-y-2">
                    {billingData?.currentPlan.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-sm"
                      >
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Method
              </CardTitle>
              <CardDescription>Manage your payment information</CardDescription>
            </CardHeader>
            <CardContent>
              {billingData?.paymentMethod ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-8 bg-muted rounded flex items-center justify-center">
                      <CreditCard className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {billingData.paymentMethod.brand} ending in{" "}
                        {billingData.paymentMethod.last4}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Expires {billingData.paymentMethod.expiryMonth}/
                        {billingData.paymentMethod.expiryYear}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleUpdatePaymentMethod}
                    className="rounded-xl"
                  >
                    Update
                  </Button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground mb-4">
                    No payment method on file
                  </p>
                  <Button
                    onClick={handleUpdatePaymentMethod}
                    className="rounded-xl"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Payment Method
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Billing History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Billing History
              </CardTitle>
              <CardDescription>
                View and download your past invoices
              </CardDescription>
            </CardHeader>
            <CardContent>
              {billingData?.billingHistory.length ? (
                <div className="space-y-4">
                  {billingData.billingHistory.map((invoice) => (
                    <div
                      key={invoice.id}
                      className="flex items-center justify-between p-4 border rounded-xl"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                          <DollarSign className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">{invoice.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(invoice.date)}
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

                        {invoice.invoice_url && invoice.status === "paid" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleDownloadInvoice(invoice.invoice_url!)
                            }
                            className="rounded-xl"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">
                    No billing history available
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Usage Alert (Optional) */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              You're currently using 85% of your monthly quota. Consider
              upgrading your plan to avoid service interruptions.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </DashboardLayout>
  );
}
