// utils/generate-csv.tsx

import type { BillingData } from "@/types/billing/billing";

/**
 * Escapes CSV special characters and wraps in quotes if necessary
 * @param value - Value to escape
 * @returns Escaped CSV value
 */
export const escapeCSV = (value: any): string => {
  if (value === null || value === undefined) return "";

  const stringValue = String(value);

  // If the value contains commas, quotes, or newlines, wrap in quotes and escape internal quotes
  if (
    stringValue.includes(",") ||
    stringValue.includes('"') ||
    stringValue.includes("\n") ||
    stringValue.includes("\r")
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
};

/**
 * Converts array of objects to CSV format
 * @param data - Array of objects to convert
 * @param headers - Array of header names
 * @returns CSV string
 */
export const arrayToCSV = (data: any[], headers: string[]): string => {
  if (!data || data.length === 0) return "";

  // Create header row
  const headerRow = headers.map((header) => escapeCSV(header)).join(",");

  // Create data rows
  const dataRows = data.map((item) => {
    return headers
      .map((header) => {
        const value = item[header] || "";
        return escapeCSV(value);
      })
      .join(",");
  });

  return [headerRow, ...dataRows].join("\n");
};

/**
 * Generates CSV content for subscription data
 * @param subscriptions - Array of subscription objects
 * @returns CSV string for subscriptions
 */
const generateSubscriptionsCSV = (subscriptions: any[]): string => {
  if (!subscriptions || subscriptions.length === 0) return "";

  const headers = [
    "id",
    "plan_name",
    "service",
    "amount",
    "currency",
    "status",
    "start_date",
    "end_date",
    "description",
    "features",
  ];

  const formattedData = subscriptions.map((subscription, index) => ({
    id: subscription.id || index + 1,
    plan_name: subscription.plan.name,
    service: subscription.service,
    amount: subscription.price,
    currency: "USD",
    status: subscription.status,
    start_date: subscription.start_date,
    end_date: subscription.end_date,
    description: subscription.plan.description || "",
    features: subscription.plan.features
      ? subscription.plan.features.join("; ")
      : "",
  }));

  return arrayToCSV(formattedData, headers);
};

/**
 * Generates CSV content for credits invoices data
 * @param invoices - Array of invoice objects
 * @returns CSV string for credits invoices
 */
const generateCreditsInvoicesCSV = (invoices: any[]): string => {
  if (!invoices || invoices.length === 0) return "";

  const headers = [
    "id",
    "credit_name",
    "quantity",
    "amount",
    "currency",
    "status",
    "created_date",
    "payment_url",
    "description",
  ];

  const formattedData = invoices.map((invoice) => ({
    id: invoice.id,
    credit_name: invoice.credit?.name || "Credits Top up",
    quantity: invoice.quantity,
    amount: invoice.amount,
    currency: "USD",
    status: invoice.status,
    created_date: invoice.created_at,
    payment_url: invoice.payment_url || "",
    description: invoice.description || "",
  }));

  return arrayToCSV(formattedData, headers);
};

/**
 * Generates CSV content for billing history data
 * @param billingHistory - Array of billing history objects
 * @returns CSV string for billing history
 */
const generateBillingHistoryCSV = (billingHistory: any[]): string => {
  if (!billingHistory || billingHistory.length === 0) return "";

  const headers = ["id", "date", "amount", "description", "type", "status"];

  const formattedData = billingHistory.map((item, index) => ({
    id: item.id || index + 1,
    date: item.date || "",
    amount: item.amount || "",
    description: item.description || "",
    type: item.type || "",
    status: item.status || "",
  }));

  return arrayToCSV(formattedData, headers);
};

/**
 * Generates CSV content for current plan data
 * @param currentPlan - Current plan object
 * @returns CSV string for current plan
 */
const generateCurrentPlanCSV = (currentPlan: any): string => {
  if (!currentPlan) return "";

  const headers = [
    "name",
    "type",
    "price",
    "billing_cycle",
    "next_billing_date",
    "features",
  ];

  const formattedData = [
    {
      name: currentPlan.name,
      type: currentPlan.type,
      price: currentPlan.price,
      billing_cycle: currentPlan.billingCycle,
      next_billing_date: currentPlan.nextBillingDate || "",
      features: currentPlan.features ? currentPlan.features.join("; ") : "",
    },
  ];

  return arrayToCSV(formattedData, headers);
};

/**
 * Generates comprehensive CSV export for all billing/payment data in separate sheets
 * @param billingData - Complete billing data object
 * @param filteredInvoices - Optional filtered invoices array
 * @returns Object containing CSV content for each data type
 */
export const generatePaymentsCSVSeparate = (
  billingData: BillingData,
  filteredInvoices?: any[]
): { [key: string]: string } => {
  const csvData: { [key: string]: string } = {};

  // Generate separate CSV content for each data type
  if (billingData.subscriptions && billingData.subscriptions.length > 0) {
    csvData.subscriptions = generateSubscriptionsCSV(billingData.subscriptions);
  }

  const invoicesToExport =
    filteredInvoices || billingData.creditsInvoices || [];
  if (invoicesToExport.length > 0) {
    csvData.credits_invoices = generateCreditsInvoicesCSV(invoicesToExport);
  }

  if (billingData.billingHistory && billingData.billingHistory.length > 0) {
    csvData.billing_history = generateBillingHistoryCSV(
      billingData.billingHistory
    );
  }

  if (billingData.currentPlan) {
    csvData.current_plan = generateCurrentPlanCSV(billingData.currentPlan);
  }

  return csvData;
};

/**
 * Generates a single combined CSV export for all billing/payment data
 * @param billingData - Complete billing data object
 * @param filteredInvoices - Optional filtered invoices array
 * @returns Single CSV string with all data
 */
export const generatePaymentsCSVCombined = (
  billingData: BillingData,
  filteredInvoices?: any[]
): string => {
  const csvSections: string[] = [];
  const timestamp = new Date().toISOString();

  // Add metadata header
  csvSections.push(`# Payments Export - Generated on ${timestamp}`);
  csvSections.push("");

  // Add subscriptions section
  if (billingData.subscriptions && billingData.subscriptions.length > 0) {
    csvSections.push("# SUBSCRIPTIONS");
    csvSections.push(generateSubscriptionsCSV(billingData.subscriptions));
    csvSections.push("");
  }

  // Add credits invoices section
  const invoicesToExport =
    filteredInvoices || billingData.creditsInvoices || [];
  if (invoicesToExport.length > 0) {
    csvSections.push("# CREDITS INVOICES");
    csvSections.push(generateCreditsInvoicesCSV(invoicesToExport));
    csvSections.push("");
  }

  // Add billing history section
  if (billingData.billingHistory && billingData.billingHistory.length > 0) {
    csvSections.push("# BILLING HISTORY");
    csvSections.push(generateBillingHistoryCSV(billingData.billingHistory));
    csvSections.push("");
  }

  // Add current plan section
  if (billingData.currentPlan) {
    csvSections.push("# CURRENT PLAN");
    csvSections.push(generateCurrentPlanCSV(billingData.currentPlan));
  }

  return csvSections.join("\n");
};

/**
 * Downloads a CSV file to the user's device
 * @param csvContent - CSV content as string
 * @param filename - Desired filename for the download
 */
export const downloadCSVFile = (csvContent: string, filename: string): void => {
  try {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the URL object
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Failed to download CSV file:", error);
    throw new Error("CSV download failed");
  }
};

/**
 * Downloads multiple CSV files as a ZIP (requires JSZip library)
 * For now, downloads the first available CSV or combined version
 * @param csvData - Object containing multiple CSV contents
 * @param baseFilename - Base filename for downloads
 */
export const downloadMultipleCSVFiles = (
  csvData: { [key: string]: string },
  baseFilename: string = "payments_export"
): void => {
  const timestamp = new Date().toISOString().split("T")[0];

  // If only one type of data, download single file
  const csvKeys = Object.keys(csvData);
  if (csvKeys.length === 1) {
    const key = csvKeys[0];
    const filename = `${baseFilename}_${key}_${timestamp}.csv`;
    downloadCSVFile(csvData[key], filename);
    return;
  }

  // For multiple files, download each separately
  // In a real implementation, you might want to use JSZip to create a ZIP file
  csvKeys.forEach((key) => {
    const filename = `${baseFilename}_${key}_${timestamp}.csv`;
    setTimeout(() => {
      downloadCSVFile(csvData[key], filename);
    }, 100 * csvKeys.indexOf(key)); // Stagger downloads slightly
  });
};

/**
 * Generates a timestamped filename for CSV exports
 * @param prefix - Optional prefix for the filename
 * @param suffix - Optional suffix before the timestamp
 * @returns Formatted filename with timestamp
 */
export const generateCSVFilename = (
  prefix: string = "payments_export",
  suffix: string = ""
): string => {
  const timestamp = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const suffixPart = suffix ? `_${suffix}` : "";
  return `${prefix}${suffixPart}_${timestamp}.csv`;
};

/**
 * Validates CSV content before download
 * @param csvContent - CSV content to validate
 * @returns Boolean indicating if CSV is valid
 */
export const validateCSVContent = (csvContent: string): boolean => {
  try {
    if (!csvContent || csvContent.trim().length === 0) return false;

    // Basic validation - check if it has at least one line
    const lines = csvContent.split("\n");
    return lines.length > 0 && lines[0].trim().length > 0;
  } catch (error) {
    console.error("CSV validation error:", error);
    return false;
  }
};

/**
 * Comprehensive export function that handles the entire CSV generation and download process
 * @param billingData - Complete billing data
 * @param filteredInvoices - Optional filtered invoices
 * @param exportType - 'combined' or 'separate' export type
 * @param filename - Optional custom filename
 * @returns Promise that resolves when download is complete
 */
export const exportPaymentsAsCSV = async (
  billingData: BillingData,
  filteredInvoices?: any[],
  exportType: "combined" | "separate" = "combined",
  filename?: string
): Promise<void> => {
  try {
    if (exportType === "separate") {
      // Generate separate CSV files for each data type
      const csvData = generatePaymentsCSVSeparate(
        billingData,
        filteredInvoices
      );

      // Validate at least one CSV has content
      const hasContent = Object.values(csvData).some((csv) =>
        validateCSVContent(csv)
      );
      if (!hasContent) {
        throw new Error("No valid CSV content to export");
      }

      // Download multiple files
      const baseFilename = filename
        ? filename.replace(".csv", "")
        : "payments_export";
      downloadMultipleCSVFiles(csvData, baseFilename);
    } else {
      // Generate combined CSV file
      const csvContent = generatePaymentsCSVCombined(
        billingData,
        filteredInvoices
      );

      // Validate CSV content
      if (!validateCSVContent(csvContent)) {
        throw new Error("Generated CSV content is invalid");
      }

      // Generate filename if not provided
      const finalFilename = filename || generateCSVFilename();

      // Download the file
      downloadCSVFile(csvContent, finalFilename);
    }
  } catch (error) {
    console.error("CSV export failed:", error);
    throw error;
  }
};

/**
 * Export only credits invoices as CSV
 * @param invoices - Array of invoice objects
 * @param filename - Optional custom filename
 */
export const exportInvoicesAsCSV = async (
  invoices: any[],
  filename?: string
): Promise<void> => {
  try {
    const csvContent = generateCreditsInvoicesCSV(invoices);

    if (!validateCSVContent(csvContent)) {
      throw new Error("No invoice data to export");
    }

    const finalFilename = filename || generateCSVFilename("invoices_export");
    downloadCSVFile(csvContent, finalFilename);
  } catch (error) {
    console.error("Invoice CSV export failed:", error);
    throw error;
  }
};
