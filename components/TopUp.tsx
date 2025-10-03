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
  ArrowLeft,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/components/auth-provider";
import { useCredits } from "@/hooks/use-credits";
import { fetchPackages } from "@/lib/api-top-up";
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

interface ShippingDetails {
  fullName: string;
  email: string;
  phoneNumber: string;
  streetAddress: string;
  barangay: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
}

interface TopUpProps {
  buttonText?: string;
  buttonVariant?: "default" | "outline" | "ghost" | "secondary";
  buttonSize?: "sm" | "md" | "lg";
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
  const { refetch } = useCredits();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<
    "selection" | "shipping" | "success"
  >("selection");
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invoiceUrl, setInvoiceUrl] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [customAuthNumber, setCustomAuthNumber] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("packages");
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoadingPackages, setIsLoadingPackages] = useState(false);
  const [packageError, setPackageError] = useState<string | null>(null);
  const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
    fullName: "",
    email: user?.email || "",
    phoneNumber: "",
    streetAddress: "",
    barangay: "",
    city: "",
    province: "",
    postalCode: "",
    country: "Philippines",
  });

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

  useEffect(() => {
    if (user?.email && isOpen) {
      setShippingDetails((prev) => ({
        ...prev,
        email: user.email,
        fullName: prev.fullName || user.name || "",
      }));
    }
  }, [user, isOpen]);

  const selectedPackageData = packages.find(
    (pkg) => pkg.id === selectedPackage
  );

  const calculateCustomPackage = (authCount: number) => {
    let bonusCredits = 0;
    let bonusAuth = 0;

    if (authCount >= 6 && authCount < 12) {
      bonusAuth = Math.floor(authCount / 6);
      bonusCredits = bonusAuth * 1000;
    } else if (authCount >= 12 && authCount < 20) {
      bonusAuth = Math.floor(authCount / 12) * 3;
      bonusCredits = bonusAuth * 1000;
    } else if (authCount >= 20) {
      bonusAuth = Math.floor(authCount / 20) * 5;
      bonusCredits = bonusAuth * 1000;
    }

    const baseCredits = authCount * 1000;
    const totalCredits = baseCredits + bonusCredits;
    const price = authCount * 1000;
    const totalAuth = authCount + bonusAuth;
    const nfcCards = totalAuth;

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

  const validateShippingDetails = (): boolean => {
    const required = [
      "fullName",
      "email",
      "phoneNumber",
      "streetAddress",
      "barangay",
      "city",
      "province",
    ];

    for (const field of required) {
      if (!shippingDetails[field as keyof ShippingDetails]?.trim()) {
        setError(`Please fill in all required fields`);
        return false;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(shippingDetails.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    return true;
  };

  const handleProceedToShipping = () => {
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

    setError(null);
    setCurrentStep("shipping");
  };

  const handlePlaceOrder = async () => {
    if (!user?.id) {
      setError("User not authenticated");
      return;
    }

    if (!validateShippingDetails()) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Build the request payload to match backend expectations
      const payload: any = {
        user_id: user.id,
        shipping: {
          full_name: shippingDetails.fullName,
          email: shippingDetails.email,
          phone: shippingDetails.phoneNumber,
          street: shippingDetails.streetAddress,
          barangay: shippingDetails.barangay,
          city: shippingDetails.city,
          province: shippingDetails.province,
          postal_code: shippingDetails.postalCode,
          country: shippingDetails.country,
        },
      };

      if (activeTab === "packages" && selectedPackageData) {
        payload.credit_id = selectedPackageData.id;
      } else if (activeTab === "custom") {
        payload.custom_authentications = parseInt(customAuthNumber);
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/authenticator/top-up`,
        payload,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      const data = await response.json();

      if (data.success && data.invoice_url) {
        setInvoiceUrl(data.invoice_url);
        setCurrentStep("success");
        setTimeout(() => {
          handleRedirectToInvoice();
        }, 2000);
      } else {
        setError(data.message || "Payment processing failed");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Payment processing failed"
      );
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
      setCurrentStep("selection");
      setSelectedPackage(null);
      setError(null);
      setInvoiceUrl(null);
      setIsRedirecting(false);
      setCustomAuthNumber("");
      setActiveTab("packages");
      setShippingDetails({
        fullName: "",
        email: user?.email || "",
        phoneNumber: "",
        streetAddress: "",
        barangay: "",
        city: "",
        province: "",
        postalCode: "",
        country: "Philippines",
      });
    }
  };

  const handleShippingChange = (
    field: keyof ShippingDetails,
    value: string
  ) => {
    setShippingDetails((prev) => ({ ...prev, [field]: value }));
    setError(null);
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
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {currentStep === "success" ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : currentStep === "shipping" ? (
                <MapPin className="h-5 w-5 text-blue-600" />
              ) : (
                <CreditCard className="h-5 w-5" />
              )}
              {currentStep === "success"
                ? "Invoice Created!"
                : currentStep === "shipping"
                ? "Shipping Details"
                : "Top Up Credits"}
            </DialogTitle>
          </DialogHeader>

          {currentStep === "success" && invoiceUrl && (
            <>
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Invoice created successfully!{" "}
                  {isRedirecting
                    ? "Redirecting to payment..."
                    : "Click below to proceed."}
                </AlertDescription>
              </Alert>

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
                    <span className="text-gray-600">Authentications:</span>
                    <span className="font-medium text-blue-600">
                      {activePackageData
                        ? getAuthenticationCount(
                            activePackageData.credits,
                            activePackageData.freeAuthentications || 0
                          )
                        : 0}
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
            </>
          )}

          {currentStep === "shipping" && (
            <>
              <Button
                variant="ghost"
                onClick={() => setCurrentStep("selection")}
                className="w-fit"
                size="sm"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Package Selection
              </Button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">
                    Contact Information
                  </h3>
                  <div>
                    <Label htmlFor="fullName">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="fullName"
                      placeholder="Enter your full name"
                      value={shippingDetails.fullName}
                      onChange={(e) =>
                        handleShippingChange("fullName", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={shippingDetails.email}
                      onChange={(e) =>
                        handleShippingChange("email", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="phoneNumber">
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phoneNumber"
                      placeholder="09XXXXXXXXX"
                      value={shippingDetails.phoneNumber}
                      onChange={(e) =>
                        handleShippingChange("phoneNumber", e.target.value)
                      }
                    />
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Address Information
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="streetAddress">
                          Street Address <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="streetAddress"
                          placeholder="House No., Street Name"
                          value={shippingDetails.streetAddress}
                          onChange={(e) =>
                            handleShippingChange(
                              "streetAddress",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="barangay">
                            Barangay <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="barangay"
                            value={shippingDetails.barangay}
                            onChange={(e) =>
                              handleShippingChange("barangay", e.target.value)
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="city">
                            City <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="city"
                            value={shippingDetails.city}
                            onChange={(e) =>
                              handleShippingChange("city", e.target.value)
                            }
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="province">
                            Province <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="province"
                            value={shippingDetails.province}
                            onChange={(e) =>
                              handleShippingChange("province", e.target.value)
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="postalCode">Postal Code</Label>
                          <Input
                            id="postalCode"
                            value={shippingDetails.postalCode}
                            onChange={(e) =>
                              handleShippingChange("postalCode", e.target.value)
                            }
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          value={shippingDetails.country}
                          disabled
                          className="bg-gray-50"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Order Summary</h3>
                  <div className="border rounded-lg p-4 bg-gray-50 space-y-4 sticky top-4">
                    <div className="space-y-1.5 text-sm">
                      <div className="flex justify-between text-gray-600">
                        <span>
                          {activeTab === "custom"
                            ? `Custom - ${customAuthNum} Auth`
                            : activePackageData?.name}
                        </span>
                        <span>
                          {formatCurrency(activePackageData?.price || 0)}
                        </span>
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

                    <Button
                      onClick={handlePlaceOrder}
                      disabled={isProcessing}
                      className="w-full"
                      size="lg"
                    >
                      {isProcessing ? (
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          Processing...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          Place Order
                        </div>
                      )}
                    </Button>
                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {currentStep === "selection" && (
            <>
              {(error || packageError) && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error || packageError}</AlertDescription>
                </Alert>
              )}

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
                  <TabsTrigger
                    value="custom"
                    className="flex items-center gap-2"
                  >
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
                          onSelect={(id) => {
                            setSelectedPackage(id);
                            setError(null);
                          }}
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
                          <span>
                            {formatCurrency(selectedPackageData.price)}
                          </span>
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
                      <p className="text-smtext-gray-600">
                        Design your perfect package! Choose exactly how many
                        authentications you need.
                      </p>
                      <div className="mt-2 space-y-1">
                        <div className="text-xs text-blue-600 font-medium">
                          Bonus Credits Available:
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
                      <Label
                        htmlFor="customAuth"
                        className="text-sm font-medium"
                      >
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
                                    Includes {customPackageDetails.bonusAuth}{" "}
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
                                          customPackageDetails.bonusCredits /
                                          100
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
            </>
          )}

          <DialogFooter>
            {currentStep === "success" && invoiceUrl ? (
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
            ) : currentStep === "shipping" ? (
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isProcessing}
              >
                Cancel
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={handleClose}
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
                <Button
                  disabled={!activePackageData}
                  onClick={handleProceedToShipping}
                >
                  Proceed to Shipping
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TopUp;
