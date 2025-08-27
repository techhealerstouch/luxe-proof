// components/forms/Step1Form.tsx
"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { FileInput } from "@/components/ui/file-input";
import { UseFormReturn } from "react-hook-form";
import { AlertCircle, FileCheck, Upload } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type Step1FormProps = {
  form: UseFormReturn<any>;
  onSubmit: (data: any) => void;
  onBack: () => void;
  step: number;
  isLoading?: boolean;
};

export function Step1Form({
  form,
  onSubmit,
  onBack,
  step,
  isLoading = false,
}: Step1FormProps) {
  const { control, handleSubmit, watch, formState } = form;

  // Watch required fields to show progress
  const warrantyCard = watch("warranty_card");
  const purchaseReceipts = watch("purchase_receipts");
  const authorizedDealer = watch("authorized_dealer");
  const warrantyCardNotes = watch("warranty_card_notes");

  const requiredFieldsCompleted = [
    warrantyCard?.length > 0,
    purchaseReceipts?.length > 0,
    authorizedDealer !== undefined,
    warrantyCardNotes?.trim(),
  ].filter(Boolean).length;

  const totalRequiredFields = 4;

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-blue-900">Documentation Review</h3>
          <div className="flex items-center gap-2 text-sm text-blue-700">
            <FileCheck className="h-4 w-4" />
            {requiredFieldsCompleted}/{totalRequiredFields} required fields
            completed
          </div>
        </div>
        <div className="w-full bg-blue-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-in-out"
            style={{
              width: `${
                (requiredFieldsCompleted / totalRequiredFields) * 100
              }%`,
            }}
          />
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Warranty Card Upload */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <FormField
              name="warranty_card"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2 mb-3">
                    <Upload className="h-5 w-5 text-blue-600" />
                    <FormLabel className="text-base font-semibold">
                      Warranty Card *
                    </FormLabel>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Upload clear images or PDF of the warranty card. Multiple
                    files supported.
                  </p>
                  <FormControl>
                    <FileInput
                      value={field.value || []}
                      onChange={(newFiles: File[]) => field.onChange(newFiles)}
                      accept="image/*,.pdf"
                      maxSize={10} // 10MB
                      className="border-dashed border-2 border-blue-200 hover:border-blue-300"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Purchase Receipts Upload */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <FormField
              name="purchase_receipts"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2 mb-3">
                    <Upload className="h-5 w-5 text-green-600" />
                    <FormLabel className="text-base font-semibold">
                      Purchase Receipts *
                    </FormLabel>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Upload purchase receipts, invoices, or proof of purchase
                    documents.
                  </p>
                  <FormControl>
                    <FileInput
                      value={field.value || []}
                      onChange={(newFiles: File[]) => field.onChange(newFiles)}
                      accept="image/*,.pdf"
                      maxSize={10}
                      className="border-dashed border-2 border-green-200 hover:border-green-300"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Service Records Upload */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <FormField
              name="service_records"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2 mb-3">
                    <Upload className="h-5 w-5 text-purple-600" />
                    <FormLabel className="text-base font-semibold">
                      Service Records
                    </FormLabel>
                    <span className="text-sm text-gray-500">(Optional)</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Upload any service records, maintenance documents, or repair
                    history.
                  </p>
                  <FormControl>
                    <FileInput
                      value={field.value || []}
                      onChange={(newFiles: File[]) => field.onChange(newFiles)}
                      accept="image/*,.pdf"
                      maxSize={10}
                      className="border-dashed border-2 border-purple-200 hover:border-purple-300"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Authorized Dealer */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <FormField
              name="authorized_dealer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold mb-4 block">
                    Is the dealer an authorized dealer? *
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) =>
                        field.onChange(value === "true")
                      }
                      value={
                        field.value === true
                          ? "true"
                          : field.value === false
                          ? "false"
                          : ""
                      }
                      className="grid grid-cols-2 gap-4"
                    >
                      <div className="flex items-center space-x-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
                        <FormControl>
                          <RadioGroupItem
                            value="true"
                            className="text-green-600"
                          />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer flex-1">
                          Yes - Authorized Dealer
                        </FormLabel>
                      </div>
                      <div className="flex items-center space-x-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
                        <FormControl>
                          <RadioGroupItem
                            value="false"
                            className="text-red-600"
                          />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer flex-1">
                          No - Unauthorized Dealer
                        </FormLabel>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Warranty Card Notes */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <FormField
              name="warranty_card_notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold mb-2 block">
                    Warranty Card Analysis *
                  </FormLabel>
                  <p className="text-sm text-gray-600 mb-3">
                    Provide detailed notes about the warranty card including
                    font quality, NFC functionality, paper quality, stamps,
                    signatures, etc.
                  </p>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={4}
                      className="resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Example: Font appears crisp and consistent, NFC chip responds correctly, official dealer stamp present, handwritten serial number matches case..."
                    />
                  </FormControl>
                  <div className="flex justify-between mt-2">
                    <FormMessage />
                    <span className="text-xs text-gray-400">
                      {field.value?.length || 0} characters
                    </span>
                  </div>
                </FormItem>
              )}
            />
          </div>

          {/* Service History Notes */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <FormField
              name="service_history_notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold mb-2 block">
                    Service History Analysis
                  </FormLabel>
                  <p className="text-sm text-gray-600 mb-3">
                    Optional: Add notes about service history, replacement
                    parts, authorized service centers, or any maintenance
                    concerns.
                  </p>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={4}
                      className="resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Example: Serviced at authorized center in 2022, original bracelet replaced with genuine part, movement recently overhauled..."
                    />
                  </FormControl>
                  <div className="flex justify-between mt-2">
                    <FormMessage />
                    <span className="text-xs text-gray-400">
                      {field.value?.length || 0} characters
                    </span>
                  </div>
                </FormItem>
              )}
            />
          </div>

          {/* Validation Alert */}
          {Object.keys(formState.errors).length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please complete all required fields before proceeding.
              </AlertDescription>
            </Alert>
          )}
        </form>
      </Form>
    </div>
  );
}
