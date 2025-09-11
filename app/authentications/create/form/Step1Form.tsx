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
import { AlertCircle, FileCheck, Upload, Camera, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState, useEffect } from "react";

type Step1FormProps = {
  form: UseFormReturn<any>;
  onSubmit: (data: any) => void;
  onBack: () => void;
  step: number;
  isLoading?: boolean;
};

// Image Preview Component
const ImagePreview = ({
  file,
  onRemove,
}: {
  file: File | null;
  onRemove: () => void;
}) => {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    // Cleanup
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  if (!file || !preview) return null;

  return (
    <div className="relative mt-3 group">
      <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
        <img src={preview} alt="Preview" className="w-full h-32 object-cover" />
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-1 truncate">{file.name}</p>
    </div>
  );
};

export function Step1Form({
  form,
  onSubmit,
  onBack,
  step,
  isLoading = false,
}: Step1FormProps) {
  const { control, handleSubmit, watch, formState } = form;

  // Watch required fields to show progress (updated for single files and including watch images)
  const warrantyCard = watch("warranty_card");
  const purchaseReceipt = watch("purchase_receipt");
  const authorizedDealer = watch("is_authorized_dealer");
  const warrantyCardNotes = watch("warranty_card_notes");
  const watchImageFront = watch("watch_image_front");
  const watchImageSide = watch("watch_image_side");
  const watchImageBack = watch("watch_image_back");
  const requiredFieldsCompleted = [
    warrantyCard !== null && warrantyCard !== undefined,
    purchaseReceipt !== null && purchaseReceipt !== undefined,
    authorizedDealer !== undefined,
    warrantyCardNotes?.trim(),
    watchImageFront !== null && watchImageFront !== undefined,
    watchImageBack !== null && watchImageBack !== undefined,
    watchImageSide !== null && watchImageSide !== undefined,
  ].filter(Boolean).length;

  const totalRequiredFields = 6;

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Watch Images Section */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Camera className="h-5 w-5 text-orange-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Watch Images
              </h3>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Upload clear, high-quality images of the watch from different
              angles (PNG or JPG only, max 2MB each).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Front View */}

              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <FormField
                  name="watch_image_front"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2 mb-3">
                        <Camera className="h-4 w-4 text-orange-600" />
                        <FormLabel className="text-sm font-semibold">
                          Front View *
                        </FormLabel>
                      </div>
                      <p className="text-xs text-gray-600 mb-3">
                        Clear front view showing the dial and hands
                      </p>
                      <FormControl>
                        <FileInput
                          value={field.value ? [field.value] : []}
                          onChange={(newFiles: File[]) =>
                            field.onChange(newFiles[0] || null)
                          }
                          accept="image/png,image/jpeg,image/jpg"
                          maxSize={2}
                          maxFiles={1}
                          className="border-dashed border-2 border-orange-200 hover:border-orange-300"
                        />
                      </FormControl>
                      <ImagePreview
                        file={field.value}
                        onRemove={() => field.onChange(null)}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Back View */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <FormField
                  name="watch_image_back"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2 mb-3">
                        <Camera className="h-4 w-4 text-red-600" />
                        <FormLabel className="text-sm font-semibold">
                          Back View *
                        </FormLabel>
                      </div>
                      <p className="text-xs text-gray-600 mb-3">
                        Case back showing serial number and engravings
                      </p>
                      <FormControl>
                        <FileInput
                          value={field.value ? [field.value] : []}
                          onChange={(newFiles: File[]) =>
                            field.onChange(newFiles[0] || null)
                          }
                          accept="image/png,image/jpeg,image/jpg"
                          maxSize={2}
                          maxFiles={1}
                          className="border-dashed border-2 border-red-200 hover:border-red-300"
                        />
                      </FormControl>
                      <ImagePreview
                        file={field.value}
                        onRemove={() => field.onChange(null)}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Side View */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <FormField
                  name="watch_image_side"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2 mb-3">
                        <Camera className="h-4 w-4 text-indigo-600" />
                        <FormLabel className="text-sm font-semibold">
                          Side View *
                        </FormLabel>
                      </div>
                      <p className="text-xs text-gray-600 mb-3">
                        Profile view showing case thickness and crown
                      </p>
                      <FormControl>
                        <FileInput
                          value={field.value ? [field.value] : []}
                          onChange={(newFiles: File[]) =>
                            field.onChange(newFiles[0] || null)
                          }
                          accept="image/png,image/jpeg,image/jpg"
                          maxSize={2}
                          maxFiles={1}
                          className="border-dashed border-2 border-indigo-200 hover:border-indigo-300"
                        />
                      </FormControl>
                      <ImagePreview
                        file={field.value}
                        onRemove={() => field.onChange(null)}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Warranty Card Upload - Single Image File */}
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
                    Upload a clear image of the warranty card (PNG or JPG only,
                    max 1MB).
                  </p>
                  <FormControl>
                    <FileInput
                      value={field.value ? [field.value] : []}
                      onChange={(newFiles: File[]) =>
                        field.onChange(newFiles[0] || null)
                      }
                      accept="image/png,image/jpeg,image/jpg"
                      maxSize={1}
                      maxFiles={1}
                      className="border-dashed border-2 border-blue-200 hover:border-blue-300"
                    />
                  </FormControl>
                  <ImagePreview
                    file={field.value}
                    onRemove={() => field.onChange(null)}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Purchase Receipt Upload - Single Image File */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <FormField
              name="purchase_receipt"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2 mb-3">
                    <Upload className="h-5 w-5 text-green-600" />
                    <FormLabel className="text-base font-semibold">
                      Purchase Receipt *
                    </FormLabel>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Upload purchase receipt or proof of purchase image (PNG or
                    JPG only, max 1MB).
                  </p>
                  <FormControl>
                    <FileInput
                      value={field.value ? [field.value] : []}
                      onChange={(newFiles: File[]) =>
                        field.onChange(newFiles[0] || null)
                      }
                      accept="image/png,image/jpeg,image/jpg"
                      maxSize={1}
                      maxFiles={1}
                      className="border-dashed border-2 border-green-200 hover:border-green-300"
                    />
                  </FormControl>
                  <ImagePreview
                    file={field.value}
                    onRemove={() => field.onChange(null)}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Service Records Upload - Single Image File */}
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
                    Upload service records or maintenance document image (PNG or
                    JPG only, max 1MB).
                  </p>
                  <FormControl>
                    <FileInput
                      value={field.value ? [field.value] : []}
                      onChange={(newFiles: File[]) =>
                        field.onChange(newFiles[0] || null)
                      }
                      accept="image/png,image/jpeg,image/jpg"
                      maxSize={1}
                      maxFiles={1}
                      className="border-dashed border-2 border-purple-200 hover:border-purple-300"
                    />
                  </FormControl>
                  <ImagePreview
                    file={field.value}
                    onRemove={() => field.onChange(null)}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Authorized Dealer - FIXED FIELD NAME */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <FormField
              name="is_authorized_dealer"
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
        </form>
      </Form>
    </div>
  );
}
