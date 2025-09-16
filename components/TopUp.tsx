// components/TopUp.tsx
import React, { useState } from "react";
import {
  Plus,
  CreditCard,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Coins,
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
import { useAuth } from "@/components/auth-provider";
import { useCredits } from "@/hooks/use-credits";
import axios from "axios";

interface Package {
  id: string;
  name: string;
  credits: number;
  price: number;
  popular?: boolean;
}

interface TopUpProps {
  buttonText?: string;
  buttonVariant?: "default" | "outline" | "ghost" | "secondary";
  buttonSize?: "sm" | "md" | "lg";
  packages?: Package[];
  className?: string;
}

const DEFAULT_PACKAGES: Package[] = [
  { id: "starter", name: "Starter Package", credits: 1000, price: 1000 },
  {
    id: "basic",
    name: "Basic Package",
    credits: 5000,
    price: 5000,
    popular: true,
  },
  { id: "standard", name: "Standard Package", credits: 10000, price: 10000 },
];

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const getAuthenticationCount = (credits: number): number =>
  Math.floor(credits / 1000);

const createInvoice = async (
  userId: string,
  packageData: Package
): Promise<string> => {
  const token = localStorage.getItem("accessToken");

  try {
    const response = await axios.post(
      `http://localhost:8000/api/authenticator/top-up`,
      {
        user_id: userId,
        package: packageData.name,
        credits: packageData.credits,
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
            {pkg.credits.toLocaleString()} credits
          </p>
          <p className="text-xs text-blue-600 font-medium">
            {getAuthenticationCount(pkg.credits)} authentication
            {getAuthenticationCount(pkg.credits) !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="text-right">
        <div className="font-semibold text-lg">{formatCurrency(pkg.price)}</div>
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
  packages = DEFAULT_PACKAGES,
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

  const handleProceedToPayment = async () => {
    if (!selectedPackage || !user?.id) {
      setError("Please select a package");
      return;
    }

    const packageData = packages.find((pkg) => pkg.id === selectedPackage);
    if (!packageData) {
      setError("Invalid package selected");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const url = await createInvoice(user.id, packageData);
      setInvoiceUrl(url);

      // Auto-redirect after 2 seconds
      setTimeout(() => {
        handleRedirectToInvoice();
      }, 2000);
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
        refetch(); // Refresh credits after successful payment
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
    }
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {invoiceUrl ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <CreditCard className="h-5 w-5" />
              )}
              {invoiceUrl ? "Invoice Created!" : "Top Up Credits"}
            </DialogTitle>
            <DialogDescription>
              {invoiceUrl ? (
                "Your invoice has been generated. You will be redirected to complete the payment."
              ) : (
                <>
                  Current balance:{" "}
                  <strong>{credits.toLocaleString()} credits</strong> (
                  {getAuthenticationCount(credits)} authentication
                  {getAuthenticationCount(credits) !== 1 ? "s" : ""})
                </>
              )}
            </DialogDescription>
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

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!invoiceUrl && (
            <div className="space-y-4 py-4">
              <h4 className="font-medium">Select Package</h4>
              <div className="grid gap-3">
                {packages.map((pkg) => (
                  <PackageCard
                    key={pkg.id}
                    package={pkg}
                    isSelected={selectedPackage === pkg.id}
                    onSelect={setSelectedPackage}
                  />
                ))}
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
                  disabled={!selectedPackage || isProcessing}
                  onClick={handleProceedToPayment}
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Create Invoice
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
