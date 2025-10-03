// components/forms/Step5Form.tsx
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from "react-hook-form";
import { Camera, FileText, X } from "lucide-react";
import { useState } from "react";
import { FileInput } from "@/components/ui/file-input"; // ✅ Add this separate import

type Step5FormProps = {
  form: UseFormReturn<any>;
  onSubmit: (data: any) => void;
  onBack: () => void;
  step: number;
  watchData?: any;
};

export function Step5Form({
  form,
  onSubmit,
  onBack,
  step,
  watchData,
}: Step5FormProps) {
  const handleRemoveExistingFile = (fieldName: string, filePath: string) => {
    setFilesToRemove((prev) => [...prev, filePath]);
    form.setValue(fieldName, null);
  };

  console.log("Step 4", watchData);
  const [filesToRemove, setFilesToRemove] = useState<string[]>([]);

  const getExistingFilePath = (fieldName: string): string | null => {
    if (fieldName === "watch_product_bracelet_analysis_image_path")
      return watchData?.bracelet_strap_and_clasp_inspection
        ?.watch_product_bracelet_analysis_image_path;

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
          name="watch_product_bracelet_analysis_image_path"
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
                  fieldName="watch_product_bracelet_analysis_image_path"
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
        {/* Bracelet Link Type */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <FormField
            name="bracelet_link_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Bracelet Link Type
                </FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                  >
                    <SelectTrigger className="text-sm mt-3">
                      <SelectValue placeholder="Select link type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solid">Solid</SelectItem>
                      <SelectItem value="hollow">Hollow</SelectItem>
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

        {/* Connection Type */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <FormField
            name="connection_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Connection Type
                </FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                  >
                    <SelectTrigger className="text-sm mt-3">
                      <SelectValue placeholder="Select connection type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="screws">Screws</SelectItem>
                      <SelectItem value="pins">Pins</SelectItem>
                      <SelectItem value="fake_screws">Fake Screws</SelectItem>
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

        {/* Clasp Action */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <FormField
            name="clasp_action"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Clasp Action
                </FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                  >
                    <SelectTrigger className="text-sm mt-3">
                      <SelectValue placeholder="Select clasp action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="smooth_click">Smooth click</SelectItem>
                      <SelectItem value="loose">Loose</SelectItem>
                      <SelectItem value="stiff">Stiff</SelectItem>
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

        {/* Micro-adjustment System Functioning */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <FormField
            name="micro_adjustment_functioning"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Micro-adjustment System Functioning?
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

        {/* Clasp Engravings */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <FormField
            name="clasp_engravings"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Clasp Engravings
                </FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                  >
                    <SelectTrigger className="text-sm mt-3">
                      <SelectValue placeholder="Select engraving type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clean">Clean</SelectItem>
                      <SelectItem value="shallow">Shallow</SelectItem>
                      <SelectItem value="uneven">Uneven</SelectItem>
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

        {/* Notes */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <FormField
            name="bracelet_notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold mb-2 block">
                  Bracelet/Strap & Clasp Notes
                </FormLabel>
                <p className="text-xs text-gray-600 mb-3">
                  Provide detailed analysis of the bracelet construction, link
                  quality, clasp mechanism, and any observations about
                  authenticity markers.
                </p>
                <FormControl>
                  <Textarea
                    {...field}
                    rows={4}
                    className="resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Example: Bracelet links are solid with proper weight, connections use genuine screws not pins, clasp clicks smoothly with no play, micro-adjustment system functions properly..."
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
