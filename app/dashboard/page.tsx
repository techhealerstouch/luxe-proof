"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard-layout";
import { AuthLoading } from "@/components/auth-loading";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Shield,
  AlertTriangle,
  Eye,
  Plus,
  DollarSign,
  Award,
  Users,
  Loader2,
  RefreshCw,
  Clock,
  Coins,
  CreditCard,
  Smartphone,
  Building2,
  Wallet,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import CreditsDisplay from "@/components/CreditsDisplay";
import TopUp from "@/components/TopUp";
import ApiCreditStatus from "@/components/ApiCreditStatus";

// Import credits service functions
import {
  fetchCredits,
  createInvoice,
  getAuthenticationCount,
  formatCurrency,
  DEFAULT_PACKAGES,
  CreditService,
  type Package,
} from "@/lib/credit-service"; // Adjust path as needed

interface DashboardStats {
  totalAuthentications: number;
  pendingAuthentications: number;
  completedAuthentications: number;
  rejectedAuthentications: number;
  totalRevenue: number;
  thisMonthRevenue: number;
  lastMonthRevenue: number;
  totalClients: number;
  creditsUsed: number;
  creditsRemaining: number;
}

interface AuthenticationItem {
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

interface TopBrand {
  brand: string;
  count: number;
  revenue: number;
}

interface PaymentMethod {
  id: string;
  name: string;
  type: string;
  icon: any;
  description: string;
  enabled: boolean;
}

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "cards",
    name: "Credit/Debit Card",
    type: "CREDIT_CARD",
    icon: CreditCard,
    description: "Visa, Mastercard, JCB, AMEX",
    enabled: true,
  },
  {
    id: "ewallet",
    name: "E-Wallet",
    type: "EWALLET",
    icon: Smartphone,
    description: "GCash, PayMaya, GrabPay",
    enabled: true,
  },
  {
    id: "bank_transfer",
    name: "Bank Transfer",
    type: "BANK_TRANSFER",
    icon: Building2,
    description: "Online Banking, ATM",
    enabled: true,
  },
  {
    id: "qr_code",
    name: "QR Code",
    type: "QR_CODE",
    icon: Wallet,
    description: "Scan to pay",
    enabled: true,
  },
];

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentAuthentications, setRecentAuthentications] = useState<
    AuthenticationItem[]
  >([]);
  const [topBrands, setTopBrands] = useState<TopBrand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Credits state - now using API instead of localStorage
  const [userCredits, setUserCredits] = useState(0);
  const [creditsLoading, setCreditsLoading] = useState(false);
  const [creditsError, setCreditsError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [topUpDialogOpen, setTopUpDialogOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | null
  >(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Initialize credits service
  const creditService = CreditService.getInstance();

  // Credits utility functions using the service
  const getCreditStatus = (credits: number) => {
    if (credits === 0) {
      return {
        status: "empty",
        message: "No credits remaining",
        color: "text-red-600",
        bgColor: "bg-red-50 border-red-200",
      };
    } else if (credits < 1000) {
      return {
        status: "low",
        message: "Low credits - insufficient for authentication",
        color: "text-orange-600",
        bgColor: "bg-orange-50 border-orange-200",
      };
    } else if (credits < 5000) {
      return {
        status: "moderate",
        message: "Moderate credit balance",
        color: "text-yellow-600",
        bgColor: "bg-yellow-50 border-yellow-200",
      };
    } else {
      return {
        status: "good",
        message: "Good credit balance",
        color: "text-green-600",
        bgColor: "bg-green-50 border-green-200",
      };
    }
  };

  const formatPrice = (price: number, discount?: number) => {
    if (discount) {
      const discountedPrice = price * (1 - discount / 100);
      return {
        original: price,
        discounted: discountedPrice,
        savings: price - discountedPrice,
      };
    }
    return { original: price };
  };

  // Load credits from API
  const loadUserCredits = async () => {
    try {
      setCreditsLoading(true);
      setCreditsError(null);
      const credits = await fetchCredits();
      setUserCredits(credits);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load credits";
      setCreditsError(errorMessage);
      console.error("Error loading credits:", error);
    } finally {
      setCreditsLoading(false);
    }
  };

  // Credits handlers
  const handlePackageSelect = (packageId: string): void => {
    setSelectedPackage(packageId);
    setPaymentError(null);
  };

  const handlePaymentMethodSelect = (methodId: string): void => {
    setSelectedPaymentMethod(methodId);
    setPaymentError(null);
  };

  const handleProceedToPayment = async (): Promise<void> => {
    if (!selectedPackage || !selectedPaymentMethod || !user?.id) {
      setPaymentError("Please select a package and payment method");
      return;
    }

    const packageData = DEFAULT_PACKAGES.find(
      (pkg) => pkg.id === selectedPackage
    );
    if (!packageData) {
      setPaymentError("Invalid package selected");
      return;
    }

    setProcessingPayment(true);
    setPaymentError(null);

    try {
      // Use the credits service to create invoice
      const invoiceUrl = await creditService.topUp(user.id, packageData);

      // For now, simulate payment success after creating invoice
      // In a real implementation, you'd redirect to the payment gateway
      // and handle the callback
      setTimeout(async () => {
        try {
          // Refresh credits after payment
          const newCredits = await creditService.refreshCredits();
          setUserCredits(newCredits);
          setPaymentSuccess(true);

          setTimeout(() => {
            handleDialogClose();
          }, 2000);
        } catch (error) {
          setPaymentError(
            "Payment completed but failed to refresh credits. Please refresh the page."
          );
        } finally {
          setProcessingPayment(false);
        }
      }, 2000);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Payment processing failed";
      setPaymentError(errorMessage);
      setProcessingPayment(false);
    }
  };

  const handleDialogClose = (): void => {
    if (!processingPayment) {
      setTopUpDialogOpen(false);
      resetDialog();
    }
  };

  const resetDialog = (): void => {
    setSelectedPackage(null);
    setSelectedPaymentMethod(null);
    setPaymentError(null);
    setPaymentSuccess(false);
    setProcessingPayment(false);
  };

  // Format time ago helper
  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
    } else {
      return "Just now";
    }
  };

  // Get status badge
  const getStatusBadge = (auth: AuthenticationItem) => {
    const status = auth.status;
    const documentSent = auth.document_sent_at;

    if (status === "voided") {
      return (
        <Badge className="bg-red-100 text-red-800 border-red-200">Voided</Badge>
      );
    }

    if (documentSent || status === "sent") {
      return (
        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
          Document Sent
        </Badge>
      );
    }

    if (status === "submitted") {
      return (
        <Badge className="bg-purple-100 text-purple-800 border-purple-200">
          Submitted
        </Badge>
      );
    }

    return (
      <Badge className="bg-green-100 text-green-800 border-green-200">
        Completed
      </Badge>
    );
  };

  // Get authenticity badge
  const getAuthenticityBadge = (verdict?: string) => {
    if (!verdict) {
      return (
        <Badge className="bg-gray-500 hover:bg-gray-600 text-white">
          Not Available
        </Badge>
      );
    }

    const isAuthentic =
      verdict.toLowerCase().includes("authentic") ||
      verdict.toLowerCase().includes("genuine");

    return (
      <Badge
        className={
          isAuthentic
            ? "bg-green-500 hover:bg-green-600 text-white"
            : "bg-red-500 hover:bg-red-600 text-white"
        }
      >
        {verdict}
      </Badge>
    );
  };

  // Credits render functions
  const renderPackageCard = (pkg: Package): React.ReactElement => {
    const pricing = formatPrice(pkg.price, pkg.discount);
    const isSelected = selectedPackage === pkg.id;

    return (
      <div
        key={pkg.id}
        className={`relative flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
          isSelected
            ? "border-blue-500 bg-blue-50 shadow-md"
            : "border-gray-200 hover:border-blue-300 hover:shadow-sm"
        } ${pkg.popular && !isSelected ? "border-blue-200 bg-blue-25" : ""}`}
        onClick={() => handlePackageSelect(pkg.id)}
      >
        {pkg.popular && (
          <Badge className="absolute -top-2 right-2 text-xs bg-blue-500">
            Popular
          </Badge>
        )}
        {pkg.discount && (
          <Badge variant="secondary" className="absolute -top-2 left-2 text-xs">
            {pkg.discount}% OFF
          </Badge>
        )}

        <div>
          <h4 className="font-semibold text-gray-900">{pkg.name}</h4>
          <div className="space-y-1">
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <Coins className="h-3 w-3" />
              {pkg.credits.toLocaleString()} credits
            </p>
            <p className="text-xs text-blue-600 font-medium">
              {getAuthenticationCount(pkg.credits)} authentication
              {getAuthenticationCount(pkg.credits) !== 1 ? "s" : ""}
            </p>
          </div>
          {pkg.discount && pricing.savings && (
            <p className="text-xs text-green-600 font-medium">
              Save {formatCurrency(pricing.savings)}
            </p>
          )}
        </div>

        <div className="text-right">
          <div className="flex items-center gap-2">
            {pricing.discounted && (
              <span className="text-sm text-gray-500 line-through">
                {formatCurrency(pricing.original)}
              </span>
            )}
            <div className="font-semibold text-lg">
              {formatCurrency(pricing.discounted || pricing.original)}
            </div>
          </div>
          <div className="text-xs text-gray-500">
            {formatCurrency(
              (pricing.discounted || pricing.original) / pkg.credits
            )}
            /credit
          </div>
        </div>
      </div>
    );
  };

  const renderPaymentMethod = (method: PaymentMethod): React.ReactElement => {
    const IconComponent = method.icon;
    const isSelected = selectedPaymentMethod === method.id;

    return (
      <div
        key={method.id}
        className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
          isSelected
            ? "border-blue-500 bg-blue-50 shadow-sm"
            : "border-gray-200 hover:border-blue-300"
        }`}
        onClick={() => handlePaymentMethodSelect(method.id)}
      >
        <IconComponent className="h-5 w-5 text-gray-600" />
        <div className="flex-1">
          <div className="font-medium text-gray-900">{method.name}</div>
          <div className="text-sm text-gray-600">{method.description}</div>
        </div>
      </div>
    );
  };

  // Fetch dashboard data
  const fetchDashboardData = async (showLoader = true) => {
    try {
      setError(null);
      if (showLoader) setLoading(true);

      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("No authentication token available");
        return;
      }

      const baseURL = process.env.NEXT_PUBLIC_API_URL;
      const headers = {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      };

      // Load credits from API instead of localStorage
      await loadUserCredits();

      // Fetch stats
      try {
        const statsResponse = await fetch(`${baseURL}/api/dashboard/stats`, {
          headers,
        });

        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats({
            totalAuthentications: Number(statsData.totalAuthentications) || 0,
            pendingAuthentications:
              Number(statsData.pendingAuthentications) || 0,
            completedAuthentications:
              Number(statsData.completedAuthentications) || 0,
            rejectedAuthentications:
              Number(statsData.rejectedAuthentications) || 0,
            totalRevenue: Number(statsData.totalRevenue) || 0,
            thisMonthRevenue: Number(statsData.thisMonthRevenue) || 0,
            lastMonthRevenue: Number(statsData.lastMonthRevenue) || 0,
            totalClients: Number(statsData.totalClients) || 0,
            creditsUsed: Number(statsData.creditsUsed) || 0,
            creditsRemaining: userCredits, // Use API credits
          });
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }

      // Fetch recent authentications
      try {
        const recentResponse = await fetch(`${baseURL}/api/auth-products`, {
          headers,
        });

        if (recentResponse.ok) {
          const recentData = await recentResponse.json();

          const mappedData = Array.isArray(recentData.data)
            ? recentData.data
                .sort((a: any, b: any) => {
                  const dateA = new Date(a.created_at || 0).getTime();
                  const dateB = new Date(b.created_at || 0).getTime();
                  return dateB - dateA;
                })
                .slice(0, 5)
                .map((item: any) => ({
                  id: item.id,
                  name: item.client_name || item.name || "Unknown Client",
                  client_name: item.client_name,
                  brand: item.brand,
                  model: item.model,
                  serial_number: item.serial_info.serial_number,
                  estimated_production_year: item.estimated_production_year,
                  authenticity_verdict: item.authenticity_verdict,
                  status: item.status || "completed",
                  document_sent_at: item.document_sent_at,
                  created_at: item.created_at,
                }))
            : [];

          setRecentAuthentications(mappedData);
        }
      } catch (error) {
        console.error("Error fetching recent authentications:", error);
      }

      // Fetch top brands
      try {
        const brandsResponse = await fetch(
          `${baseURL}/api/dashboard/top-brands`,
          {
            headers,
          }
        );

        if (brandsResponse.ok) {
          const brandsData = await brandsResponse.json();
          setTopBrands(
            Array.isArray(brandsData.data || brandsData)
              ? (brandsData.data || brandsData).slice(0, 5)
              : []
          );
        }
      } catch (error) {
        console.error("Error fetching top brands:", error);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to load dashboard data");
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  // Subscribe to credit changes
  useEffect(() => {
    const unsubscribe = creditService.subscribe((credits) => {
      setUserCredits(credits);
    });

    return unsubscribe;
  }, [creditService]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const creditStatus = getCreditStatus(userCredits);
  const authCapacity = getAuthenticationCount(userCredits);

  if (isLoading || !user) {
    return <AuthLoading />;
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user.name}! Here's your overview.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchDashboardData()}
              disabled={loading || creditsLoading}
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${
                  loading || creditsLoading ? "animate-spin" : ""
                }`}
              />
              Refresh
            </Button>
            <Button
              asChild
              disabled={userCredits < 1000 || creditsLoading}
              className={
                userCredits < 1000 || creditsLoading
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }
            >
              <Link href="/authentications/intro">
                <Plus className="w-4 h-4 mr-2" />
                New Authentication
              </Link>
            </Button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="border-destructive bg-destructive/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  <div>
                    <h3 className="font-semibold text-destructive mb-1">
                      Error
                    </h3>
                    <p className="text-sm text-destructive/80">{error}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchDashboardData()}
                  className="border-destructive text-destructive hover:bg-destructive/10"
                >
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Credits Error Display */}
        {creditsError && (
          <Card className="border-orange-500 bg-orange-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <div>
                    <h3 className="font-semibold text-orange-600 mb-1">
                      Credits Error
                    </h3>
                    <p className="text-sm text-orange-600/80">{creditsError}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadUserCredits}
                  className="border-orange-500 text-orange-600 hover:bg-orange-50"
                >
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Credit Status Alert */}
        {isClient &&
          !creditsLoading &&
          (creditStatus.status === "empty" ||
            creditStatus.status === "low") && (
            <Card className={`border ${creditStatus.bgColor}`}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertTriangle
                      className={`h-5 w-5 ${creditStatus.color}`}
                    />
                    <div>
                      <h3
                        className={`font-semibold ${creditStatus.color} mb-1`}
                      >
                        {creditStatus.status === "empty"
                          ? "No Credits"
                          : "Low Credits"}
                      </h3>
                      <p className={`text-sm ${creditStatus.color}/80`}>
                        {creditStatus.message}. You need 1000 credits to perform
                        an authentication.
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => setTopUpDialogOpen(true)}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Top Up Credits
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Authentications
              </CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.totalAuthentications?.toLocaleString() || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Lifetime authentications
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Clients
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.totalClients || 0}
              </div>
              <p className="text-xs text-muted-foreground">Active customers</p>
            </CardContent>
          </Card>
        </div>

        {/* Credits and Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Credit Overview
              </CardTitle>
              <CardDescription>Your current credit status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Current Balance</p>
                  {creditsLoading ? (
                    <div className="flex items-center gap-2 mt-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-muted-foreground">
                        Loading...
                      </span>
                    </div>
                  ) : creditsError ? (
                    <div className="flex items-center gap-2 mt-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <span className="text-sm text-red-500">
                        Failed to load
                      </span>
                    </div>
                  ) : (
                    <div className="mt-2">
                      <div className="text-2xl font-bold flex items-center gap-2">
                        <Coins className="h-5 w-5 text-blue-600" />
                        {userCredits.toLocaleString()}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {authCapacity} authentication
                        {authCapacity !== 1 ? "s" : ""} available
                      </p>
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Quick Actions</p>
                  <div className="mt-2 space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={loadUserCredits}
                      disabled={creditsLoading}
                    >
                      <RefreshCw
                        className={`w-3 h-3 mr-1 ${
                          creditsLoading ? "animate-spin" : ""
                        }`}
                      />
                      Refresh
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setTopUpDialogOpen(true)}
                      className="w-full"
                    >
                      <CreditCard className="w-3 h-3 mr-1" />
                      Top Up
                    </Button>
                  </div>
                </div>
              </div>

              {/* Credit status indicator */}
              {!creditsLoading && !creditsError && (
                <div
                  className={`p-3 rounded-lg border ${creditStatus.bgColor}`}
                >
                  <div className="flex items-center gap-2">
                    {creditStatus.status === "good" ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertTriangle
                        className={`h-4 w-4 ${creditStatus.color}`}
                      />
                    )}
                    <span
                      className={`text-sm font-medium ${creditStatus.color}`}
                    >
                      {creditStatus.message}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                asChild
                className={`w-full justify-start ${
                  userCredits < 1000 || creditsLoading ? "opacity-50" : ""
                }`}
                disabled={userCredits < 1000 || creditsLoading}
              >
                <Link href="/authentications/intro">
                  <Plus className="w-4 h-4 mr-2" />
                  Start Authentication{" "}
                  {userCredits < 1000
                    ? "(Insufficient Credits)"
                    : creditsLoading
                    ? "(Loading...)"
                    : ""}
                </Link>
              </Button>
              <Button
                variant="outline"
                asChild
                className="w-full justify-start"
              >
                <Link href="/authentications">
                  <Eye className="w-4 h-4 mr-2" />
                  View All Cases
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Authentications Table and Top Brands */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Authentications</CardTitle>
                  <CardDescription>
                    Latest authentication requests
                  </CardDescription>
                </div>
                {recentAuthentications.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="bg-primary/10 text-primary"
                  >
                    {recentAuthentications.length} recent
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {recentAuthentications.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[120px]">
                          Serial Number
                        </TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Brand</TableHead>
                        <TableHead>Model</TableHead>
                        <TableHead className="w-[100px]">Year</TableHead>
                        <TableHead>Authenticity</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[120px]">Created</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentAuthentications.map((auth) => {
                        const isVoided = auth.status === "voided";

                        return (
                          <TableRow
                            key={auth.id}
                            className="hover:bg-muted/50 cursor-pointer"
                            onClick={() =>
                              router.push(`/authentications/${auth.id}`)
                            }
                          >
                            <TableCell>
                              <div
                                className={`font-mono text-sm ${
                                  isVoided ? "text-gray-400 line-through" : ""
                                }`}
                              >
                                {auth.serial_number || "N/A"}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div
                                className={`font-medium ${
                                  isVoided ? "text-gray-400 line-through" : ""
                                }`}
                              >
                                {auth.name || auth.client_name || "Unknown"}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div
                                className={`text-sm ${
                                  isVoided ? "text-gray-400 line-through" : ""
                                }`}
                              >
                                {auth.brand}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div
                                className={`text-sm ${
                                  isVoided ? "text-gray-400 line-through" : ""
                                }`}
                              >
                                {auth.model || "N/A"}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div
                                className={`text-sm ${
                                  isVoided ? "text-gray-400 line-through" : ""
                                }`}
                              >
                                {auth.estimated_production_year || "N/A"}
                              </div>
                            </TableCell>
                            <TableCell>
                              {isVoided ? (
                                <Badge className="bg-gray-100 text-gray-500 border-gray-200">
                                  Voided
                                </Badge>
                              ) : (
                                getAuthenticityBadge(auth.authenticity_verdict)
                              )}
                            </TableCell>
                            <TableCell>{getStatusBadge(auth)}</TableCell>
                            <TableCell>
                              <div
                                className={`text-sm ${
                                  isVoided ? "text-gray-400" : ""
                                }`}
                              >
                                {auth.created_at ? (
                                  <>
                                    <div className="flex items-center gap-1">
                                      <Clock className="h-3 w-3 text-muted-foreground" />
                                      <span>
                                        {formatTimeAgo(auth.created_at)}
                                      </span>
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-1">
                                      {new Date(
                                        auth.created_at
                                      ).toLocaleDateString()}
                                    </div>
                                  </>
                                ) : (
                                  "N/A"
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Shield className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    No recent authentications
                  </p>
                  <Button
                    asChild
                    size="sm"
                    disabled={userCredits < 1000 || creditsLoading}
                    className={
                      userCredits < 1000 || creditsLoading ? "opacity-50" : ""
                    }
                  >
                    <Link href="/authentications/intro">
                      <Plus className="h-4 w-4 mr-2" />
                      {userCredits < 1000
                        ? "Need Credits"
                        : creditsLoading
                        ? "Loading..."
                        : "Start First Authentication"}
                    </Link>
                  </Button>
                </div>
              )}

              {recentAuthentications.length > 0 && (
                <div className="flex justify-center mt-4 pt-4 border-t">
                  <Button variant="outline" asChild>
                    <Link href="/authentications">
                      View All Authentications
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Brands</CardTitle>
              <CardDescription>Most authenticated brands</CardDescription>
            </CardHeader>
            <CardContent>
              {topBrands.length > 0 ? (
                <div className="space-y-3">
                  {topBrands.map((brand, index) => (
                    <div
                      key={brand.brand}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{brand.brand}</p>
                          <p className="text-sm text-muted-foreground">
                            {brand.count} authentication
                            {brand.count !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Award className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No brand data available
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Credits Top Up Dialog */}
        <Dialog open={topUpDialogOpen} onOpenChange={setTopUpDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {paymentSuccess ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <CreditCard className="h-5 w-5" />
                )}
                {paymentSuccess ? "Payment Successful!" : "Top Up Credits"}
              </DialogTitle>
              <DialogDescription>
                {paymentSuccess ? (
                  `Your new credit balance is ${userCredits.toLocaleString()} credits.`
                ) : (
                  <>
                    Choose a credit package and payment method. Current balance:{" "}
                    <strong>{userCredits.toLocaleString()} credits</strong> (
                    {getAuthenticationCount(userCredits)} authentication
                    {getAuthenticationCount(userCredits) !== 1 ? "s" : ""})
                  </>
                )}
              </DialogDescription>
            </DialogHeader>

            {paymentSuccess && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Payment completed successfully! Your credits have been added.
                </AlertDescription>
              </Alert>
            )}

            {paymentError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{paymentError}</AlertDescription>
              </Alert>
            )}

            {!paymentSuccess && (
              <div className="space-y-6 py-4 max-h-96 overflow-y-auto">
                {/* Package Selection */}
                <div>
                  <h4 className="font-medium mb-3">Select Package</h4>
                  <div className="grid gap-3">
                    {DEFAULT_PACKAGES.map(renderPackageCard)}
                  </div>
                </div>

                {/* Payment Method Selection */}
                {selectedPackage && (
                  <div>
                    <h4 className="font-medium mb-3">Select Payment Method</h4>
                    <div className="grid gap-2">
                      {PAYMENT_METHODS.filter((method) => method.enabled).map(
                        renderPaymentMethod
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            <DialogFooter>
              {!paymentSuccess ? (
                <>
                  <Button
                    variant="outline"
                    onClick={handleDialogClose}
                    disabled={processingPayment}
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={
                      !selectedPackage ||
                      !selectedPaymentMethod ||
                      processingPayment
                    }
                    onClick={handleProceedToPayment}
                  >
                    {processingPayment ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Processing...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Complete Payment
                      </div>
                    )}
                  </Button>
                </>
              ) : (
                <Button onClick={handleDialogClose} className="w-full">
                  Close
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
