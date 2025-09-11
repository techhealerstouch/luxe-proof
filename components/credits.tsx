import React, { useState, useEffect } from "react";

// Mock UI components since we can't import the actual shadcn/ui components
const Badge = ({ children, variant = "default", className = "" }) => {
  const variantClasses = {
    default: "bg-blue-100 text-blue-800",
    secondary: "bg-gray-100 text-gray-800",
    destructive: "bg-red-100 text-red-800",
    outline: "border border-gray-300 bg-white text-gray-700",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-sm font-medium ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

const Button = ({
  children,
  variant = "default",
  size = "md",
  onClick,
  disabled = false,
  className = "",
}) => {
  const variantClasses = {
    default: "bg-blue-600 hover:bg-blue-700 text-white",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
    ghost: "text-gray-700 hover:bg-gray-100",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </button>
  );
};

const Dialog = ({ children, open, onOpenChange }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

const DialogContent = ({ children }) => <div className="p-6">{children}</div>;

const DialogHeader = ({ children }) => <div className="mb-4">{children}</div>;

const DialogTitle = ({ children }) => (
  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
    {children}
  </h3>
);

const DialogDescription = ({ children }) => (
  <p className="text-sm text-gray-600 mt-1">{children}</p>
);

const DialogFooter = ({ children }) => (
  <div className="flex gap-2 justify-end pt-4 border-t">{children}</div>
);

const Alert = ({ children, variant = "default" }) => {
  const variantClasses = {
    default: "border-blue-200 bg-blue-50",
    destructive: "border-red-200 bg-red-50",
  };

  return (
    <div className={`p-4 rounded-lg border ${variantClasses[variant]} mb-4`}>
      {children}
    </div>
  );
};

const AlertDescription = ({ children }) => (
  <div className="text-sm">{children}</div>
);

// Icons
const Plus = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4v16m8-8H4"
    />
  </svg>
);

const Coins = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <circle cx="8" cy="8" r="6" />
    <path d="M18.09 10.37A6 6 0 1 1 10.37 18.09" />
    <path d="M7 6h1v4" />
    <path d="M16.71 13.88.7.71" />
  </svg>
);

const CreditCard = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);

const Smartphone = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
    <line x1="12" y1="18" x2="12.01" y2="18" />
  </svg>
);

const Building2 = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
    <path d="M6 12H4a2 2 0 0 0-2 2v8h20v-8a2 2 0 0 0-2-2h-2" />
    <path d="M18 9h4v4h-4V9Z" />
    <path d="M14 9h4v4h-4V9Z" />
    <path d="M10 9h4v4h-4V9Z" />
  </svg>
);

const Wallet = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M17 14h.01" />
    <path d="M7 7h12a4 4 0 0 1 4 4v6a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Z" />
    <path d="M7 17V7a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v6a4 4 0 0 1-4 4h-6a4 4 0 0 1-4-4Z" />
  </svg>
);

const AlertCircle = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const CheckCircle = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22,4 12,14.01 9,11.01" />
  </svg>
);

// Main component
const defaultPackages = [
  {
    id: "starter",
    name: "Starter Package",
    credits: 1000,
    price: 1000,
    popular: false,
  },
  {
    id: "basic",
    name: "Basic Package",
    credits: 5000,
    price: 4500,
    popular: true,
    discount: 10,
  },
  {
    id: "standard",
    name: "Standard Package",
    credits: 10000,
    price: 8500,
    popular: false,
    discount: 15,
  },
];

const paymentMethods = [
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

// Helper functions
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const getAuthenticationCount = (credits) => {
  return Math.floor(credits / 1000);
};

const formatPrice = (price, discount) => {
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

// Mock payment simulation
const simulatePayment = async (packageData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 90% success rate for demo
      const success = Math.random() > 0.1;
      if (success) {
        resolve({ success: true });
      } else {
        resolve({
          success: false,
          error: "Payment was declined. Please try again.",
        });
      }
    }, 2000);
  });
};

export default function Credits({
  credits = 0,
  packages = defaultPackages,
  onPurchase = () => {},
  onPaymentSuccess = () => {},
  onPaymentError = () => {},
  loading = false,
  showTopUpButton = true,
  badgeVariant,
  size = "md",
}) {
  const [topUpDialogOpen, setTopUpDialogOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const getCreditsBadgeVariant = (credits) => {
    if (badgeVariant) return badgeVariant;
    if (credits < 1000) return "destructive";
    if (credits < 5000) return "secondary";
    return "default";
  };

  const getSizeClasses = (size) => {
    switch (size) {
      case "sm":
        return {
          badge: "text-xs px-2 py-1",
          button: "px-3 py-1.5 text-sm",
          icon: "h-2.5 w-2.5",
        };
      case "lg":
        return {
          badge: "text-base px-3 py-2",
          button: "px-6 py-3 text-lg",
          icon: "h-4 w-4",
        };
      default:
        return {
          badge: "text-sm px-2.5 py-1.5",
          button: "px-4 py-2",
          icon: "h-3 w-3",
        };
    }
  };

  const sizeClasses = getSizeClasses(size);

  const handlePaymentMethodSelect = (methodId) => {
    setSelectedPaymentMethod(methodId);
    setPaymentError(null);
  };

  const handleProceedToPayment = async () => {
    if (!selectedPackage || !selectedPaymentMethod) {
      setPaymentError("Please select a package and payment method");
      return;
    }

    const packageData = packages.find((pkg) => pkg.id === selectedPackage);
    if (!packageData) {
      setPaymentError("Invalid package selected");
      return;
    }

    setProcessingPayment(true);
    setPaymentError(null);

    try {
      console.log("Starting payment process...");

      // Simulate payment processing
      const result = await simulatePayment(packageData);

      if (result.success) {
        console.log("Payment successful!");
        setPaymentSuccess(true);

        // Call success callbacks
        onPaymentSuccess(packageData);
        onPurchase(selectedPackage, packageData);

        // Show success for 2 seconds, then close
        setTimeout(() => {
          handleDialogClose();
        }, 2000);
      } else {
        throw new Error(result.error || "Payment failed");
      }
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentError(error.message || "Payment processing failed");
      onPaymentError(error.message || "Payment processing failed");
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleDialogClose = () => {
    if (!processingPayment) {
      setTopUpDialogOpen(false);
      setSelectedPackage(null);
      setSelectedPaymentMethod(null);
      setPaymentError(null);
      setPaymentSuccess(false);
    }
  };

  const resetDialog = () => {
    setSelectedPackage(null);
    setSelectedPaymentMethod(null);
    setPaymentError(null);
    setPaymentSuccess(false);
    setProcessingPayment(false);
  };

  // Reset dialog when it opens
  useEffect(() => {
    if (topUpDialogOpen) {
      resetDialog();
    }
  }, [topUpDialogOpen]);

  return (
    <div className="flex items-center gap-2">
      <Badge
        variant={getCreditsBadgeVariant(credits)}
        className={`flex items-center gap-1 ${sizeClasses.badge}`}
      >
        <Coins className={sizeClasses.icon} />
        {credits.toLocaleString()} credits
      </Badge>

      {showTopUpButton && (
        <>
          <Button
            variant="outline"
            size="sm"
            className={sizeClasses.button}
            disabled={loading}
            onClick={() => setTopUpDialogOpen(true)}
          >
            <Plus className={`${sizeClasses.icon} mr-1`} />
            <span className="hidden sm:inline">
              {loading ? "Loading..." : "Top Up"}
            </span>
          </Button>

          <Dialog open={topUpDialogOpen} onOpenChange={setTopUpDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  <CreditCard className="h-5 w-5" />
                  {paymentSuccess ? "Payment Successful!" : "Top Up Credits"}
                </DialogTitle>
                <DialogDescription>
                  {paymentSuccess ? (
                    `Your new credit balance is ${credits.toLocaleString()} credits.`
                  ) : (
                    <>
                      Choose a credit package and payment method. Current
                      balance: {credits.toLocaleString()} credits (
                      {getAuthenticationCount(credits)} authentication
                      {getAuthenticationCount(credits) !== 1 ? "s" : ""})
                    </>
                  )}
                </DialogDescription>
              </DialogHeader>

              {paymentSuccess && (
                <Alert>
                  <div className="flex items-center gap-2 text-green-800">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription>
                      Payment completed successfully! Your credits have been
                      added.
                    </AlertDescription>
                  </div>
                </Alert>
              )}

              {paymentError && (
                <Alert variant="destructive">
                  <div className="flex items-center gap-2 text-red-800">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{paymentError}</AlertDescription>
                  </div>
                </Alert>
              )}

              {!paymentSuccess && (
                <div className="space-y-6 py-4 max-h-96 overflow-y-auto">
                  {/* Package Selection */}
                  <div>
                    <h4 className="font-medium mb-3">Select Package</h4>
                    <div className="grid gap-3">
                      {packages.map((pkg) => {
                        const pricing = formatPrice(pkg.price, pkg.discount);
                        return (
                          <div
                            key={pkg.id}
                            className={`relative flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                              selectedPackage === pkg.id
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-300 hover:border-blue-400"
                            } ${
                              pkg.popular && selectedPackage !== pkg.id
                                ? "border-blue-300 bg-blue-25"
                                : ""
                            }`}
                            onClick={() => setSelectedPackage(pkg.id)}
                          >
                            {pkg.popular && (
                              <Badge className="absolute -top-2 right-2 text-xs">
                                Popular
                              </Badge>
                            )}
                            {pkg.discount && (
                              <Badge
                                variant="secondary"
                                className="absolute -top-2 left-2 text-xs"
                              >
                                {pkg.discount}% OFF
                              </Badge>
                            )}
                            <div>
                              <h4 className="font-medium">{pkg.name}</h4>
                              <div className="space-y-1">
                                <p className="text-sm text-gray-600">
                                  {pkg.credits.toLocaleString()} credits
                                </p>
                                <p className="text-xs text-blue-600 font-medium">
                                  {getAuthenticationCount(pkg.credits)}{" "}
                                  authentication
                                  {getAuthenticationCount(pkg.credits) !== 1
                                    ? "s"
                                    : ""}
                                </p>
                              </div>
                              {pkg.discount && pricing.savings && (
                                <p className="text-xs text-green-600 font-medium">
                                  Save {formatCurrency(pricing.savings)}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-1">
                                {pricing.discounted && (
                                  <span className="text-sm text-gray-500 line-through">
                                    {formatCurrency(pricing.original)}
                                  </span>
                                )}
                                <div className="font-semibold">
                                  {formatCurrency(
                                    pricing.discounted || pricing.original
                                  )}
                                </div>
                              </div>
                              <div className="text-xs text-gray-500">
                                ₱
                                {(
                                  (pricing.discounted || pricing.original) /
                                  pkg.credits
                                ).toFixed(2)}
                                /credit
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Payment Method Selection */}
                  {selectedPackage && (
                    <div>
                      <h4 className="font-medium mb-3">
                        Select Payment Method
                      </h4>
                      <div className="grid gap-2">
                        {paymentMethods
                          .filter((method) => method.enabled)
                          .map((method) => {
                            const IconComponent = method.icon;
                            return (
                              <div
                                key={method.id}
                                className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                                  selectedPaymentMethod === method.id
                                    ? "border-blue-500 bg-blue-50"
                                    : "border-gray-300 hover:border-blue-400"
                                }`}
                                onClick={() =>
                                  handlePaymentMethodSelect(method.id)
                                }
                              >
                                <IconComponent className="h-5 w-5 text-gray-600" />
                                <div>
                                  <div className="font-medium">
                                    {method.name}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {method.description}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
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
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
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
        </>
      )}
    </div>
  );
}
