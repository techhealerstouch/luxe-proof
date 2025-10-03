// components/forms/Step2Form.tsx
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileInput } from "@/components/ui/file-input";
import { Upload, FileText, X, Camera } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from "react-hook-form";
import { useState } from "react";

type Step2FormProps = {
  form: UseFormReturn<any>;
  onSubmit: (data: any) => void;
  onBack: () => void;
  watchData?: any; // Add watchData prop to access existing file paths
};

export function Step2Form({
  form,
  onSubmit,
  onBack,
  watchData,
}: Step2FormProps) {
  const handleRemoveExistingFile = (fieldName: string, filePath: string) => {
    setFilesToRemove((prev) => [...prev, filePath]);
    form.setValue(fieldName, null);
  };
  console.log("SERIAL", watchData);
  const [filesToRemove, setFilesToRemove] = useState<string[]>([]);

  const getExistingFilePath = (fieldName: string): string | null => {
    if (fieldName === "watch_serial_info_image_path")
      return watchData?.serial_and_model_number_cross_reference
        ?.watch_serial_info_image_path;

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
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <FormField
            name="watch_serial_info_image_path"
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
                    fieldName="watch_serial_info_image_path"
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

        {/* Serial Number */}
        <FormField
          name="serial_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm">Serial Number *</FormLabel>
              <FormControl>
                <Input
                  readOnly
                  className="bg-gray-100 text-gray-600 cursor-not-allowed text-sm"
                  {...field}
                  value={field.value ?? ""}
                  autoComplete="off"
                />
              </FormControl>
              <div className="text-xs text-gray-500 mt-1">
                Current value: {field.value || "Not set"}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Model Number */}
        <FormField
          name="model_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm">Model Number *</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value ?? ""}
                  autoComplete="off"
                  className="text-sm"
                />
              </FormControl>
              <div className="text-xs text-gray-500 mt-1">
                Current value: {field.value || "Not set"}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Serial Found Location */}
        <FormField
          name="serial_found_location"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-2">
              <FormLabel className="text-sm">
                Where was the serial found?
              </FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? ""}
                >
                  <SelectTrigger className="w-full text-sm">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Between lugs">Between lugs</SelectItem>
                    <SelectItem value="Rehaut">Rehaut</SelectItem>
                    <SelectItem value="Caseback">Caseback</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <div className="text-xs text-gray-500 mt-1">
                Current value: {field.value || "Not selected"}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Matches Documents */}

        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <FormField
            name="matches_documents"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Matches documents?
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
                    className="grid grid-cols-2 gap-3 mt-3"
                  >
                    <div className="flex items-center space-x-2 rounded-lg border border-gray-200 p-3 hover:bg-gray-50 transition-colors">
                      <FormControl>
                        <RadioGroupItem
                          value="true"
                          className="text-green-600"
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal cursor-pointer flex-1">
                        Yes
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
                        No
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
        {/* Engraving Quality */}
        <FormField
          name="engraving_quality"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-2">
              <FormLabel className="text-sm">Engraving Quality</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? ""}
                >
                  <SelectTrigger className="w-full text-sm">
                    <SelectValue placeholder="Select quality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sharp">Sharp</SelectItem>
                    <SelectItem value="Shallow">Shallow</SelectItem>
                    <SelectItem value="Acid-etched">Acid-etched</SelectItem>
                    <SelectItem value="Dotty">Dotty</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <div className="text-xs text-gray-500 mt-1">
                Current value: {field.value || "Not selected"}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Serial Notes */}
        <FormField
          name="serial_notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm">Notes *</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value ?? ""}
                  rows={4}
                  className="resize-none text-sm"
                  placeholder="Please provide notes about the serial number..."
                />
              </FormControl>
              <div className="text-xs text-gray-500 mt-1">
                Current value:{" "}
                {field.value ? `${field.value.length} characters` : "Empty"}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
