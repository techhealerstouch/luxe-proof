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
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FileInput } from "@/components/ui/file-input";
import { Upload, FileText, X, Camera } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { useState } from "react";

type Step1FormProps = {
  form: UseFormReturn<any>;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  watchData?: any; // Add watchData prop to access existing file paths
};

export function Step1Form({
  form,
  onSubmit,
  onCancel,
  watchData,
}: Step1FormProps) {
  const [filesToRemove, setFilesToRemove] = useState<string[]>([]);

  const handleRemoveExistingFile = (fieldName: string, filePath: string) => {
    setFilesToRemove((prev) => [...prev, filePath]);
    form.setValue(fieldName, null);
  };

  const getExistingFilePath = (fieldName: string): string | null => {
    if (fieldName === "warranty_card")
      return watchData?.provenance_documentation_audit?.warranty_card_path;
    if (fieldName === "purchase_receipt")
      return watchData?.provenance_documentation_audit?.purchase_receipt_path;
    if (fieldName === "service_records")
      return watchData?.provenance_documentation_audit?.service_records_path;
    return null;
  };

  const getFileName = (filePath: string): string => {
    return filePath.split("/").pop() || filePath;
  };

  const ExistingFileDisplay = ({
    fieldName,
    field,
  }: {
    fieldName: string;
    field: any;
  }) => {
    const existingPath = getExistingFilePath(fieldName);
    const isRemoved = filesToRemove.includes(existingPath || "");

    if (!existingPath || isRemoved) return null;

    return (
      <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">
              Current file: {getFileName(existingPath)}
            </span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => handleRemoveExistingFile(fieldName, existingPath)}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-blue-700 mt-1">
          Upload a new file to replace this one, or click X to remove it.
        </p>
      </div>
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Front View */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <FormField
              name="watch_image_front"
              render={({ field }) => {
                const handleFileChange = (newFiles: File[]) => {
                  if (newFiles.length > 0) {
                    field.onChange(newFiles[0]);
                  } else {
                    field.onChange(null);
                  }
                };

                const getFileInputValue = () => {
                  if (!field.value) return [];
                  if (field.value instanceof File) {
                    return [field.value];
                  }
                  return [];
                };

                const getDisplayText = () => {
                  if (!field.value) return "No file selected";
                  if (field.value instanceof File) {
                    return field.value.name;
                  }
                  if (typeof field.value === "string") {
                    return field.value.split("/").pop() || field.value;
                  }
                  return "Unknown file";
                };

                return (
                  <FormItem>
                    <div className="flex items-center gap-2 mb-3">
                      <Camera className="h-4 w-4 text-orange-600" />
                      <FormLabel className="text-sm font-semibold">
                        Front View {!field.value && "*"}
                      </FormLabel>
                    </div>
                    <p className="text-xs text-gray-600 mb-3">
                      Clear front view showing the dial and hands
                    </p>

                    {/* Show existing file if it's a string path */}
                    {field.value && typeof field.value === "string" && (
                      <div className="mb-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                        <div className="flex items-center gap-2 text-sm text-orange-800">
                          <Camera className="h-4 w-4" />
                          <span>Current file: {getDisplayText()}</span>
                        </div>
                      </div>
                    )}

                    <ExistingFileDisplay
                      fieldName="watch_image_front"
                      field={field}
                    />

                    <FormControl>
                      <FileInput
                        value={getFileInputValue()}
                        onChange={handleFileChange}
                        accept="image/png,image/jpeg,image/jpg"
                        maxSize={2}
                        maxFiles={1}
                        className="border-dashed border-2 border-orange-200 hover:border-orange-300"
                      />
                    </FormControl>

                    <div className="text-xs text-gray-500 mt-1">
                      Selected: {getDisplayText()}
                    </div>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>

          {/* Back View */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <FormField
              name="watch_image_back"
              render={({ field }) => {
                const handleFileChange = (newFiles: File[]) => {
                  if (newFiles.length > 0) {
                    field.onChange(newFiles[0]);
                  } else {
                    field.onChange(null);
                  }
                };

                const getFileInputValue = () => {
                  if (!field.value) return [];
                  if (field.value instanceof File) {
                    return [field.value];
                  }
                  return [];
                };

                const getDisplayText = () => {
                  if (!field.value) return "No file selected";
                  if (field.value instanceof File) {
                    return field.value.name;
                  }
                  if (typeof field.value === "string") {
                    return field.value.split("/").pop() || field.value;
                  }
                  return "Unknown file";
                };

                return (
                  <FormItem>
                    <div className="flex items-center gap-2 mb-3">
                      <Camera className="h-4 w-4 text-red-600" />
                      <FormLabel className="text-sm font-semibold">
                        Back View {!field.value && "*"}
                      </FormLabel>
                    </div>
                    <p className="text-xs text-gray-600 mb-3">
                      Case back showing serial number and engravings
                    </p>

                    {/* Show existing file if it's a string path */}
                    {field.value && typeof field.value === "string" && (
                      <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center gap-2 text-sm text-red-800">
                          <Camera className="h-4 w-4" />
                          <span>Current file: {getDisplayText()}</span>
                        </div>
                      </div>
                    )}

                    <ExistingFileDisplay
                      fieldName="watch_image_back"
                      field={field}
                    />

                    <FormControl>
                      <FileInput
                        value={getFileInputValue()}
                        onChange={handleFileChange}
                        accept="image/png,image/jpeg,image/jpg"
                        maxSize={2}
                        maxFiles={1}
                        className="border-dashed border-2 border-red-200 hover:border-red-300"
                      />
                    </FormControl>

                    <div className="text-xs text-gray-500 mt-1">
                      Selected: {getDisplayText()}
                    </div>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>

          {/* Side View */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <FormField
              name="watch_image_side"
              render={({ field }) => {
                const handleFileChange = (newFiles: File[]) => {
                  if (newFiles.length > 0) {
                    field.onChange(newFiles[0]);
                  } else {
                    field.onChange(null);
                  }
                };

                const getFileInputValue = () => {
                  if (!field.value) return [];
                  if (field.value instanceof File) {
                    return [field.value];
                  }
                  return [];
                };

                const getDisplayText = () => {
                  if (!field.value) return "No file selected";
                  if (field.value instanceof File) {
                    return field.value.name;
                  }
                  if (typeof field.value === "string") {
                    return field.value.split("/").pop() || field.value;
                  }
                  return "Unknown file";
                };

                return (
                  <FormItem>
                    <div className="flex items-center gap-2 mb-3">
                      <Camera className="h-4 w-4 text-indigo-600" />
                      <FormLabel className="text-sm font-semibold">
                        Side View {!field.value && "*"}
                      </FormLabel>
                    </div>
                    <p className="text-xs text-gray-600 mb-3">
                      Profile view showing case thickness and crown
                    </p>

                    {/* Show existing file if it's a string path */}
                    {field.value && typeof field.value === "string" && (
                      <div className="mb-3 p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                        <div className="flex items-center gap-2 text-sm text-indigo-800">
                          <Camera className="h-4 w-4" />
                          <span>Current file: {getDisplayText()}</span>
                        </div>
                      </div>
                    )}

                    <ExistingFileDisplay
                      fieldName="watch_image_side"
                      field={field}
                    />

                    <FormControl>
                      <FileInput
                        value={getFileInputValue()}
                        onChange={handleFileChange}
                        accept="image/png,image/jpeg,image/jpg"
                        maxSize={2}
                        maxFiles={1}
                        className="border-dashed border-2 border-indigo-200 hover:border-indigo-300"
                      />
                    </FormControl>

                    <div className="text-xs text-gray-500 mt-1">
                      Selected: {getDisplayText()}
                    </div>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
        </div>
        {/* Warranty Card Upload */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <FormField
            name="warranty_card"
            render={({ field }) => {
              const handleFileChange = (newFiles: File[]) => {
                // When a new file is selected, update the field with the File object
                if (newFiles.length > 0) {
                  field.onChange(newFiles[0]);
                } else {
                  field.onChange(null);
                }
              };

              // Convert string path to a format FileInput can understand
              // FileInput expects File objects, but we might have a string path for existing files
              const getFileInputValue = () => {
                if (!field.value) return [];

                // If it's already a File object, use it as is
                if (field.value instanceof File) {
                  return [field.value];
                }

                // If it's a string path, we can't pass it to FileInput
                // FileInput is designed for new file uploads, not existing file paths
                return [];
              };

              const getDisplayText = () => {
                if (!field.value) return "No file selected";

                if (field.value instanceof File) {
                  return field.value.name;
                }

                // For string paths, extract just the filename
                if (typeof field.value === "string") {
                  return field.value.split("/").pop() || field.value;
                }

                return "Unknown file";
              };

              return (
                <FormItem>
                  <div className="flex items-center gap-2 mb-3">
                    <Upload className="h-4 w-4 text-blue-600" />
                    <FormLabel className="text-sm font-semibold">
                      Warranty Card {!field.value && "*"}
                    </FormLabel>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">
                    Upload a clear image of the warranty card (PNG or JPG only,
                    max 1MB).
                  </p>

                  {/* Show existing file if it's a string path */}
                  {field.value && typeof field.value === "string" && (
                    <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-blue-800">
                        <Upload className="h-4 w-4" />
                        <span>Current file: {getDisplayText()}</span>
                      </div>
                    </div>
                  )}

                  <ExistingFileDisplay
                    fieldName="warranty_card"
                    field={field}
                  />

                  <FormControl>
                    <FileInput
                      value={getFileInputValue()}
                      onChange={handleFileChange}
                      accept="image/png,image/jpeg,image/jpg"
                      maxSize={1}
                      maxFiles={1}
                      className="border-dashed border-2 border-blue-200 hover:border-blue-300"
                    />
                  </FormControl>
                  <div className="text-xs text-gray-500 mt-1">
                    Selected: {getDisplayText()}
                  </div>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </div>

        {/* Purchase Receipt Upload */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <FormField
            name="purchase_receipt"
            render={({ field }) => {
              const handleFileChange = (newFiles: File[]) => {
                // When a new file is selected, update the field with the File object
                if (newFiles.length > 0) {
                  field.onChange(newFiles[0]);
                } else {
                  field.onChange(null);
                }
              };

              // Convert string path to a format FileInput can understand
              // FileInput expects File objects, but we might have a string path for existing files
              const getFileInputValue = () => {
                if (!field.value) return [];

                // If it's already a File object, use it as is
                if (field.value instanceof File) {
                  return [field.value];
                }

                // If it's a string path, we can't pass it to FileInput
                // FileInput is designed for new file uploads, not existing file paths
                return [];
              };

              const getDisplayText = () => {
                if (!field.value) return "No file selected";

                if (field.value instanceof File) {
                  return field.value.name;
                }

                // For string paths, extract just the filename
                if (typeof field.value === "string") {
                  return field.value.split("/").pop() || field.value;
                }

                return "Unknown file";
              };

              return (
                <FormItem>
                  <div className="flex items-center gap-2 mb-3">
                    <Upload className="h-4 w-4 text-green-600" />
                    <FormLabel className="text-sm font-semibold">
                      Purchase Receipt {!field.value && "*"}
                    </FormLabel>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">
                    Upload purchase receipt or proof of purchase image (PNG or
                    JPG only, max 1MB).
                  </p>

                  {/* Show existing file if it's a string path */}
                  {field.value && typeof field.value === "string" && (
                    <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-green-800">
                        <Upload className="h-4 w-4" />
                        <span>Current file: {getDisplayText()}</span>
                      </div>
                    </div>
                  )}

                  <ExistingFileDisplay
                    fieldName="purchase_receipt"
                    field={field}
                  />

                  <FormControl>
                    <FileInput
                      value={getFileInputValue()}
                      onChange={handleFileChange}
                      accept="image/png,image/jpeg,image/jpg"
                      maxSize={1}
                      maxFiles={1}
                      className="border-dashed border-2 border-green-200 hover:border-green-300"
                    />
                  </FormControl>
                  <div className="text-xs text-gray-500 mt-1">
                    Selected: {getDisplayText()}
                  </div>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </div>

        {/* Service Records Upload */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <FormField
            name="service_records"
            render={({ field }) => {
              const handleFileChange = (newFiles: File[]) => {
                // When a new file is selected, update the field with the File object
                if (newFiles.length > 0) {
                  field.onChange(newFiles[0]);
                } else {
                  field.onChange(null);
                }
              };

              // Convert string path to a format FileInput can understand
              // FileInput expects File objects, but we might have a string path for existing files
              const getFileInputValue = () => {
                if (!field.value) return [];

                // If it's already a File object, use it as is
                if (field.value instanceof File) {
                  return [field.value];
                }

                // If it's a string path, we can't pass it to FileInput
                // FileInput is designed for new file uploads, not existing file paths
                return [];
              };

              const getDisplayText = () => {
                if (!field.value) return "No file selected";

                if (field.value instanceof File) {
                  return field.value.name;
                }

                // For string paths, extract just the filename
                if (typeof field.value === "string") {
                  return field.value.split("/").pop() || field.value;
                }

                return "Unknown file";
              };

              return (
                <FormItem>
                  <div className="flex items-center gap-2 mb-3">
                    <Upload className="h-4 w-4 text-purple-600" />
                    <FormLabel className="text-sm font-semibold">
                      Service Records
                    </FormLabel>
                    <span className="text-xs text-gray-500">(Optional)</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">
                    Upload service records or maintenance document image (PNG or
                    JPG only, max 1MB).
                  </p>

                  {/* Show existing file if it's a string path */}
                  {field.value && typeof field.value === "string" && (
                    <div className="mb-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-purple-800">
                        <Upload className="h-4 w-4" />
                        <span>Current file: {getDisplayText()}</span>
                      </div>
                    </div>
                  )}

                  <ExistingFileDisplay
                    fieldName="service_records"
                    field={field}
                  />

                  <FormControl>
                    <FileInput
                      value={getFileInputValue()}
                      onChange={handleFileChange}
                      accept="image/png,image/jpeg,image/jpg"
                      maxSize={1}
                      maxFiles={1}
                      className="border-dashed border-2 border-purple-200 hover:border-purple-300"
                    />
                  </FormControl>
                  <div className="text-xs text-gray-500 mt-1">
                    Selected: {getDisplayText()}
                  </div>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </div>

        {/* Authorized Dealer */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <FormField
            name="is_authorized_dealer"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold mb-3 block">
                  Is the dealer an authorized dealer? *
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={(value) => field.onChange(value === "true")}
                    value={
                      field.value === true
                        ? "true"
                        : field.value === false
                        ? "false"
                        : ""
                    }
                    className="grid grid-cols-2 gap-3"
                  >
                    <div className="flex items-center space-x-2 rounded-lg border border-gray-200 p-3 hover:bg-gray-50 transition-colors">
                      <FormControl>
                        <RadioGroupItem
                          value="true"
                          className="text-green-600"
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal cursor-pointer flex-1">
                        Yes - Authorized Dealer
                      </FormLabel>
                    </div>
                    <div className="flex items-center space-x-2 rounded-lg border border-gray-200 p-3 hover:bg-gray-50 transition-colors">
                      <FormControl>
                        <RadioGroupItem
                          value="false"
                          className="text-red-600"
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal cursor-pointer flex-1">
                        No - Unauthorized Dealer
                      </FormLabel>
                    </div>
                  </RadioGroup>
                </FormControl>
                <div className="text-xs text-gray-500 mt-1">
                  Current value:{" "}
                  {field.value === true
                    ? "Yes"
                    : field.value === false
                    ? "No"
                    : "Not selected"}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Warranty Card Notes */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <FormField
            name="warranty_card_notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold mb-2 block">
                  Warranty Card Analysis *
                </FormLabel>
                <p className="text-xs text-gray-600 mb-3">
                  Provide detailed notes about the warranty card including font
                  quality, NFC functionality, paper quality, stamps, signatures,
                  etc.
                </p>
                <FormControl>
                  <Textarea
                    {...field}
                    rows={3}
                    className="resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
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
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <FormField
            name="service_history_notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold mb-2 block">
                  Service History Analysis
                </FormLabel>
                <p className="text-xs text-gray-600 mb-3">
                  Optional: Add notes about service history, replacement parts,
                  authorized service centers, or any maintenance concerns.
                </p>
                <FormControl>
                  <Textarea
                    {...field}
                    rows={3}
                    className="resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
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
  );
}
