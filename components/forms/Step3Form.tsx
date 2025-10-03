// components/forms/Step3Form.tsx
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
import { useState } from "react";
import { Camera, FileText, X } from "lucide-react";
import { FileInput } from "../ui/file-input";

type Step3FormProps = {
  form: UseFormReturn<any>;
  onSubmit: (data: any) => void;
  onBack: () => void;
  watchData?: any; // Add watchData prop to access existing file paths
};

export function Step3Form({
  form,
  onSubmit,
  onBack,
  watchData,
}: Step3FormProps) {
  const handleRemoveExistingFile = (fieldName: string, filePath: string) => {
    setFilesToRemove((prev) => [...prev, filePath]);
    form.setValue(fieldName, null);
  };
  console.log("SERIAL", watchData);
  const [filesToRemove, setFilesToRemove] = useState<string[]>([]);

  const getExistingFilePath = (fieldName: string): string | null => {
    if (fieldName === "watch_serial_info_image_path")
      return watchData?.case_bezel_and_crystal_analysis
        ?.watch_product_case_analysis_image_path;

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
          name="watch_product_case_analysis_image_path"
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
        {/* Case Material Verified */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <FormField
            name="case_material_verified"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Case Material Verified
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

        {/* Case Weight Feel */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <FormField
            name="case_weight_feel"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Case Weight Feel
                </FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="text-sm mt-3">
                      <SelectValue placeholder="Select weight feel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Balanced & solid">
                        Balanced & solid
                      </SelectItem>
                      <SelectItem value="Light">Light</SelectItem>
                      <SelectItem value="Inconsistent">Inconsistent</SelectItem>
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

        {/* Finishing Transitions */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <FormField
            name="finishing_transitions"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Finishing Transitions
                </FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="text-sm mt-3">
                      <SelectValue placeholder="Select transition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sharp">Sharp</SelectItem>
                      <SelectItem value="Soft">Soft</SelectItem>
                      <SelectItem value="Unclear">Unclear</SelectItem>
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

        {/* Bezel Action */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <FormField
            name="bezel_action"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Bezel Action
                </FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="text-sm mt-3">
                      <SelectValue placeholder="Select bezel action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Precise clicks">
                        Precise clicks
                      </SelectItem>
                      <SelectItem value="Loose">Loose</SelectItem>
                      <SelectItem value="No rotation">No rotation</SelectItem>
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

        {/* Crystal Type */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <FormField
            name="crystal_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Crystal Type
                </FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="text-sm mt-3">
                      <SelectValue placeholder="Select crystal type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sapphire">Sapphire</SelectItem>
                      <SelectItem value="Mineral">Mineral</SelectItem>
                      <SelectItem value="Acrylic">Acrylic</SelectItem>
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
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <FormField
            name="laser_etched_crown"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Laser-etched crown found?
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
        {/* Crown Logo Sharpness */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <FormField
            name="crown_logo_sharpness"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Crown Logo Sharpness
                </FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="text-sm mt-3">
                      <SelectValue placeholder="Select sharpness" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sharp">Sharp</SelectItem>
                      <SelectItem value="Fuzzy">Fuzzy</SelectItem>
                      <SelectItem value="Worn">Worn</SelectItem>
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
            name="case_notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold mb-2 block">
                  Case, Bezel & Crystal Notes
                </FormLabel>
                <p className="text-xs text-gray-600 mb-3">
                  Provide detailed analysis of the case construction, bezel
                  functionality, crystal quality, and any observations about
                  authenticity markers.
                </p>
                <FormControl>
                  <Textarea
                    {...field}
                    rows={4}
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
