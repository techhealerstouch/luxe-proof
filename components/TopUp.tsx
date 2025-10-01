import React, { useState, useEffect } from "react";
import {
  Plus,
  CreditCard,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Coins,
  Truck,
  Edit3,
  CreditCardIcon,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/components/auth-provider";
import { useCredits } from "@/hooks/use-credits";
import axios from "axios";

interface Package {
  id: string;
  name: string;
  credits: number;
  price: number;
  popular?: boolean;
  freeAuthentications?: number;
  nfcCards?: number;
}

interface BackendCredit {
  id: number;
  name: string;
  quantity: number;
  price: string;
  currency: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

interface TopUpProps {
  buttonText?: string;
  buttonVariant?: "default" | "outline" | "ghost" | "secondary";
  buttonSize?: "sm" | "md" | "lg";
  packages?: Package[];
  className?: string;
}

const SHIPPING_COST = 150;

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const getAuthenticationCount = (
  credits: number,
  freeAuth: number = 0
): number => {
  const paidAuth = Math.floor(credits / 1000);
  return paidAuth + freeAuth;
};

// Map backend credit data to frontend package format
const mapBackendToPackage = (credit: BackendCredit): Package => {
  const price = parseFloat(credit.price);

  // Calculate credits based on price (1000 PHP = 1000 credits base calculation)
  // But we need to account for the bonus structure
  let credits = 0;
  let freeAuthentications = 0;
  let nfcCards = 0;
  let popular = false;

  // Calculate based on the actual price from backend
  if (credit.name === "Starter Package") {
    // 1000 PHP = 1 auth = 1000 credits
    const baseAuth = Math.floor(price / 1000);
    credits = baseAuth * 1000;
    nfcCards = baseAuth;
  } else if (credit.name === "Basic Package") {
    // 6000 PHP = 6 auth paid + 1 free = 7000 credits total
    const baseAuth = Math.floor(price / 1000);
    const bonusAuth = Math.floor(baseAuth / 6);
    credits = (baseAuth + bonusAuth) * 1000;
    nfcCards = baseAuth + bonusAuth;
    popular = true;
  } else if (credit.name === "Standard Package") {
    // 12000 PHP = 12 auth paid + 3 free = 15000 credits total
    const baseAuth = Math.floor(price / 1000);
    const bonusAuth = Math.floor(baseAuth / 12) * 3;
    credits = (baseAuth + bonusAuth) * 1000;
    nfcCards = baseAuth + bonusAuth;
  } else {
    // Default calculation for any other packages
    const baseAuth = Math.floor(price / 1000);
    credits = baseAuth * 1000;
    nfcCards = baseAuth;
  }

  return {
    id: credit.id.toString(),
    name: credit.name,
    credits: credits,
    price: price,
    popular: popular,
    freeAuthentications: freeAuthentications,
    nfcCards: nfcCards,
  };
};

const fetchPackages = async (): Promise<Package[]> => {
  const token = localStorage.getItem("accessToken");

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/credits`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.success && Array.isArray(response.data.data)) {
      // Filter out Custom Package and map the rest
      return response.data.data
        .filter((credit: BackendCredit) => credit.name !== "Custom Package")
        .map(mapBackendToPackage);
    }
    throw new Error("Invalid response format");
  } catch (error) {
    console.error("Failed to fetch packages:", error);
    throw error;
  }
};

const createInvoice = async (
  userId: string,
  packageData: Package | null,
  customAuth: number | null,
  shippingCost: number
): Promise<string> => {
  const token = localStorage.getItem("accessToken");

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/authenticator/top-up`,
      {
        credit_id: packageData?.id || null,
        user_id: userId,
        package: packageData?.name || "Custom Package",
        credits: packageData?.credits,
        shipping_cost: shippingCost,
        custom_authentications: customAuth,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.success && response.data.invoice_url) {
      return response.data.invoice_url;
    }
    throw new Error(response.data.message || "Failed to create invoice");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(
          error.response.data?.message ||
            `Server error: ${error.response.status}`
        );
      } else if (error.request) {
        throw new Error("Network error. Please check your connection.");
      }
    }
    throw error;
  }
};

const PackageCard: React.FC<{
  package: Package;
  isSelected: boolean;
  onSelect: (id: string) => void;
}> = ({ package: pkg, isSelected, onSelect }) => {
  const totalAuth = getAuthenticationCount(
    pkg.credits,
    pkg.freeAuthentications || 0
  );

  const nfcCards = pkg.nfcCards || totalAuth;

  const savings = pkg.credits - pkg.price;
  const hasSavings = savings > 0;

  return (
    <div
      className={`relative flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
        isSelected
          ? "border-blue-500 bg-blue-50 shadow-md"
          : "border-gray-200 hover:border-blue-300 hover:shadow-sm"
      } ${pkg.popular && !isSelected ? "border-blue-200" : ""}`}
      onClick={() => onSelect(pkg.id)}
    >
      {pkg.popular && (
        <Badge className="absolute -top-2 right-2 text-xs bg-blue-500">
          Popular
        </Badge>
      )}

      <div>
        <h4 className="font-semibold text-gray-900">{pkg.name}</h4>
        <div className="space-y-1">
          <p className="text-sm text-gray-600 flex items-center gap-1">
            <Coins className="h-3 w-3" />
            {(pkg.credits / 100).toLocaleString()} credits
          </p>
          <p className="text-xs font-medium">
            <span className="text-blue-600">
              {totalAuth} authentication{totalAuth !== 1 ? "s" : ""}
            </span>
            {hasSavings && pkg.id === "2" && (
              <span className="ml-1 text-green-600">(6 + 1 free)</span>
            )}
            {hasSavings && pkg.id === "3" && (
              <span className="ml-1 text-green-600">(12 + 3 free)</span>
            )}
          </p>
          <p className="text-xs text-purple-600 font-medium flex items-center gap-1">
            <CreditCardIcon className="h-3 w-3" />
            {nfcCards} NFC Card{nfcCards !== 1 ? "s" : ""} included
          </p>
        </div>
      </div>

      <div className="text-right">
        <div className="font-semibold text-lg">{formatCurrency(pkg.price)}</div>
        {hasSavings && (
          <div className="text-xs text-green-600 font-medium">
            Save {formatCurrency(savings)}!
          </div>
        )}
        <div className="text-xs text-gray-500">
          ₱{(pkg.price / pkg.credits).toFixed(2)}/credit
        </div>
      </div>
    </div>
  );
};

const TopUp: React.FC<TopUpProps> = ({
  buttonText = "Top Up",
  buttonVariant = "outline",
  buttonSize = "sm",
  className = "",
}) => {
  const { user } = useAuth();
  const { credits, refetch } = useCredits();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invoiceUrl, setInvoiceUrl] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [customAuthNumber, setCustomAuthNumber] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("packages");
  const [showSummary, setShowSummary] = useState(false);
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoadingPackages, setIsLoadingPackages] = useState(false);
  const [packageError, setPackageError] = useState<string | null>(null);

  // Fetch packages when dialog opens
  useEffect(() => {
    if (isOpen && packages.length === 0) {
      setIsLoadingPackages(true);
      setPackageError(null);

      fetchPackages()
        .then((fetchedPackages) => {
          setPackages(fetchedPackages);
        })
        .catch((err) => {
          setPackageError("Failed to load packages. Please try again.");
          console.error("Error fetching packages:", err);
        })
        .finally(() => {
          setIsLoadingPackages(false);
        });
    }
  }, [isOpen]);

  const selectedPackageData = packages.find(
    (pkg) => pkg.id === selectedPackage
  );

  const calculateCustomPackage = (authCount: number) => {
    let bonusCredits = 0;
    let bonusAuth = 0;

    // Apply same bonus logic as the packages from backend
    if (authCount >= 6 && authCount < 12) {
      // Basic tier: 1 free per 6 authentications
      bonusAuth = Math.floor(authCount / 6);
      bonusCredits = bonusAuth * 1000;
    } else if (authCount >= 12 && authCount < 20) {
      // Standard tier: 3 free per 12 authentications
      bonusAuth = Math.floor(authCount / 12) * 3;
      bonusCredits = bonusAuth * 1000;
    } else if (authCount >= 20) {
      // Premium tier: 5 free per 20 authentications
      bonusAuth = Math.floor(authCount / 20) * 5;
      bonusCredits = bonusAuth * 1000;
    }

    const baseCredits = authCount * 1000;
    const totalCredits = baseCredits + bonusCredits;
    // Price calculation: 1000 PHP per authentication (matching backend packages)
    const price = authCount * 1000;
    const totalAuth = authCount + bonusAuth;
    const nfcCards = totalAuth; // NFC cards match total authentications

    return {
      baseCredits,
      bonusCredits,
      totalCredits,
      price,
      bonusAuth,
      totalAuth,
      nfcCards,
      savings: bonusCredits,
    };
  };

  const customAuthNum = customAuthNumber ? parseInt(customAuthNumber) : 0;
  const customPackageDetails =
    customAuthNum > 0 ? calculateCustomPackage(customAuthNum) : null;

  const dynamicCustomPackage: Package | null =
    activeTab === "custom" && customPackageDetails && customAuthNum > 0
      ? {
          id: "custom",
          name: "Custom Package",
          credits: customPackageDetails.totalCredits,
          price: customPackageDetails.price,
          freeAuthentications: customPackageDetails.bonusAuth,
          nfcCards: customPackageDetails.nfcCards,
        }
      : null;

  const activePackageData =
    activeTab === "custom" ? dynamicCustomPackage : selectedPackageData;

  const selectedNfcCards =
    activePackageData?.nfcCards ||
    (activePackageData
      ? getAuthenticationCount(
          activePackageData.credits,
          activePackageData.freeAuthentications || 0
        )
      : 0);
  const totalPrice = activePackageData
    ? activePackageData.price + SHIPPING_COST
    : 0;

  const handleBuyNow = async () => {
    if (!user?.id) {
      setError("User not authenticated");
      return;
    }

    if (activeTab === "packages" && !selectedPackage) {
      setError("Please select a package");
      return;
    }

    if (
      activeTab === "custom" &&
      (!customAuthNumber || parseInt(customAuthNumber) < 1)
    ) {
      setError("Please enter a valid authentication number (minimum 1)");
      return;
    }

    setShowSummary(true);
    setIsProcessing(true);
    setError(null);

    try {
      const url = await createInvoice(
        user.id,
        activeTab === "custom" ? null : selectedPackageData,
        activeTab === "custom" ? parseInt(customAuthNumber) : null,
        SHIPPING_COST
      );
      setInvoiceUrl(url);

      setTimeout(() => {
        handleRedirectToInvoice();
      }, 2000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Payment processing failed"
      );
      setShowSummary(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRedirectToInvoice = () => {
    if (invoiceUrl) {
      setIsRedirecting(true);
      window.open(invoiceUrl, "_blank", "noopener,noreferrer");

      setTimeout(() => {
        setIsRedirecting(false);
        handleClose();
        refetch();
      }, 1000);
    }
  };

  const handleClose = () => {
    if (!isProcessing && !isRedirecting) {
      setIsOpen(false);
      setSelectedPackage(null);
      setError(null);
      setInvoiceUrl(null);
      setIsRedirecting(false);
      setCustomAuthNumber("");
      setActiveTab("packages");
      setShowSummary(false);
    }
  };

  const handlePackageSelect = (id: string) => {
    setSelectedPackage(id);
    setError(null);
    setShowSummary(false);
  };

  return (
    <div className={className}>
      <Button
        variant={buttonVariant}
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2"
      >
        <Plus className="h-4 w-4" />
        {buttonText}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {invoiceUrl ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <CreditCard className="h-5 w-5" />
              )}
              {invoiceUrl
                ? "Invoice Created!"
                : showSummary
                ? "Order Summary"
                : "Top Up Credits"}
            </DialogTitle>
          </DialogHeader>

          {invoiceUrl && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Invoice created successfully!{" "}
                {isRedirecting
                  ? "Redirecting to payment..."
                  : "Click below to proceed."}
              </AlertDescription>
            </Alert>
          )}

          {(error || packageError) && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error || packageError}</AlertDescription>
            </Alert>
          )}

          {!invoiceUrl && !showSummary && (
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger
                  value="packages"
                  className="flex items-center gap-2"
                >
                  <Package className="h-4 w-4" />
                  Packages
                </TabsTrigger>
                <TabsTrigger value="custom" className="flex items-center gap-2">
                  <Edit3 className="h-4 w-4" />
                  Custom
                </TabsTrigger>
              </TabsList>

              <TabsContent value="packages" className="space-y-4">
                {isLoadingPackages ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
                  </div>
                ) : packageError ? (
                  <div className="text-center py-8 text-gray-500">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                    <p>Failed to load packages</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={() => {
                        setPackageError(null);
                        setIsLoadingPackages(true);
                        fetchPackages()
                          .then(setPackages)
                          .catch(() =>
                            setPackageError("Failed to load packages")
                          )
                          .finally(() => setIsLoadingPackages(false));
                      }}
                    >
                      Retry
                    </Button>
                  </div>
                ) : packages.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Package className="h-8 w-8 mx-auto mb-2" />
                    <p>No packages available</p>
                  </div>
                ) : (
                  <div className="grid gap-3 mt-4">
                    {packages.map((pkg) => (
                      <PackageCard
                        key={pkg.id}
                        package={pkg}
                        isSelected={selectedPackage === pkg.id}
                        onSelect={handlePackageSelect}
                      />
                    ))}
                  </div>
                )}

                {selectedPackageData && (
                  <div className="border-t pt-4 space-y-2">
                    <h4 className="font-medium text-sm">Order Summary</h4>
                    <div className="space-y-1.5 text-sm">
                      <div className="flex justify-between text-gray-600">
                        <span>{selectedPackageData.name}</span>
                        <span>{formatCurrency(selectedPackageData.price)}</span>
                      </div>
                      <div className="flex justify-between text-purple-600 text-xs">
                        <span className="flex items-center gap-1">
                          <CreditCardIcon className="h-3 w-3" />
                          {selectedNfcCards} NFC Card
                          {selectedNfcCards !== 1 ? "s" : ""} included
                        </span>
                        <span className="font-medium">Free</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span className="flex items-center gap-1">
                          <Truck className="h-3 w-3" />
                          Shipping Fee
                        </span>
                        <span>{formatCurrency(SHIPPING_COST)}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-base border-t pt-2">
                        <span>Total</span>
                        <span className="text-blue-600">
                          {formatCurrency(totalPrice)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="custom" className="space-y-4">
                <div className="mt-4">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-2">
                      <Edit3 className="h-4 w-4 text-blue-600" />
                      Create Your Custom Package
                    </h4>
                    <p className="text-sm text-gray-600">
                      Design your perfect package! Choose exactly how many
                      authentications you need.
                    </p>
                    <div className="mt-2 space-y-1">
                      <div className="text-xs text-blue-600 font-medium">
                        🎁 Bonus Credits Available:
                      </div>
                      <div className="text-xs text-gray-600">
                        • 6-11 auth: Get 1 FREE per 6 purchased
                        <br />
                        • 12-19 auth: Get 3 FREE per 12 purchased
                        <br />• 20+ auth: Get 5 FREE per 20 purchased
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="customAuth" className="text-sm font-medium">
                      Number of Authentications Needed
                    </Label>
                    <Input
                      id="customAuth"
                      type="number"
                      min="1"
                      max="99"
                      placeholder="How many do you need? (1-99)"
                      value={customAuthNumber}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (
                          value === "" ||
                          (parseInt(value) >= 1 && parseInt(value) <= 99)
                        ) {
                          setCustomAuthNumber(value);
                        }
                      }}
                      className="mt-1"
                    />
                    {customAuthNumber && parseInt(customAuthNumber) > 99 && (
                      <p className="text-xs text-red-500 mt-1">
                        Maximum 99 authentications allowed
                      </p>
                    )}

                    {customPackageDetails &&
                      customAuthNum > 0 &&
                      customAuthNum <= 99 && (
                        <div className="mt-4">
                          <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm space-y-3">
                            <div className="text-center pb-2 border-b">
                              <h5 className="font-semibold text-gray-900">
                                Your Custom Package
                              </h5>
                              {customPackageDetails.bonusAuth > 0 && (
                                <span className="text-xs text-green-600 font-medium">
                                  🎉 Includes {customPackageDetails.bonusAuth}{" "}
                                  FREE authentication
                                  {customPackageDetails.bonusAuth > 1
                                    ? "s"
                                    : ""}
                                  !
                                </span>
                              )}
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600 flex items-center gap-1">
                                  <Coins className="h-3 w-3" />
                                  Total Credits:
                                </span>
                                <span className="font-semibold text-gray-900">
                                  {(
                                    customPackageDetails.totalCredits / 100
                                  ).toLocaleString()}{" "}
                                  credits
                                  {customPackageDetails.bonusCredits > 0 && (
                                    <span className="text-xs text-green-600 ml-1">
                                      (
                                      {(
                                        customPackageDetails.baseCredits / 100
                                      ).toLocaleString()}{" "}
                                      +{" "}
                                      {(
                                        customPackageDetails.bonusCredits / 100
                                      ).toLocaleString()}{" "}
                                      free)
                                    </span>
                                  )}
                                </span>
                              </div>

                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                  Total Authentications:
                                </span>
                                <span className="font-semibold text-blue-600">
                                  {customPackageDetails.totalAuth}{" "}
                                  authentication
                                  {customPackageDetails.totalAuth !== 1
                                    ? "s"
                                    : ""}
                                  {customPackageDetails.bonusAuth > 0 && (
                                    <span className="text-xs text-green-600 ml-1">
                                      ({customAuthNum} +{" "}
                                      {customPackageDetails.bonusAuth} free)
                                    </span>
                                  )}
                                </span>
                              </div>

                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600 flex items-center gap-1">
                                  <CreditCardIcon className="h-3 w-3" />
                                  NFC Cards Included:
                                </span>
                                <span className="font-semibold text-purple-600">
                                  {customPackageDetails.nfcCards} card
                                  {customPackageDetails.nfcCards !== 1
                                    ? "s"
                                    : ""}{" "}
                                  FREE
                                </span>
                              </div>

                              <div className="border-t pt-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">
                                    Package Price:
                                  </span>
                                  <div className="text-right">
                                    <span className="font-bold text-lg text-gray-900">
                                      {formatCurrency(
                                        customPackageDetails.price
                                      )}
                                    </span>
                                    {customPackageDetails.savings > 0 && (
                                      <div className="text-xs text-green-600 font-medium">
                                        Save{" "}
                                        {formatCurrency(
                                          customPackageDetails.savings
                                        )}
                                        !
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                  <span>Effective price per auth:</span>
                                  <span>
                                    ₱
                                    {(
                                      customPackageDetails.price /
                                      customPackageDetails.totalAuth
                                    ).toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                  </div>

                  {dynamicCustomPackage && customPackageDetails && (
                    <div className="border-t pt-4 space-y-2">
                      <h4 className="font-medium text-sm">Order Summary</h4>
                      <div className="space-y-1.5 text-sm">
                        <div className="flex justify-between text-gray-600">
                          <span>
                            {customAuthNum} Authentication
                            {customAuthNum !== 1 ? "s" : ""}
                            {customPackageDetails.bonusAuth > 0 && (
                              <span className="text-green-600 text-xs ml-1">
                                (+{customPackageDetails.bonusAuth} FREE)
                              </span>
                            )}
                          </span>
                          <span>
                            {formatCurrency(dynamicCustomPackage.price)}
                          </span>
                        </div>
                        <div className="flex justify-between text-purple-600 text-xs">
                          <span className="flex items-center gap-1">
                            <CreditCardIcon className="h-3 w-3" />
                            {customPackageDetails.nfcCards} NFC Card
                            {customPackageDetails.nfcCards !== 1
                              ? "s"
                              : ""}{" "}
                            included
                          </span>
                          <span className="font-medium">Free</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                          <span className="flex items-center gap-1">
                            <Truck className="h-3 w-3" />
                            Shipping Fee
                          </span>
                          <span>{formatCurrency(SHIPPING_COST)}</span>
                        </div>
                        {customPackageDetails.savings > 0 && (
                          <div className="flex justify-between text-green-600 text-xs font-medium">
                            <span>Total Savings:</span>
                            <span>
                              {formatCurrency(customPackageDetails.savings)}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between font-semibold text-base border-t pt-2">
                          <span>Total</span>
                          <span className="text-blue-600">
                            {formatCurrency(totalPrice)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}

          {showSummary && !invoiceUrl && (
            <div className="border rounded-lg p-4 space-y-3 bg-blue-50">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                Order Details
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Package:</span>
                  <span className="font-medium">
                    {activeTab === "custom"
                      ? `Custom - ${customAuthNum} Auth`
                      : activePackageData?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Credits:</span>
                  <span className="font-medium">
                    {(activePackageData?.credits || 0).toLocaleString()} credits
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Authentications:</span>
                  <span className="font-medium text-blue-600">
                    {activePackageData
                      ? getAuthenticationCount(
                          activePackageData.credits,
                          activePackageData.freeAuthentications || 0
                        )
                      : 0}
                    {activeTab === "packages" &&
                      activePackageData?.freeAuthentications &&
                      activePackageData.freeAuthentications > 0 && (
                        <span>
                          {" "}
                          ({Math.floor(activePackageData.credits / 1000)} +{" "}
                          {activePackageData.freeAuthentications} free)
                        </span>
                      )}
                    {activeTab === "custom" &&
                      customPackageDetails?.bonusAuth &&
                      customPackageDetails.bonusAuth > 0 && (
                        <span>
                          {" "}
                          ({customAuthNum} + {customPackageDetails.bonusAuth}{" "}
                          free)
                        </span>
                      )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 flex items-center gap-1">
                    <CreditCardIcon className="h-3 w-3" />
                    NFC Cards:
                  </span>
                  <span className="font-medium text-purple-600">
                    {selectedNfcCards} card{selectedNfcCards !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 flex items-center gap-1">
                    <Truck className="h-3 w-3" />
                    Shipping:
                  </span>
                  <span className="font-medium">
                    {formatCurrency(SHIPPING_COST)}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-semibold">Total Amount:</span>
                  <span className="font-semibold text-blue-600 text-lg">
                    {formatCurrency(totalPrice)}
                  </span>
                </div>
              </div>
              {isProcessing && (
                <div className="flex items-center justify-center gap-2 text-blue-600 pt-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  <span className="text-sm">Creating invoice...</span>
                </div>
              )}
            </div>
          )}

          {invoiceUrl && (
            <div className="border rounded-lg p-4 space-y-3 bg-gray-50">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Purchase Details
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Package:</span>
                  <span className="font-medium">
                    {activeTab === "custom"
                      ? `Custom - ${customAuthNum} Auth`
                      : activePackageData?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Credits:</span>
                  <span className="font-medium">
                    {(activePackageData?.credits || 0).toLocaleString()} credits
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Authentications:</span>
                  <span className="font-medium text-blue-600">
                    {activePackageData
                      ? getAuthenticationCount(
                          activePackageData.credits,
                          activePackageData.freeAuthentications || 0
                        )
                      : 0}
                    {activeTab === "custom" &&
                      customPackageDetails?.bonusAuth &&
                      customPackageDetails.bonusAuth > 0 && (
                        <span className="text-xs text-green-600">
                          {" "}
                          (includes {customPackageDetails.bonusAuth} free)
                        </span>
                      )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 flex items-center gap-1">
                    <CreditCardIcon className="h-3 w-3" />
                    NFC Cards:
                  </span>
                  <span className="font-medium text-purple-600">
                    {selectedNfcCards} card{selectedNfcCards !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 flex items-center gap-1">
                    <Truck className="h-3 w-3" />
                    Shipping:
                  </span>
                  <span className="font-medium">
                    {formatCurrency(SHIPPING_COST)}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-semibold">Total Amount:</span>
                  <span className="font-semibold text-blue-600 text-lg">
                    {formatCurrency(totalPrice)}
                  </span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            {!invoiceUrl ? (
              <>
                <Button
                  variant="outline"
                  onClick={handleClose}
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
                <Button
                  disabled={isProcessing || !activePackageData}
                  onClick={handleBuyNow}
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Buy Now
                    </div>
                  )}
                </Button>
              </>
            ) : (
              <div className="flex gap-2 w-full">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  disabled={isRedirecting}
                  className="flex-1"
                >
                  Close
                </Button>
                <Button
                  onClick={handleRedirectToInvoice}
                  disabled={isRedirecting}
                  className="flex-1"
                >
                  {isRedirecting ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Redirecting...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4" />
                      Proceed to Payment
                    </div>
                  )}
                </Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TopUp;
