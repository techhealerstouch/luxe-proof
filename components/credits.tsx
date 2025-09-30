// import React, { useState, useEffect } from "react";
// import {
//   Plus,
//   Coins,
//   CreditCard,
//   CheckCircle,
//   AlertCircle,
//   ExternalLink,
// } from "lucide-react";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { useAuth } from "@/components/auth-provider";
// import {
//   fetchCredits,
//   createInvoice,
//   formatCurrency,
//   getAuthenticationCount,
//   DEFAULT_PACKAGES,
//   type Package,
// } from "@/lib/credit-service";

// interface CreditsProps {
//   showTopUpButton?: boolean;
//   size?: "sm" | "md" | "lg";
//   variant?: "default" | "secondary" | "destructive" | "outline";
//   onCreditsUpdate?: (credits: number) => void;
// }

// // Main Credits Component
// const Credits: React.FC<CreditsProps> = ({
//   showTopUpButton = true,
//   size = "md",
//   variant,
//   onCreditsUpdate,
// }) => {
//   const { user } = useAuth();
//   const [credits, setCredits] = useState<number>(0);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   // Load credits on mount
//   useEffect(() => {
//     loadCredits();
//   }, []);

//   const loadCredits = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const fetchedCredits = await fetchCredits();
//       setCredits(fetchedCredits);
//       onCreditsUpdate?.(fetchedCredits);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Failed to load credits");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getBadgeVariant = () => {
//     if (variant) return variant;
//     if (credits < 1000) return "destructive";
//     if (credits < 5000) return "secondary";
//     return "default";
//   };

//   const getSizeClasses = () => {
//     const classes = {
//       sm: {
//         badge: "text-xs px-2 py-1",
//         button: "px-3 py-1.5 text-sm",
//         icon: "h-3 w-3",
//       },
//       md: {
//         badge: "text-sm px-2.5 py-1.5",
//         button: "px-4 py-2",
//         icon: "h-4 w-4",
//       },
//       lg: {
//         badge: "text-base px-3 py-2",
//         button: "px-6 py-3 text-lg",
//         icon: "h-5 w-5",
//       },
//     };
//     return classes[size];
//   };

//   const sizeClasses = getSizeClasses();

//   if (loading) {
//     return (
//       <div className="flex items-center gap-2">
//         <Badge
//           variant="outline"
//           className={`flex items-center gap-1 ${sizeClasses.badge}`}
//         >
//           <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
//           Loading...
//         </Badge>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center gap-2">
//         <Badge
//           variant="destructive"
//           className={`flex items-center gap-1 ${sizeClasses.badge}`}
//         >
//           <AlertCircle className={sizeClasses.icon} />
//           Error
//         </Badge>
//         {showTopUpButton && (
//           <Button variant="outline" size="sm" onClick={loadCredits}>
//             Retry
//           </Button>
//         )}
//       </div>
//     );
//   }

//   return (
//     <div className="flex items-center gap-2">
//       <Badge
//         variant={getBadgeVariant()}
//         className={`flex items-center gap-1 ${sizeClasses.badge}`}
//       >
//         <Coins className={sizeClasses.icon} />
//         {credits.toLocaleString()} credits
//       </Badge>

//       {showTopUpButton && (
//         <TopUpDialog
//           currentCredits={credits}
//           onSuccess={loadCredits}
//           size={size}
//           userId={user?.id}
//         />
//       )}
//     </div>
//   );
// };

// // Top-up Dialog Component
// interface TopUpDialogProps {
//   currentCredits: number;
//   onSuccess: () => void;
//   size: "sm" | "md" | "lg";
//   userId?: string;
// }

// const TopUpDialog: React.FC<TopUpDialogProps> = ({
//   currentCredits,
//   onSuccess,
//   size,
//   userId,
// }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [invoiceUrl, setInvoiceUrl] = useState<string | null>(null);
//   const [isRedirecting, setIsRedirecting] = useState(false);

//   const sizeClasses = {
//     sm: { button: "px-3 py-1.5 text-sm", icon: "h-3 w-3" },
//     md: { button: "px-4 py-2", icon: "h-4 w-4" },
//     lg: { button: "px-6 py-3 text-lg", icon: "h-5 w-5" },
//   }[size];

//   const handleProceedToPayment = async () => {
//     if (!selectedPackage || !userId) {
//       setError("Please select a package");
//       return;
//     }

//     const packageData = DEFAULT_PACKAGES.find(
//       (pkg) => pkg.id === selectedPackage
//     );
//     if (!packageData) {
//       setError("Invalid package selected");
//       return;
//     }

//     setIsProcessing(true);
//     setError(null);

//     try {
//       const invoiceUrl = await createInvoice(userId, packageData);
//       setInvoiceUrl(invoiceUrl);

//       // Auto-redirect after 2 seconds
//       setTimeout(() => {
//         handleRedirectToInvoice();
//       }, 2000);
//     } catch (err) {
//       setError(
//         err instanceof Error ? err.message : "Payment processing failed"
//       );
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const handleRedirectToInvoice = () => {
//     if (invoiceUrl) {
//       setIsRedirecting(true);
//       window.open(invoiceUrl, "_blank", "noopener,noreferrer");

//       setTimeout(() => {
//         setIsRedirecting(false);
//         handleClose();
//         onSuccess();
//       }, 1000);
//     }
//   };

//   const handleClose = () => {
//     if (!isProcessing && !isRedirecting) {
//       setIsOpen(false);
//       setSelectedPackage(null);
//       setError(null);
//       setInvoiceUrl(null);
//       setIsRedirecting(false);
//     }
//   };

//   return (
//     <>
//       <Button
//         variant="outline"
//         size="sm"
//         className={sizeClasses.button}
//         onClick={() => setIsOpen(true)}
//       >
//         <Plus className={`${sizeClasses.icon} mr-1`} />
//         <span className="hidden sm:inline">Top Up</span>
//       </Button>

//       <Dialog open={isOpen} onOpenChange={setIsOpen}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2">
//               {invoiceUrl ? (
//                 <CheckCircle className="h-5 w-5 text-green-600" />
//               ) : (
//                 <CreditCard className="h-5 w-5" />
//               )}
//               {invoiceUrl ? "Invoice Created!" : "Top Up Credits"}
//             </DialogTitle>
//             <DialogDescription>
//               {invoiceUrl ? (
//                 "Your invoice has been generated. You will be redirected to complete the payment."
//               ) : (
//                 <>
//                   Current balance:{" "}
//                   <strong>{currentCredits.toLocaleString()} credits</strong> (
//                   {getAuthenticationCount(currentCredits)} authentication
//                   {getAuthenticationCount(currentCredits) !== 1 ? "s" : ""})
//                 </>
//               )}
//             </DialogDescription>
//           </DialogHeader>

//           {invoiceUrl && (
//             <Alert className="border-green-200 bg-green-50">
//               <CheckCircle className="h-4 w-4 text-green-600" />
//               <AlertDescription className="text-green-800">
//                 Invoice created successfully!{" "}
//                 {isRedirecting
//                   ? "Redirecting to payment..."
//                   : "Click below to proceed."}
//               </AlertDescription>
//             </Alert>
//           )}

//           {error && (
//             <Alert variant="destructive">
//               <AlertCircle className="h-4 w-4" />
//               <AlertDescription>{error}</AlertDescription>
//             </Alert>
//           )}

//           {!invoiceUrl && (
//             <div className="space-y-4 py-4">
//               <h4 className="font-medium">Select Package</h4>
//               <div className="grid gap-3">
//                 {DEFAULT_PACKAGES.map((pkg) => (
//                   <PackageCard
//                     key={pkg.id}
//                     package={pkg}
//                     isSelected={selectedPackage === pkg.id}
//                     onSelect={setSelectedPackage}
//                   />
//                 ))}
//               </div>
//             </div>
//           )}

//           <DialogFooter>
//             {!invoiceUrl ? (
//               <>
//                 <Button
//                   variant="outline"
//                   onClick={handleClose}
//                   disabled={isProcessing}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   disabled={!selectedPackage || isProcessing}
//                   onClick={handleProceedToPayment}
//                 >
//                   {isProcessing ? (
//                     <div className="flex items-center gap-2">
//                       <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
//                       Processing...
//                     </div>
//                   ) : (
//                     <div className="flex items-center gap-2">
//                       <CreditCard className="h-4 w-4" />
//                       Create Invoice
//                     </div>
//                   )}
//                 </Button>
//               </>
//             ) : (
//               <div className="flex gap-2 w-full">
//                 <Button
//                   variant="outline"
//                   onClick={handleClose}
//                   disabled={isRedirecting}
//                   className="flex-1"
//                 >
//                   Close
//                 </Button>
//                 <Button
//                   onClick={handleRedirectToInvoice}
//                   disabled={isRedirecting}
//                   className="flex-1"
//                 >
//                   {isRedirecting ? (
//                     <div className="flex items-center gap-2">
//                       <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
//                       Redirecting...
//                     </div>
//                   ) : (
//                     <div className="flex items-center gap-2">
//                       <ExternalLink className="h-4 w-4" />
//                       Proceed to Payment
//                     </div>
//                   )}
//                 </Button>
//               </div>
//             )}
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// };

// // Package Card Component
// interface PackageCardProps {
//   package: Package;
//   isSelected: boolean;
//   onSelect: (id: string) => void;
// }

// const PackageCard: React.FC<PackageCardProps> = ({
//   package: pkg,
//   isSelected,
//   onSelect,
// }) => {
//   return (
//     <div
//       className={`relative flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
//         isSelected
//           ? "border-blue-500 bg-blue-50 shadow-md"
//           : "border-gray-200 hover:border-blue-300 hover:shadow-sm"
//       } ${pkg.popular && !isSelected ? "border-blue-200 bg-blue-25" : ""}`}
//       onClick={() => onSelect(pkg.id)}
//     >
//       {pkg.popular && (
//         <Badge className="absolute -top-2 right-2 text-xs bg-blue-500">
//           Popular
//         </Badge>
//       )}

//       <div>
//         <h4 className="font-semibold text-gray-900">{pkg.name}</h4>
//         <div className="space-y-1">
//           <p className="text-sm text-gray-600 flex items-center gap-1">
//             <Coins className="h-3 w-3" />
//             {pkg.credits.toLocaleString()} credits
//           </p>
//           <p className="text-xs text-blue-600 font-medium">
//             {getAuthenticationCount(pkg.credits)} authentication
//             {getAuthenticationCount(pkg.credits) !== 1 ? "s" : ""}
//           </p>
//         </div>
//       </div>

//       <div className="text-right">
//         <div className="font-semibold text-lg">{formatCurrency(pkg.price)}</div>
//         <div className="text-xs text-gray-500">
//           ₱{(pkg.price / pkg.credits).toFixed(2)}/credit
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Credits;
