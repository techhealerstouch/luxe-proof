"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard-layout";
import { AuthLoading } from "@/components/auth-loading";
import { formatTimeAgo } from "@/utils/formatting";

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

import {
  Shield,
  AlertTriangle,
  Eye,
  Plus,
  Award,
  Users,
  Loader2,
  RefreshCw,
  Clock,
  Coins,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

// Import credits service functions
import {
  fetchCredits,
  getAuthenticationCount,
  CreditService,
  type Package,
} from "@/lib/credit-service"; // Adjust path as needed
import {
  fetchDashboardStats,
  fetchRecentAuthentications,
  fetchTopBrands,
  fetchNfcTotal,
  type DashboardStatsResponse,
  type AuthenticationItem,
  type TopBrand,
} from "@/lib/api-dashboard";

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
  const [totalNfc, setTotalNfc] = useState<number>(0);

  // Initialize credits service
  const creditService = CreditService.getInstance();
  const deductCredits = parseInt(
    process.env.NEXT_PUBLIC_DEDUCT_CREDITS_WATCH_AUTHENTICATION || "0",
    10
  );

  // Credits utility functions using the service
  const getCreditStatus = (credits: number) => {
    if (credits === 0) {
      return {
        status: "empty",
        message: "No credits remaining",
        color: "text-red-600",
        bgColor: "bg-red-50 border-red-200",
      };
    } else if (credits < deductCredits) {
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

  // Fetch dashboard data
  const fetchDashboardData = async (showLoader = true) => {
    try {
      setError(null);
      if (showLoader) setLoading(true);

      // Load credits
      await loadUserCredits();

      // Fetch stats
      try {
        const statsData = await fetchDashboardStats();
        setStats({
          totalAuthentications: Number(statsData.totalAuthentications) || 0,
          pendingAuthentications: Number(statsData.pendingAuthentications) || 0,
          completedAuthentications:
            Number(statsData.completedAuthentications) || 0,
          rejectedAuthentications:
            Number(statsData.rejectedAuthentications) || 0,
          totalRevenue: Number(statsData.totalRevenue) || 0,
          thisMonthRevenue: Number(statsData.thisMonthRevenue) || 0,
          lastMonthRevenue: Number(statsData.lastMonthRevenue) || 0,
          totalClients: Number(statsData.totalClients) || 0,
          creditsUsed: Number(statsData.creditsUsed) || 0,
          creditsRemaining: userCredits,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }

      // Fetch NFC total
      try {
        const nfcData = await fetchNfcTotal();
        setTotalNfc(nfcData.totalNfc || 0);
      } catch (error) {
        console.error("Error fetching NFC total:", error);
      }

      // Recent authentications
      try {
        const recentData = await fetchRecentAuthentications();
        setRecentAuthentications(recentData);
      } catch (error) {
        console.error("Error fetching recent authentications:", error);
      }

      // Top brands
      try {
        const brandsData = await fetchTopBrands();
        setTopBrands(brandsData);
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
              onClick={() => router.push("/authentications/intro")}
              disabled={userCredits <= 0 || creditsLoading}
              className={
                userCredits <= 0 || creditsLoading
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }
            >
              <Plus className="w-4 h-4 mr-2" />
              New Authentication
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

        <div className="grid gap-3 md:grid-cols-3">
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
              <CardTitle className="text-sm font-medium">Total NFC</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalNfc.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">NFC Total Client</p>
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
                onClick={() => router.push("/authentications/intro")}
                className={`w-full justify-start ${
                  userCredits < deductCredits || creditsLoading
                    ? "opacity-50"
                    : ""
                }`}
                disabled={userCredits <= 0 || creditsLoading}
              >
                <Plus className="w-4 h-4 mr-2" />
                Start Authentication{" "}
                {userCredits < deductCredits
                  ? "(Insufficient Credits)"
                  : creditsLoading
                  ? "(Loading...)"
                  : ""}
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
                    disabled={userCredits < deductCredits || creditsLoading}
                    className={
                      userCredits < deductCredits || creditsLoading
                        ? "opacity-50"
                        : ""
                    }
                  >
                    <Link href="/authentications/intro">
                      <Plus className="h-4 w-4 mr-2" />
                      {userCredits < deductCredits
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
      </div>
    </DashboardLayout>
  );
}
