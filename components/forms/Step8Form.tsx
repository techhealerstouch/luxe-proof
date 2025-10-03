// components/forms/Step8Form.tsx
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { Camera, FileText, X } from "lucide-react";
import { useState } from "react";
import { FileInput } from "../ui/file-input";

type Step8FormProps = {
  form: UseFormReturn<any>;
  onSubmit: (data: any) => void;
  onBack: () => void;
  step: number;
  watchData?: any;
};

export function Step8Form({
  form,
  onSubmit,
  onBack,
  step,
  watchData,
}: Step8FormProps) {
  const handleRemoveExistingFile = (fieldName: string, filePath: string) => {
    setFilesToRemove((prev) => [...prev, filePath]);
    form.setValue(fieldName, null);
  };

  console.log("Step 4", watchData);
  const [filesToRemove, setFilesToRemove] = useState<string[]>([]);

  const getExistingFilePath = (fieldName: string): string | null => {
    if (fieldName === "watch_performance_tests_image_path")
      return watchData?.performance_and_function_test
        ?.watch_performance_tests_image_path;

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
        <FormField
          name="watch_movement_analysis_image_path"
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
                  fieldName="watch_movement_analysis_image_path"
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
        {/* Hidden Status Field */}
        <FormField
          name="status"
          render={({ field }) => (
            <FormItem className="hidden">
              <FormControl>
                <Input type="hidden" {...field} value="pending" />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Authenticity Verdict */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <FormField
            name="authenticity_verdict"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Authenticity Verdict
                </FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                  >
                    <SelectTrigger className="text-sm mt-3">
                      <SelectValue placeholder="Select authenticity verdict" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="genuine">Genuine</SelectItem>
                      <SelectItem value="counterfeit">Counterfeit</SelectItem>
                      <SelectItem value="genuine (aftermarket)">
                        Genuine (Aftermarket)
                      </SelectItem>
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
        </div>

        {/* Estimated Year of Production */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <FormField
            name="estimated_production_year"
            render={({ field }) => {
              const currentYear = new Date().getFullYear();
              const startYear = 1950;
              const years: string[] = Array.from(
                { length: currentYear - startYear + 1 },
                (_, i) => String(startYear + i)
              ).reverse(); // Show most recent years first

              return (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">
                    Estimated Year of Production
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? ""}
                    >
                      <SelectTrigger className="text-sm mt-3">
                        <SelectValue placeholder="Select a year" />
                      </SelectTrigger>
                      <SelectContent className="max-h-48">
                        {years.map((year) => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <div className="text-xs text-gray-500 mt-1">
                    Current value: {field.value || "Not selected"}
                  </div>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </div>

        {/* Final Summary */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <FormField
            name="final_summary"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold mb-2 block">
                  Final Summary
                </FormLabel>
                <p className="text-xs text-gray-600 mb-3">
                  Provide a comprehensive summary of your authentication
                  analysis, including key findings, verdict rationale, and any
                  recommendations.
                </p>
                <FormControl>
                  <Textarea
                    placeholder="Example: Based on comprehensive analysis, this watch exhibits all authentic characteristics including proper serial engraving, genuine movement finishing, and correct component specifications. All documentation appears legitimate. Verdict: Genuine..."
                    {...field}
                    rows={6}
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
